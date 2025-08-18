// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

const SKIP_AUTH = process.env.SKIP_REPLIT_AUTH === "true";

if (!SKIP_AUTH && !process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

// ---------- OIDC discovery (memoized) ----------
const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

// ---------- Session ----------
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week

  // In dev (skip auth) or when DATABASE_URL is missing, use in-memory store.
  // In prod, use Postgres-backed sessions.
  let store: session.Store | undefined = undefined;

  if (!SKIP_AUTH && process.env.DATABASE_URL) {
    const PgStore = connectPg(session);
    store = new PgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false,
      ttl: sessionTtl,
      tableName: "sessions",
    });
  }

  return session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: !SKIP_AUTH, // secure only if auth is enabled
      maxAge: sessionTtl,
    },
  });
}

// ---------- Helpers ----------
function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

// ---------- Auth setup ----------
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  if (SKIP_AUTH) {
    console.log("🟢 SKIP_REPLIT_AUTH=true – Replit auth disabled for local development.");

    // Dev-only lightweight endpoints that *never* crash the server
    app.get("/api/login", (req, res) => {
      const returnTo =
        typeof req.query.returnTo === "string"
          ? req.query.returnTo
          : "http://localhost:5173/";
      // pretend login succeeded then bounce back to the frontend
      return res.redirect(returnTo);
    });

    app.get("/api/auth/user", (_req, res) => {
      // pretend there's a logged-in user
      return res.json({ id: "dev-user", name: "Dev User", email: "dev@example.com" });
    });

    app.get("/api/logout", (req, res) => {
      const returnTo =
        typeof req.query.returnTo === "string"
          ? req.query.returnTo
          : "http://localhost:5173/";
      req.session.destroy(() => {
        res.redirect(returnTo);
      });
    });

    return;
  }

  // Real OIDC setup (for Replit / production)
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user: any = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", async (req, res) => {
    const config2 = await getOidcConfig();
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config2, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

// ---------- Route guard ----------
export const isAuthenticated: RequestHandler = async (req, _res, next) => {
  if (SKIP_AUTH) {
    // Ensure downstream code always has a user + claims in dev
    if (!(req as any).user) {
      (req as any).user = {
        claims: {
          sub: "dev-user",
          email: "dev@example.com",
          first_name: "Dev",
          last_name: "User",
        },
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      };
    }
    return next();
  }

  const user = req.user as any;
  if (!req.isAuthenticated() || !user?.expires_at) {
    return _res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) return next();

  const refreshToken = user.refresh_token;
  if (!refreshToken) return _res.status(401).json({ message: "Unauthorized" });

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch {
    return _res.status(401).json({ message: "Unauthorized" });
  }
};