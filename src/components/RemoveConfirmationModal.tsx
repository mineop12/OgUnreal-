import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useGlobalData } from '../context/DataContext';

export function RemoveConfirmationModal() {
  const { assetToRemove, cancelRemoveFromLibrary, confirmRemoveFromLibrary } = useGlobalData();
  const [inputText, setInputText] = useState('');

  if (!assetToRemove) return null;

  const handleConfirm = () => {
    if (inputText === 'I want to Remove it') {
      confirmRemoveFromLibrary();
      setInputText('');
    }
  };

  const handleCancel = () => {
    cancelRemoveFromLibrary();
    setInputText('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6 text-red-600">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Remove Asset?</h2>
          </div>
          
          <p className="text-slate-600 mb-6 font-medium">
            Are you sure you want to remove this asset from your library?
          </p>
          
          <div className="mb-6 space-y-2">
            <label className="text-sm font-medium text-slate-700 block">
              Type <strong className="text-slate-900 select-all">I want to Remove it</strong> to confirm:
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="I want to Remove it"
              autoComplete="off"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={inputText !== 'I want to Remove it'}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
