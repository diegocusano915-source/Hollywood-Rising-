/**
 * HOLLYWOOD RISING - Media Center Sub-View
 * Archive of trade articles, magazine covers, TV interviews, news reports, and podcast appearances generated from gameplay.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RepresentationFullState } from '../../types/representation';
import { Newspaper, ArrowLeft, Tv, Radio, Mic, Award, Camera, FileText } from 'lucide-react';

interface MediaCenterViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

export const MediaCenterView: React.FC<MediaCenterViewProps> = ({
  representationState,
  onBack,
}) => {
  const mediaItems = representationState.mediaCenter;
  const [filter, setFilter] = useState<string>('ALL');

  const filteredItems = filter === 'ALL' ? mediaItems : mediaItems.filter((m) => m.type === filter);

  return (
    <div className="space-y-6 text-white select-none pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-black/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Representation</span>
        </button>
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-sky-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">MEDIA CENTER</h2>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2 text-xs font-bold">
        {['ALL', 'Article', 'Magazine Cover', 'TV Interview', 'Press Conference'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === cat ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
            <Newspaper className="w-10 h-10 text-sky-400 mx-auto" />
            <h3 className="text-base font-black text-white">NO MEDIA ARCHIVES RECORDED YET</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Trade articles, magazine covers, TV interviews, and podcast appearances are automatically added as you book movies, release box office hits, and publish press statements!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-black uppercase">
                    {item.type}
                  </span>
                  <span className="text-[10px] text-gray-400">{item.dateText}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">{item.source}</span>
                  <h4 className="text-sm font-black text-white">{item.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{item.snippet}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
