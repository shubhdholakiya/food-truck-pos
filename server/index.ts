import "dotenv/config";
import path from "path";
import express, { type Request, type Response, type NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log, spaFallbackProd } from "./vite";
import { setupAuth } from "./replitAuth"; // unified auth (OIDC or dev bypass)

const app = express();

// ---------- Core middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Single-origin dev (:5000)
app.use(
  cors({
    origin: ["http://localhost:5000"],
    credentials: true,
  })
);

// ---------- API response logger (only /api/*) ----------
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: unknown;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let line = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        try {
          line += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        } catch {}
      }
      if (line.length > 120) line = line.slice(0, 119) + "…";
      log(line);
    }
  });

  next();
});

// ---------- Health ----------
app.get("/api/health", (_req: Request, res: Response) => res.json({ ok: true }));

(async () => {
  // ---------- Auth (works for both real OIDC and dev bypass) ----------
  await setupAuth(app);

  // Dev auth: explicit opt-in/out with a cookie (no auto-auth on SKIP_REPLIT_AUTH)
  app.post("/api/dev-login", (_req: Request, res: Response) => {
    res.cookie("eataz_dev", "1", {
      sameSite: "lax",
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.json({ ok: true });
  });

  app.post("/api/dev-logout", (_req: Request, res: Response) => {
    res.clearCookie("eataz_dev", { sameSite: "lax", path: "/" });
    res.json({ ok: true });
  });

  // Single, consistent session endpoint for the SPA
  app.get("/api/session", (req: Request, res: Response) => {
    res.set("Cache-Control", "no-store");

    const skipAuth = process.env.SKIP_REPLIT_AUTH === "true";

    // True OIDC session?
    const authedViaOIDC =
      typeof (req as any).isAuthenticated === "function" &&
      (req as any).isAuthenticated() === true;

    // Dev cookie counts ONLY when SKIP_REPLIT_AUTH=true
    const devCookie = skipAuth && req.cookies?.eataz_dev === "1";

    const authenticated = authedViaOIDC || devCookie;

    const user =
      authenticated && (req as any).user?.claims
        ? (req as any).user.claims
        : authenticated
        ? {
            sub: "dev-user",
            email: "dev@example.com",
            first_name: "Dev",
            last_name: "User",
          }
        : null;

    res.json({ authenticated, user });
  });

  // ---------- Mount API routes ----------
  const server = await registerRoutes(app);

  // ---------- Frontend ----------
  if (app.get("env") === "development") {
    // Vite dev middleware (single origin :5000)
    await setupVite(app, server);
  } else {
    // Serve built client from /dist
    serveStatic(app);
    // SPA fallback for non-/api routes
    spaFallbackProd(app);
  }

  // ---------- Error handler ----------
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    if (status >= 500) console.error(err);
  });

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
    log(`serving on port ${port}`);
  });
})();
