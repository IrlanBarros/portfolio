export const keys = {
  avatar: 'irlan-odyssey:avatar',
  theme: 'irlan-odyssey:theme',
  mode: 'irlan-odyssey:mode',
  progress: 'irlan-odyssey:progress',
} as const;

export interface Progress { sections: string[]; achievements: string[]; avatars: string[] }
export const sectionIds = ['sobre', 'projetos', 'habilidades', 'trajetoria', 'pesquisa', 'contato'];
export const achievementIds = ['project', 'skills', 'research', 'avatars', 'complete'];
export const emptyProgress = (): Progress => ({ sections: [], achievements: [], avatars: [] });
export const normalizeSearch = (s: string): string => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
export function validAvatar(id: string | null, ids: string[], fallback: string): string {
  return id && ids.includes(id) ? id : ids.includes(fallback) ? fallback : ids[0];
}
export function parseProgress(raw: string | null, avatarIds: string[]): Progress {
  try {
    const value: unknown = JSON.parse(raw || 'null');
    if (!value || typeof value !== 'object') return emptyProgress();
    const p = value as Partial<Progress>;
    const clean = (values: unknown, allowed: string[]) => Array.isArray(values) ? [...new Set(values.filter((v): v is string => typeof v === 'string' && allowed.includes(v)))] : [];
    return { sections: clean(p.sections, sectionIds), achievements: clean(p.achievements, achievementIds), avatars: clean(p.avatars, avatarIds) };
  } catch { return emptyProgress(); }
}
export const progressPercent = (progress: Progress) => Math.round(new Set(progress.sections.filter(s => sectionIds.includes(s))).size / sectionIds.length * 100);

export function safeRead(key: string): string | null { try { return localStorage.getItem(key); } catch { return null; } }
export function safeWrite(key: string, value: string): boolean { try { localStorage.setItem(key, value); return true; } catch { return false; } }
