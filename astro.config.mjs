import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from 'astro/config';
import { remarkModifiedTime } from './utils/remark-modified-time.mjs';
import { remarkReadingTime } from './utils/remark-reading-time.mjs';

import sitemap from "@astrojs/sitemap";
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// https://astro.build/config
export default defineConfig({
  site: 'https://prolegomena.com/',
  output: 'static',
  integrations: [tailwind({
    applyBaseStyles: false
  }), mdx({
    remarkPlugins: [remarkModifiedTime, remarkMath, remarkReadingTime],
    rehypePlugins: [rehypeKatex]
  }),
  sitemap()],
});
