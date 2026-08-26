/**
 * HOLLYWOOD RISING — CINEMA COMMAND DECK (Design 3)
 * Shared scene-hub grid system: HUD cards with corner brackets that snap
 * open on hover, pulsing status LEDs, real progress meters, and a blueprint
 * grid backdrop. Used by every scene hub (Empire, World, ...).
 */

import React from 'react';

export type DeckAccent = 'ok' | 'warn' | 'crit' | 'info';

const ACCENT_COLORS: Record<DeckAccent, string> = {
  ok: '#3ddc97',
  warn: '#f5b942',
  crit: '#ff5b6e',
  info: '#38bdf8',
};

/** Injected once — scoped class names, no global leakage. */
export const CommandDeckStyles: React.FC = () => (
  <style>{`
    .cmdk-bg {
      background-color:#060a08;
      background-image:
        linear-gradient(rgba(61,220,151,.035) 1px,transparent 1px),
        linear-gradient(90deg,rgba(61,220,151,.035) 1px,transparent 1px);
      background-size:44px 44px;
    }
    .cmdk-card {
      position:relative; overflow:hidden; cursor:pointer;
      background:#0a100d; border:1px solid rgba(61,220,151,.16); border-radius:6px;
      padding:14px 14px 12px; height:100%;
      font-family:'Cascadia Code','Consolas','Segoe UI',monospace;
      transition:border-color .25s, transform .25s, background .25s;
    }
    .cmdk-card:hover { border-color:transparent; background:#0c1410; transform:translateY(-3px); }
    .cmdk-card.cmdk-anim { transform:scale(.92); box-shadow:0 0 0 3px var(--acc), 0 0 34px var(--acc); }
    .cmdk-br { position:absolute; width:14px; height:14px; border:2px solid var(--acc); opacity:.85;
      transition:width .25s, height .25s; pointer-events:none; }
    .cmdk-br.tl { top:-1px; left:-1px; border-right:none; border-bottom:none; }
    .cmdk-br.tr { top:-1px; right:-1px; border-left:none; border-bottom:none; }
    .cmdk-br.bl { bottom:-1px; left:-1px; border-right:none; border-top:none; }
    .cmdk-br.br { bottom:-1px; right:-1px; border-left:none; border-top:none; }
    .cmdk-card:hover .cmdk-br { width:26px; height:26px; }
    .cmdk-led { display:flex; align-items:center; gap:5px; font-size:8px; letter-spacing:1.5px;
      color:var(--acc); font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .cmdk-led i { width:6px; height:6px; min-width:6px; background:var(--acc); border-radius:50%;
      box-shadow:0 0 8px var(--acc); animation:cmdkblink 1.8s infinite; }
    @keyframes cmdkblink { 50%{opacity:.2;} }
    .cmdk-tag { font-size:8px; letter-spacing:1px; font-weight:800; color:var(--acc);
      border:1px solid var(--acc); padding:2px 7px; border-radius:3px; opacity:.9; white-space:nowrap; }
    .cmdk-icon { width:42px; height:42px; min-width:42px; display:flex; align-items:center; justify-content:center;
      background:rgba(0,0,0,.5); border:1px solid rgba(255,255,255,.09); border-radius:4px;
      box-shadow:0 0 14px color-mix(in srgb,var(--acc) 18%,transparent) inset; }
    .cmdk-bar { height:5px; background:rgba(255,255,255,.06); border-radius:2px; overflow:hidden; }
    .cmdk-bar i { display:block; height:100%; border-radius:2px;
      background:linear-gradient(90deg,color-mix(in srgb,var(--acc) 45%,transparent),var(--acc));
      box-shadow:0 0 10px var(--acc); transition:width .5s ease; }
  `}</style>
);

interface CommandCardProps {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  subtitle: string;
  /** LED status line — real live state, e.g. "ACTIVE" / "3/5 GATES" */
  status: string;
  /** Small bordered tag, e.g. "TIER 3" */
  tag?: string;
  accent?: DeckAccent;
  /** Real progress meter (0-100). Omit for cards without a measurable scale. */
  meter?: { label: string; pct: number; text: string };
  foot?: string;
  onClick?: () => void;
  animating?: boolean;
}

export const CommandDeckCard: React.FC<CommandCardProps> = ({
  icon: Icon,
  title,
  subtitle,
  status,
  tag,
  accent = 'ok',
  meter,
  foot,
  onClick,
  animating,
}) => {
  const acc = ACCENT_COLORS[accent];
  const pct = Math.max(0, Math.min(100, meter?.pct ?? 0));

  return (
    <button
      onClick={onClick}
      className={`cmdk-card flex flex-col text-left w-full ${animating ? 'cmdk-anim' : ''}`}
      style={{ ['--acc' as string]: acc }}
    >
      <span className="cmdk-br tl" /><span className="cmdk-br tr" />
      <span className="cmdk-br bl" /><span className="cmdk-br br" />

      {/* status row */}
      <div className="flex items-center justify-between gap-1.5 mb-2.5">
        <div className="cmdk-led"><i />{status}</div>
        {tag && <span className="cmdk-tag">{tag}</span>}
      </div>

      {/* icon + title */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="cmdk-icon"><Icon className="w-5 h-5" style={{ color: acc }} /></div>
        <div className="min-w-0">
          <h3 className="text-[11px] leading-tight font-extrabold tracking-wide uppercase text-[#eafff4] truncate">{title}</h3>
          <p className="text-[8px] tracking-wide text-[#5d8a72] truncate uppercase">{subtitle}</p>
        </div>
      </div>

      {/* real meter */}
      {meter && (
        <div className="mb-1">
          <div className="flex justify-between items-center text-[8px] tracking-wider text-[#6fae8f] mb-1">
            <span className="truncate">{meter.label}</span>
            <b style={{ color: acc }} className="font-mono whitespace-nowrap ml-1">{meter.text}</b>
          </div>
          <div className="cmdk-bar"><i style={{ width: `${pct}%` }} /></div>
        </div>
      )}

      {/* foot */}
      <div className="mt-auto pt-2.5 border-t border-dashed border-white/10 flex items-center justify-between text-[8px] tracking-widest text-[#5d8a72]">
        <span className="truncate">{foot ?? 'SYSTEM ONLINE'}</span>
        <span className="font-extrabold" style={{ color: acc }}>ACCESS ▸</span>
      </div>
    </button>
  );
};

/** Scene hub header bar in the same HUD language. */
export const CommandDeckHeader: React.FC<{
  title: string;
  metaLeft: React.ReactNode;
  metaRight: React.ReactNode;
}> = ({ title, metaLeft, metaRight }) => (
  <div
    className="cmdk-bg relative flex flex-wrap items-center justify-between gap-3 rounded-md px-4 py-3.5 mb-4"
    style={{ border: '1px solid rgba(61,220,151,.3)', background: 'rgba(61,220,151,.04)' }}
  >
    <span className="cmdk-br tl" style={{ borderColor: '#3ddc97' }} />
    <span className="cmdk-br br" style={{ borderColor: '#3ddc97' }} />
    <h1 className="text-base sm:text-xl font-extrabold tracking-[6px] text-[#eafff4] uppercase">
      {title} <span className="text-[#3ddc97]">//</span>
    </h1>
    <div className="text-right text-[9px] tracking-[2px] text-[#6fae8f] leading-relaxed">
      <div>{metaLeft}</div>
      <div>{metaRight}</div>
    </div>
  </div>
);
