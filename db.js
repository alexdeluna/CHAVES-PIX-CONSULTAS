import {
    getFirestore,
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { app } from "./firebase-config.js";

import { auth } from "./auth.js";


const db = getFirestore(app);


// ======================================================
// VALIDAR USUÁRIO
// ======================================================

function obterUid() {

    const usuario = auth.currentUser;

    if (!usuario) {
        throw new Error("Usuário não autenticado.");
    }

    return usuario.uid;
}


// ======================================================
// REFERÊNCIA DAS PESSOAS
// ======================================================

function referenciaPessoas() {

    const uid = obterUid();

    return collection(
        db,
        "users",
        uid,
        "pessoas"
    );
}


// ======================================================
// CRIAR / GARANTIR DOCUMENTO DO USUÁRIO
// ======================================================

export async function criarUsuarioSeNaoExistir(usuario) {

    if (!usuario) {
        throw new Error("Usuário não informado.");
    }

    const referencia = doc(
        db,
        "users",
        usuario.uid
    );

    const snapshot = await getDoc(referencia);

    if (!snapshot.exists()) {

        await setDoc(referencia, {
            email: usuario.email || "",
            nome: usuario.displayName || "",
            criadoEm: serverTimestamp(),
            atualizadoEm: serverTimestamp()
        });

    } else {

        await updateDoc(referencia, {
            atualizadoEm: serverTimestamp()
        });
    }
}


// ======================================================
// CADASTRAR PESSOA
// ======================================================

export async function cadastrarPessoa(nome) {

    if (!nome || !nome.trim()) {
        throw new Error("Informe o nome da pessoa.");
    }

    const referencia = await addDoc(
        referenciaPessoas(),
        {
            nome: nome.trim(),
            criadoEm: serverTimestamp(),
            atualizadoEm: serverTimestamp()
        }
    );

    return referencia.id;
}


// ======================================================
// CONSULTAR TODAS AS PESSOAS
// ======================================================

export async function listarPessoas() {

    const consulta = query(
        referenciaPessoas(),
        orderBy("nome")
    );

    const snapshot = await getDocs(consulta);

    return snapshot.docs.map(documento => ({
        id: documento.id,
        ...documento.data()
    }));
}


// ======================================================
// CONSULTAR UMA PESSOA
// ======================================================

export async function obterPessoa(pessoaId) {

    const referencia = doc(
        referenciaPessoas(),
        pessoaId
    );

    const snapshot = await getDoc(referencia);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    };
}


// ======================================================
// ATUALIZAR PESSOA
// ======================================================

export async function atualizarPessoa(
    pessoaId,
    nome
) {

    if (!nome || !nome.trim()) {
        throw new Error("Informe o nome da pessoa.");
    }

    const referencia = doc(
        referenciaPessoas(),
        pessoaId
    );

    await updateDoc(
        referencia,
        {
            nome: nome.trim(),
            atualizadoEm: serverTimestamp()
        }
    );
}


// ======================================================
// EXCLUIR PESSOA
// ======================================================

export async function excluirPessoa(pessoaId) {

    const referencia = doc(
        referenciaPessoas(),
        pessoaId
    );

    await deleteDoc(referencia);
}


// ======================================================
// REFERÊNCIA DAS CHAVES DE UMA PESSOA
// ======================================================

function referenciaChaves(pessoaId) {

    return collection(
        referenciaPessoas(),
        pessoaId,
        "chaves"
    );
}


// ======================================================
// CADASTRAR CHAVE PIX
// ======================================================

export async function cadastrarChave(
    pessoaId,
    chave,
    banco,
    tipoDetectado = ""
) {

    if (!chave || !chave.trim()) {
        throw new Error("Informe a chave PIX.");
    }

    if (!banco || !banco.trim()) {
        throw new Error("Informe o banco.");
    }

    const referencia = await addDoc(
        referenciaChaves(pessoaId),
        {
            chave: chave.trim(),
            banco: banco.trim(),
            tipoDetectado: tipoDetectado || "",
            criadoEm: serverTimestamp(),
            atualizadoEm: serverTimestamp()
        }
    );

    return referencia.id;
}


// ======================================================
// LISTAR CHAVES DE UMA PESSOA
// ======================================================

export async function listarChaves(pessoaId) {

    const consulta = query(
        referenciaChaves(pessoaId),
        orderBy("criadoEm", "desc")
    );

    const snapshot = await getDocs(consulta);

    return snapshot.docs.map(documento => ({
        id: documento.id,
        ...documento.data()
    }));
}


// ======================================================
// OBTER UMA CHAVE
// ======================================================

export async function obterChave(
    pessoaId,
    chaveId
) {

    const referencia = doc(
        referenciaChaves(pessoaId),
        chaveId
    );

    const snapshot = await getDoc(referencia);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    };
}


// ======================================================
// ATUALIZAR CHAVE
// ======================================================

export async function atualizarChave(
    pessoaId,
    chaveId,
    chave,
    banco,
    tipoDetectado = ""
) {

    if (!chave || !chave.trim()) {
        throw new Error("Informe a chave PIX.");
    }

    if (!banco || !banco.trim()) {
        throw new Error("Informe o banco.");
    }

    const referencia = doc(
        referenciaChaves(pessoaId),
        chaveId
    );

    await updateDoc(
        referencia,
        {
            chave: chave.trim(),
            banco: banco.trim(),
            tipoDetectado: tipoDetectado || "",
            atualizadoEm: serverTimestamp()
        }
    );
}


// ======================================================
// EXCLUIR CHAVE
// ======================================================

export async function excluirChave(
    pessoaId,
    chaveId
) {

    const referencia = doc(
        referenciaChaves(pessoaId),
        chaveId
    );

    await deleteDoc(referencia);
}


// ======================================================
// EXPORTAR FIRESTORE
// ======================================================

export { db };