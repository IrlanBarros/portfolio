import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
const dist = path.resolve('dist');
const htmlFiles = readdirSync(dist, { recursive: true }).filter(f => f.endsWith('.html'));
test('home, seis estudos de caso e página 404 são HTML estático', () => {
  assert.equal(htmlFiles.length, 8);
  for (const p of ['planeja-ufca', 'ilarica', 'flowcount', 'blockchain-research', 'nail-manager', 'pokegrafo']) assert.ok(existsSync(path.join(dist, 'projetos', p, 'index.html')));
  const home = readFileSync(path.join(dist, 'index.html'), 'utf8');
  for (const text of ['Irlan Barros', 'Professor de robótica', 'Ciência da Computação', 'Validação metodológica pendente']) assert.ok(home.includes(text));
});
test('URLs locais de documentos, páginas, scripts, estilos e imagens existem no build', () => {
  for (const file of htmlFiles) {
    const html = readFileSync(path.join(dist, file), 'utf8');
    for (const match of html.matchAll(/(?:src|href|data-src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
      const url = match[1];
      const target = path.join(dist, decodeURIComponent(url), url.endsWith('/') ? 'index.html' : '');
      assert.ok(existsSync(target), `${file} referencia arquivo inexistente: ${url}`);
    }
  }
});
test('catálogo tem exatamente seis arquivos reais, IDs únicos e imagens processadas', () => {
  const html = readFileSync(path.join(dist, 'index.html'), 'utf8');
  const match = html.match(/<script[^>]*id="avatar-catalog"[^>]*>([\s\S]*?)<\/script>/);
  assert.ok(match);
  const catalog = JSON.parse(match[1]);
  assert.equal(catalog.avatars.length, 6);
  assert.equal(new Set(catalog.avatars.map(a => a.id)).size, 6);
  assert.equal(catalog.defaultId, 'ilustracao-azul');
  for (const a of catalog.avatars) {
    assert.ok(existsSync(path.join(dist, a.src)));
    assert.ok(existsSync(path.join(dist, a.thumb)));
  }
});
test('currículo é um PDF real e SEO não inventa um domínio', () => {
  assert.equal(readFileSync(path.join(dist, 'documents/irlan-barros-curriculo.pdf')).subarray(0, 5).toString(), '%PDF-');
  const home = readFileSync(path.join(dist, 'index.html'), 'utf8');
  assert.ok(home.includes('application/ld+json'));
  assert.ok(!home.includes('example.com'));
  assert.ok(existsSync(path.join(dist, 'robots.txt')));
  assert.ok(existsSync(path.join(dist, 'sitemap.xml')));
});
