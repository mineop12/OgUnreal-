import { useGlobalData } from '../context/DataContext';
import { Asset } from '../types';
import { Bookmark, ImageIcon } from 'lucide-react';
import { CATEGORIES } from './Categories';

export function Library({ onViewAsset }: { onViewAsset: (asset: Asset) => void }) {
  const { assets, library, toggleLibrary } = useGlobalData();

  const savedAssets = assets.filter((a) => library.includes(a.id));

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Library</h2>
          <p className="text-slate-500 mt-2">Manage your saved Unreal Engine assets.</p>
        </div>

        {savedAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedAssets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="relative aspect-video bg-slate-200 cursor-pointer" onClick={() => onViewAsset(asset)}>
                  <div className="absolute inset-0 z-0">
                    {asset.imageUrl ? (
                      <img src={asset.imageUrl} alt={asset.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 hidden group-hover:block transition-all"></div>
                  <h3 className="absolute bottom-3 left-4 text-white font-bold text-sm z-20 truncate right-4 opacity-0 group-hover:opacity-100 transition-opacity">{asset.name}</h3>
                  <div className="absolute top-3 right-3 flex gap-2 z-20">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleLibrary(asset.id); }}
                      className="p-1 px-2 border text-[10px] rounded font-bold shadow-sm backdrop-blur-sm transition-colors flex items-center justify-center border-[#2563EB] text-[#2563EB] bg-white/90 hover:bg-white"
                      title="Remove from Library"
                    >
                      <Bookmark className="w-3 h-3 mr-1" fill="currentColor" /> REMOVE
                    </button>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">{CATEGORIES.find(c => c.id === asset.category)?.name || asset.category}</span>
                    <span className="text-[10px] text-[#64748B]">{asset.fileSize || ''}</span>
                  </div>
                  <h3 className="font-bold text-[#0F172A] leading-tight truncate mb-1 cursor-pointer hover:text-[#2563EB]" onClick={() => onViewAsset(asset)}>
                    {asset.name}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-4 flex-grow">{asset.shortDesc}</p>
                  <button 
                    onClick={() => onViewAsset(asset)}
                    className="w-full py-2 bg-slate-100 text-[#0F172A] text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Your library is empty</h3>
            <p className="text-slate-500 mt-2">Save assets you like to find them quickly later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
