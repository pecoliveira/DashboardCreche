// Script para criar usuário de teste
// Execute com: node create-test-user.js

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCOId4970L2rk8l225osHO4NnlYLfghBWE",
  authDomain: "estrela-do-oriente-app.firebaseapp.com",
  projectId: "estrela-do-oriente-app",
  storageBucket: "estrela-do-oriente-app.firebasestorage.app",
  messagingSenderId: "783966550018",
  appId: "1:783966550018:web:89d7de9e2655bf342e8f1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createTestUser() {
  try {
    console.log('Criando usuário de teste...');
    
    // Criar usuário no Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, 'admin@creche.com', '123456');
    const user = userCredential.user;
    
    console.log('Usuário criado no Authentication:', user.email);
    
    // Criar documento do usuário no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      name: 'Administrador',
      role: 'colaborador',
      createdAt: new Date()
    });
    
    console.log('Documento do usuário criado no Firestore');
    console.log('Usuário de teste criado com sucesso!');
    console.log('Email: admin@creche.com');
    console.log('Senha: 123456');
    
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
  }
}

createTestUser();
