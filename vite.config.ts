import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * Serves ./api/*.ts (Vercel Edge-style handlers taking a Web `Request`) on the
 * dev server, so `/api/chat` works locally without `vercel dev`. Production is
 * handled by Vercel itself.
 */
function vercelApiDev(env: Record<string, string>): Plugin {
  return {
    name: "vercel-api-dev",
    configureServer(server: ViteDevServer) {
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) process.env[key] = value;
      }
      server.middlewares.use("/api", async (req, res, next) => {
        const route = (req.url ?? "/").split("?")[0].replace(/\/$/, "");
        if (!route || route === "/") return next();
        try {
          const mod = await server.ssrLoadModule(`/api${route}.ts`);
          const handler = mod.default as (r: Request) => Promise<Response>;

          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const body = chunks.length ? Buffer.concat(chunks) : undefined;
          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) {
            if (typeof v === "string") headers.set(k, v);
          }
          const request = new Request(`http://localhost${req.url}`, {
            method: req.method,
            headers,
            body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
          });

          const response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((v, k) => res.setHeader(k, v));
          if (!response.body) return res.end();
          const reader = response.body.getReader();
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        } catch (err) {
          console.error(`[api] ${route}:`, err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Dev API handler failed" }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      mode === "development" && vercelApiDev(env),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "framer-motion": ["framer-motion"],
            "radix-ui": [
              "@radix-ui/react-dialog",
              "@radix-ui/react-toast",
              "@radix-ui/react-tooltip",
            ],
          },
        },
      },
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "framer-motion"],
    },
  };
});
