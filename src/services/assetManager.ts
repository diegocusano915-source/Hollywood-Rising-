/**
 * HOLLYWOOD RISING — OFFLINE ASSET MANAGER (invisible)
 * Single source for every bundled picture. Components ask for an image by
 * category + context (tier, seed) and get a LOCAL file path — never a
 * network URL. Deterministic: the same seed always returns the same image,
 * so an NPC keeps the same face forever.
 */
import manifest from '../../public/assets/offline/manifest.json';

type Category = keyof typeof manifest;

const CATS: Record<string, string[]> = manifest as unknown as Record<string, string[]>;

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Deterministic pick from a category by any seed string. */
export function pickAsset(category: Category | string, seed: string | number): string {
  const list = CATS[category] || [];
  if (list.length === 0) return '';
  const h = typeof seed === 'number' ? seed : hashStr(String(seed));
  return list[h % list.length];
}

/**
 * Tier-aware pick: splits the category list into `tiers` bands and picks
 * within the requested band. Band 1 = first third (everyday), highest band
 * = premium end of the list.
 */
export function pickTiered(category: Category | string, tier: number, seed: string | number, tiers = 3): string {
  const list = CATS[category] || [];
  if (list.length === 0) return '';
  const bandSize = Math.max(1, Math.ceil(list.length / tiers));
  const band = Math.min(tiers - 1, Math.max(0, tier - 1));
  const start = band * bandSize;
  const bandList = list.slice(start, start + bandSize);
  if (bandList.length === 0) return pickAsset(category, seed);
  const h = typeof seed === 'number' ? seed : hashStr(String(seed));
  return bandList[h % bandList.length];
}

/** NPC portrait — stable per name. */
export function npcAvatar(name: string): string {
  return pickAsset('portraits', name || 'npc');
}

/** Car picture — tier 1 everyday, 2 luxury, 3 supercar. */
export function carImage(wealthTier: number, seed: string | number): string {
  return pickTiered('cars', wealthTier, seed);
}

/** House picture — tier 1 apartment, 2 luxury home, 3 mansion. */
export function houseImage(wealthTier: number, seed: string | number): string {
  return pickTiered('houses', wealthTier, seed);
}

/** Scene/prop picture from the extras pack (events, studios, parties...). */
export function sceneImage(kind: string, seed: string | number): string {
  return pickAsset('extras', kind + ':' + String(seed));
}

/** Total bundled image count (for settings/diagnostics). */
export function assetPackSize(): number {
  return Object.values(CATS).reduce((a, b) => a + b.length, 0);
}

const AssetManager = { pickAsset, pickTiered, npcAvatar, carImage, houseImage, sceneImage, assetPackSize };
export default AssetManager;

// ============================================================
// INVISIBLE OFFLINE IMAGE INTERCEPTOR
// The codebase references remote Unsplash URLs in 24 files. Rather than
// touching any of them, this boots once and transparently rewrites every
// remote image to its LOCAL pack copy (pack filenames embed the original
// photo id, so the mapping is exact). No logic is modified anywhere.
// ============================================================

let interceptorInstalled = false;

/** photo id (last 12 chars) -> local path, built from the pack manifest. */
const ID_TO_LOCAL: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const list of Object.values(CATS)) {
    for (const p of list) {
      const m = p.match(/_([a-z0-9]{12})\.jpg$/);
      if (m) map[m[1]] = p;
    }
  }
  // DEAD-ID FALLBACKS: these 7 remote photos 404 even online (two are typo'd
  // ids in old code). Each maps to a context-matched bundled image.
  const dead: Record<string, string> = {
    '583008082980': 'assets/offline/houses/houses_00f18fb6b3ea.jpg',   // real-estate property
    'a4c8a383392d': 'assets/offline/extras/extras_2ee91cede3ba.jpg',   // studio casting poster
    'a4c8a383392e': 'assets/offline/extras/extras_2ee91cede3ba.jpg',   // (typo twin)
    'a3fb3927b6a0': 'assets/offline/extras/extras_152d9b164e26.jpg',   // studio casting poster
    'a3fb3927b675': 'assets/offline/extras/extras_152d9b164e26.jpg',   // (typo twin)
    '26b21557b4a7': 'assets/offline/extras/extras_47ba0277781c.jpg',   // streaming platform
    '0b3b00cc82ee': 'assets/offline/extras/extras_04bf5292ceea.jpg',   // sports radio station
  };
  Object.assign(map, dead);
  return map;
})();

function localForRemote(src: string): string | null {
  const m = src.match(/photo-[0-9]+-([a-f0-9]+)/);
  if (!m) return null;
  const key = m[1].slice(-12);
  return ID_TO_LOCAL[key] || null;
}

function rewriteEl(el: HTMLImageElement) {
  const src = el.getAttribute('src') || '';
  if (src.indexOf('images.unsplash.com') === -1) return;
  const local = localForRemote(src);
  if (local) el.setAttribute('src', local);
}

function rewriteBackgrounds(el: HTMLElement) {
  const bg = el.style && el.style.backgroundImage;
  if (bg && bg.indexOf('images.unsplash.com') !== -1) {
    const m = bg.match(/photo-[0-9]+-([a-f0-9]+)/);
    if (m) {
      const local = ID_TO_LOCAL[m[1].slice(-12)];
      if (local) el.style.backgroundImage = `url(${local})`;
    }
  }
}

function scan(root: Element) {
  if (root instanceof HTMLImageElement) rewriteEl(root);
  rewriteBackgrounds(root as HTMLElement);
  root.querySelectorAll('img').forEach(rewriteEl);
  root.querySelectorAll<HTMLElement>('[style*="images.unsplash.com"]').forEach(rewriteBackgrounds);
}

export function installOfflineImageInterceptor(): void {
  if (interceptorInstalled || typeof document === 'undefined') return;
  interceptorInstalled = true;
  const run = () => scan(document.documentElement);
  run();
  const mo = new MutationObserver((mutations) => {
    for (const mu of mutations) {
      mu.addedNodes.forEach((n) => { if (n instanceof Element) scan(n); });
      if (mu.type === 'attributes' && mu.target instanceof Element) scan(mu.target);
    }
  });
  const start = () => mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'style'] });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}
