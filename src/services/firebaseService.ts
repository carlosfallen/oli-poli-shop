// FILE: src/services/firebaseService.ts
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product, SiteConfig, Category } from '../types';

// Products
export const getProducts = async (): Promise<Product[]> => {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Product[];
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const q = query(
    collection(db, 'products'), 
    where('category', '==', category),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Product[];
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const q = query(
    collection(db, 'products'), 
    where('featured', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Product[];
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
  await updateDoc(doc(db, 'products', id), product);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'products', id));
};

export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Product[];
    callback(products);
  });
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'categories'), category);
  return docRef.id;
};

export const updateCategory = async (id: string, category: Partial<Category>): Promise<void> => {
  await updateDoc(doc(db, 'categories', id), category);
};

export const deleteCategory = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'categories', id));
};

// Site Config
export const getSiteConfig = async (): Promise<SiteConfig | null> => {
  const docSnap = await getDoc(doc(db, 'config', 'site'));
  if (docSnap.exists()) {
    return docSnap.data() as SiteConfig;
  }
  return null;
};

export const updateSiteConfig = async (config: Partial<SiteConfig>): Promise<void> => {
  await updateDoc(doc(db, 'config', 'site'), config);
};

export const subscribeToSiteConfig = (callback: (config: SiteConfig | null) => void) => {
  return onSnapshot(doc(db, 'config', 'site'), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as SiteConfig);
    } else {
      callback(null);
    }
  });
};