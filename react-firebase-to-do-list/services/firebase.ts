// FIX: Use Firebase v9 compat libraries to support the v8 namespaced API.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { User, Task } from '../types';

// FIX: The User type is available on the top-level `firebase` namespace in Firebase v8.
type FirebaseUser = firebase.User;


// Sua configuração do Firebase que você forneceu
const firebaseConfig = {
  apiKey: "AIzaSyDna4kbD-owRwaEzF90_RMtaXzjlVaqWKU",
  authDomain: "listaalunos-1b102.firebaseapp.com",
  projectId: "listaalunos-1b102",
  storageBucket: "listaalunos-1b102.firebasestorage.app",
  messagingSenderId: "817053621809",
  appId: "1:817053621809:web:b7af0ea3ffcdb6b858bf10"
};

// Inicializa o Firebase
// FIX: Switched to v8 initialization syntax.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

const mapFirebaseUser = (user: FirebaseUser): User => ({
  uid: user.uid,
  email: user.email,
});

// --- REAL AUTH SERVICE ---
// FIX: Auth functions now use the v8 namespaced API (e.g., auth.onAuthStateChanged).
export const firebaseAuth = {
  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    return auth.onAuthStateChanged((user) => {
      callback(user ? mapFirebaseUser(user) : null);
    });
  },

  createUserWithEmailAndPassword: async (email: string, password: string): Promise<{ user: User }> => {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    // In v8, user can be null, but on success it won't be. Use non-null assertion to match original v9 types.
    return { user: mapFirebaseUser(userCredential.user!) };
  },

  signInWithEmailAndPassword: async (email: string, password: string): Promise<{ user: User }> => {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    // In v8, user can be null, but on success it won't be. Use non-null assertion to match original v9 types.
    return { user: mapFirebaseUser(userCredential.user!) };
  },

  signOut: (): Promise<void> => {
    return auth.signOut();
  },
};

// --- REAL FIRESTORE SERVICE ---
// FIX: Firestore functions now use the v8 method-chaining API (e.g., db.collection(...).where(...)).
const TASKS_COLLECTION = 'tasks';
const tasksCollectionRef = db.collection(TASKS_COLLECTION);

export const firestoreService = {
  onSnapshot: (userId: string, callback: (tasks: Task[]) => void, onError: (error: Error) => void): (() => void) => {
    const q = tasksCollectionRef.where("userId", "==", userId);
    
    const unsubscribe = q.onSnapshot((querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Task));
      callback(tasks);
    }, onError);

    return unsubscribe;
  },
  
  addTask: (taskData: Omit<Task, 'id'>): Promise<any> => {
    return tasksCollectionRef.add(taskData);
  },

  updateTask: (id: string, updates: Partial<Task>): Promise<void> => {
    const taskDocRef = tasksCollectionRef.doc(id);
    return taskDocRef.update(updates);
  },
  
  deleteTask: (id: string): Promise<void> => {
    const taskDocRef = tasksCollectionRef.doc(id);
    return taskDocRef.delete();
  },
};
