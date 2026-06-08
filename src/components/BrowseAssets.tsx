import { useState, useMemo, useEffect } from 'react';
import { useGlobalData } from '../context/DataContext';
import { Asset } from '../types';
import { CATEGORIES } from './Categories';
import { Search, Filter, Bookmark, Image as ImageIcon } from 'lucide-react';

export function BrowseAssets({
  initialCategory = 'all',
  onlyFree = false,
  onViewAsset,
}: {
  initialCategory?: string;
  onlyFree?: boolean;
  onViewAsset: (asset: Asset) => void;
}) {
  const { assets, library, toggleLibrary } = useGlobalData();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>(onlyFree ? 'free' : 'all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');

  // Update internal category if prop changes
  useEffect(() => {
    if (initialCategory !== 'all') {
      setCategoryFilter(initialCategory);
    }
  }, [initialCategory]);

  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || asset.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = categoryFilter === 'all' || asset.category === categoryFilter;
        const matchesPrice = priceFilter === 'all' || asset.priceType === priceFilter;
        return matchesSearch && matchesCat && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.createdAt - a.createdAt;
        if (sortBy === 'price_low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price_high') return (b.price || 0) - (a.price || 0);
        return 0;
      });
  }, [assets, searchQuery, categoryFilter, priceFilter, sortBy]);

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Browse Assets</h2>
            <p className="text-slate-500 mt-1">Discover high-quality UE5 resources.</p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {!onlyFree && (
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Prices</option>
                  <option value="free">Free</option>
                  <option value="paid">Premium</option>
                </select>
              )}

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 ml-auto lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="relative aspect-video bg-slate-200 cursor-pointer" onClick={() => onViewAsset(asset)}>
                  {/* Image */}
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
                    <span className="bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">
                      UE {asset.ueVersion}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-sm ${asset.priceType === 'free' ? 'bg-green-500 text-white' : 'bg-white/90 text-slate-900'}`}>
                      {asset.priceType === 'free' ? 'FREE' : `$${asset.price.toFixed(2)}`}
                    </span>
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
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onViewAsset(asset)}
                      className="flex-1 py-2 bg-slate-100 text-[#0F172A] text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Details
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleLibrary(asset.id); }}
                      className={`px-3 py-2 border text-xs rounded-lg transition-colors flex items-center justify-center ${library.includes(asset.id) ? 'border-[#2563EB] text-[#2563EB] bg-blue-50' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                      title="Save to Library"
                    >
                      <Bookmark className="w-4 h-4" fill={library.includes(asset.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No assets found</h3>
            <p className="text-slate-500 max-w-sm">
              {assets.length === 0 
                ? "No assets available yet. Admin can add assets from the admin panel."
                : "Try adjusting your search or filters to find what you're looking for."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
