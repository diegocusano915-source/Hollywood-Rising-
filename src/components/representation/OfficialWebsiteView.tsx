/**
 * HOLLYWOOD RISING - Official Website Sub-View
 * Launch, upgrade, and manage the official digital web portal.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RepresentationFullState } from '../../types/representation';
import { RepresentationService } from '../../services/representationService';
import { Globe, ArrowLeft, Film, Award, Briefcase, Eye, Sparkles, Check, ExternalLink, DollarSign } from 'lucide-react';

interface OfficialWebsiteViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

export const OfficialWebsiteView: React.FC<OfficialWebsiteViewProps> = ({
  representationState,
  onRefresh,
  onBack,
}) => {
  const { player, bookedProjects, releasedMovies } = useGame();
  const website = representationState.website;

  const [domainInput, setDomainInput] = useState('');
  const [designTier, setDesignTier] = useState<'Basic' | 'Sleek Modern' | 'Custom Luxury Portal'>('Sleek Modern');

  // Launch Website
  const handleLaunchWebsite = () => {
    if (!domainInput.trim()) {
      alert('Please enter a custom domain name.');
      return;
    }

    const costs = { Basic: 2500, 'Sleek Modern': 7500, 'Custom Luxury Portal': 20000 };
    const cost = costs[designTier];

    if (player.money < cost) {
      alert(`Insufficient funds! Launching ${designTier} website costs $${cost.toLocaleString()}.`);
      return;
    }

    player.money -= cost;
    const state = RepresentationService.getState();
    const cleanDomain = domainInput.trim().toLowerCase().replace(/[^a-z0-0]/g, '') + '.com';

    state.website = {
      isLaunched: true,
      domainName: `www.${cleanDomain}`,
      designTier,
      weeklyVisitors: 2500,
      hasBio: true,
      hasFilmography: true,
      hasAwards: true,
      hasUpcomingProjects: true,
      hasBusinessPortfolio: true,
      launchWeek: player.dateWeek,
      launchYear: player.dateYear,
    };

    state.reputation.publicReputation = Math.min(100, state.reputation.publicReputation + 5);
    RepresentationService.saveState(state);
    alert(`🌐 Official Website ${state.website.domainName} launched!`);
    onRefresh();
  };

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
          <Globe className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">OFFICIAL WEBSITE</h2>
        </div>
      </div>

      {!website.isLaunched ? (
        <div className="p-8 rounded-3xl border border-blue-500/30 bg-black/60 backdrop-blur-md text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-400/50 flex items-center justify-center mx-auto shadow-xl">
            <Globe className="w-8 h-8 text-blue-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">Build Official Digital Portal</h3>
            <p className="text-xs text-gray-400">
              Launch your official domain to showcase filmography, press releases, upcoming projects, and press contacts.
            </p>
          </div>

          <div className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Domain Handle</label>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-gray-400 font-bold">www.</span>
                <input
                  type="text"
                  placeholder={`${player.firstName.toLowerCase()}${player.lastName.toLowerCase()}`}
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white outline-none focus:border-blue-400"
                />
                <span className="text-gray-400 font-bold">.com</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Design Tier</label>
              <select
                value={designTier}
                onChange={(e) => setDesignTier(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none"
              >
                <option value="Basic">Basic Web Template ($2,500)</option>
                <option value="Sleek Modern">Sleek Hollywood Modern ($7,500)</option>
                <option value="Custom Luxury Portal">Custom Luxury Web Portal ($20,000)</option>
              </select>
            </div>

            <button
              onClick={handleLaunchWebsite}
              className="w-full py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs transition-all shadow-xl hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>LAUNCH WEBSITE</span>
            </button>
          </div>
        </div>
      ) : (
        /* LIVE WEBSITE PREVIEW CARD */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-blue-500/40 bg-black/80 backdrop-blur-md space-y-4 shadow-2xl">
            {/* Browser Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="px-3 py-1 rounded-xl bg-white/10 text-blue-300 font-mono text-[11px] flex items-center gap-1.5">
                  <Globe className="w-3 h-3" />
                  <span>{website.domainName}</span>
                </span>
              </div>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>{website.weeklyVisitors.toLocaleString()} Visitors/Wk</span>
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                <DollarSign className="w-3.5 h-3.5" />
                <span>${(website.weeklyIncome || 0).toLocaleString()}/wk income · ${(website.totalIncome || 0).toLocaleString()} total</span>
              </span>
            </div>

            {/* MONETIZATION + BOOST */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => { const st = RepresentationService.getState(); st.website.adEnabled = !st.website.adEnabled; RepresentationService.saveState(st); onRefresh(); }}
                className={`px-3 py-2 rounded-xl text-[10px] font-black cursor-pointer ${website.adEnabled ? 'bg-emerald-500 text-black' : 'bg-black/40 text-gray-300 border border-white/10'}`}
              >
                📺 Ads {website.adEnabled ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => { const st = RepresentationService.getState(); st.website.merchEnabled = !st.website.merchEnabled; RepresentationService.saveState(st); onRefresh(); }}
                className={`px-3 py-2 rounded-xl text-[10px] font-black cursor-pointer ${website.merchEnabled ? 'bg-emerald-500 text-black' : 'bg-black/40 text-gray-300 border border-white/10'}`}
              >
                🛍 Merch Store {website.merchEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="pt-1">
              <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Boost Visitors (Lv {website.boostLevel || 0}/5)</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((lv) => (
                  <button
                    key={lv}
                    onClick={() => { const st = RepresentationService.getState(); const cost = lv * 25000; if (player.money < cost) { alert('Insufficient funds'); return; } player.money -= cost; st.website.boostLevel = lv; RepresentationService.saveState(st); onRefresh(); }}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black cursor-pointer ${(website.boostLevel || 0) >= lv ? 'bg-blue-500 text-black' : 'bg-black/40 text-gray-400 border border-white/10'}`}
                  >
                    Lv{lv} ${(lv * 25000).toLocaleString()}
                  </button>
                ))}
              </div>
              <p className="text-[8px] text-gray-600 mt-1">Each level = +40% visitors. Ads pay $0.02/visitor · Merch pays $0.03/visitor.</p>
            </div>

            {/* Website Content Preview */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <img src={player.avatarUrl} alt={player.firstName} className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 shadow-lg" />
                <div>
                  <h3 className="text-xl font-black text-white">{player.firstName} {player.lastName}</h3>
                  <p className="text-xs text-blue-300 font-bold uppercase">{player.country} • {player.personality} Talent</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Official Hollywood Web Portal ({website.designTier})</p>
                </div>
              </div>

              {/* Sections Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                    <Film className="w-3 h-3 text-blue-400" /> Filmography
                  </span>
                  <span className="text-sm font-black text-white block">{releasedMovies.length} Released Movies</span>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Upcoming
                  </span>
                  <span className="text-sm font-black text-white block">{bookedProjects.length} Booked Productions</span>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-300" /> Awards
                  </span>
                  <span className="text-sm font-black text-white block">{player.awardsWon} Honors Won</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
