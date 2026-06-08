import React, { useState } from 'react';
import { Mail, Instagram, Youtube, Send } from 'lucide-react';
import { useGlobalData } from '../context/DataContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function Contact() {
  const { addToast, currentUser, setShowAuthModal } = useGlobalData();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill in all fields', 'error');
      return;
    }
    
    try {
      await addDoc(collection(db, 'messages'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        userId: currentUser.uid || '',
        userEmail: currentUser.email || '',
        createdAt: serverTimestamp(),
        read: false
      });
      
      addToast('Message sent successfully! We will get back to you soon.', 'success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      console.error('Error sending message:', error);
      if (error.code === 'permission-denied') {
        addToast('Permission Denied: Please update your Firestore rules to allow writing to "messages".', 'error');
      } else if (error.code === 'unavailable') {
        addToast('Network error: Could not reach Firestore. Check if the database is created in the console.', 'error');
      } else {
        addToast(`Error: ${error.message || 'Failed to send message.'}`, 'error');
      }
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl mb-4">Need help with an asset?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Contact OGUnreal support for asset questions, download help, project support, or any other inquiries.
            </p>
            
            <div className="space-y-6">
              <a href="mailto:support@ogunrealassets.com" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors group">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Email Us</p>
                  <p className="text-slate-600">support@ogunrealassets.com</p>
                </div>
              </a>

              <a href="#" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-pink-100 hover:bg-pink-50/50 transition-colors group">
                <div className="w-12 h-12 bg-pink-100 text-pink-600 flex items-center justify-center rounded-lg group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Instagram</p>
                  <p className="text-slate-600">@ogunreal</p>
                </div>
              </a>

              <a href="#" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-red-100 hover:bg-red-50/50 transition-colors group">
                <div className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Youtube className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">YouTube</p>
                  <p className="text-slate-600">OGUnreal</p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h3>
            {currentUser ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                    placeholder="How can we help?"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                >
                  Send Message
                  <Send className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Sign in to contact us</h4>
                <p className="text-slate-600 mb-6">You must be logged in to send a message so we can get back to you.</p>
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Sign In / Sign Up
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
