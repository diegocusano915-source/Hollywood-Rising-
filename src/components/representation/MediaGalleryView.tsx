/**
 * HOLLYWOOD RISING - Media Gallery Sub-View
 * Automatically stores movie posters, magazine covers, award photos, red carpet shots, and promotional stills earned from gameplay.
 */

import React, { useState } from 'react';
import { RepresentationFullState, GalleryPhoto } from '../../types/representation';
import { Camera, ArrowLeft, Image as ImageIcon, X, ZoomIn } from 'lucide-react';

interface MediaGalleryViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

export const MediaGalleryView: React.FC<MediaGalleryViewProps> = ({
  representationState,
  onBack,
}) => {
  const gallery = representationState.mediaGallery;

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [zoomedPhoto, setZoomedPhoto] = useState<GalleryPhoto | null>(null);

  const filtered = selectedCategory === 'ALL' ? gallery : gallery.filter((p) => p.category === selectedCategory);

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
          <Camera className="w-5 h-5 text-rose-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">MEDIA GALLERY</h2>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2 text-xs font-bold">
        {['ALL', 'Movie Poster', 'Magazine Cover', 'Award Photo', 'Red Carpet', 'Interview'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedCategory === cat ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
            <ImageIcon className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-base font-black text-white">NO MEDIA PHOTOS EARNED YET</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Posters, magazine covers, and red carpet photos are automatically unlocked in your gallery when you release films, win awards, and attend galas!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setZoomedPhoto(photo)}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-black/60 aspect-[3/4] cursor-pointer shadow-lg hover:border-rose-400/50 transition-all"
              >
                <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-end">
                  <span className="text-[9px] uppercase font-bold text-rose-300">{photo.category}</span>
                  <h4 className="text-xs font-black text-white line-clamp-1">{photo.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN ZOOM MODAL */}
      {zoomedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="relative max-w-md w-full rounded-3xl border border-white/20 bg-gray-900 overflow-hidden space-y-3 p-4">
            <button
              onClick={() => setZoomedPhoto(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-white/20 transition-all cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
              <img src={zoomedPhoto.imageUrl} alt={zoomedPhoto.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-rose-400 uppercase">{zoomedPhoto.category} • {zoomedPhoto.dateEarned}</span>
              <h3 className="text-base font-black text-white">{zoomedPhoto.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed mt-1">{zoomedPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
