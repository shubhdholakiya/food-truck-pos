import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// dev cookie + CORS
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// log /api responses
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // ---------- DEV AUTH SHIM ----------
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  // POST to set cookie via credentialed fetch (most reliable in dev)
  app.post("/api/dev-login", (_req: Request, res: Response) => {
    res.cookie("eataz_dev", "1", {
      sameSite: "lax",
      // explicit + persistent (1 day)
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.json({ ok: true });
  });

  app.post("/api/logout", (_req: Request, res: Response) => {
    res.clearCookie("eataz_dev", { sameSite: "lax", path: "/" });
    res.json({ ok: true });
  });

  app.get("/api/session", (req: Request, res: Response) => {
    res.set("Cache-Control", "no-store");
    res.json({ authenticated: req.cookies?.eataz_dev === "1" });
  });

  // keep your old redirect around (optional), but we won't use it in dev:
  app.get("/api/login", (req: Request, res: Response) => {
    const returnTo =
      typeof req.query.returnTo === "string"
        ? req.query.returnTo
        : "http://localhost:5173/dashboard";
    res.cookie("eataz_dev", "1", {
      sameSite: "lax",
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.redirect(returnTo);
  });
  // ---------- END DEV AUTH SHIM ----------

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    { port, host: "0.0.0.0", reusePort: true },
    () => log(`serving on port ${port}`)
  );
})();
