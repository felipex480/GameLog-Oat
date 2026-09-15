/*
  IMPORTANTE:
  Para testar tudo localmente:
    API_URL = "http://localhost:3000/api"

  Quando publicar o back-end em um serviço online, troque pelo endereço da API.
  Exemplo:
    const API_URL = "https://sua-api.exemplo.com/api";
*/

const API_URL = "https://gamelog-oat.onrender.com";

let jogos = [];
let idParaExcluir = null;

const elementos = {
  lista: document.getElementById("listaJogos"),
  stats: document.getElementById("stats"),
  busca: document.getElementById("busca"),
  filtroStatus: document.getElementById("filtroStatus"),
  mensagem: document.getElementById("mensagem"),

  modal: document.getElementById("modal"),
  modalExcluir: document.getElementById("modalExcluir"),
  tituloModal: document.getElementById("tituloModal"),

  form: document.getElementById("formJogo"),
  jogoId: document.getElementById("jogoId"),
  nome: document.getElementById("nome"),
  plataforma: document.getElementById("plataforma"),
  genero: document.getElementById("genero"),
  status: document.getElementById("status"),
  nota: document.getElementById("nota"),
  horas: document.getElementById("horas"),

  nomeExcluir: document.getElementById("nomeExcluir")
};

document.addEventListener("DOMContentLoaded", carregarJogos);

document.getElementById("btnNovo").addEventListener("click", () => abrirFormulario());
document.getElementById("btnFecharModal").addEventListener("click", fecharFormulario);
document.getElementById("btnCancelar").addEventListener("click", fecharFormulario);

document.getElementById("btnCancelarExclusao").addEventListener("click", fecharExclusao);
document.getElementById("btnConfirmarExclusao").addEventListener("click", confirmarExclusao);

elementos.form.addEventListener("submit", salvarJogo);
elementos.busca.addEventListener("input", aplicarFiltros);
elementos.filtroStatus.addEventListener("change", aplicarFiltros);

async function carregarJogos() {
  try {
    const resposta = await fetch(`${API_URL}/jogos`);

    if (!resposta.ok) {
      throw new Error("Não foi possível acessar a API.");
    }

    jogos = await resposta.json();
    renderizar();
  } catch (erro) {
    mostrarMensagem(
      "Não foi possível conectar à API. Verifique se o servidor está rodando ou se a API publicada foi configurada no script.js.",
      true
    );
  }
}

function renderizar() {
  atualizarEstatisticas();
  aplicarFiltros();
}

function aplicarFiltros() {
  const termo = elementos.busca.value.toLowerCase().trim();
  const statusSelecionado = elementos.filtroStatus.value;

  const filtrados = jogos.filter(jogo => {
    const correspondeBusca = jogo.nome.toLowerCase().includes(termo);
    const correspondeStatus =
      statusSelecionado === "Todos" || jogo.status === statusSelecionado;

    return correspondeBusca && correspondeStatus;
  });

  renderizarJogos(filtrados);
}

function renderizarJogos(lista) {
  if (lista.length === 0) {
    elementos.lista.innerHTML = `
      <div class="empty">
        <div style="font-size: 32px; margin-bottom: 10px;">🎮</div>
        Nenhum jogo encontrado.
      </div>
    `;
    return;
  }

  elementos.lista.innerHTML = lista.map(jogo => `
    <article class="game-card">
      <div class="game-top">
        <div class="game-icon">🎮</div>
        <span class="status">${jogo.status}</span>
      </div>

      <h3>${escaparHTML(jogo.nome)}</h3>
      <p class="game-meta">
        ${escaparHTML(jogo.plataforma)} • ${escaparHTML(jogo.genero)}
      </p>

      <div class="game-info">
        <span>⭐ <strong>${jogo.nota ?? "—"}</strong></span>
        <span>⏱️ <strong>${jogo.horas || 0}h</strong></span>
      </div>

      <div class="card-actions">
        <button class="btn btn-secondary" onclick="abrirEdicao(${jogo.id})">
          Editar
        </button>
        <button class="btn btn-danger" onclick="abrirExclusao(${jogo.id})">
          Excluir
        </button>
      </div>
    </article>
  `).join("");
}

function atualizarEstatisticas() {
  const total = jogos.length;
  const finalizados = jogos.filter(jogo => jogo.status === "Finalizado").length;
  const andamento = jogos.filter(jogo => jogo.status === "Em andamento").length;
  const horas = jogos.reduce((total, jogo) => total + Number(jogo.horas || 0), 0);

  elementos.stats.innerHTML = `
    <div class="stat">
      <strong>${total}</strong>
      <span>Jogos cadastrados</span>
    </div>
    <div class="stat">
      <strong>${finalizados}</strong>
      <span>Finalizados</span>
    </div>
    <div class="stat">
      <strong>${andamento}</strong>
      <span>Em andamento</span>
    </div>
    <div class="stat">
      <strong>${horas}h</strong>
      <span>Horas jogadas</span>
    </div>
  `;
}

function abrirFormulario(jogo = null) {
  elementos.form.reset();

  if (jogo) {
    elementos.tituloModal.textContent = "Editar jogo";
    elementos.jogoId.value = jogo.id;
    elementos.nome.value = jogo.nome;
    elementos.plataforma.value = jogo.plataforma;
    elementos.genero.value = jogo.genero;
    elementos.status.value = jogo.status;
    elementos.nota.value = jogo.nota ?? "";
    elementos.horas.value = jogo.horas ?? 0;
  } else {
    elementos.tituloModal.textContent = "Adicionar jogo";
    elementos.jogoId.value = "";
    elementos.status.value = "Ainda não comecei";
  }

  elementos.modal.classList.remove("hidden");
  elementos.nome.focus();
}

function fecharFormulario() {
  elementos.modal.classList.add("hidden");
}

async function salvarJogo(evento) {
  evento.preventDefault();

  const dados = {
    nome: elementos.nome.value.trim(),
    plataforma: elementos.plataforma.value,
    genero: elementos.genero.value,
    status: elementos.status.value,
    nota: elementos.nota.value,
    horas: elementos.horas.value
  };

  const id = elementos.jogoId.value;
  const metodo = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/jogos/${id}` : `${API_URL}/jogos`;

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Erro ao salvar jogo.");
    }

    fecharFormulario();
    mostrarMensagem(id ? "Jogo atualizado com sucesso!" : "Jogo adicionado com sucesso!");
    await carregarJogos();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

function abrirEdicao(id) {
  const jogo = jogos.find(item => item.id === id);

  if (jogo) {
    abrirFormulario(jogo);
  }
}

function abrirExclusao(id) {
  const jogo = jogos.find(item => item.id === id);

  if (!jogo) {
    return;
  }

  idParaExcluir = id;
  elementos.nomeExcluir.textContent = jogo.nome;
  elementos.modalExcluir.classList.remove("hidden");
}

function fecharExclusao() {
  idParaExcluir = null;
  elementos.modalExcluir.classList.add("hidden");
}

async function confirmarExclusao() {
  if (!idParaExcluir) {
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/jogos/${idParaExcluir}`, {
      method: "DELETE"
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Erro ao excluir jogo.");
    }

    fecharExclusao();
    mostrarMensagem("Jogo excluído com sucesso!");
    await carregarJogos();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

function mostrarMensagem(texto, erro = false) {
  elementos.mensagem.textContent = texto;
  elementos.mensagem.classList.remove("hidden", "error");

  if (erro) {
    elementos.mensagem.classList.add("error");
  }

  setTimeout(() => {
    elementos.mensagem.classList.add("hidden");
  }, 4000);
}

function escaparHTML(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.abrirEdicao = abrirEdicao;
window.abrirExclusao = abrirExclusao;
