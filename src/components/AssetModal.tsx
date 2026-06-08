import { useState } from 'react';
import { X, Download, Bookmark, Layers, HardDrive, CheckCircle } from 'lucide-react';
import { Asset } from '../types';
import { useGlobalData } from '../context/DataContext';

export function AssetModal({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  const { library, toggleLibrary, addToast } = useGlobalData();
  const isSaved = library.includes(asset.id);
  const [activeImage, setActiveImage] = useState(asset.images?.[0] || asset.imageUrl);

  const handleDownload = () => {
    if (asset.downloadLink) {
      window.open(asset.downloadLink, '_blank');
    } else {
      addToast('Download link is not available yet.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header content handles close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto w-full max-h-full">
          {/* Cover Image */}
          <div className="w-full h-64 sm:h-80 bg-slate-100 relative">
             {activeImage ? (
               <img src={activeImage} alt={asset.name} className="w-full h-full object-cover transition-opacity duration-300" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">No Image Available</div>
             )}
             <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
             <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
               <div>
                 <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${asset.priceType === 'free' ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                    {asset.priceType === 'free' ? 'Free Asset' : `$${asset.price.toFixed(2)}`}
                 </span>
                 <h2 className="text-3xl font-bold text-white tracking-tight">{asset.name}</h2>
                 {asset.tags && asset.tags.length > 0 && (
                   <div className="flex gap-2 mt-2">
                     {asset.tags.map(tag => (
                       <span key={tag} className="text-[10px] uppercase font-bold px-2 py-0.5 bg-white/20 text-white rounded backdrop-blur-sm">
                         {tag}
                       </span>
                     ))}
                   </div>
                 )}
               </div>
             </div>
          </div>

          {/* Thumbnails */}
          {asset.images && asset.images.length > 1 && (
            <div className="flex gap-2 p-4 bg-slate-50 border-b border-slate-200 overflow-x-auto">
              {asset.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-24 h-16 rounded overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === img ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Description</h3>
                <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {asset.fullDesc || asset.shortDesc}
                </div>
              </div>

              {asset.features && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Features</h3>
                  <ul className="space-y-2">
                    {asset.features.split('\\n').map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-3 text-slate-700">
                  <Layers className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Engine Version</p>
                    <p className="font-medium">UE {asset.ueVersion}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <HardDrive className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">File Size</p>
                    <p className="font-medium">{asset.fileSize || 'N/A'}</p>
                  </div>
                </div>
                
                {asset.requirements && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Requirements</p>
                    <p className="text-sm text-slate-700">{asset.requirements}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Download className="w-5 h-5" />
                  Download Asset
                </button>
                <button 
                  onClick={() => toggleLibrary(asset.id)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold border transition-colors ${
                    isSaved ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
                  {isSaved ? 'Saved in Library' : 'Save to Library'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
