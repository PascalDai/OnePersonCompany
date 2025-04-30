// @ts-check
import { defineConfig } from 'astro/config';

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

import remarkMermaid from "remark-mermaidjs";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  legacy: {
    collections: true,
  },
  markdown: {
    remarkPlugins: [
      [
        remarkMermaid,
        {
          mermaidConfig: {
            // 允许mermaid.js使用window.mermaidConfig
            useConfigFromWindow: true,
          },
        },
      ],
    ],
  },
});