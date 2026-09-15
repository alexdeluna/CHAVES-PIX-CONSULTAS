import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { app } from "./firebase-config.js";

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();


// ======================================================
// PERSISTÊNCIA DA SESSÃO
// ======================================================

export async function configurarPersistencia() {
    await setPersistence(auth, browserLocalPersistence);
}


// ======================================================
// LOGIN COM E-MAIL E SENHA
// ======================================================

export async function loginEmail(email, senha) {
    return await signInWithEmailAndPassword(
        auth,
        email,
        senha
    );
}


// ======================================================
// CRIAR CONTA
// ======================================================

export async function criarConta(email, senha) {
    return await createUserWithEmailAndPassword(
        auth,
        email,
        senha
    );
}


// ======================================================
// LOGIN COM GOOGLE
// ======================================================

export async function loginGoogle() {
    return await signInWithPopup(
        auth,
        googleProvider
    );
}


// ======================================================
// RECUPERAR SENHA
// ======================================================

export async function recuperarSenha(email) {
    return await sendPasswordResetEmail(
        auth,
        email
    );
}


// ======================================================
// LOGOUT
// ======================================================

export async function logout() {
    return await signOut(auth);
}


// ======================================================
// USUÁRIO ATUAL
// ======================================================

export function usuarioAtual() {
    return auth.currentUser;
}


// ======================================================
// OBSERVAR ALTERAÇÕES NA SESSÃO
// ======================================================

export function observarSessao(callback) {
    return onAuthStateChanged(
        auth,
        callback
    );
}


// ======================================================
// EXPORTAR AUTH
// ======================================================

export { auth };