import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { log, setupVite, serveStatic } from "./vite";

async function main() {
  const app = express();

  // Apply JSON middleware
  app.use(express.json());

  // Create HTTP server and register API routes
  const httpServer = await registerRoutes(app);

  // Determine and set port
  const PORT = process.env.PORT || 5000;
  const isDev = process.env.NODE_ENV === "development";

  // Set up Vite or serve static files in production
  if (isDev) {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      message: "An unexpected error occurred",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  });

  // Start server
  httpServer.listen(PORT, () => {
    log(`serving on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
