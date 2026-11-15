import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('conteúdo, filtros e estudos de caso funcionam sem erros ou imagens quebradas', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ideias viram');
  await page.locator('[data-filter="Pesquisa"]').click();
  await expect(page.locator('.project-card:visible')).toHaveCount(1);
  await expect(page.locator('.project-card:visible')).toContainText('Blockchain & LLMs');
  await page.locator('[data-filter="Todos"]').click();
  await expect(page.locator('.project-card:visible')).toHaveCount(6);
  await page.locator('.project-card h3 a').first().click();
  await expect(page).toHaveURL(/projetos\/planeja-ufca/);
  await expect(page.getByRole('heading', { name: 'O problema real.' })).toBeVisible();
  await expect(page.locator('[data-achievement="project"]')).toHaveClass(/unlocked/);
  expect(errors).toEqual([]);
});

test('seis avatares sincronizam, persistem, preservam modo e voltam ao padrão', async ({ page }) => {
  await page.goto('/');
  const opener = page.locator('[data-open-avatar]').first();
  await opener.click();
  const options = page.locator('[data-select-avatar]');
  await expect(options).toHaveCount(6);
  for (const option of await options.all()) {
    const id = await option.getAttribute('data-select-avatar');
    await option.click();
    await expect(option).toHaveAttribute('aria-pressed', 'true');
    for (const avatar of await page.locator('[data-active-avatar]').all()) {
      await expect(avatar).toHaveAttribute('data-avatar-id', id!);
      await expect.poll(() => avatar.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
  }
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  await page.locator('[data-toggle-mode]').click();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'professional');
  await page.reload();
  await expect(page.locator('[data-active-avatar]').first()).toHaveAttribute('data-avatar-id', 'quadrinhos-blazer');
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'professional');
  await opener.click();
  await page.locator('[data-reset-avatar]').click();
  await expect(page.locator('[data-active-avatar]').first()).toHaveAttribute('data-avatar-id', 'ilustracao-azul');
  await page.keyboard.press('Escape');
});

test('paleta por teclado encontra tecnologias, ações e estado vazio', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  const input = page.getByRole('searchbox');
  await expect(input).toBeFocused();
  await input.fill('formacao');
  await expect(page.locator('.command-item:visible')).toHaveCount(1);
  await input.fill('zzzinexistente');
  await expect(page.locator('.command-empty')).toBeVisible();
  await input.fill('trocar avatar');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Um perfil. Outras perspectivas.' })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('#avatar-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Control+k');
  await input.fill('MQTT');
  await page.locator('[data-command-skill="MQTT"]').click();
  await expect(page.locator('#skill-detail')).toContainText('FlowCount');
});

test('progresso depende de visita, persiste e reinicia sem apagar o avatar', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-progress-count]').first()).toHaveText('0');
  for (const id of ['sobre', 'projetos', 'habilidades', 'trajetoria', 'pesquisa', 'contato']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(section => JSON.parse(localStorage.getItem('irlan-odyssey:progress') || '{}').sections?.includes(section), id)).toBe(true);
  }
  await expect(page.locator('[data-progress-percent]')).toHaveText('100%');
  await page.reload();
  await expect(page.locator('[data-progress-percent]')).toHaveText('100%');
  await page.locator('[data-open-avatar]').first().click();
  await page.locator('[data-select-avatar="pixel-art-retrato"]').click();
  await page.keyboard.press('Escape');
  await page.locator('[data-open-progress]').click();
  await page.locator('[data-reset-progress]').click();
  await expect(page.locator('[data-progress-count]').first()).toHaveText('0');
  await expect(page.locator('[data-active-avatar]').first()).toHaveAttribute('data-avatar-id', 'pixel-art-retrato');
});

test('preferências inválidas ou armazenamento bloqueado não interrompem o site', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('irlan-odyssey:avatar', 'arquivo-ausente');
    localStorage.setItem('irlan-odyssey:progress', '{bad');
  });
  await page.goto('/');
  await expect(page.locator('[data-active-avatar]').first()).toHaveAttribute('data-avatar-id', 'ilustracao-azul');
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Bloqueado'); } }); });
  await page.reload();
  await page.locator('[data-open-avatar]').first().click();
  await page.locator('[data-select-avatar="ghibli"]').click();
  await expect(page.locator('[data-active-avatar]').first()).toHaveAttribute('data-avatar-id', 'ghibli');
});

test('conteúdo essencial, currículo e navegação sobrevivem sem JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await expect(page.locator('h1')).toContainText('Ideias viram');
  await expect(page.locator('[data-active-avatar]').first()).toBeVisible();
  await expect(page.locator('.project-card')).toHaveCount(6);
  await expect(page.locator('.nojs-skills')).toBeVisible();
  const cv = await page.request.get('/documents/irlan-barros-curriculo.pdf');
  expect(cv.status()).toBe(200);
  await page.locator('.project-card h3 a').first().click();
  await expect(page.locator('h1')).toContainText('Planeja UFCA');
  await context.close();
});

test('sem overflow horizontal e auditoria axe WCAG AA nos dois temas e seletor', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const theme of ['dark', 'light']) {
    await page.evaluate(value => { document.documentElement.dataset.theme = value; }, theme);
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(scan.violations).toEqual([]);
  }
  await page.locator('[data-open-avatar]').first().click();
  const modalScan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(modalScan.violations).toEqual([]);
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.closest('dialog')?.id)).toBe('avatar-dialog');
  }
  await page.keyboard.press('Escape');
  await page.keyboard.press('Control+k');
  const commandScan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(commandScan.violations).toEqual([]);
});

test('menu móvel, tema e contexto da navegação', async ({ page }, testInfo) => {
  await page.goto('/');
  if (testInfo.project.name === 'mobile') {
    await page.locator('[data-menu-toggle]').click();
    await page.locator('#mobile-nav a[href="/#projetos"]').click();
    await expect(page.locator('#mobile-nav')).toBeHidden();
  }
  await page.locator('#habilidades').scrollIntoViewIfNeeded();
  const before = await page.locator('#habilidades').evaluate(e => e.getBoundingClientRect().top);
  // Clique no botão sticky já visível: evita a rolagem preparatória do locator
  // do Playwright, que mudaria a posição antes de nossa interação começar.
  const toggle = (await page.locator('[data-toggle-mode]').boundingBox())!;
  await page.mouse.click(toggle.x + toggle.width / 2, toggle.y + toggle.height / 2);
  await expect.poll(async () => Math.abs(await page.locator('#habilidades').evaluate(e => e.getBoundingClientRect().top) - before)).toBeLessThan(24);
  await page.keyboard.press('Control+k');
  await page.getByRole('searchbox').fill('alternar tema');
  await page.locator('[data-command-action="theme"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.keyboard.press('Control+k');
  await page.getByRole('searchbox').fill('alternar tema');
  await page.locator('[data-command-action="theme"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('imagens reais, capturas de revisão e tamanhos de tela adicionais', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.screenshot({ path: `test-results/portfolio-${testInfo.project.name}.png` });
  for (const section of await page.locator('[data-explore]').all()) await section.scrollIntoViewIfNeeded();
  const images = page.locator('main img');
  for (const img of await images.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  await page.screenshot({ path: `test-results/portfolio-${testInfo.project.name}-full.png`, fullPage: true });
  if (testInfo.project.name === 'desktop') {
    for (const width of [320, 360, 768, 1024, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow em ${width}px`).toBe(true);
    }
  }
});
