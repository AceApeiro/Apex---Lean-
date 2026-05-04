// 🔒 MOCK FIREBASE (for GitHub Pages / frontend demo)

export const db = null;
export const auth = null;
export const googleProvider = null;

// ✅ Mock audit logger (no Firestore)
export const logAudit = async (action: string, details: string = '') => {
  console.log('[AUDIT]', { action, details, created_at: new Date().toISOString() });
};

// ✅ Mock auth functions
export const signInWithPopup = async () => {
  console.log('Mock Google login');
};

export const signInWithEmailAndPassword = async () => {
  console.log('Mock email login');
};

export const createUserWithEmailAndPassword = async () => {
  console.log('Mock signup');
};

export const signOut = async () => {
  console.log('Mock logout');
};

export const onAuthStateChanged = (_auth: any, callback: any) => {
  // Immediately return fake user
  callback(null);
  return () => {};
};

// ✅ Mock Firestore helpers
export const doc = () => null;
export const getDoc = async () => ({ exists: () => false });
export const setDoc = async () => {};
export const collection = () => null;
export const getDocs = async () => ({ docs: [] });
export const onSnapshot = () => () => {};
export const addDoc = async () => {};
export const updateDoc = async () => {};
export const deleteDoc = async () => {};
export const query = () => null;
export const orderBy = () => null;
export const limit = () => null;
export const where = () => null;
