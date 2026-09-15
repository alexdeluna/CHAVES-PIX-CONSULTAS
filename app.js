import {
    loginEmail,
    criarConta,
    loginGoogle,
    recuperarSenha,
    logout,
    observarSessao,
    configurarPersistencia
} from "./auth.js";

import {
    criarUsuarioSeNaoExistir,
    cadastrarPessoa,
    cadastrarChave,
    listarPessoas,
    listarChaves,
    atualizarPessoa,
    atualizarChave,
    excluirChave
} from "./db.js";


// ======================================================
// ELEMENTOS DA INTERFACE
// ======================================================

const telaLogin = document.getElementById("tela-login");
const telaPrincipal = document.getElementById("tela-principal");

const emailLogin = document.getElementById("login-email");
const senhaLogin = document.getElementById("login-senha");

const btnEntrar = document.getElementById("btn-entrar");
const btnGoogle = document.getElementById("btn-google");
const btnCriarConta = document.getElementById("btn-criar-conta");
const btnEsqueciSenha = document.getElementById("btn-esqueci-senha");
const btnLogout = document.getElementById("btn-logout");

const usuarioEmail = document.getElementById("usuario-email");
const mensagemLogin = document.getElementById("mensagem-login");

const telaComoUsar =
    document.getElementById("tela-como-usar");

const btnComoUsar =
    document.getElementById("btn-como-usar");

const btnVoltarComoUsar =
    document.getElementById("btn-voltar-como-usar");

    const telaCadastro =
    document.getElementById("tela-cadastro");

const btnCadastrar =
    document.getElementById("btn-cadastrar");

const btnSalvarChave =
    document.getElementById("btn-salvar-chave");

const btnVoltarCadastro =
    document.getElementById("btn-voltar-cadastro");

const cadastroNome =
    document.getElementById("cadastro-nome");

const cadastroChave =
    document.getElementById("cadastro-chave");

const cadastroBanco =
    document.getElementById("cadastro-banco");

const tipoDetectado =
    document.getElementById("tipo-detectado");

const mensagemCadastro =
    document.getElementById("mensagem-cadastro");

    const resultadoCadastroPessoas =
    document.getElementById("resultado-cadastro-pessoas");

const pessoaSelecionada =
    document.getElementById("pessoa-selecionada");

    let pessoaAtualCadastro = null;

    const telaConsulta =
    document.getElementById("tela-consulta");

const btnConsultar =
    document.getElementById("btn-consultar");

const btnVoltarConsulta =
    document.getElementById("btn-voltar-consulta");

const consultaNome =
    document.getElementById("consulta-nome");

const resultadoPessoas =
    document.getElementById("resultado-pessoas");

const resultadoChaves =
    document.getElementById("resultado-chaves");


// ======================================================
// MENSAGENS
// ======================================================

function mostrarMensagem(
    texto,
    tipo = ""
) {

    mensagemLogin.textContent = texto;

    mensagemLogin.className = "mensagem";

    if (tipo) {
        mensagemLogin.classList.add(tipo);
    }
}


function limparMensagem() {

    mensagemLogin.textContent = "";

    mensagemLogin.className = "mensagem";
}


// ======================================================
// ESTADO DOS BOTÕES
// ======================================================

function bloquearBotoesLogin(bloquear) {

    btnEntrar.disabled = bloquear;
    btnGoogle.disabled = bloquear;
    btnCriarConta.disabled = bloquear;
    btnEsqueciSenha.disabled = bloquear;
}


// ======================================================
// TRADUZIR ERROS DO FIREBASE
// ======================================================

function mensagemErroFirebase(erro) {

    switch (erro.code) {

        case "auth/invalid-credential":
            return "E-mail ou senha incorretos.";

        case "auth/user-not-found":
            return "Usuário não encontrado.";

        case "auth/wrong-password":
            return "Senha incorreta.";

        case "auth/email-already-in-use":
            return "Este e-mail já possui uma conta.";

        case "auth/weak-password":
            return "A senha precisa ter pelo menos 6 caracteres.";

        case "auth/invalid-email":
            return "Informe um e-mail válido.";

        case "auth/popup-closed-by-user":
            return "O login com Google foi cancelado.";

        case "auth/popup-blocked":
            return "O navegador bloqueou a janela do Google.";

        case "auth/too-many-requests":
            return "Muitas tentativas. Aguarde alguns minutos.";

        default:
            console.error(erro);

            return "Não foi possível realizar a operação.";
    }
}


// ======================================================
// ENTRAR COM E-MAIL
// ======================================================

async function realizarLogin() {

    const email = emailLogin.value.trim();
    const senha = senhaLogin.value;

    limparMensagem();

    if (!email) {

        mostrarMensagem(
            "Informe seu e-mail.",
            "erro"
        );

        emailLogin.focus();

        return;
    }

    if (!senha) {

        mostrarMensagem(
            "Informe sua senha.",
            "erro"
        );

        senhaLogin.focus();

        return;
    }

    try {

        bloquearBotoesLogin(true);

        mostrarMensagem(
            "Entrando..."
        );

        await loginEmail(
            email,
            senha
        );

    } catch (erro) {

        mostrarMensagem(
            mensagemErroFirebase(erro),
            "erro"
        );

    } finally {

        bloquearBotoesLogin(false);
    }
}


// ======================================================
// CRIAR CONTA
// ======================================================

async function realizarCriacaoConta() {

    const email = emailLogin.value.trim();
    const senha = senhaLogin.value;

    limparMensagem();

    if (!email) {

        mostrarMensagem(
            "Informe seu e-mail.",
            "erro"
        );

        emailLogin.focus();

        return;
    }

    if (!senha) {

        mostrarMensagem(
            "Informe uma senha.",
            "erro"
        );

        senhaLogin.focus();

        return;
    }

    if (senha.length < 6) {

        mostrarMensagem(
            "A senha precisa ter pelo menos 6 caracteres.",
            "erro"
        );

        senhaLogin.focus();

        return;
    }

    try {

        bloquearBotoesLogin(true);

        mostrarMensagem(
            "Criando sua conta..."
        );

        await criarConta(
            email,
            senha
        );

        mostrarMensagem(
            "Conta criada com sucesso.",
            "sucesso"
        );

    } catch (erro) {

        mostrarMensagem(
            mensagemErroFirebase(erro),
            "erro"
        );

    } finally {

        bloquearBotoesLogin(false);
    }
}


// ======================================================
// LOGIN GOOGLE
// ======================================================

async function realizarLoginGoogle() {

    limparMensagem();

    try {

        bloquearBotoesLogin(true);

        mostrarMensagem(
            "Abrindo login do Google..."
        );

        await loginGoogle();

    } catch (erro) {

        mostrarMensagem(
            mensagemErroFirebase(erro),
            "erro"
        );

    } finally {

        bloquearBotoesLogin(false);
    }
}


// ======================================================
// RECUPERAR SENHA
// ======================================================

async function realizarRecuperacaoSenha() {

    const email = emailLogin.value.trim();

    limparMensagem();

    if (!email) {

        mostrarMensagem(
            "Digite seu e-mail primeiro.",
            "erro"
        );

        emailLogin.focus();

        return;
    }

    try {

        bloquearBotoesLogin(true);

        await recuperarSenha(email);

        mostrarMensagem(
            "Enviamos as instruções para seu e-mail.",
            "sucesso"
        );

    } catch (erro) {

        mostrarMensagem(
            mensagemErroFirebase(erro),
            "erro"
        );

    } finally {

        bloquearBotoesLogin(false);
    }
}


// ======================================================
// LOGOUT
// ======================================================

async function realizarLogout() {

    try {

        await logout();

    } catch (erro) {

        console.error(
            "Erro ao sair:",
            erro
        );
    }
}


// ======================================================
// ALTERAR TELA
// ======================================================

function mostrarTelaLogin() {

    telaLogin.hidden = false;
    telaPrincipal.hidden = true;
    telaComoUsar.hidden = true;

    usuarioEmail.textContent = "";

    limparMensagem();
}


function mostrarTelaPrincipal(usuario) {

    telaLogin.hidden = true;
    telaPrincipal.hidden = false;
    telaComoUsar.hidden = true;

    usuarioEmail.textContent =
        usuario.email || "Usuário";
}


// ======================================================
// OBSERVAR SESSÃO
// ======================================================

observarSessao(
    async (usuario) => {

        if (usuario) {

            try {

                await criarUsuarioSeNaoExistir(
                    usuario
                );

                mostrarTelaPrincipal(
                    usuario
                );

            } catch (erro) {

                console.error(
                    "Erro ao preparar usuário:",
                    erro
                );

                mostrarMensagem(
                    "Não foi possível carregar sua conta.",
                    "erro"
                );
            }

        } else {

            mostrarTelaLogin();
        }
    }
);


// ======================================================
// EVENTOS
// ======================================================

btnEntrar.addEventListener(
    "click",
    realizarLogin
);


btnGoogle.addEventListener(
    "click",
    realizarLoginGoogle
);


btnCriarConta.addEventListener(
    "click",
    realizarCriacaoConta
);


btnEsqueciSenha.addEventListener(
    "click",
    realizarRecuperacaoSenha
);


btnLogout.addEventListener(
    "click",
    realizarLogout
);

// ======================================================
// COMO USAR
// ======================================================

btnComoUsar.addEventListener(
    "click",
    () => {

        telaPrincipal.hidden = true;
        telaComoUsar.hidden = false;
    }
);


btnVoltarComoUsar.addEventListener(
    "click",
    () => {

        telaComoUsar.hidden = true;
        telaPrincipal.hidden = false;
    }
);

// ======================================================
// CADASTRO DE CHAVE PIX
// ======================================================

function mostrarMensagemCadastro(texto, tipo = "") {

    mensagemCadastro.textContent = texto;

    mensagemCadastro.className = "mensagem";

    if (tipo) {
        mensagemCadastro.classList.add(tipo);
    }
}


function limparMensagemCadastro() {

    mensagemCadastro.textContent = "";

    mensagemCadastro.className = "mensagem";
}


function identificarTipoChave(valor) {

    const chave = valor.trim();

    if (!chave) {
        return "";
    }

    // E-mail
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chave)) {
        return "E-mail";
    }

    // CPF
    const somenteNumeros = chave.replace(/\D/g, "");

    if (
        somenteNumeros.length === 11 &&
        /^[0-9]+$/.test(somenteNumeros)
    ) {
        return "Telefone ou CPF";
    }

    // CNPJ
    if (
        somenteNumeros.length === 14 &&
        /^[0-9]+$/.test(somenteNumeros)
    ) {
        return "CNPJ";
    }

    // Chave aleatória
    if (chave.length >= 20) {
        return "Aleatória";
    }

    return "";
}


function mostrarTelaCadastro() {

    telaPrincipal.hidden = true;
    telaComoUsar.hidden = true;
    telaCadastro.hidden = false;

    limparMensagemCadastro();

    pessoaAtualCadastro = null;

    cadastroNome.value = "";
    cadastroChave.value = "";
    cadastroBanco.value = "";

    tipoDetectado.textContent = "";

    resultadoCadastroPessoas.innerHTML = "";

    pessoaSelecionada.hidden = true;
    pessoaSelecionada.textContent = "";

    cadastroNome.focus();
}

async function pesquisarPessoaParaCadastro() {

    const termo =
        cadastroNome.value
            .trim()
            .toLowerCase();

    resultadoCadastroPessoas.innerHTML = "";

    pessoaAtualCadastro = null;

    pessoaSelecionada.hidden = true;
    pessoaSelecionada.textContent = "";

    if (!termo) {
        return;
    }

    try {

        const pessoas = await listarPessoas();

        const encontradas =
            pessoas.filter(pessoa =>
                pessoa.nome
                    .trim()
                    .toLowerCase()
                    .includes(termo)
            );

        if (encontradas.length === 0) {

            const mensagem =
                document.createElement("p");

            mensagem.textContent =
                "Nenhuma pessoa encontrada. Para cadastrar uma nova pessoa, use o nome informado e salve a chave.";

            resultadoCadastroPessoas.appendChild(
                mensagem
            );

            return;
        }

        encontradas.forEach(pessoa => {

            const botao =
                document.createElement("button");

            botao.type = "button";
            botao.className = "card-pessoa";
            botao.textContent = pessoa.nome;

            botao.addEventListener(
                "click",
                () => selecionarPessoaParaCadastro(pessoa)
            );

            resultadoCadastroPessoas.appendChild(
                botao
            );
        });

    } catch (erro) {

        console.error(
            "Erro ao pesquisar pessoa:",
            erro
        );

        mostrarMensagemCadastro(
            "Não foi possível pesquisar as pessoas.",
            "erro"
        );
    }
}

function selecionarPessoaParaCadastro(pessoa) {

    pessoaAtualCadastro = pessoa;

    cadastroNome.value = pessoa.nome;

    resultadoCadastroPessoas.innerHTML = "";

    pessoaSelecionada.hidden = false;

    pessoaSelecionada.textContent =
        `Pessoa selecionada: ${pessoa.nome}`;

    cadastroChave.focus();
}

function voltarParaPrincipal() {

    telaCadastro.hidden = true;
    telaPrincipal.hidden = false;

    limparMensagemCadastro();
}


async function salvarNovaChave() {

    limparMensagemCadastro();

    const nome = cadastroNome.value.trim();
    const chave = cadastroChave.value.trim();
    const banco = cadastroBanco.value.trim();

    if (!nome) {

        mostrarMensagemCadastro(
            "Informe o nome da pessoa.",
            "erro"
        );

        cadastroNome.focus();

        return;
    }

    if (!chave) {

        mostrarMensagemCadastro(
            "Informe a chave PIX.",
            "erro"
        );

        cadastroChave.focus();

        return;
    }

    if (!banco) {

        mostrarMensagemCadastro(
            "Informe o banco.",
            "erro"
        );

        cadastroBanco.focus();

        return;
    }

    try {

        btnSalvarChave.disabled = true;
        btnSalvarChave.textContent = "SALVANDO...";

        let pessoaId;

        /*
         * Se uma pessoa foi selecionada,
         * usamos o ID dela.
         *
         * Portanto NÃO criamos outra pessoa.
         */

        if (pessoaAtualCadastro) {

            pessoaId = pessoaAtualCadastro.id;

        } else {

            /*
             * Nenhuma pessoa foi selecionada.
             * Vamos verificar novamente se já existe
             * alguém com exatamente esse nome.
             */

            const pessoas = await listarPessoas();

            const nomeNormalizado =
                nome
                    .trim()
                    .toLowerCase();

            const pessoaExistente =
                pessoas.find(pessoa =>
                    pessoa.nome
                        .trim()
                        .toLowerCase() === nomeNormalizado
                );

            if (pessoaExistente) {

                mostrarMensagemCadastro(
                    "Esta pessoa já existe. Selecione-a na lista antes de salvar a chave.",
                    "erro"
                );

                cadastroNome.focus();

                return;
            }

            pessoaId =
                await cadastrarPessoa(nome);
        }

        const tipo =
            identificarTipoChave(chave);

        await cadastrarChave(
            pessoaId,
            chave,
            banco,
            tipo
        );

        mostrarMensagemCadastro(
            "Chave cadastrada com sucesso.",
            "sucesso"
        );

        cadastroNome.value = "";
        cadastroChave.value = "";
        cadastroBanco.value = "";

        tipoDetectado.textContent = "";

        resultadoCadastroPessoas.innerHTML = "";

        pessoaAtualCadastro = null;

        pessoaSelecionada.hidden = true;
        pessoaSelecionada.textContent = "";

        setTimeout(() => {

            voltarParaPrincipal();

        }, 800);

    } catch (erro) {

        console.error(
            "Erro ao cadastrar chave:",
            erro
        );

        mostrarMensagemCadastro(
            "Não foi possível cadastrar a chave.",
            "erro"
        );

    } finally {

        btnSalvarChave.disabled = false;
        btnSalvarChave.textContent = "SALVAR CHAVE";
    }
}


// ======================================================
// EVENTOS DO CADASTRO
// ======================================================

btnCadastrar.addEventListener(
    "click",
    mostrarTelaCadastro
);


btnVoltarCadastro.addEventListener(
    "click",
    voltarParaPrincipal
);

cadastroNome.addEventListener(
    "input",
    pesquisarPessoaParaCadastro
);

btnConsultar.addEventListener(
    "click",
    async () => {

        telaPrincipal.hidden = true;
        telaComoUsar.hidden = true;
        telaCadastro.hidden = true;
        telaConsulta.hidden = false;

        consultaNome.value = "";
        resultadoPessoas.innerHTML = "";
        resultadoChaves.innerHTML = "";

        await carregarPessoas();

        consultaNome.focus();
    }
);


// ======================================================
// CONSULTAR PESSOAS
// ======================================================

async function carregarPessoas() {

    resultadoPessoas.innerHTML = "";
    resultadoChaves.innerHTML = "";

    try {

        const pessoas = await listarPessoas();

        if (pessoas.length === 0) {

            resultadoPessoas.innerHTML =
                "<p>Nenhuma pessoa cadastrada.</p>";

            return;
        }

        pessoas.forEach(pessoa => {

            const card = document.createElement("button");

            card.type = "button";
            card.className = "card-pessoa";
            card.textContent = pessoa.nome;

            card.addEventListener(
                "click",
                () => carregarChaves(pessoa)
            );

            resultadoPessoas.appendChild(card);
        });

    } catch (erro) {

        console.error(
            "Erro ao consultar pessoas:",
            erro
        );

        resultadoPessoas.innerHTML =
            "<p>Não foi possível carregar as pessoas.</p>";
    }
}


// ======================================================
// PESQUISAR PESSOA PELO NOME
// ======================================================

consultaNome.addEventListener(
    "input",
    async () => {

        const termo =
            consultaNome.value
                .trim()
                .toLowerCase();

        resultadoChaves.innerHTML = "";

        if (!termo) {

            await carregarPessoas();

            return;
        }

        try {

            const pessoas = await listarPessoas();

            const pessoasFiltradas =
                pessoas.filter(pessoa =>
                    pessoa.nome
                        .toLowerCase()
                        .includes(termo)
                );

            resultadoPessoas.innerHTML = "";

            if (pessoasFiltradas.length === 0) {

                resultadoPessoas.innerHTML =
                    "<p>Nenhuma pessoa encontrada.</p>";

                return;
            }

            pessoasFiltradas.forEach(pessoa => {

                const card =
                    document.createElement("button");

                card.type = "button";
                card.className = "card-pessoa";
                card.textContent = pessoa.nome;

                card.addEventListener(
                    "click",
                    () => carregarChaves(pessoa)
                );

                resultadoPessoas.appendChild(card);
            });

        } catch (erro) {

            console.error(
                "Erro ao pesquisar pessoa:",
                erro
            );

            resultadoPessoas.innerHTML =
                "<p>Não foi possível realizar a pesquisa.</p>";
        }
    }
);


// ======================================================
// CARREGAR CHAVES DA PESSOA
// ======================================================

async function carregarChaves(pessoa) {

    resultadoChaves.innerHTML = "";

    try {

        const chaves =
            await listarChaves(pessoa.id);

        const titulo =
            document.createElement("h2");

        titulo.textContent =
            `Chaves de ${pessoa.nome}`;

        resultadoChaves.appendChild(titulo);

        const botoesPessoa =
    document.createElement("div");

botoesPessoa.className =
    "botoes-gerenciamento-pessoa";


const botaoEditarPessoa =
    document.createElement("button");

botaoEditarPessoa.type = "button";
botaoEditarPessoa.textContent =
    "EDITAR PESSOA";

botaoEditarPessoa.className =
    "botao-editar-pessoa";

botaoEditarPessoa.addEventListener(
    "click",
    () => editarPessoa(pessoa)
);


botoesPessoa.appendChild(
    botaoEditarPessoa
);

resultadoChaves.appendChild(
    botoesPessoa
);

        const botaoExcluirPessoa =
    document.createElement("button");

botaoExcluirPessoa.type = "button";
botaoExcluirPessoa.textContent =
    "EXCLUIR PESSOA";

botaoExcluirPessoa.className =
    "botao-perigo";

botaoExcluirPessoa.addEventListener(
    "click",
    () => excluirPessoaComChaves(pessoa)
);

resultadoChaves.appendChild(
    botaoExcluirPessoa
);

        if (chaves.length === 0) {

            const mensagem =
                document.createElement("p");

            mensagem.textContent =
                "Esta pessoa não possui chaves cadastradas.";

            resultadoChaves.appendChild(mensagem);

            return;
        }

        chaves.forEach(chave => {

            const card =
                document.createElement("div");

            card.className = "card-chave";

            const banco =
                document.createElement("h3");

            banco.textContent =
                chave.banco;

            const valor =
                document.createElement("p");

            valor.textContent =
                chave.chave;

            const tipo =
                document.createElement("p");

            if (chave.tipoDetectado) {

                tipo.textContent =
                    `Tipo: ${chave.tipoDetectado}`;

            } else {

                tipo.textContent = "";
            }

            const botaoCopiar =
                document.createElement("button");

            botaoCopiar.type = "button";
            botaoCopiar.textContent =
                "COPIAR CHAVE";

            botaoCopiar.addEventListener(
                "click",
                () => copiarChave(
                    chave.chave,
                    botaoCopiar
                )
            );

            const botoesGerenciamento =
    document.createElement("div");

botoesGerenciamento.className =
    "botoes-gerenciamento-chave";


const botaoEditar =
    document.createElement("button");

botaoEditar.type = "button";
botaoEditar.textContent = "EDITAR";
botaoEditar.className =
    "botao-editar-chave";

botaoEditar.addEventListener(
    "click",
    () => editarChave(
        pessoa,
        chave
    )
);


const botaoExcluir =
    document.createElement("button");

botaoExcluir.type = "button";
botaoExcluir.textContent = "EXCLUIR";
botaoExcluir.className =
    "botao-excluir-chave";

botaoExcluir.addEventListener(
    "click",
    () => excluirChaveIndividual(
        pessoa,
        chave
    )
);


botoesGerenciamento.appendChild(
    botaoEditar
);

botoesGerenciamento.appendChild(
    botaoExcluir
);

            card.appendChild(banco);
            card.appendChild(valor);
            card.appendChild(tipo);
            card.appendChild(botaoCopiar);
            card.appendChild(botoesGerenciamento);

            resultadoChaves.appendChild(card);
        });

    } catch (erro) {

        console.error(
            "Erro ao carregar chaves:",
            erro
        );

        resultadoChaves.innerHTML =
            "<p>Não foi possível carregar as chaves.</p>";
    }
}

// ======================================================
// EDITAR PESSOA
// ======================================================

async function editarPessoa(pessoa) {

    const novoNome = prompt(
        "Informe o novo nome da pessoa:",
        pessoa.nome
    );

    if (novoNome === null) {
        return;
    }

    const nomeLimpo = novoNome.trim();

    if (!nomeLimpo) {
        alert("Informe o nome da pessoa.");
        return;
    }

    if (nomeLimpo === pessoa.nome) {
        return;
    }

    try {

        await atualizarPessoa(
            pessoa.id,
            nomeLimpo
        );

        alert(
            "Nome da pessoa atualizado com sucesso."
        );

        // Atualiza o objeto utilizado pela tela
        pessoa.nome = nomeLimpo;

        // Atualiza a tela
        await carregarChaves(pessoa);

    } catch (erro) {

        console.error(
            "Erro ao atualizar pessoa:",
            erro
        );

        alert(
            "Não foi possível atualizar o nome da pessoa."
        );
    }
}

// ======================================================
// EXCLUIR PESSOA E TODAS AS SUAS CHAVES
// ======================================================

async function excluirPessoaComChaves(pessoa) {

    const confirmou = confirm(
        `EXCLUIR PESSOA\n\n` +
        `Você está prestes a excluir ${pessoa.nome}.\n\n` +
        `Todas as chaves PIX cadastradas para essa pessoa ` +
        `também serão excluídas.\n\n` +
        `Essa ação não poderá ser desfeita.\n\n` +
        `Deseja continuar?`
    );

    if (!confirmou) {
        return;
    }

    try {

        // Primeiro localiza todas as chaves
        const chaves = await listarChaves(pessoa.id);

        // Exclui cada chave
        for (const chave of chaves) {

            await excluirChave(
                pessoa.id,
                chave.id
            );
        }

        // Somente depois exclui a pessoa
        await excluirPessoa(pessoa.id);

        alert(
            `A pessoa ${pessoa.nome} e todas as suas ` +
            `chaves foram excluídas com sucesso.`
        );

        // Limpa a área das chaves
        resultadoChaves.innerHTML = "";

        // Recarrega a lista de pessoas
        await carregarPessoas();

    } catch (erro) {

        console.error(
            "Erro ao excluir pessoa:",
            erro
        );

        alert(
            "Não foi possível concluir a exclusão.\n\n" +
            "A pessoa não foi excluída."
        );
    }
}

// ======================================================
// EDITAR CHAVE PIX
// ======================================================

async function editarChave(pessoa, chave) {

    const novaChave = prompt(
        "Informe a nova chave PIX:",
        chave.chave
    );

    if (novaChave === null) {
        return;
    }

    const chaveLimpa = novaChave.trim();

    if (!chaveLimpa) {
        alert("Informe uma chave PIX.");
        return;
    }

    const novoBanco = prompt(
        "Informe o banco:",
        chave.banco
    );

    if (novoBanco === null) {
        return;
    }

    const bancoLimpo = novoBanco.trim();

    if (!bancoLimpo) {
        alert("Informe o banco.");
        return;
    }

    try {

        const tipo = identificarTipoChave(
            chaveLimpa
        );

        await atualizarChave(
            pessoa.id,
            chave.id,
            chaveLimpa,
            bancoLimpo,
            tipo
        );

        alert(
            "Chave PIX atualizada com sucesso."
        );

        await carregarChaves(pessoa);

    } catch (erro) {

        console.error(
            "Erro ao atualizar chave:",
            erro
        );

        alert(
            "Não foi possível atualizar a chave PIX."
        );
    }
}


// ======================================================
// EXCLUIR CHAVE PIX
// ======================================================

async function excluirChaveIndividual(
    pessoa,
    chave
) {

    const confirmou = confirm(
        `EXCLUIR CHAVE\n\n` +
        `Pessoa: ${pessoa.nome}\n\n` +
        `Banco: ${chave.banco}\n` +
        `Chave: ${chave.chave}\n\n` +
        `Esta ação não poderá ser desfeita.\n\n` +
        `Deseja realmente excluir esta chave?`
    );

    if (!confirmou) {
        return;
    }

    try {

        await excluirChave(
            pessoa.id,
            chave.id
        );

        alert(
            "Chave PIX excluída com sucesso."
        );

        await carregarChaves(pessoa);

    } catch (erro) {

        console.error(
            "Erro ao excluir chave:",
            erro
        );

        alert(
            "Não foi possível excluir a chave PIX."
        );
    }
}

// ======================================================
// COPIAR CHAVE PIX
// ======================================================

async function copiarChave(
    chave,
    botao
) {

    try {

        await navigator.clipboard.writeText(chave);

        botao.textContent = "COPIADO";

        setTimeout(() => {

            botao.textContent =
                "COPIAR CHAVE";

        }, 1500);

    } catch (erro) {

        console.error(
            "Erro ao copiar chave:",
            erro
        );

        botao.textContent =
            "NÃO FOI POSSÍVEL COPIAR";

        setTimeout(() => {

            botao.textContent =
                "COPIAR CHAVE";

        }, 2000);
    }
}


// ======================================================
// VOLTAR DA CONSULTA
// ======================================================

btnVoltarConsulta.addEventListener(
    "click",
    () => {

        telaConsulta.hidden = true;
        telaPrincipal.hidden = false;

        consultaNome.value = "";
        resultadoPessoas.innerHTML = "";
        resultadoChaves.innerHTML = "";
    }
);

btnSalvarChave.addEventListener(
    "click",
    salvarNovaChave
);


cadastroChave.addEventListener(
    "input",
    () => {

        const tipo = identificarTipoChave(
            cadastroChave.value
        );

        if (tipo) {

            tipoDetectado.textContent =
                `Tipo identificado: ${tipo}`;

        } else {

            tipoDetectado.textContent = "";
        }
    }
);

// ======================================================
// ENTER NO LOGIN
// ======================================================

senhaLogin.addEventListener(
    "keydown",
    (evento) => {

        if (evento.key === "Enter") {

            realizarLogin();
        }
    }
);


// ======================================================
// INICIALIZAÇÃO
// ======================================================

async function iniciarAplicacao() {

    try {

        await configurarPersistencia();

    } catch (erro) {

        console.error(
            "Erro ao configurar persistência:",
            erro
        );
    }
}


iniciarAplicacao();