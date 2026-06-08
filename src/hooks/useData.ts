import { useState, useEffect, useCallback } from 'react';
import { Asset, ToastMessage, ToastType } from '../types';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, getDocs, doc, getDoc, onSnapshot, setDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';

export function useData() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [library, setLibrary] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [assetToRemove, setAssetToRemove] = useState<string | null>(null);

  // Track Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Check if the user is the admin
        if (user.email === 'unrealproartist2010op@gmail.com') {
          setIsAdminLoggedIn(true);
        } else {
          setIsAdminLoggedIn(false);
        }
      } else {
        setLibrary([]); // clear library on logout
        setIsAdminLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Assets with Firestore
  useEffect(() => {
    const assetsRef = collection(db, 'assets');
    const q = query(assetsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedAssets = snapshot.docs.map(doc => ({
        ...doc.data()
      })) as Asset[];
      setAssets(loadedAssets);
    }, (error: any) => {
      if (error.code === 'permission-denied') {
        console.warn('Firebase Rules Error: Please update your Firestore security rules in the Firebase Console');
      } else {
        console.warn("Error listening to assets", error);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync Library with Firestore for logged in user
  useEffect(() => {
    if (!currentUser) return;
    
    const userDocRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.library && Array.isArray(data.library)) {
          setLibrary(data.library);
        }
      } else {
        // Initialize user document if it doesn't exist
        setDoc(userDocRef, { library: [] }).catch(error => {
          console.error("Failed to initialize user data", error);
        });
      }
    }, (error: any) => {
      if (error.code === 'permission-denied') {
        console.warn('Permission Denied: Please update your Firestore rules to allow read/write access to the "users" collection.');
      } else if (error.code === 'unavailable') {
        console.warn('Firestore is unreachable. Please check if the Firestore database is created in the Firebase Console and your network is not blocking it.');
      } else {
        console.warn("Error listening to library", error);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addAsset = async (asset: Omit<Asset, 'id' | 'createdAt'>) => {
    try {
      const newAsset: Asset = {
        ...asset,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      await setDoc(doc(db, 'assets', newAsset.id), newAsset);
      addToast('Asset added successfully', 'success');
    } catch (error) {
      console.error("Error adding asset:", error);
      addToast('Failed to add asset', 'error');
    }
  };

  const updateAsset = async (id: string, updatedFields: Partial<Asset>) => {
    try {
      await updateDoc(doc(db, 'assets', id), updatedFields);
      addToast('Asset updated successfully', 'success');
    } catch (error) {
      console.error("Error updating asset:", error);
      addToast('Failed to update asset', 'error');
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'assets', id));
      // Remove from current user's library if it's there
      if (currentUser && library.includes(id)) {
        toggleLibrary(id, true);
      }
      addToast('Asset deleted', 'info');
    } catch (error) {
      console.error("Error deleting asset:", error);
      addToast('Failed to delete asset', 'error');
    }
  };

  const clearAllAssets = async () => {
    try {
      const assetsRef = collection(db, 'assets');
      const snapshot = await getDocs(assetsRef);
      const batch = writeBatch(db);
      
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      addToast('All assets cleared', 'info');
    } catch (error) {
      console.error("Error clearing assets:", error);
      addToast('Failed to clear assets', 'error');
    }
  };

  const toggleLibrary = async (id: string, forceRemove: boolean = false) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      let currentLibrary: string[] = [];
      
      if (docSnap.exists()) {
        currentLibrary = docSnap.data().library || [];
      }

      let newLibrary: string[];
      if (currentLibrary.includes(id)) {
        if (!forceRemove) {
          setAssetToRemove(id);
          return;
        }
        newLibrary = currentLibrary.filter(libId => libId !== id);
        addToast('Removed from library', 'info');
        setAssetToRemove(null);
      } else {
        newLibrary = [...currentLibrary, id];
        addToast('Added to library', 'success');
      }

      await setDoc(userDocRef, { library: newLibrary }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.uid}`);
      addToast('Failed to update library', 'error');
    }
  };

  const cancelRemoveFromLibrary = () => {
    setAssetToRemove(null);
  };

  const confirmRemoveFromLibrary = () => {
    if (assetToRemove) {
      toggleLibrary(assetToRemove, true);
    }
  };

  return {
    assets,
    library,
    currentUser,
    showAuthModal,
    setShowAuthModal,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    toasts,
    addToast,
    removeToast,
    addAsset,
    updateAsset,
    deleteAsset,
    clearAllAssets,
    toggleLibrary,
    assetToRemove,
    cancelRemoveFromLibrary,
    confirmRemoveFromLibrary,
  };
}
