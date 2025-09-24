// Script para criar usuário no Firestore
// Execute este script no console do navegador (F12) quando estiver logado

const addUserToFirestore = async () => {
  // Verifica se Firebase está disponível
  if (typeof firebase === 'undefined') {
    console.error('Firebase não está disponível');
    return;
  }

  const user = firebase.auth().currentUser;
  if (!user) {
    console.error('Nenhum usuário logado');
    return;
  }

  const userData = {
    email: user.email,
    name: 'Professor', // Altere conforme necessário
    role: 'professor', // ou 'colaborador'
    createdAt: firebase.firestore.Timestamp.now()
  };

  try {
    await firebase.firestore().collection('users').doc(user.uid).set(userData);
    console.log('Usuário adicionado com sucesso ao Firestore!');
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
  }
};

addUserToFirestore();
