/**
 * HOLLYWOOD RISING — BLACK CARD SOCIETY (Elite Club rebuild, Option B)
 * Realm board (140 contacts · 10 realms · 69 real names), Signal-style DM
 * threads with archetype replies (SUAVE/BRASS TACKS/SWAGGER/CAGEY) and
 * REAL inline deal cards, concierge events whose outcomes hit the actual
 * ledger, and a live contracts desk. Every number is real.
 */
import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, SocietyDeal } from '../../types/empire';
import { EmpireService, ELITE_EVENT_CATALOG } from '../../services/empireService';
import {
  SOCIETY_CONTACTS, SOCIETY_STATS, REALM_META, SocietyContact, EliteRealm,
} from '../../database/eliteClubDatabase';
import {
  SOCIETY_ENTRY_FEE, SOCIETY_MIN_FAME, SOCIETY_ANNUAL_DUES,
  unlockedRealms, openThread, buildReplyOptions, sendReply,
  acceptDeal, declineDeal, hostSocietyEvent, tierFor,
} from '../../services/societyEngine';
import { ArrowLeft, Search } from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const fmtNW = (v: number) => v >= 1e9 ? `$${(v / 1e9).toFixed(0)}B` : `$${(v / 1e6).toFixed(0)}M`;

export const EliteClubView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player, saveData, updateSave, persistNow } = useGame();
  const ec = empireState.eliteClub;

  const [tab, setTab] = useState<'NETWORK' | 'CONCIERGE' | 'DEALS'>('NETWORK');
  const [openRealm, setOpenRealm] = useState<EliteRealm | null>(null);
  const [openContact, setOpenContact] = useState<SocietyContact | null>(null);
  const [search, setSearch] = useState('');
  const [fb, setFb] = useState<string | null>(null);
  const [fbOk, setFbOk] = useState(true);

  const showFb = (msg: string, ok = true) => { setFbOk(ok); setFb(msg); setTimeout(() => setFb(null), 5000); };
  const commit = (next: EmpireFullState) => { EmpireService.saveState(next); onUpdateState(next); };

  const realms = useMemo(() => unlockedRealms(empireState, player.fameXp || 0), [empireState, player.fameXp]);
  const rel = (id: string) => (ec.relationships || {})[id] ?? 10;
  const unreadCount = Object.values(ec.unread || {}).filter(Boolean).length;
  const pendingDeals = (ec.deals || []).filter((d) => d.status === 'PENDING');
  const activeDeals = (ec.deals || []).filter((d) => d.status === 'ACCEPTED');

  // ---------- membership ----------
  const joinClub = () => {
    if ((player.fameXp || 0) < SOCIETY_MIN_FAME) { showFb(`Requires ${SOCIETY_MIN_FAME} fame — you have ${(player.fameXp || 0).toLocaleString()}.`, false); return; }
    if ((player.money || 0) < SOCIETY_ENTRY_FEE) { showFb(`Entry fee is $${SOCIETY_ENTRY_FEE.toLocaleString()}.`, false); return; }
    const p = { ...player, money: player.money - SOCIETY_ENTRY_FEE };
    const next: EmpireFullState = {
      ...empireState,
      eliteClub: {
        ...ec,
        isMember: true,
        joinedWeek: player.dateWeek,
        joinedYear: player.dateYear,
        duesLastChargedWeek: player.dateYear * 52 + player.dateWeek,
      },
    };
    updateSave({ ...saveData, player: p });
    commit(next);
    showFb('👑 WELCOME TO THE BLACK CARD SOCIETY — $250K annual dues begin next year.');
  };

  // ---------- DM ----------
  const openDM = (c: SocietyContact) => {
    const next = { ...empireState, eliteClub: { ...ec } };
    openThread(next, c);
    commit(next);
    setOpenContact(c);
  };

  const reply = (c: SocietyContact, opt: { archetype: string; text: string; relChange: number; dealScale?: number }) => {
    const next = { ...empireState, eliteClub: { ...ec, threads: { ...(ec.threads || {}) } } };
    // The EXACT option the player clicked is sent — texts and REL effects
    // shown on screen always match what's applied (no re-roll).
    const { newDeal } = sendReply(next, c, opt as any);
    commit(next);
    if (newDeal) showFb(`🔓 NEW DEAL UNLOCKED: ${newDeal.title} — check the chat.`);
  };

  const doAccept = (deal: SocietyDeal) => {
    const next = { ...empireState, eliteClub: { ...ec, deals: [...(ec.deals || [])] } };
    const res = acceptDeal(next, deal.id);
    if (!res.success) return;
    const p = { ...player };
    p.money = Math.max(0, (p.money || 0) + res.cashOut - res.cashIn);
    p.fans = (p.fans || 0) + res.fansBonus;
    p.fameXp = (p.fameXp || 0) + Math.max(1, Math.floor(res.fameXp * 0.2)); // global slow-burn multiplier
    updateSave({ ...saveData, player: p });
    commit(next);
    showFb(res.message);
  };

  const doDecline = (deal: SocietyDeal) => {
    const next = { ...empireState, eliteClub: { ...ec, deals: [...(ec.deals || [])] } };
    if (declineDeal(next, deal.id)) { commit(next); showFb('Deal declined.'); }
  };

  // ---------- concierge ----------
  const hostEvent = (evt: any) => {
    if ((player.money || 0) < evt.cost) { showFb(`Insufficient cash — $${evt.cost.toLocaleString()} required.`, false); return; }
    const next = { ...empireState, eliteClub: { ...ec, eventHistory: [...ec.eventHistory] } };
    const res = hostSocietyEvent(next, evt, player.fameXp || 0);
    if (!res.success || !res.outcome) { showFb(res.message, false); return; }
    const o = res.outcome;
    const p = { ...player };
    p.money = Math.max(0, (p.money || 0) - evt.cost + o.pokerNet);
    p.fans = (p.fans || 0) + o.fans;
    p.fameXp = (p.fameXp || 0) + Math.max(1, Math.floor(o.fameXp * 0.2));
    o.log.week = player.dateWeek; o.log.year = player.dateYear;
    next.eliteClub.eventHistory = [o.log, ...ec.eventHistory];
    updateSave({ ...saveData, player: p });
    commit(next);
    showFb(`${evt.title} hosted — ${o.attendeeIds.length} contacts +${o.relGains} REL · +${o.fameXp} fame${o.pokerNet !== 0 ? ` · poker ${o.pokerNet > 0 ? '+' : '−'}$${Math.abs(o.pokerNet).toLocaleString()}` : ''}${o.taxDeductible > 0 ? ` · $${o.taxDeductible.toLocaleString()} tax-deductible` : ''}${o.unlockedRealm ? ` · ${o.unlockedRealm} realm UNLOCKED` : ''}`);
  };

  // ============================================================
  // NON-MEMBER
  // ============================================================
  if (!ec.isMember) {
    return (
      <div className="space-y-4" style={{ background: 'linear-gradient(170deg,#0b0f14,#06080a)', minHeight: '100%' }}>
        <div className="flex items-center justify-between p-3">
          <button onClick={onBack} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-black cursor-pointer flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-[9px] font-black text-[#5c6470] tracking-[2px]">BLACK CARD SOCIETY</span>
        </div>
        <div className="mx-3 rounded-2xl border border-[#2a3238] bg-[#0a0e12] p-6 text-center space-y-4">
          <div className="w-16 h-10 mx-auto rounded-lg bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#3a3f45] flex items-center justify-center text-xl relative">
            🖤
            <span className="absolute inset-[3px] border border-white/10 rounded" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">THE BLACK CARD SOCIETY</h3>
            <p className="text-[10px] text-gray-400 leading-relaxed mt-1 max-w-xs mx-auto">
              140 members. 10 realms. 69 household names. DM anyone — conversations unlock real contracts, co-investments and favors.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-left max-w-xs mx-auto">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[8px] font-black text-[#7ab3ec] uppercase block">Requirement</span>
              <b className="text-white text-sm">{SOCIETY_MIN_FAME} Fame XP</b>
              <span className="text-[9px] text-gray-500 block">you: {(player.fameXp || 0).toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[8px] font-black text-[#f5b942] uppercase block">Entry Fee</span>
              <b className="text-white text-sm">${SOCIETY_ENTRY_FEE.toLocaleString()}</b>
              <span className="text-[9px] text-gray-500 block">+ ${SOCIETY_ANNUAL_DUES.toLocaleString()}/yr dues</span>
            </div>
          </div>
          <button onClick={joinClub} className="px-8 py-3.5 rounded-2xl bg-[#f5b942] text-black font-black text-xs cursor-pointer shadow-lg">
            PAY & JOIN THE SOCIETY
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // DM THREAD VIEW
  // ============================================================
  if (openContact) {
    const thread = (ec.threads || {})[openContact.id] || [];
    const replies = buildReplyOptions(empireState, openContact);
    const r = rel(openContact.id);
    return (
      <div className="flex flex-col" style={{ background: 'linear-gradient(170deg,#0b0f14,#06080a)', minHeight: '100%' }}>
        {/* header */}
        <div className="flex gap-2.5 items-center px-3 py-2.5 bg-[#0a0f16] border-b border-[#1c2833]">
          <button onClick={() => setOpenContact(null)} className="text-[10px] font-black text-[#7ab3ec] cursor-pointer">← Back</button>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-black shrink-0"
            style={{ background: `${openContact.tint}22`, border: `1px solid ${openContact.tint}44`, color: openContact.tint }}>
            {initials(openContact.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <b className="text-[12px] text-white truncate">{openContact.name}</b>
              {openContact.isReal && <span className="text-[6px] font-black px-1.5 py-0.5 rounded bg-[#cf9df0]/15 text-[#cf9df0] border border-[#cf9df0]/35">REAL</span>}
            </div>
            <span className="text-[7.5px] text-[#5c6470] block truncate">{openContact.title} · {fmtNW(openContact.netWorth)}</span>
          </div>
          <span className="text-[7.5px] font-black px-2.5 py-1.5 rounded-lg bg-[#f5b942]/10 text-[#f5b942] border border-[#f5b942]/30 shrink-0">{tierFor(r)} · {r}</span>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2" style={{ minHeight: 240 }}>
          {thread.map((m, i) => {
            if (m.who === 'system') return <p key={i} className="text-center text-[7px] text-[#5c6470] font-mono">{m.text}</p>;
            const deal = m.dealId ? (ec.deals || []).find((d) => d.id === m.dealId) : undefined;
            return (
              <div key={i} className={`max-w-[85%] p-2.5 rounded-xl text-[10px] leading-relaxed border ${m.who === 'me' ? 'self-end ml-auto bg-[#14202e] border-[#2a4a6a]' : 'bg-[#0d1420] border-[#1f2b38]'}`}>
                {m.who === 'them' && <span className="text-[6.5px] font-black tracking-wider block mb-0.5" style={{ color: openContact.tint }}>{openContact.name.split(' ')[0].toUpperCase()}</span>}
                {m.text}
                {deal && (
                  <div className="mt-2 rounded-lg border-l-2 border-[#3ddc97] bg-[#3ddc97]/5 px-2.5 py-2">
                    <b className="text-[9px] text-[#5fd6a4] block">{deal.title}</b>
                    <span className="text-[8px] text-[#a8d8c2]">
                      {deal.kind === 'BRAND' ? `$${(deal.cashOut || 0).toLocaleString()} flat · +${(deal.fansBonus || 0).toLocaleString()} fans` : deal.kind === 'INVEST' ? `invest $${(deal.cashIn || 0).toLocaleString()} · $${(deal.weeklyPayout || 0).toLocaleString()}/wk payout` : `favor · +${deal.fameXp} fame`}
                    </span>
                    {deal.status === 'PENDING' && (
                      <div className="flex gap-1.5 mt-1.5">
                        <button onClick={() => doAccept(deal)} className="text-[8px] font-black bg-[#3ddc97] text-[#04231a] px-2.5 py-1.5 rounded-md cursor-pointer">SIGN</button>
                        <button onClick={() => doDecline(deal)} className="text-[8px] font-black bg-white/5 text-gray-400 border border-white/10 px-2.5 py-1.5 rounded-md cursor-pointer">PASS</button>
                      </div>
                    )}
                    {deal.status === 'ACCEPTED' && <span className="text-[7px] font-black text-[#5fd6a4] block mt-1">✔ SIGNED — terms active</span>}
                    {deal.status === 'DECLINED' && <span className="text-[7px] font-black text-gray-500 block mt-1">declined</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* replies */}
        <div className="px-3 py-2.5 border-t border-[#1c2833] bg-[#0a0f16] space-y-1.5">
          <p className="text-[6.5px] font-black text-[#5c6470] tracking-[1.5px]">REPLY — ARCHETYPES ROTATE · EFFECTS ARE REAL</p>
          {replies.map((opt, i) => (
            <button key={opt.archetype} onClick={() => reply(openContact, opt)}
              className="w-full flex gap-2.5 items-center bg-[#06080a] border border-[#1f2b38] rounded-xl px-3 py-2.5 cursor-pointer hover:border-[#f5b942]/40 text-left">
              <span className={`min-w-[54px] text-center text-[6.5px] font-black py-1.5 px-1 rounded-md ${
                opt.archetype === 'SUAVE' ? 'bg-[#f5b942]/15 text-[#f5b942]' :
                opt.archetype === 'BRASS TACKS' ? 'bg-[#7ab3ec]/15 text-[#7ab3ec]' :
                opt.archetype === 'SWAGGER' ? 'bg-[#ff8fa3]/15 text-[#ff8fa3]' : 'bg-[#cf9df0]/15 text-[#cf9df0]'
              }`}>{opt.archetype}</span>
              <p className="text-[9.5px] text-[#d4dae4] flex-1 leading-snug">{opt.text}</p>
              <span className="text-[7px] font-mono text-[#5c6470] shrink-0">{opt.relChange >= 0 ? '+' : ''}{opt.relChange} REL</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================
  // MEMBER DASHBOARD
  // ============================================================
  const realmContacts = openRealm
    ? SOCIETY_CONTACTS.filter((c) => c.realm === openRealm).filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.affiliation.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="flex flex-col gap-3 pb-8" style={{ background: 'linear-gradient(170deg,#0b0f14,#06080a)', minHeight: '100%' }}>
      {/* header */}
      <div className="flex items-center justify-between p-3">
        <button onClick={onBack} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-black cursor-pointer flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex gap-1.5">
          {(['NETWORK', 'CONCIERGE', 'DEALS'] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setOpenRealm(null); }}
              className={`px-2.5 py-1.5 rounded-lg text-[8.5px] font-black cursor-pointer ${tab === t ? 'bg-[#f5b942] text-black' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
              {t}{t === 'DEALS' && pendingDeals.length > 0 ? ` (${pendingDeals.length})` : ''}
            </button>
          ))}
        </div>
      </div>

      {fb && <div className={`mx-3 p-2.5 rounded-xl border text-[10px] font-bold ${fbOk ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300' : 'bg-rose-500/10 border-rose-400/30 text-rose-300'}`}>{fb}</div>}

      {/* member strip */}
      <div className="mx-3 rounded-xl border border-[#2a3238] bg-[#10161d] px-3.5 py-2.5 flex justify-between items-center">
        <div>
          <b className="text-[9.5px] text-[#d4dae4] block">MEMBER SINCE WK {ec.joinedWeek} · {ec.joinedYear}</b>
          <span className="text-[7px] text-[#5c6470]">ANNUAL DUES ${SOCIETY_ANNUAL_DUES.toLocaleString()} — AUTO-CHARGED EVERY 52 WKS</span>
        </div>
        <div className="text-right">
          <b className="text-[15px] font-mono text-[#f5b942] block">{SOCIETY_STATS.total}</b>
          <span className="text-[6.5px] text-[#5c6470] tracking-wider">CONTACTS</span>
        </div>
      </div>

      {/* ================= NETWORK ================= */}
      {tab === 'NETWORK' && !openRealm && (
        <div className="px-3">
          <div className="flex justify-between items-baseline mb-2">
            <b className="text-[12px]">🌐 The Network</b>
            <span className="text-[8px] text-[#5c6470] font-bold">{realms.length}/10 REALMS · {SOCIETY_STATS.realNames} REAL NAMES</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(REALM_META) as EliteRealm[]).map((realm) => {
              const meta = REALM_META[realm];
              const unlocked = realms.includes(realm);
              const contacts = SOCIETY_CONTACTS.filter((c) => c.realm === realm);
              const unreadRealm = contacts.some((c) => (ec.unread || {})[c.id]);
              return (
                <button key={realm} disabled={!unlocked} onClick={() => setOpenRealm(realm)}
                  className={`rounded-xl border p-3 flex gap-2.5 items-center text-left cursor-pointer ${unlocked ? 'border-[#1c2833] bg-[#0a0f16] hover:border-[#f5b942]/40' : 'border-[#1c2833] bg-[#0a0f16] opacity-50 cursor-not-allowed'}`}>
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: `${meta.color}18` }}>{meta.icon}</span>
                  <span className="flex-1 min-w-0">
                    <b className="text-[10.5px] block truncate">{realm}</b>
                    <span className="text-[7px] text-[#5c6470] block truncate">{unlocked ? `${contacts.filter((c) => c.isReal).length} real names inside` : `🔒 ${meta.unlockHint}`}</span>
                  </span>
                  <span className="text-right shrink-0">
                    <b className="text-[12px] font-mono text-[#d4dae4] block">{unlocked ? 14 : '—'}</b>
                    {unreadRealm && <span className="text-[6px] font-black text-[#f5b942]">● NEW</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'NETWORK' && openRealm && (
        <div className="px-3 space-y-2">
          <div className="flex gap-2 items-center">
            <button onClick={() => setOpenRealm(null)} className="text-[10px] font-black text-[#7ab3ec] cursor-pointer shrink-0">← Realms</button>
            <div className="flex-1 flex items-center gap-2 bg-[#0a0f16] border border-[#1c2833] rounded-xl px-3 py-2">
              <Search className="w-3.5 h-3.5 text-[#5c6470]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members..."
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-[10.5px] text-gray-200 placeholder:text-[#3a4150]" />
            </div>
          </div>
          {realmContacts.map((c) => {
            const r = rel(c.id);
            return (
              <button key={c.id} onClick={() => openDM(c)}
                className="w-full flex gap-2.5 items-center bg-[#0a0f16] border border-[#1c2833] rounded-xl px-3 py-2.5 cursor-pointer hover:border-[#f5b942]/40 text-left">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black shrink-0"
                  style={{ background: `${c.tint}22`, border: `1px solid ${c.tint}44`, color: c.tint }}>
                  {initials(c.name)}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-1.5">
                    <b className="text-[11px] truncate">{c.name}</b>
                    {c.isReal && <span className="text-[6px] font-black px-1.5 py-0.5 rounded bg-[#cf9df0]/15 text-[#cf9df0] border border-[#cf9df0]/35 shrink-0">REAL</span>}
                  </span>
                  <span className="text-[7.5px] text-[#5c6470] block truncate">{c.title} · {fmtNW(c.netWorth)}</span>
                  <span className="block mt-1 h-[3px] rounded-full bg-white/10 overflow-hidden w-24">
                    <i className="block h-full rounded-full" style={{ width: `${r}%`, background: 'linear-gradient(90deg,#8a5a10,#f5b942)' }} />
                  </span>
                </span>
                <span className="text-right shrink-0">
                  <b className="text-[9px] font-mono text-[#f5b942] block">{r}</b>
                  {(ec.unread || {})[c.id] && <span className="w-2 h-2 rounded-full bg-[#f5b942] block ml-auto mt-1" style={{ boxShadow: '0 0 6px #f5b942' }} />}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ================= CONCIERGE ================= */}
      {tab === 'CONCIERGE' && (
        <div className="px-3 space-y-2">
          <div className="flex justify-between items-baseline">
            <b className="text-[12px]">🛎️ Concierge Desk</b>
            <span className="text-[8px] text-[#5c6470] font-bold">EVERY OUTCOME HITS YOUR LEDGER</span>
          </div>
          {ELITE_EVENT_CATALOG.map((evt) => {
            const ledger = [
              ['REL', { 'Charity Gala': '+6 ea', 'Movie Premiere': '+5 ea', 'Casino Night': '+8 ea', 'Tech Summit': '+7 ea', 'Yacht Weekend': '+9 ea', 'Island Retreat': '+12 ea' }[evt.category] || '+5'],
              ['FAME', { 'Charity Gala': '+6', 'Movie Premiere': '+4', 'Casino Night': '+8', 'Tech Summit': '+9', 'Yacht Weekend': '+12', 'Island Retreat': '+15' }[evt.category] || '+5'],
              ['TAX-DED', ['Charity Gala', 'Tech Summit', 'Island Retreat'].includes(evt.category) ? `$${(evt.cost / 1000).toFixed(0)}K` : '$0'],
              ['SPECIAL', { 'Charity Gala': 'GOV REALM', 'Casino Night': '±POKER POT', 'Movie Premiere': '+8K FANS', 'Yacht Weekend': 'TABLOID 8%', 'Island Retreat': 'BOARD INTRO', 'Tech Summit': 'DEAL FLOW' }[evt.category] || '—'],
            ] as Array<[string, string]>;
            const locked = (player.fameXp || 0) < evt.minFameRequired;
            return (
              <div key={evt.id} className="rounded-xl border border-[#1c2833] bg-[#0a0f16] overflow-hidden">
                <div className="flex justify-between items-center px-3.5 py-2.5">
                  <div className="min-w-0">
                    <b className="text-[11.5px] block">{evt.title}</b>
                    <span className="text-[7.5px] text-[#5c6470]">{evt.description}</span>
                  </div>
                  <span className="text-[9.5px] font-mono font-black text-[#f5b942] shrink-0">${evt.cost.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 px-3.5 pb-2">
                  {ledger.map(([k, v]) => (
                    <div key={k} className="bg-[#0d1420] border border-[#1f2b38] rounded-lg py-1.5 text-center">
                      <span className="text-[5.5px] text-[#5c6470] block">{k}</span>
                      <b className="text-[9px] font-mono text-[#d4dae4]">{v}</b>
                    </div>
                  ))}
                </div>
                <button onClick={() => hostEvent(evt)} disabled={locked}
                  className={`w-full py-2.5 text-[10px] font-black cursor-pointer ${locked ? 'bg-white/5 text-gray-500' : 'bg-[#f5b942] text-black'}`}>
                  {locked ? `🔒 ${evt.minFameRequired.toLocaleString()} FAME` : 'HOST EVENT'}
                </button>
              </div>
            );
          })}
          {ec.eventHistory.length > 0 && (
            <div className="pt-1">
              <b className="text-[9px] font-black text-[#5c6470] tracking-wider block mb-1.5">EVENT HISTORY</b>
              {ec.eventHistory.slice(0, 5).map((log) => (
                <div key={log.id} className="rounded-xl border border-[#1c2833] bg-[#0a0f16] px-3 py-2 mb-1.5">
                  <div className="flex justify-between">
                    <b className="text-[9.5px] text-[#f5b942]">{log.eventTitle}</b>
                    <span className="text-[7px] text-[#5c6470]">WK {log.week} · {log.year}</span>
                  </div>
                  <p className="text-[8px] text-gray-400">{log.outcome}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= DEALS ================= */}
      {tab === 'DEALS' && (
        <div className="px-3 space-y-2">
          <div className="flex justify-between items-baseline">
            <b className="text-[12px]">📜 Contracts Desk</b>
            <span className="text-[8px] text-[#5c6470] font-bold">REAL MONEY · TAX APPLIES ON CASH OUT</span>
          </div>
          {(ec.deals || []).length === 0 ? (
            <div className="text-center py-8 rounded-2xl border border-white/10 bg-black/30">
              <span className="text-3xl block">📜</span>
              <p className="text-[11px] text-gray-300 font-bold mt-2">No deals yet.</p>
              <p className="text-[8.5px] text-gray-500 mt-1">DM contacts and grow relationships — deals unlock at 25+ and get richer at every tier.</p>
            </div>
          ) : (
            (ec.deals || []).slice().reverse().map((d) => (
              <div key={d.id} className={`rounded-xl border p-3 ${
                d.status === 'PENDING' ? 'border-[#f5b942]/40 bg-[#f5b942]/5' :
                d.status === 'ACCEPTED' ? 'border-emerald-400/30 bg-emerald-500/5' : 'border-white/10 bg-black/30 opacity-60'
              }`}>
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <b className="text-[10.5px] block">{d.title}</b>
                    <span className="text-[7.5px] text-[#5c6470] block">{d.contactName} · {d.kind}</span>
                  </div>
                  <span className={`text-[7px] font-black px-2 py-1 rounded shrink-0 ${
                    d.status === 'PENDING' ? 'bg-[#f5b942]/15 text-[#f5b942]' :
                    d.status === 'ACCEPTED' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/5 text-gray-500'
                  }`}>{d.status}</span>
                </div>
                <p className="text-[8.5px] text-gray-400 mt-1">
                  {d.kind === 'BRAND' ? `$${(d.cashOut || 0).toLocaleString()} flat · +${(d.fansBonus || 0).toLocaleString()} fans` : d.kind === 'INVEST' ? `$${(d.cashIn || 0).toLocaleString()} in · $${(d.weeklyPayout || 0).toLocaleString()}/wk · ${d.weeksRemaining || 0} wks left` : `favor · +${d.fameXp} fame`}
                </p>
                {d.status === 'PENDING' && (
                  <div className="flex gap-1.5 mt-2">
                    <button onClick={() => doAccept(d)} className="flex-1 py-2 rounded-lg bg-[#3ddc97] text-[#04231a] text-[9px] font-black cursor-pointer">SIGN DEAL</button>
                    <button onClick={() => doDecline(d)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[9px] font-black cursor-pointer">PASS</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
