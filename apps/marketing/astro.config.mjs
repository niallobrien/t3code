import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://agentsmith.dev",
  server: {
    port: Number(process.env.PORT ?? 4173),
  },
});
