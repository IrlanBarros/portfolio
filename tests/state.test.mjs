import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/scripts/state.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const state = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('preferência de avatar inválida recai no padrão ou na primeira imagem local', () => {
  assert.equal(state.validAvatar('inexistente', ['azul', 'pixel'], 'azul'), 'azul');
  assert.equal(state.validAvatar('pixel', ['azul', 'pixel'], 'azul'), 'pixel');
  assert.equal(state.validAvatar(null, ['pixel'], 'azul'), 'pixel');
});
test('dados locais malformados e estruturas inválidas não quebram a página', () => {
  for (const value of ['not-json', 'null', '2', '{"sections":true}', '[]']) assert.deepEqual(state.parseProgress(value, []), state.emptyProgress());
});
test('progresso restaura apenas identificadores permitidos e elimina duplicatas', () => {
  const p = state.parseProgress(JSON.stringify({ sections: ['sobre', 'sobre', 'fake'], achievements: ['skills', 'admin'], avatars: ['azul', 'azul', 'unknown'] }), ['azul']);
  assert.deepEqual(p, { sections: ['sobre'], achievements: ['skills'], avatars: ['azul'] });
  assert.equal(state.progressPercent(p), 17);
});
test('progresso não ultrapassa 100% nem contabiliza seções inexistentes', () => {
  assert.equal(state.progressPercent({ sections: [...state.sectionIds, 'sobre', 'unknown'] }), 100);
  assert.equal(state.progressPercent(state.emptyProgress()), 0);
});
test('busca desconsidera acentos, espaços periféricos e caixa', () => {
  assert.equal(state.normalizeSearch('  FORMAÇÃO '), 'formacao');
});
test('armazenamento bloqueado falha sem interromper interações', () => {
  globalThis.localStorage = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('QuotaExceededError'); } };
  assert.equal(state.safeRead('x'), null);
  assert.equal(state.safeWrite('x', 'y'), false);
  delete globalThis.localStorage;
});
