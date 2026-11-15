import { keys, sectionIds, emptyProgress, normalizeSearch, validAvatar, parseProgress, progressPercent, safeRead, safeWrite } from './state';

interface ClientAvatar { id: string; name: string; src: string; thumb: string; alt: string; position: string; pixelated: boolean }
const root = document.documentElement;
const $ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) => scope.querySelector<T>(selector);
const $$ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) => Array.from(scope.querySelectorAll<T>(selector));
const catalogElement = $('#avatar-catalog');
const catalog = JSON.parse(catalogElement?.textContent || '{"avatars":[],"defaultId":""}') as { avatars: ClientAvatar[]; defaultId: string };
const avatarIds = catalog.avatars.map(a => a.id);
let progress = parseProgress(safeRead(keys.progress), avatarIds);
let activeAvatar = validAvatar(safeRead(keys.avatar), avatarIds, catalog.defaultId);
let toastTimer: ReturnType<typeof setTimeout>;

function toast(message: string) {
  const el = $('#toast');
  if (!el) return;
  clearTimeout(toastTimer);
  el.textContent = message;
  el.hidden = false;
  toastTimer = setTimeout(() => { el.hidden = true; }, 4200);
}

const openers = new WeakMap<HTMLDialogElement, HTMLElement>();
function openDialog(id: string, opener?: HTMLElement) {
  const dialog = $<HTMLDialogElement>(`#${id}`);
  if (!dialog) return;
  const focused = opener || (document.activeElement instanceof HTMLElement ? document.activeElement : undefined);
  if (focused) openers.set(dialog, focused);
  if (id === 'avatar-dialog') $$<HTMLImageElement>('img[data-src]', dialog).forEach(img => { if (!img.src) img.src = img.dataset.src!; });
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  if (id === 'command-dialog') {
    const input = $<HTMLInputElement>('#command-search')!;
    input.value = '';
    filterCommands('');
    input.focus();
  } else if (id === 'avatar-dialog') {
    $<HTMLButtonElement>('.avatar-option[aria-pressed="true"]', dialog)?.focus();
  }
}
function closeDialog(dialog: HTMLDialogElement) { dialog.close(); }
$$<HTMLDialogElement>('dialog').forEach(dialog => {
  $$('[data-close-dialog]', dialog).forEach(button => button.addEventListener('click', () => closeDialog(dialog)));
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = $$<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]', dialog).filter(el => el.getClientRects().length > 0 && !el.closest('[hidden]'));
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) { event.preventDefault(); first?.focus(); }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog(dialog);
  });
  dialog.addEventListener('close', () => {
    if (!$('dialog[open]')) document.body.style.overflow = '';
    const opener = openers.get(dialog);
    if (opener?.isConnected && opener.getClientRects().length) opener.focus({ preventScroll: true });
  });
});

function renderProgress() {
  const percentage = progressPercent(progress);
  $$('[data-progress-count]').forEach(el => { el.textContent = String(progress.sections.length); });
  $$('[data-progress-percent]').forEach(el => { el.textContent = `${percentage}%`; });
  $$('[data-progress-bar]').forEach(el => { el.style.width = `${percentage}%`; });
  $$('[role="progressbar"]').forEach(el => el.setAttribute('aria-valuenow', String(percentage)));
  $$('[data-achievement]').forEach(el => {
    const unlocked = progress.achievements.includes(el.dataset.achievement!);
    el.classList.toggle('unlocked', unlocked);
    const state = $('.achievement-state', el);
    if (state) state.textContent = unlocked ? 'Conquistada ✓' : 'A explorar';
  });
}
function saveProgress() { safeWrite(keys.progress, JSON.stringify(progress)); renderProgress(); }
const achievementNames: Record<string, string> = { project: 'Primeira missão', skills: 'Conexões descobertas', research: 'Espírito investigador', avatars: 'Outras perspectivas', complete: 'Jornada completa' };
function unlock(id: string) {
  if (root.dataset.mode === 'professional' || progress.achievements.includes(id)) return;
  progress.achievements.push(id);
  saveProgress();
  toast(`Conquista da visita: ${achievementNames[id]}.`);
}
function visitSection(id: string) {
  if (root.dataset.mode === 'professional' || !sectionIds.includes(id) || progress.sections.includes(id)) return;
  progress.sections.push(id);
  if (id === 'pesquisa') unlock('research');
  if (progress.sections.length === sectionIds.length) unlock('complete');
  saveProgress();
}

function applyAvatar(id: string, persist = true, announce = true) {
  activeAvatar = validAvatar(id, avatarIds, catalog.defaultId);
  const avatar = catalog.avatars.find(a => a.id === activeAvatar);
  if (!avatar) return;
  $$<HTMLImageElement>('[data-active-avatar]').forEach(img => {
    img.src = avatar.src;
    img.alt = avatar.alt;
    img.dataset.avatarId = avatar.id;
    img.style.objectPosition = avatar.position;
    img.classList.toggle('pixelated', avatar.pixelated);
    if (announce && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      img.style.animation = 'none';
      requestAnimationFrame(() => { img.style.animation = 'avatar-enter .2s ease-out'; });
    }
  });
  $$('[data-select-avatar]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.selectAvatar === activeAvatar)));
  if (persist) safeWrite(keys.avatar, activeAvatar);
  if (announce) {
    const message = `Avatar selecionado: ${avatar.name}.`;
    const feedback = $('[data-avatar-feedback]');
    if (feedback) feedback.textContent = message;
    if (!$<HTMLDialogElement>('#avatar-dialog')?.open) toast(message);
    if (root.dataset.mode !== 'professional') {
      if (!progress.avatars.includes(activeAvatar)) progress.avatars.push(activeAvatar);
      if (progress.avatars.length >= 3) unlock('avatars');
      saveProgress();
    }
  }
}
// O HTML já contém o avatar padrão. Somente um retrato escolhido é solicitado
// na restauração; as miniaturas permanecem sem src até a abertura do diálogo.
if (activeAvatar !== catalog.defaultId) applyAvatar(activeAvatar, false, false);
const failedAvatars = new Set<string>();
$$<HTMLImageElement>('[data-active-avatar]').forEach(img => img.addEventListener('error', () => {
  failedAvatars.add(img.dataset.avatarId || activeAvatar);
  const fallback = catalog.avatars.find(a => a.id === catalog.defaultId && !failedAvatars.has(a.id)) || catalog.avatars.find(a => !failedAvatars.has(a.id));
  if (fallback) applyAvatar(fallback.id, true, false);
}));
$$('[data-open-avatar]').forEach(el => el.addEventListener('click', () => openDialog('avatar-dialog', el)));
$$('[data-select-avatar]').forEach(el => el.addEventListener('click', () => applyAvatar(el.dataset.selectAvatar!)));
$$('[data-reset-avatar]').forEach(el => el.addEventListener('click', () => applyAvatar(catalog.defaultId)));

function updateModeControl() {
  const isProfessional = root.dataset.mode === 'professional';
  $$('[data-toggle-mode]').forEach(el => el.setAttribute('aria-pressed', String(isProfessional)));
  $$('[data-mode-label]').forEach(el => { el.textContent = isProfessional ? 'Modo exploração' : 'Modo profissional'; });
}
function toggleMode() {
  const anchor = $$('[data-explore], .case-content section').filter(el => el.getBoundingClientRect().top < innerHeight * .5).at(-1);
  const offset = anchor?.getBoundingClientRect().top;
  root.dataset.mode = root.dataset.mode === 'professional' ? 'exploration' : 'professional';
  safeWrite(keys.mode, root.dataset.mode);
  updateModeControl();
  if (anchor && offset !== undefined) {
    // Reaplica após a composição: o novo menu e o cabeçalho sticky podem
    // estabilizar em quadros distintos, inclusive em telas com zoom.
    const restorePosition = () => window.scrollTo({ top: window.scrollY + anchor.getBoundingClientRect().top - offset, behavior: 'instant' });
    restorePosition();
    requestAnimationFrame(() => { restorePosition(); requestAnimationFrame(restorePosition); });
  }
  toast(root.dataset.mode === 'professional' ? 'Modo profissional: acesso direto ao conteúdo.' : 'Modo exploração: siga sua curiosidade.');
}
$$('[data-toggle-mode]').forEach(el => {
  // Focar um botão sticky pode rolar a página até a posição original do header
  // no Chromium. Mantemos o foco acessível sem deslocar a leitura.
  el.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault();
    el.focus({ preventScroll: true });
  });
  el.addEventListener('click', toggleMode);
});
updateModeControl();

const themeQuery = matchMedia('(prefers-color-scheme: light)');
let themePreference = safeRead(keys.theme) || 'system';
if (!['system', 'dark', 'light'].includes(themePreference)) themePreference = 'system';
function applyTheme() {
  root.dataset.theme = themePreference === 'system' ? (themeQuery.matches ? 'light' : 'dark') : themePreference;
  const names: Record<string, string> = { system: 'sistema', dark: 'escuro', light: 'claro' };
  $$('[data-toggle-theme]').forEach(el => { el.setAttribute('aria-label', `Tema: ${names[themePreference]}. Alternar tema`); el.title = `Tema: ${names[themePreference]}`; });
  $('meta[name="theme-color"]')?.setAttribute('content', root.dataset.theme === 'dark' ? '#111613' : '#f5f6f0');
}
function toggleTheme() {
  const order = ['system', 'dark', 'light'];
  themePreference = order[(order.indexOf(themePreference) + 1) % order.length];
  safeWrite(keys.theme, themePreference);
  applyTheme();
  toast(`Tema ${themePreference === 'system' ? 'do sistema' : themePreference === 'dark' ? 'escuro' : 'claro'} ativado.`);
}
themeQuery.addEventListener('change', () => { if (themePreference === 'system') applyTheme(); });
$$('[data-toggle-theme]').forEach(el => el.addEventListener('click', toggleTheme));
applyTheme();

const menuButton = $('[data-menu-toggle]');
const mobileNav = $('#mobile-nav');
function closeMenu() { if (mobileNav) mobileNav.hidden = true; menuButton?.setAttribute('aria-expanded', 'false'); menuButton?.setAttribute('aria-label', 'Abrir menu'); }
menuButton?.addEventListener('click', () => {
  if (!mobileNav) return;
  mobileNav.hidden = !mobileNav.hidden;
  menuButton.setAttribute('aria-expanded', String(!mobileNav.hidden));
  menuButton.setAttribute('aria-label', mobileNav.hidden ? 'Abrir menu' : 'Fechar menu');
});
$$('a', mobileNav || document.createDocumentFragment()).forEach(a => a.addEventListener('click', closeMenu));

const cards = $$('[data-project-category]');
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  cards.forEach(card => { card.hidden = category !== 'Todos' && card.dataset.projectCategory !== category; });
  const status = $('[data-filter-status]');
  if (status) status.textContent = `${cards.filter(c => !c.hidden).length} projetos na categoria ${category}.`;
}));

function selectSkill(skill: string, scroll = false) {
  const template = $$<HTMLTemplateElement>('template[data-skill-template]').find(el => el.dataset.skillTemplate === skill);
  const detail = $('#skill-detail');
  if (!template || !detail) return;
  detail.replaceChildren(template.content.cloneNode(true));
  $$('[data-skill]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.skill === skill)));
  unlock('skills');
  if (scroll || matchMedia('(max-width: 600px)').matches) detail.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
}
$$('[data-skill]').forEach(button => button.addEventListener('click', () => selectSkill(button.dataset.skill!)));
const initialSkill = new URLSearchParams(location.search).get('skill');
if (initialSkill) selectSkill(initialSkill);

const commandItems = $$<HTMLAnchorElement | HTMLButtonElement>('.command-item');
function filterCommands(query: string) {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  commandItems.forEach(item => { const haystack = normalizeSearch(item.dataset.commandSearch || ''); item.hidden = !terms.every(term => haystack.includes(term)); });
  const count = commandItems.filter(i => !i.hidden).length;
  const empty = $('.command-empty');
  if (empty) empty.hidden = count > 0;
  const status = $('[data-command-status]');
  if (status) status.textContent = `${count} resultados.`;
}
$('#command-search')?.addEventListener('input', event => filterCommands((event.target as HTMLInputElement).value));
$$('[data-open-command]').forEach(el => el.addEventListener('click', () => openDialog('command-dialog', el)));
$('#command-dialog')?.addEventListener('keydown', event => {
  if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) return;
  const visible = commandItems.filter(item => !item.hidden);
  const index = visible.indexOf(document.activeElement as HTMLButtonElement);
  if (event.key === 'Enter') {
    if (document.activeElement === $('#command-search')) { event.preventDefault(); visible[0]?.click(); }
    return;
  }
  event.preventDefault();
  const next = event.key === 'ArrowDown' ? (index + 1) % visible.length : index <= 0 ? visible.length - 1 : index - 1;
  visible[next]?.focus();
});
commandItems.forEach(item => item.addEventListener('click', event => {
  closeDialog($<HTMLDialogElement>('#command-dialog')!);
  const skill = item.dataset.commandSkill;
  if (skill) {
    event.preventDefault();
    if ($('#habilidades')) { selectSkill(skill, true); }
    else { location.href = `/?skill=${encodeURIComponent(skill)}#habilidades`; }
  }
  const action = item.dataset.commandAction;
  if (action === 'theme') toggleTheme();
  if (action === 'mode') toggleMode();
  if (action === 'avatar') openDialog('avatar-dialog', $<HTMLElement>('[data-open-command]')!);
  if (action === 'reset-avatar') applyAvatar(catalog.defaultId);
}));

document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    const command = $<HTMLDialogElement>('#command-dialog')!;
    if (command.open) closeDialog(command);
    else if (!$('dialog[open]')) openDialog('command-dialog', $<HTMLElement>('[data-open-command]')!);
  }
  if (event.key === 'Escape' && mobileNav && !mobileNav.hidden) { closeMenu(); menuButton?.focus(); }
});

$$('[data-open-progress]').forEach(button => button.addEventListener('click', () => openDialog('progress-dialog', button)));
const sectionTimers = new Map<string, ReturnType<typeof setTimeout>>();
$$('[data-reset-progress]').forEach(button => button.addEventListener('click', () => {
  sectionTimers.forEach(clearTimeout); sectionTimers.clear();
  progress = emptyProgress(); saveProgress(); toast('Progresso reiniciado. Sua escolha de avatar e suas preferências foram preservadas.');
}));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const visible = entry.isIntersecting && entry.intersectionRect.height >= Math.min(240, entry.boundingClientRect.height * .3);
      if (visible) {
        $$('.desktop-nav a').forEach(link => { if (link.getAttribute('href') === `/#${id}`) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
        if (!progress.sections.includes(id) && !sectionTimers.has(id)) sectionTimers.set(id, setTimeout(() => { sectionTimers.delete(id); if (!document.hidden) visitSection(id); }, 1200));
      } else {
        clearTimeout(sectionTimers.get(id)); sectionTimers.delete(id);
      }
    });
  }, { threshold: [0, .05, .1, .2, .3, .5, .75, 1] });
  $$('[data-explore]').forEach(el => observer.observe(el));
} else {
  $$<HTMLAnchorElement>('a[href^="/#"], a[href^="#"]').forEach(a => a.addEventListener('click', () => visitSection(a.hash.slice(1))));
}
if (document.body.dataset.project) { visitSection('projetos'); unlock('project'); }
renderProgress();

$$('[data-copy-email]').forEach(button => button.addEventListener('click', async () => {
  const email = button.dataset.copyEmail!;
  try { await navigator.clipboard.writeText(email); toast('E-mail copiado. Vamos conversar!'); }
  catch { toast(`Não foi possível copiar automaticamente. E-mail: ${email}`); }
}));
$$('[data-easter-egg]').forEach(button => button.addEventListener('click', () => toast('Sinal recebido. A melhor parte de uma jornada é o que a curiosidade encontra. ∞')));

window.addEventListener('storage', event => {
  if (event.key === keys.avatar) applyAvatar(validAvatar(event.newValue, avatarIds, catalog.defaultId), false, false);
  if (event.key === keys.progress) { progress = parseProgress(event.newValue, avatarIds); renderProgress(); }
  if (event.key === keys.theme) { themePreference = ['dark', 'light', 'system'].includes(event.newValue || '') ? event.newValue! : 'system'; applyTheme(); }
  if (event.key === keys.mode) { root.dataset.mode = event.newValue === 'professional' ? 'professional' : 'exploration'; updateModeControl(); }
});
