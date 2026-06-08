import React, { useState, useEffect } from 'react';
import { useGlobalData } from '../context/DataContext';
import { Asset, Message } from '../types';
import { CATEGORIES } from './Categories';
import { Loader2, Plus, Edit2, Trash2, ShieldAlert, MessageSquare, Check, Trash } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export function AdminPanel() {
  const { assets, isAdminLoggedIn, setIsAdminLoggedIn, addAsset, updateAsset, deleteAsset, clearAllAssets, addToast } = useGlobalData();
  
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'assets'|'messages'>('assets');
  
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    }, (error: any) => {
      console.error("Error listening to messages", error);
      if (error.code === 'permission-denied') {
        const errorMsg = 'Permission Denied: Please update your Firestore rules to allow read access to the "messages" collection for admins.';
        console.error(errorMsg);
        addToast(errorMsg, 'error');
      } else if (error.code === 'unavailable') {
        addToast('Network error: Could not reach Firestore. Check if the database is created in the console.', 'error');
      }
    });
    
    return () => unsubscribe();
  }, [isAdminLoggedIn]);

  const handleMarkAsRead = async (id: string, currentReadStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'messages', id), { read: !currentReadStatus });
    } catch (error) {
      console.error(error);
      addToast('Failed to update message status', 'error');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('Delete this message?')) {
      try {
        await deleteDoc(doc(db, 'messages', id));
        addToast('Message deleted', 'success');
      } catch (error) {
        console.error(error);
        addToast('Failed to delete message', 'error');
      }
    }
  };

  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Asset, 'id' | 'createdAt'>>({
    name: '',
    category: CATEGORIES[0].id,
    priceType: 'free',
    price: 0,
    shortDesc: '',
    fullDesc: '',
    imageUrl: '',
    images: [],
    tags: [],
    ueVersion: '5.3',
    fileSize: '',
    downloadLink: '',
    features: '',
    requirements: '',
  });
  const [tagsInput, setTagsInput] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginData.username, loginData.password);
      // useData handles setting isAdminLoggedIn
      addToast('Admin logged in successfully', 'success');
    } catch (error: any) {
      addToast(error.message || 'Invalid credentials', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoginData({ username: '', password: '' });
      addToast('Logged out successfully', 'info');
    } catch (error) {}
  };

  const handleMultipleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 5) {
      addToast('Maximum 5 images allowed. Extra images ignored.', 'info');
    }
    const selectedFiles = files.slice(0, 5);
    
    if (selectedFiles.length === 0) return;
    
    const newImages: string[] = [];
    let processed = 0;
    
    selectedFiles.forEach(file => {
      if (file.size > 5000000) { 
        addToast(`Image ${file.name} is too large (>5MB). Please choose a smaller file.`, 'error');
        processed++;
        if (processed === selectedFiles.length) finish();
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // Compress to 60% quality jpeg
            
            // Check if still too large for Firestore (approx limit of string is < 700kb to be safe)
            if (dataUrl.length > 700000) {
                 addToast(`Image ${file.name} could not be compressed enough. Please manually resize it.`, 'error');
            } else {
                 newImages.push(dataUrl);
            }
            
            processed++;
            if (processed === selectedFiles.length) finish();
          };
          img.src = reader.result as string;
        } else {
          processed++;
          if (processed === selectedFiles.length) finish();
        }
      };
      reader.readAsDataURL(file);
    });

    function finish() {
      setFormData(prev => ({ 
        ...prev, 
        images: newImages,
        imageUrl: newImages[0] || prev.imageUrl
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.shortDesc || !formData.ueVersion) {
      addToast('Please fill out all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    
    const finalFormData = {
      ...formData,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    };
    
    // Simulate loading for 1 second
    setTimeout(() => {
      if (isEditing) {
        updateAsset(isEditing, finalFormData);
        setIsEditing(null);
      } else {
        addAsset(finalFormData);
      }
      
      setFormData({
        name: '',
        category: CATEGORIES[0].id,
        priceType: 'free',
        price: 0,
        shortDesc: '',
        fullDesc: '',
        imageUrl: '',
        images: [],
        tags: [],
        ueVersion: '5.3',
        fileSize: '',
        downloadLink: '',
        features: '',
        requirements: '',
      });
      setTagsInput('');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleEditClick = (asset: Asset) => {
    setIsEditing(asset.id);
    setFormData({
      name: asset.name,
      category: asset.category,
      priceType: asset.priceType,
      price: asset.price || 0,
      shortDesc: asset.shortDesc,
      fullDesc: asset.fullDesc,
      imageUrl: asset.imageUrl,
      images: asset.images || [],
      tags: asset.tags || [],
      ueVersion: asset.ueVersion,
      fileSize: asset.fileSize,
      downloadLink: asset.downloadLink,
      features: asset.features,
      requirements: asset.requirements,
    });
    setTagsInput(asset.tags?.join(', ') || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      deleteAsset(id);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('WARNING: Are you sure you want to delete ALL assets? This cannot be undone.')) {
      clearAllAssets();
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="py-32 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 max-w-md w-full mx-4">
          <div className="flex justify-center mb-6 text-blue-600">
            <ShieldAlert className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Admin Access</h2>
          <p className="text-center text-slate-500 text-sm mb-6">Restricted area. Please sign in.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input 
                type="text" 
                value={loginData.username}
                onChange={e => setLoginData({...loginData, username: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={loginData.password}
                onChange={e => setLoginData({...loginData, password: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Admin Dashboard</h2>
            <p className="text-slate-500">Manage store assets and messages</p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex bg-slate-200 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('assets')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'assets' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Assets
              </button>
              <button 
                onClick={() => setActiveTab('messages')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'messages' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Messages
                {messages.filter(m => !m.read).length > 0 && (
                  <span className="w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center">
                    {messages.filter(m => !m.read).length}
                  </span>
                )}
              </button>
            </div>
            
            <button 
              onClick={handleLogout}
              className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium h-fit"
            >
              Logout
            </button>
          </div>
        </div>

        {activeTab === 'assets' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                {isEditing ? <Edit2 className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}
                {isEditing ? 'Edit Asset' : 'Add New Asset'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Asset Name *</label>
                  <input 
                    type="text" required
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category *</label>
                    <select 
                      value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Price Type</label>
                    <select 
                      value={formData.priceType} onChange={e => setFormData({...formData, priceType: e.target.value as any})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>

                {formData.priceType === 'paid' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Price ($)</label>
                    <input 
                      type="number" min="0" step="0.01" required
                      value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Short Description *</label>
                  <textarea 
                    required maxLength={150} rows={2}
                    value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                    placeholder="Brief description for cards"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Images (Up to 5)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImagesChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {formData.images && formData.images.length > 0 && (
                    <div className="mt-2 text-xs text-green-600 truncate">{formData.images.length} images loaded</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">UE Version *</label>
                    <input 
                      type="text" required placeholder="e.g. 5.3"
                      value={formData.ueVersion} onChange={e => setFormData({...formData, ueVersion: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">File Size</label>
                    <input 
                      type="text" placeholder="e.g. 2.4 GB"
                      value={formData.fileSize} onChange={e => setFormData({...formData, fileSize: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Download Link</label>
                  <input 
                    type="url" placeholder="https://..."
                    value={formData.downloadLink} onChange={e => setFormData({...formData, downloadLink: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Tags (Comma separated)</label>
                  <input 
                    type="text" placeholder="e.g. Cyberpunk, Modular, Low Poly"
                    value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    type="submit" disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-70 text-sm"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : (isEditing ? 'Save Changes' : 'Add Asset')}
                  </button>
                  {isEditing && (
                    <button 
                      type="button" onClick={() => { setIsEditing(null); }}
                      className="px-4 bg-slate-200 text-slate-700 py-2.5 rounded-lg font-bold hover:bg-slate-300 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-900">Manage Assets ({assets.length})</h3>
                {assets.length > 0 && (
                  <button onClick={handleClearAll} className="text-xs text-red-600 font-semibold hover:text-red-700 px-3 py-1 rounded border border-red-200 hover:bg-red-50">
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="divide-y divide-slate-100 max-h-[800px] overflow-y-auto">
                {assets.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    No assets added yet.
                  </div>
                ) : (
                  assets.map(asset => (
                    <div key={asset.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                      <div className="w-16 h-16 rounded overflow-hidden bg-slate-200 shrink-0">
                        {asset.imageUrl ? <img src={asset.imageUrl} className="w-full h-full object-cover" /> : null}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{asset.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded">{CATEGORIES.find(c => c.id === asset.category)?.name || asset.category}</span>
                          <span className={asset.priceType === 'free' ? 'text-green-600 font-semibold' : 'text-blue-600 font-semibold'}>
                            {asset.priceType === 'free' ? 'Free' : `$${asset.price.toFixed(2)}`}
                          </span>
                          <span>UE {asset.ueVersion}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleEditClick(asset)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(asset.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-slate-400" />
                User Messages ({messages.length})
              </h3>
            </div>
            
            <div className="divide-y divide-slate-100 max-h-[800px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  No messages yet.
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`p-6 transition-colors ${msg.read ? 'bg-white' : 'bg-blue-50/30'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{msg.name}</h4>
                          <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 hover:underline">{msg.email}</a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {msg.createdAt && (
                          <span className="text-xs text-slate-400 mr-2">
                            {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                          </span>
                        )}
                        <button 
                          onClick={() => handleMarkAsRead(msg.id, msg.read)}
                          className={`p-2 rounded transition-colors ${msg.read ? 'text-slate-400 hover:text-blue-600 hover:bg-slate-100' : 'text-blue-600 bg-blue-100 hover:bg-blue-200'}`}
                          title={msg.read ? "Mark as unread" : "Mark as read"}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete message"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-slate-700 whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
