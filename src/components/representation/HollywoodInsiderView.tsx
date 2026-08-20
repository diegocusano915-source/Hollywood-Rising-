/**
 * HOLLYWOOD RISING — THE HOLLYWOOD INSIDER (Trade Paper, Option A)
 * Cream/gold newspaper: masthead, breaking ticker of real headlines,
 * 10-section rail with live counts, lead story + article rows each wearing
 * a SOURCE RECEIPT tracing to the real game event that filed it. Tapping
 * an article opens the long-form body (9-13 paragraphs) with 50-65
 * deduplicated comments. Sections refresh every 2-3 weeks; empty sections
 * say so honestly — nothing is padded, nothing is fake.
 */
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { HollywoodInsiderService } from '../../services/hollywoodInsiderService';
import { HollywoodInsiderArticle, NewsCategory } from '../../types/hollywoodInsider';
import { ArrowLeft, Search, X } from 'lucide-react';

const CATEGORIES: NewsCategory[] = [
  'Movies', 'Box Office', 'Awards', 'Casting', 'Legal News',
  'Studios', 'Television & Streaming', 'Social Media', 'Scandals', 'Industry News',
];

const CAT_ICON: Record<string, string> = {
  Movies: '🎬', 'Box Office': '💵', Awards: '🏆', Casting: '🎭', 'Legal News': '⚖️',
  Studios: '🏢', 'Television & Streaming': '📺', 'Social Media': '📱', Scandals: '🌪️', 'Industry News': '🏭',
};

const CMT_MODS = ['', '', '', ' 💯', ' 🔥', ' ❤️', ' Facts.', ' This.', ' Well said.'];

export const HollywoodInsiderView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { player, persistNow } = useGame();
  const [state, setState] = useState(() => HollywoodInsiderService.getState());
  const [cat, setCat] = useState<'ALL' | NewsCategory>('ALL');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<HollywoodInsiderArticle | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [fb, setFb] = useState<string | null>(null);

  const showFb = (m: string) => { setFb(m); setTimeout(() => setFb(null), 3500); };
  const refresh = () => setState({ ...HollywoodInsiderService.getState() });

  const counts = CATEGORIES.reduce((acc, c) => ({ ...acc, [c]: state.articles.filter((a) => a.category === c).length }), {} as Record<string, number>);

  const filtered = state.articles.filter((a) => {
    const matchCat = cat === 'ALL' || a.category === cat;
    const q = search.toLowerCase();
    const matchQ = !q || a.headline.toLowerCase().includes(q) || (a.subHeadline || '').toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const lead = cat === 'ALL' && !search ? filtered[0] : null;
  const rest = lead ? filtered.slice(1) : filtered;
  const ticker = state.articles.slice(0, 6).map((a) => a.headline);

  const like = (id: string) => { HollywoodInsiderService.toggleLikeArticle(id); refresh(); if (open?.id === id) setOpen(HollywoodInsiderService.getState().articles.find((a) => a.id === id) || null); };
  const bookmark = (id: string) => { HollywoodInsiderService.toggleBookmark(id); refresh(); };
  const submitComment = () => {
    if (!open || !commentDraft.trim()) return;
    HollywoodInsiderService.addPlayerComment(open.id, player, commentDraft.trim());
    setCommentDraft('');
    setOpen(HollywoodInsiderService.getState().articles.find((a) => a.id === open.id) || null);
    refresh();
    showFb('Comment posted.');
  };

  // ============ ARTICLE READER ============
  if (open) {
    const receipt = (open as any).sourceReceipt || 'FILED FROM REAL EVENTS';
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0a0806' }}>
        {/* bar */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#2e2410]" style={{ background: '#100d09' }}>
          <button onClick={() => setOpen(null)} className="flex items-center gap-1.5 text-[10px] font-black text-[#c9a227] cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> FRONT PAGE
          </button>
          <div className="flex gap-2">
            <button onClick={() => like(open.id)} className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black cursor-pointer ${open.userLiked ? 'bg-[#c9a227] text-[#1a1206]' : 'bg-white/5 text-[#b0a685] border border-[#2e2410]'}`}>
              ♥ {open.likesCount.toLocaleString()}
            </button>
            <button onClick={() => bookmark(open.id)} className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black cursor-pointer ${state.bookmarkedIds.includes(open.id) ? 'bg-[#7dd3a8] text-[#06231a]' : 'bg-white/5 text-[#b0a685] border border-[#2e2410]'}`}>
              🔖
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* receipt */}
          <div className="px-4 pt-3">
            <span className="inline-block text-[6.5px] font-black px-2.5 py-1.5 rounded tracking-wider" style={{ background: 'rgba(61,220,151,0.1)', color: '#5fd6a4', border: '1px solid rgba(61,220,151,0.3)', fontFamily: 'Courier New, monospace' }}>
              ▣ SOURCE: {receipt}
            </span>
          </div>

          {/* headline */}
          <div className="px-4 pt-2.5 pb-3 border-b border-[#2e2410]">
            <h1 className="text-lg font-black leading-snug" style={{ color: '#f0e6cc', fontFamily: 'Georgia, serif' }}>{open.headline}</h1>
            {open.subHeadline && <p className="text-[10px] italic mt-2 leading-relaxed" style={{ color: '#b0a685', fontFamily: 'Georgia, serif' }}>{open.subHeadline}</p>}
            <div className="flex justify-between items-center mt-3 text-[7px]" style={{ color: '#6f6752', fontFamily: 'Arial, sans-serif' }}>
              <span>By {open.authorName} · {open.authorRole}</span>
              <span>{open.publishDate} · {open.readTimeMinutes} min read</span>
            </div>
            <div className="flex gap-3 text-[7px] mt-1.5" style={{ color: '#8a8069', fontFamily: 'Arial, sans-serif' }}>
              <span>👁 {open.viewsCount.toLocaleString()}</span><span>♥ {open.likesCount.toLocaleString()}</span><span>💬 {open.commentCount}</span><span>↗ {open.sharesCount.toLocaleString()}</span>
            </div>
          </div>

          {/* hero */}
          <div className="mx-4 mt-3 rounded-lg overflow-hidden border border-[#2e2410]">
            <img src={open.heroImageUrl} alt="" className="w-full h-36 object-cover opacity-80" />
            {open.imageCaption && <p className="px-2.5 py-1.5 text-[7px] italic" style={{ background: '#0c0a07', color: '#6f6752' }}>{open.imageCaption}</p>}
          </div>

          {/* long-form body */}
          <div className="px-4 py-4 space-y-3.5">
            {open.contentParagraphs.map((p, i) => (
              <p key={i} className={`leading-relaxed ${i === 0 ? 'text-[11px] font-bold first-letter:text-3xl first-letter:font-black first-letter:mr-1 first-letter:float-left first-letter:text-[#c9a227]' : 'text-[10.5px]'}`}
                style={{ color: i === 0 ? '#e8dfc8' : '#c4b899', fontFamily: 'Georgia, serif' }}>
                {p}
              </p>
            ))}
          </div>

          {/* comments */}
          <div className="border-t-2 border-double border-[#c9a227] mx-4 mt-1">
            <div className="flex justify-between items-center py-2.5">
              <b className="text-[10px] tracking-wider" style={{ color: '#f0e6cc' }}>💬 COMMENTS ({open.comments.length})</b>
              <span className="text-[6.5px]" style={{ color: '#6f6752', fontFamily: 'Courier New, monospace' }}>NEVER THE SAME TEXT TWICE</span>
            </div>

            {/* player comment box */}
            <div className="flex gap-1.5 pb-3">
              <input value={commentDraft} onChange={(e) => setCommentDraft(e.target.value)} placeholder="Add your comment..."
                className="flex-1 min-w-0 bg-[#0c0a07] border border-[#2e2410] rounded-lg px-3 py-2 text-[9.5px] outline-none" style={{ color: '#e8dfc8' }} />
              <button onClick={submitComment} className="px-3 rounded-lg bg-[#c9a227] text-[#1a1206] text-[9px] font-black cursor-pointer">POST</button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto space-y-2.5 pb-4">
              {open.comments.map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  {c.authorAvatar ? <img src={c.authorAvatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 border" style={{ borderColor: c.isVerified ? '#c9a22755' : '#2e2410' }} /> :
                    <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] bg-[#1a150c] border border-[#2e2410]">👤</div>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <b className="text-[8.5px]" style={{ color: c.isVerified ? '#f0e6cc' : '#c4b899', fontFamily: 'Arial, sans-serif' }}>{c.authorName}</b>
                      {c.isVerified && <span className="text-[6px] font-black" style={{ color: '#c9a227' }}>✔ {c.roleBadge}</span>}
                      {c.isTopComment && <span className="text-[5.5px] font-black px-1.5 py-0.5 rounded" style={{ background: '#c9a22722', color: '#c9a227' }}>TOP</span>}
                    </div>
                    <p className="text-[8.5px] leading-relaxed mt-0.5" style={{ color: '#b0a685', fontFamily: 'Arial, sans-serif' }}>{c.text}</p>
                    <span className="text-[6.5px] mt-1 block" style={{ color: '#6f6752', fontFamily: 'Courier New, monospace' }}>♥ {c.likesCount.toLocaleString()} · {c.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {fb && <div className="p-2 text-center text-[9px] font-bold" style={{ background: '#1a150c', color: '#c9a227' }}>{fb}</div>}
      </div>
    );
  }

  // ============ FRONT PAGE ============
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0806' }}>
      {/* top bar */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <button onClick={onBack} className="px-3.5 py-2 rounded-xl text-[10px] font-black flex items-center gap-1.5 cursor-pointer" style={{ background: '#100d09', border: '1px solid #2e2410', color: '#b0a685' }}>
          <ArrowLeft className="w-3.5 h-3.5 text-[#c9a227]" /> Back
        </button>
        <span className="text-[8px] font-black tracking-[2px]" style={{ color: '#5c5443', fontFamily: 'Courier New, monospace' }}>WK {player.dateWeek} · {player.dateYear}</span>
      </div>

      {/* masthead */}
      <div className="px-4 py-3 text-center border-y-[3px] border-double border-[#c9a227]" style={{ background: '#100d09' }}>
        <h1 className="text-lg font-black tracking-[2px]" style={{ color: '#f0e6cc', fontFamily: 'Georgia, serif' }}>THE HOLLYWOOD INSIDER</h1>
        <p className="text-[7px] tracking-[3px] mt-0.5" style={{ color: '#8a8069', fontFamily: 'Arial, sans-serif' }}>THE TRADE PAPER OF RECORD · FIRST WITH THE REAL STORY</p>
      </div>

      {/* breaking ticker */}
      {ticker.length > 0 ? (
        <div className="flex items-center gap-2 px-3 py-2 overflow-hidden" style={{ background: '#7a1e2e' }}>
          <span className="text-[7px] font-black px-2 py-1 rounded shrink-0" style={{ background: '#f2ede4', color: '#7a1e2e', fontFamily: 'Arial, sans-serif', animation: 'insBlink 1.4s infinite' }}>● LIVE</span>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-8 whitespace-nowrap" style={{ animation: 'insTick 22s linear infinite', width: 'max-content' }}>
              {[...ticker, ...ticker].map((t, i) => (
                <span key={i} className="text-[8.5px] font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#f2ede4' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* search */}
      <div className="px-3 py-2 flex items-center gap-2 border-b border-[#2e2410]" style={{ background: '#0c0a07' }}>
        <Search className="w-3.5 h-3.5 text-[#5c5443]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the archive..."
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-[10px]" style={{ color: '#e8dfc8' }} />
      </div>

      {/* section rail */}
      <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-[#2e2410]" style={{ background: '#0c0a07' }}>
        <button onClick={() => setCat('ALL')} className={`text-[7.5px] font-black px-2.5 py-1.5 rounded-full shrink-0 cursor-pointer border ${cat === 'ALL' ? 'bg-[#c9a227] text-[#1a1206] border-[#c9a227]' : 'bg-[#1a150c] text-[#8a8069] border-[#2e2410]'}`} style={{ fontFamily: 'Arial, sans-serif' }}>
          ALL ({state.articles.length})
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`text-[7.5px] font-black px-2.5 py-1.5 rounded-full shrink-0 cursor-pointer border ${cat === c ? 'bg-[#c9a227] text-[#1a1206] border-[#c9a227]' : 'bg-[#1a150c] text-[#8a8069] border-[#2e2410]'}`} style={{ fontFamily: 'Arial, sans-serif' }}>
            {CAT_ICON[c]} {c.split(' ')[0].toUpperCase()} {counts[c] ? `(${counts[c]})` : ''}
          </button>
        ))}
      </div>

      <style>{`@keyframes insTick { from { transform: translateX(10%); } to { transform: translateX(-100%); } } @keyframes insBlink { 50% { opacity: 0.35; } }`}</style>

      {/* feed */}
      <div className="flex-1 overflow-y-auto pb-6">
        {filtered.length === 0 ? (
          <div className="text-center py-14 px-6">
            <span className="text-3xl block">🗞️</span>
            <p className="text-[11px] font-bold mt-3" style={{ color: '#b0a685', fontFamily: 'Georgia, serif' }}>
              {state.articles.length === 0 ? 'THE PRESSES ARE QUIET' : 'NOTHING FILED IN THIS SECTION'}
            </p>
            <p className="text-[8.5px] mt-2 leading-relaxed" style={{ color: '#6f6752', fontFamily: 'Arial, sans-serif' }}>
              {state.articles.length === 0
                ? 'No stories yet — the Insider reports only REAL events. Release a movie, book a role, hit a milestone, and the desk will file it.'
                : 'This section has no filed stories this cycle — new events will fill it. Nothing is padded.'}
            </p>
          </div>
        ) : (
          <>
            {/* lead story */}
            {lead && (
              <button onClick={() => setOpen(lead)} className="w-full text-left px-4 py-3.5 border-b border-[#2e2410] cursor-pointer hover:bg-[#100d09]" style={{ background: lead.isBreaking ? '#140e0a' : 'transparent' }}>
                <span className="inline-block text-[6px] font-black px-2 py-1 rounded mb-2 tracking-wider" style={{ background: 'rgba(61,220,151,0.1)', color: '#5fd6a4', border: '1px solid rgba(61,220,151,0.3)', fontFamily: 'Courier New, monospace' }}>
                  ▣ SOURCE: {(lead as any).sourceReceipt || 'REAL EVENTS'}
                </span>
                <h2 className="text-[14px] font-black leading-snug" style={{ color: '#f0e6cc', fontFamily: 'Georgia, serif' }}>{lead.headline}</h2>
                {lead.subHeadline && <p className="text-[9.5px] italic mt-1.5 leading-relaxed" style={{ color: '#b0a685', fontFamily: 'Georgia, serif' }}>{lead.subHeadline}</p>}
                <div className="flex justify-between items-center mt-2.5 text-[7px]" style={{ color: '#6f6752', fontFamily: 'Arial, sans-serif' }}>
                  <span>{lead.authorName} · {lead.publishDate}</span>
                  <span>👁 {lead.viewsCount.toLocaleString()} · 💬 {lead.commentCount}</span>
                </div>
              </button>
            )}

            {/* article rows */}
            {rest.map((a) => (
              <button key={a.id} onClick={() => setOpen(a)} className="w-full flex gap-2.5 px-4 py-3 border-b border-[#1c160c] text-left cursor-pointer hover:bg-[#100d09]">
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[5.5px] font-black px-1.5 py-0.5 rounded mb-1 tracking-wider" style={{ background: 'rgba(61,220,151,0.08)', color: '#5fd6a4', border: '1px solid rgba(61,220,151,0.25)', fontFamily: 'Courier New, monospace' }}>
                    ▣ {(a as any).sourceReceipt || 'REAL EVENTS'}
                  </span>
                  <h4 className="text-[10.5px] font-black leading-snug" style={{ color: '#e8dfc8', fontFamily: 'Georgia, serif' }}>{a.headline}</h4>
                  <p className="text-[7.5px] mt-1 leading-snug line-clamp-2" style={{ color: '#8a8069', fontFamily: 'Arial, sans-serif' }}>{a.subHeadline || a.excerpt}</p>
                  <div className="text-[6.5px] mt-1.5" style={{ color: '#6f6752', fontFamily: 'Arial, sans-serif' }}>
                    {CAT_ICON[a.category]} {a.category} · {a.publishDate} · 👁 {a.viewsCount.toLocaleString()}
                  </div>
                </div>
                <div className="w-14 h-14 rounded-lg shrink-0 flex items-center justify-center text-xl border border-[#2e2410]" style={{ background: '#1a150c' }}>
                  {CAT_ICON[a.category]}
                </div>
              </button>
            ))}
          </>
        )}

        <p className="text-center text-[6.5px] py-4 px-6 leading-relaxed" style={{ color: '#5c5443', fontFamily: 'Courier New, monospace' }}>
          EVERY ARTICLE CARRIES ITS SOURCE RECEIPT · NO EVENT = NO ARTICLE · SECTIONS ROTATE EVERY 2-3 WEEKS · {state.articles.length} STORIES IN THE CURRENT CYCLE
        </p>
      </div>
    </div>
  );
};
