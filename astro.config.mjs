import { defineConfig } from 'astro/config';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if (existsSync('.env')) loadEnvFile('.env');
const site = process.env.SITE_URL || undefined;
if (site && !/^https?:\/\//.test(site)) throw new Error('SITE_URL deve ser uma URL absoluta HTTP(S).');

export default defineConfig({
  site,
  output: 'static',
  build: { format: 'directory' },
  image: { responsiveStyles: true, service: { entrypoint: './src/scripts/image-service.ts' } },
});
