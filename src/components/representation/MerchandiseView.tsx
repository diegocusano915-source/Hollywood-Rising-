/**
 * HOLLYWOOD RISING - Official Merchandise Sub-View
 * Design, launch, and monetize apparel, posters, caps, accessories, and movie replicas.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RepresentationFullState, MerchProductCategory } from '../../types/representation';
import { RepresentationService } from '../../services/representationService';
import { ShoppingBag, ArrowLeft, Plus, DollarSign, Package, TrendingUp, Tag } from 'lucide-react';

interface MerchandiseViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

const MERCH_CATALOG: { category: MerchProductCategory; unitCost: number; suggestedPrice: number; name: string }[] = [
  { category: 'Shirts', unitCost: 12, suggestedPrice: 35, name: 'Signature Graphic Tee' },
  { category: 'Hoodies', unitCost: 25, suggestedPrice: 75, name: 'Heavyweight Studio Hoodie' },
  { category: 'Caps', unitCost: 8, suggestedPrice: 30, name: 'Embroidered Dad Hat' },
  { category: 'Posters', unitCost: 3, suggestedPrice: 20, name: 'Autographed Metallic Poster' },
  { category: 'Accessories', unitCost: 5, suggestedPrice: 25, name: 'Custom Phone Case & Keyring' },
  { category: 'Movie Memorabilia', unitCost: 40, suggestedPrice: 150, name: 'Limited Edition Movie Prop Replica' },
];

export const MerchandiseView: React.FC<MerchandiseViewProps> = ({
  representationState,
  onRefresh,
  onBack,
}) => {
  const { player } = useGame();
  const merchandise = representationState.merchandise;
  const isEligible = (player.fans || 0) >= 50 || representationState.fanClub.isCreated;

  const [selectedCat, setSelectedCat] = useState<MerchProductCategory>('Shirts');
  const [productName, setProductName] = useState('');
  const [sellingPrice, setSellingPrice] = useState<number>(35);
  const [unitsToProduce, setUnitsToProduce] = useState<number>(100);
  const [vipOnly, setVipOnly] = useState(false);
  const [limitedDrop, setLimitedDrop] = useState(false);
  const [movieTied, setMovieTied] = useState('');
  const { releasedMovies } = useGame();

  // Launch Merch Product
  const handleLaunchProduct = () => {
    if (!productName.trim()) {
      alert('Please enter a product name.');
      return;
    }

    const template = MERCH_CATALOG.find((c) => c.category === selectedCat);
    const unitCost = template ? template.unitCost : 10;
    const totalProductionCost = unitsToProduce * unitCost;

    if (player.money < totalProductionCost) {
      alert(`Insufficient funds! Producing ${unitsToProduce} units requires $${totalProductionCost.toLocaleString()}.`);
      return;
    }

    player.money -= totalProductionCost;
    const state = RepresentationService.getState();
    state.merchandise.unshift({
      id: `merch_${Date.now()}`,
      name: productName.trim(),
      category: selectedCat,
      unitCost,
      sellingPrice: vipOnly ? sellingPrice * 3 : sellingPrice, // VIP = premium pricing
      inventory: unitsToProduce,
      totalSold: 0,
      weeklySales: 0,
      totalRevenue: 0,
      totalProfit: 0,
      vipOnly,
      movieTied: movieTied || undefined,
      limitedDrop,
      dropWeeksLeft: limitedDrop ? 4 : undefined,
    });

    RepresentationService.saveState(state);
    setProductName('');
    alert(`🛍 Merch Line "${productName.trim()}" produced! ${unitsToProduce} units added to store inventory.`);
    onRefresh();
  };

  // Restock Inventory
  const handleRestock = (productId: string, count: number) => {
    const state = RepresentationService.getState();
    const item = state.merchandise.find((m) => m.id === productId);
    if (!item) return;

    const cost = item.unitCost * count;
    if (player.money < cost) {
      alert(`Insufficient funds! Restocking ${count} units costs $${cost.toLocaleString()}.`);
      return;
    }

    player.money -= cost;
    item.inventory += count;
    RepresentationService.saveState(state);
    alert(`📦 Restocked +${count} units of "${item.name}".`);
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
          <ShoppingBag className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">OFFICIAL MERCHANDISE</h2>
        </div>
      </div>

      {!isEligible ? (
        <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
          <Package className="w-10 h-10 text-purple-400 mx-auto" />
          <h3 className="text-base font-black text-white">MERCHANDISE STORE LOCKED</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            You must establish an Official Fan Club or accumulate at least 50 Fans to launch custom apparel lines and collectibles.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Launch New Merch Form */}
          <div className="p-6 rounded-3xl border border-purple-500/30 bg-black/60 backdrop-blur-md space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              <span>Design & Produce New Merchandise Item</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Category</label>
                <select
                  value={selectedCat}
                  onChange={(e) => {
                    const cat = e.target.value as MerchProductCategory;
                    setSelectedCat(cat);
                    const tmpl = MERCH_CATALOG.find((c) => c.category === cat);
                    if (tmpl) setSellingPrice(tmpl.suggestedPrice);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none"
                >
                  {MERCH_CATALOG.map((c) => (
                    <option key={c.category} value={c.category}>
                      {c.category} (Cost: ${c.unitCost}/unit)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. Vintage Tour Tee"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Selling Price ($)</label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Production Batch</label>
                <select
                  value={unitsToProduce}
                  onChange={(e) => setUnitsToProduce(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none"
                >
                  <option value={50}>50 Units</option>
                  <option value={100}>100 Units</option>
                  <option value={250}>250 Units</option>
                  <option value={500}>500 Units</option>
                </select>
              </div>
            </div>

            {/* NEW: VIP, Limited Drop, Movie tie */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setVipOnly((v) => !v)} className={`px-3 py-2 rounded-xl text-[10px] font-black cursor-pointer ${vipOnly ? 'bg-amber-500 text-black' : 'bg-black/40 text-gray-300 border border-white/10'}`}>
                👑 VIP ONLY (3x price)
              </button>
              <button onClick={() => setLimitedDrop((v) => !v)} className={`px-3 py-2 rounded-xl text-[10px] font-black cursor-pointer ${limitedDrop ? 'bg-rose-500 text-black' : 'bg-black/40 text-gray-300 border border-white/10'}`}>
                🔥 LIMITED DROP (3x sales)
              </button>
            </div>
            <select value={movieTied} onChange={(e) => setMovieTied(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs outline-none">
              <option value="">Tie to movie (optional)</option>
              {(releasedMovies || []).slice(0, 10).map((m: any) => (
                <option key={m.id} value={m.movieTitle}>{m.movieTitle}</option>
              ))}
            </select>
            <button
              onClick={handleLaunchProduct}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              PRODUCE BATCH & LAUNCH STORE
            </button>
          </div>

          {/* Active Merch Store Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Active Store Catalog</h4>
            {merchandise.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No products launched yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {merchandise.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-purple-300">{item.category}</span>
                        <h5 className="text-base font-black text-white">{item.name}</h5>
                      </div>
                      <span className="text-sm font-black text-emerald-400">${item.sellingPrice}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-400 p-3 rounded-xl bg-black/40">
                      <div>Inventory: <span className="text-white font-bold">{item.inventory}</span></div>
                      <div>Total Sold: <span className="text-white font-bold">{item.totalSold}</span></div>
                      <div>Total Profit: <span className="text-emerald-400 font-bold">${item.totalProfit.toLocaleString()}</span></div>
                    </div>

                    <button
                      onClick={() => handleRestock(item.id, 100)}
                      className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-all"
                    >
                      Restock +100 Units (${item.unitCost * 100})
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
