/**
 * HOLLYWOOD RISING - Hollywood Insider Sub-View
 * Variety / Deadline / The Hollywood Reporter style entertainment trade news platform.
 * Displays real game-generated 250-700 word articles, 50-150 NPC comments, threaded replies, and engagement metrics.
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { HollywoodInsiderArticle, NewsCategory, NPCComment } from '../../types/hollywoodInsider';
import { HollywoodInsiderService } from '../../services/hollywoodInsiderService';
import {
  Newspaper,
  ArrowLeft,
  Search,
  Bookmark,
  Heart,
  Share2,
  Eye,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  UserCheck,
  Send,
  X,
  SlidersHorizontal,
  Film,
  Award,
  DollarSign,
  Scale,
  Building2,
  Tv,
  Radio,
  Zap,
} from 'lucide-react';

interface HollywoodInsiderViewProps {
  onBack: () => void;
}

const CATEGORIES: { name: NewsCategory | 'ALL'; icon: React.ComponentType<{ className?: string }> }[] = [
  { name: 'ALL', icon: Newspaper },
  { name: 'Movies', icon: Film },
  { name: 'Box Office', icon: DollarSign },
  { name: 'Awards', icon: Award },
  { name: 'Casting', icon: UserCheck },
  { name: 'Legal News', icon: Scale },
  { name: 'Studios', icon: Building2 },
  { name: 'Television & Streaming', icon: Tv },
  { name: 'Social Media', icon: Radio },
  { name: 'Scandals', icon: Zap },
  { name: 'Industry News', icon: GlobeIcon },
];

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}

export const HollywoodInsiderView: React.FC<HollywoodInsiderViewProps> = ({ onBack }) => {
  const { player } = useGame();
  const [insiderState, setInsiderState] = useState(() => HollywoodInsiderService.getState());
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'TRENDING' | 'BOOKMARKED'>('ALL');
  
  // Selected Article for Reading Modal
  const [activeArticle, setActiveArticle] = useState<HollywoodInsiderArticle | null>(null);
  const [commentFilter, setCommentFilter] = useState<'ALL' | 'TOP' | 'VERIFIED'>('ALL');
  const [playerCommentText, setPlayerCommentText] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);

  const refreshState = () => {
    setInsiderState({ ...HollywoodInsiderService.getState() });
  };

  useEffect(() => {
    refreshState();
  }, [player]);

  const articles = insiderState.articles || [];

  // Filter logic
  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      art.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.relatedEntities?.movieTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.relatedEntities?.actorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.relatedEntities?.studioName?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesType = true;
    if (activeFilter === 'TRENDING') matchesType = !!art.isTrending;
    if (activeFilter === 'BOOKMARKED') matchesType = !!art.userBookmarked;

    return matchesCat && matchesSearch && matchesType;
  });

  const headlineArticle = articles.find((a) => a.isHeadlineBanner) || articles[0];

  const handleToggleLike = (artId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    HollywoodInsiderService.toggleLikeArticle(artId);
    refreshState();
    if (activeArticle && activeArticle.id === artId) {
      setActiveArticle((prev) =>
        prev
          ? {
              ...prev,
              userLiked: !prev.userLiked,
              likesCount: prev.userLiked ? prev.likesCount - 1 : prev.likesCount + 1,
            }
          : null
      );
    }
  };

  const handleToggleBookmark = (artId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    HollywoodInsiderService.toggleBookmark(artId);
    refreshState();
    if (activeArticle && activeArticle.id === artId) {
      setActiveArticle((prev) =>
        prev ? { ...prev, userBookmarked: !prev.userBookmarked } : null
      );
    }
  };

  const handleShareArticle = (art: HollywoodInsiderArticle, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handlePostPlayerComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeArticle || !playerCommentText.trim()) return;

    HollywoodInsiderService.addPlayerComment(activeArticle.id, player, playerCommentText);
    setPlayerCommentText('');
    refreshState();

    // Update active modal view
    const updatedState = HollywoodInsiderService.getState();
    const updatedArt = updatedState.articles.find((a) => a.id === activeArticle.id);
    if (updatedArt) {
      setActiveArticle(updatedArt);
    }
  };

  return (
    <div className="space-y-6 text-white select-none pb-20 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-black px-4 py-2.5 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Article link copied to clipboard!</span>
        </div>
      )}

      {/* TOP TRADE MASTHEAD HEADER */}
      <div className="bg-gradient-to-r from-red-950 via-black to-slate-950 p-5 sm:p-6 rounded-3xl border border-red-500/30 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black transition-all cursor-pointer border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Representation</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Week {player.dateWeek || 1}, Year {player.dateYear || 1} • Live Industry Desk</span>
          </div>
        </div>

        {/* MASTHEAD LOGO & TITLE */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-[10px] font-black uppercase text-red-400 tracking-widest">
            <Flame className="w-3 h-3 text-red-400 animate-pulse" />
            OFFICIAL ENTERTAINMENT TRADE DESK
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-500 font-serif">
            HOLLYWOOD INSIDER
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide max-w-xl mx-auto">
            Breaking Film, Box Office, Awards, Casting, Legal & Studio Trade News
          </p>
        </div>

        {/* BREAKING TICKER */}
        <div className="bg-black/60 rounded-2xl border border-amber-500/20 p-2.5 flex items-center gap-3 overflow-hidden text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-black text-[10px] uppercase shrink-0 tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3" /> BREAKING
          </span>
          <div className="truncate text-gray-300 font-medium">
            {headlineArticle ? (
              <span>
                <strong className="text-amber-300">{headlineArticle.headline}</strong> — Read full trade report inside.
              </span>
            ) : (
              'Loading latest Hollywood trade reports...'
            )}
          </div>
        </div>
      </div>

      {/* CATEGORY NAV TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-amber-500 text-black font-black shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-black/40 hover:bg-white/10 text-gray-300 border border-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/40 p-3.5 rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, actors, studios..."
            className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
          {[
            { id: 'ALL', label: 'All Stories' },
            { id: 'TRENDING', label: '🔥 Trending' },
            { id: 'BOOKMARKED', label: '🔖 Saved' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-gray-400 hover:text-white bg-black/40 border border-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURED HEADLINE BANNER (If not filtering) */}
      {selectedCategory === 'ALL' && !searchQuery && activeFilter === 'ALL' && headlineArticle && (
        <div
          onClick={() => setActiveArticle(headlineArticle)}
          className="relative rounded-3xl border border-amber-500/30 overflow-hidden group cursor-pointer shadow-2xl transition-all hover:border-amber-400"
        >
          <div className="h-80 sm:h-96 w-full relative">
            <img
              src={headlineArticle.heroImageUrl}
              alt={headlineArticle.headline}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-600 text-white font-black text-[10px] uppercase tracking-wider">
                FEATURED BREAKING COVERAGE
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-amber-300 font-bold text-[10px]">
                {headlineArticle.category}
              </span>
              <span className="text-[11px] text-gray-300 font-medium">
                {headlineArticle.publishDate} • {headlineArticle.readTimeMinutes} min read
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white group-hover:text-amber-300 transition-colors font-serif leading-tight">
              {headlineArticle.headline}
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 max-w-3xl">
              {headlineArticle.excerpt}
            </p>

            <div className="flex items-center justify-between pt-2 text-xs text-gray-400 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{headlineArticle.authorName}</span>
                <span>• {headlineArticle.authorRole}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-amber-400" /> {headlineArticle.viewsCount.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400" /> {headlineArticle.likesCount.toLocaleString()}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-sky-400" /> {headlineArticle.commentCount} Comments</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ARTICLE FEED GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-gray-400 border-b border-white/10 pb-2">
          <span>SHOWING {filteredArticles.length} ARTICLES</span>
          <span>HOLLYWOOD INSIDER PRESS ARCHIVES</span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-white/10 bg-black/40 space-y-3">
            <Newspaper className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-base font-black text-white uppercase">NO MATCHING ARTICLES FOUND</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              No news stories match your current search parameters. Articles are automatically published whenever real game events, releases, awards, or studio contracts occur!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="rounded-2xl border border-white/10 bg-black/60 hover:border-amber-500/50 backdrop-blur-md overflow-hidden flex flex-col justify-between group cursor-pointer transition-all hover:-translate-y-1 shadow-lg"
              >
                <div>
                  {/* Hero Thumbnail */}
                  <div className="h-44 w-full relative overflow-hidden">
                    <img
                      src={art.heroImageUrl}
                      alt={art.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-black/80 border border-white/20 text-amber-300 font-black text-[9px] uppercase">
                        {art.category}
                      </span>
                      {art.isTrending && (
                        <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-black text-[9px] uppercase flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5" /> TRENDING
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleToggleBookmark(art.id, e)}
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-full border backdrop-blur-md transition-all ${
                        art.userBookmarked
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-black/60 text-gray-300 border-white/20 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Body Text */}
                  <div className="p-4 space-y-2">
                    <div className="text-[10px] text-gray-400 font-medium">
                      {art.publishDate} • {art.readTimeMinutes} min read
                    </div>

                    <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors font-serif leading-snug line-clamp-2">
                      {art.headline}
                    </h3>

                    <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                  <span className="truncate max-w-[120px] text-gray-300 font-semibold">{art.authorName}</span>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-amber-400" /> {art.viewsCount.toLocaleString()}</span>
                    <button
                      onClick={(e) => handleToggleLike(art.id, e)}
                      className={`flex items-center gap-1 hover:text-rose-400 transition-colors ${art.userLiked ? 'text-rose-400 font-bold' : ''}`}
                    >
                      <Heart className={`w-3 h-3 ${art.userLiked ? 'fill-current' : ''}`} />
                      <span>{art.likesCount.toLocaleString()}</span>
                    </button>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-sky-400" /> {art.commentCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULL ARTICLE READER MODAL */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-950 border border-amber-500/40 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-6 shadow-2xl relative">
            {/* Close Modal Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category & Time Badge */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-black font-black uppercase text-[10px]">
                {activeArticle.category}
              </span>
              <span className="text-gray-400 font-medium">
                {activeArticle.publisher} • {activeArticle.publishDate} • {activeArticle.readTimeMinutes} min read
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl font-black text-white font-serif leading-tight">
              {activeArticle.headline}
            </h1>

            {/* Sub-headline */}
            {activeArticle.subHeadline && (
              <p className="text-sm sm:text-base text-amber-200/90 font-medium italic border-l-2 border-amber-400 pl-3">
                {activeArticle.subHeadline}
              </p>
            )}

            {/* Reporter Author Profile */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/60 border border-white/10 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center font-black text-black text-sm">
                  {activeArticle.authorName[0]}
                </div>
                <div>
                  <div className="font-black text-white">{activeArticle.authorName}</div>
                  <div className="text-gray-400">{activeArticle.authorRole}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleBookmark(activeArticle.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeArticle.userBookmarked
                      ? 'bg-amber-500 text-black border-amber-400'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  <span>{activeArticle.userBookmarked ? 'Saved' : 'Save Story'}</span>
                </button>

                <button
                  onClick={() => handleShareArticle(activeArticle)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="rounded-2xl overflow-hidden border border-white/10 space-y-1.5">
              <img src={activeArticle.heroImageUrl} alt={activeArticle.headline} className="w-full h-72 sm:h-96 object-cover" />
              {activeArticle.imageCaption && (
                <p className="text-[11px] text-gray-400 px-3 py-1 bg-black/40 italic">
                  Photo: {activeArticle.imageCaption}
                </p>
              )}
            </div>

            {/* FULL 250-700 WORD MULTI-PARAGRAPH ARTICLE BODY */}
            <div className="space-y-4 text-sm sm:text-base text-gray-200 leading-relaxed font-sans">
              {activeArticle.contentParagraphs.map((para, idx) => (
                <p key={idx} className="first-letter:text-3xl first-letter:font-black first-letter:text-amber-400 first-letter:mr-1">
                  {para}
                </p>
              ))}
            </div>

            {/* ARTICLE ENGAGEMENT ACTIONS BAR */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleLike(activeArticle.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-black transition-all cursor-pointer ${
                    activeArticle.userLiked
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${activeArticle.userLiked ? 'fill-current text-rose-400' : ''}`} />
                  <span>{activeArticle.likesCount.toLocaleString()} Likes</span>
                </button>

                <span className="flex items-center gap-1.5 text-gray-400 font-medium">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>{activeArticle.viewsCount.toLocaleString()} Views</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 font-medium">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>{activeArticle.commentCount} Community Discussion Comments</span>
              </div>
            </div>

            {/* NPC COMMENTS & COMMUNITY DISCUSSION SECTION */}
            <div className="space-y-5 pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    COMMUNITY DISCUSSION ({activeArticle.comments.length})
                  </h3>
                </div>

                {/* Comment Filters */}
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {[
                    { id: 'ALL', label: 'All Comments' },
                    { id: 'TOP', label: '🔥 Top Comments' },
                    { id: 'VERIFIED', label: '✓ Verified Pros' },
                  ].map((cf) => (
                    <button
                      key={cf.id}
                      onClick={() => setCommentFilter(cf.id as any)}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        commentFilter === cf.id
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {cf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* POST PLAYER COMMENT FORM */}
              <form onSubmit={handlePostPlayerComment} className="flex gap-2">
                <input
                  type="text"
                  value={playerCommentText}
                  onChange={(e) => setPlayerCommentText(e.target.value)}
                  placeholder={`Comment as ${player.stageName || player.name}...`}
                  className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-400"
                />
                <button
                  type="submit"
                  disabled={!playerCommentText.trim()}
                  className="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </form>

              {/* COMMENTS LIST */}
              <div className="space-y-3.5">
                {activeArticle.comments
                  .filter((c) => {
                    if (commentFilter === 'TOP') return c.isTopComment || c.likesCount > 800;
                    if (commentFilter === 'VERIFIED') return c.isVerified || c.authorType === 'VERIFIED_CELEBRITY';
                    return true;
                  })
                  .slice(0, 50)
                  .map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <img src={c.authorAvatar} alt={c.authorName} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-white">{c.authorName}</span>
                              <span className="text-[10px] text-gray-500">{c.authorHandle}</span>
                              {c.isVerified && (
                                <span className="p-0.5 rounded-full bg-sky-500 text-black">
                                  <CheckCircle2 className="w-3 h-3 fill-current" />
                                </span>
                              )}
                              {c.isTopComment && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black uppercase">
                                  🔥 TOP COMMENT
                                </span>
                              )}
                            </div>
                            {c.roleBadge && <div className="text-[10px] text-amber-400 font-semibold">{c.roleBadge}</div>}
                          </div>
                        </div>

                        <span className="text-[10px] text-gray-500">{c.timeAgo}</span>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed pl-10">{c.text}</p>

                      <div className="flex items-center justify-between text-[11px] text-gray-400 pl-10 pt-1">
                        <button className="flex items-center gap-1 hover:text-rose-400 transition-colors">
                          <Heart className="w-3 h-3" />
                          <span>{c.likesCount.toLocaleString()}</span>
                        </button>
                        <span className="text-[10px] text-gray-500 cursor-pointer hover:text-white">Reply</span>
                      </div>

                      {/* Threaded NPC Replies */}
                      {c.replies && c.replies.length > 0 && (
                        <div className="ml-8 mt-2.5 pl-3 border-l-2 border-white/10 space-y-2">
                          {c.replies.map((r) => (
                            <div key={r.id} className="p-2.5 rounded-xl bg-black/40 space-y-1">
                              <div className="flex items-center gap-2 text-xs">
                                <img src={r.authorAvatar} alt={r.authorName} className="w-6 h-6 rounded-full object-cover" />
                                <span className="font-bold text-white">{r.authorName}</span>
                                <span className="text-[10px] text-gray-500">{r.authorHandle}</span>
                                <span className="text-[10px] text-gray-500 ml-auto">{r.timeAgo}</span>
                              </div>
                              <p className="text-xs text-gray-300 pl-8">{r.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
