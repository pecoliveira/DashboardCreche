'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('AuthContext: Auth state changed', firebaseUser?.email || 'No user');
      
      if (firebaseUser) {
        console.log('AuthContext: User found, fetching user data from Firestore');
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('AuthContext: User data found in Firestore', userData);
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: userData.name,
              role: userData.role,
              createdAt: userData.createdAt?.toDate() || new Date(),
            });
          } else {
            console.log('AuthContext: No user document found in Firestore for UID:', firebaseUser.uid);
            console.log('AuthContext: Creating user document in Firestore');
            
            // Create user document in Firestore
            const newUserData = {
              email: firebaseUser.email || '',
              name: firebaseUser.email?.split('@')[0] || 'Usuário',
              role: 'colaborador' as const,
              createdAt: Timestamp.now(),
            };

            // Try to create the document
            try {
              await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
              console.log('AuthContext: User document created successfully');
              
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: newUserData.name,
                role: newUserData.role,
                createdAt: newUserData.createdAt.toDate(),
              });
            } catch (createError) {
              console.error('AuthContext: Error creating user document:', createError);
              // Still set user even if creation fails
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: newUserData.name,
                role: newUserData.role,
                createdAt: new Date(),
              });
            }
          }
        } catch (error) {
          console.error('AuthContext: Error fetching user data:', error);
          // Still set user even if Firestore fails
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.email?.split('@')[0] || 'Usuário',
            role: 'colaborador',
            createdAt: new Date(),
          });
        }
      } else {
        console.log('AuthContext: No user, setting to null');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('AuthContext: Attempting login for:', email);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthContext: Login successful for:', result.user.email);
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
