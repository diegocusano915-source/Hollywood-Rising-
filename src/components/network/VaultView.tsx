/**
 * HOLLYWOOD RISING - Vault & Luxury Auction House View (Phase 4 Network)
 * Luxury Watches, Jewelry, Rare Scripts, Fine Art, Collectibles & Live NPC Bidding Auctions.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NetworkFullState, VaultItem, AuctionLot } from '../../types/network';
import { NetworkService } from '../../services/networkService';
import {
  Lock,
  ArrowLeft,
  DollarSign,
  Gavel,
  ShieldCheck,
  Award,
  Sparkles,
  Watch,
  Palette,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface VaultViewProps {
  onBack: () => void;
  networkState: NetworkFullState;
  onUpdateState: (next: NetworkFullState) => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  onBack,
  networkState,
  onUpdateState,
}) => {
  const { player, settings, persistNow } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeTab, setActiveTab] = useState<'VAULT' | 'AUCTION'>('VAULT');
  const [feedback, setFeedback] = useState<string | null>(null);

  const vaultItems = networkState.vaultItems || [];
  const auctionLots = networkState.auctionLots || [];

  const totalVaultValue = vaultItems.reduce((sum, item) => sum + item.estimatedValue, 0);

  const handlePlaceBid = (lot: AuctionLot) => {
    const minNextBid = Math.round(lot.currentBid * 1.1);

    if (player.money < minNextBid) {
      setFeedback(`Insufficient Cash! Required bid: $${minNextBid.toLocaleString()}`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const updatedLots = auctionLots.map((l) => {
      if (l.id === lot.id) {
        return {
          ...l,
          currentBid: minNextBid,
          highBidder: `${player.firstName} ${player.lastName}`,
          bidsCount: l.bidsCount + 1,
        };
      }
      return l;
    });

    const nextState: NetworkFullState = {
      ...networkState,
      auctionLots: updatedLots,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(`HIGH BIDDER! Placed bid of $${minNextBid.toLocaleString()} on ${lot.title}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleClaimAuctionLot = (lot: AuctionLot) => {
    if (lot.highBidder !== `${player.firstName} ${player.lastName}`) {
      setFeedback('You are not the winning bidder on this lot!');
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const nextVaultItems: VaultItem[] = [
      ...vaultItems,
      { ...lot.item, acquiredWeek: player.dateWeek },
    ];

    const nextLots = auctionLots.filter((l) => l.id !== lot.id);

    const nextState: NetworkFullState = {
      ...networkState,
      vaultItems: nextVaultItems,
      auctionLots: nextLots,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);
    player.money -= lot.currentBid;
    persistNow();

    setFeedback(`LOT CLAIMED! Paid $${lot.currentBid.toLocaleString()} for ${lot.item.name} — added to your Vault.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-purple-400" />
          <span>Back to Network</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/30 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-purple-400" />
            Hollywood High-Security Vault
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div
        className="rounded-3xl p-5 border shadow-2xl space-y-2 relative overflow-hidden"
        style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-400/40">
              <Lock className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">
                COLLECTIBLES & FINE ART
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">THE PRIVATE VAULT</h1>
            </div>
          </div>

          <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Vault Appraised Value</span>
            <span className="text-lg font-black text-amber-400">
              ${totalVaultValue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* VAULT CAPACITY SUMMARY */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-black bg-black/60 p-3 rounded-2xl border border-white/10 pt-2">
          <div>
            <span className="text-[10px] text-gray-400 font-bold block">Items Owned</span>
            <span className="text-purple-300 font-black">{vaultItems.length}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block">Vault Value</span>
            <span className="text-emerald-400 font-black">${totalVaultValue.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block">Collections</span>
            <span className="text-sky-300 font-black">{new Set(vaultItems.map(i => i.category)).size}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block">Storage Used</span>
            <span className="text-amber-300 font-black">{Math.min(100, Math.round((vaultItems.length / 50) * 100))}%</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-purple-500/20 border border-purple-500/50 text-purple-300 text-xs font-black shadow-lg text-center">
          {feedback}
        </div>
      )}

      {/* TABS: VAULT vs AUCTIONS */}
      <div className="flex rounded-2xl bg-black/60 p-1.5 border border-white/10">
        <button
          onClick={() => setActiveTab('VAULT')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'VAULT' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>My Vault Inventory ({vaultItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('AUCTION')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'AUCTION' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Luxury Auction House ({auctionLots.length})</span>
        </button>
      </div>

      {/* SECTION 1: MY VAULT INVENTORY */}
      {activeTab === 'VAULT' && (
        <>
          {vaultItems.length === 0 ? (
            <div className="p-8 rounded-3xl border border-white/10 bg-black/50 text-center space-y-4 shadow-xl">
              <Lock className="w-10 h-10 text-purple-400 mx-auto opacity-60" />
              <h3 className="text-base font-black text-white">YOUR VAULT IS EMPTY</h3>
              <div className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed space-y-2">
                <p className="font-bold">Your vault is empty.</p>
                <p className="text-gray-400 font-semibold pt-1">Acquire collectibles through:</p>
                <ul className="text-left text-gray-300 space-y-1 list-disc list-inside inline-block text-[11px] font-medium">
                  <li>Luxury Auction House</li>
                  <li>Movie Memorabilia</li>
                  <li>Studio Awards</li>
                  <li>Exclusive Events</li>
                  <li>Luxury Purchases</li>
                </ul>
              </div>
              <div>
                <button
                  onClick={() => setActiveTab('AUCTION')}
                  className="px-5 py-2.5 rounded-2xl bg-purple-500 text-white font-black text-xs hover:scale-102 transition-all cursor-pointer shadow-lg inline-flex items-center gap-2 mt-2"
                >
                  <Gavel className="w-4 h-4" />
                  <span>BROWSE LUXURY AUCTIONS</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vaultItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl border border-white/10 bg-black/50 hover:bg-black/70 transition-all space-y-3 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-purple-400 uppercase bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-500/20">
                        {item.category} • {item.rarity}
                      </span>
                      <span className="text-xs font-black text-amber-300">
                        Valued: ${item.estimatedValue.toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white">{item.name}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="text-[10px] text-gray-400 font-bold bg-black/60 p-2 rounded-xl border border-white/5 flex justify-between">
                    <span>Acquired Week {item.acquiredWeek}</span>
                    <span className="text-emerald-400 font-black">Secured in Vault</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* SECTION 2: LUXURY AUCTION HOUSE */}
      {activeTab === 'AUCTION' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {auctionLots.map((lot) => {
            const isPlayerHighBidder = lot.highBidder === `${player.firstName} ${player.lastName}`;

            return (
              <div
                key={lot.id}
                className="p-5 rounded-3xl border border-purple-500/30 bg-black/50 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-amber-400 uppercase bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                      {lot.category} • {lot.bidsCount} Bids
                    </span>
                    <span className="text-xs font-black text-rose-400 flex items-center gap-1">
                      <Gavel className="w-3.5 h-3.5" /> LIVE AUCTION
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white">{lot.title}</h3>
                  <p className="text-xs text-gray-300">{lot.item.description}</p>

                  <div className="p-3 rounded-2xl bg-black/70 border border-white/10 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current High Bid:</span>
                      <span className="text-emerald-400 font-black">${lot.currentBid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400">Top Bidder:</span>
                      <span className={isPlayerHighBidder ? 'text-amber-300 font-black' : 'text-sky-300 font-bold'}>
                        {lot.highBidder}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => handlePlaceBid(lot)}
                    className="py-3 rounded-2xl font-black text-xs bg-purple-500 text-white hover:scale-102 transition-all cursor-pointer shadow-lg"
                  >
                    BID (${Math.round(lot.currentBid * 1.1).toLocaleString()})
                  </button>

                  <button
                    onClick={() => handleClaimAuctionLot(lot)}
                    disabled={!isPlayerHighBidder}
                    className={`py-3 rounded-2xl font-black text-xs transition-all cursor-pointer border ${
                      isPlayerHighBidder
                        ? 'bg-amber-400 text-black border-amber-400'
                        : 'bg-black/50 text-gray-600 border-white/5 cursor-not-allowed'
                    }`}
                  >
                    CLAIM ITEM
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
