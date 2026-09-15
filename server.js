const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let jogos = [
  {
    id: 1,
    nome: "Elden Ring",
    plataforma: "PC",
    genero: "RPG",
    status: "Finalizado",
    nota: 10,
    horas: 120
  },
  {
    id: 2,
    nome: "Persona 5 Royal",
    plataforma: "PC",
    genero: "JRPG",
    status: "Ainda não comecei",
    nota: null,
    horas: 0
  },
  {
    id: 3,
    nome: "Cult of the Lamb",
    plataforma: "PC",
    genero: "Roguelike",
    status: "Pausado",
    nota: null,
    horas: 15
  }
];

// CREATE
function criarJogo(dados) {
  const novoJogo = {
    id: jogos.length > 0 ? Math.max(...jogos.map(jogo => jogo.id)) + 1 : 1,
    nome: dados.nome,
    plataforma: dados.plataforma,
    genero: dados.genero,
    status: dados.status,
    nota: dados.nota === "" || dados.nota == null ? null : Number(dados.nota),
    horas: dados.horas === "" || dados.horas == null ? 0 : Number(dados.horas)
  };

  jogos.push(novoJogo);
  return novoJogo;
}

// READ
function listarJogos() {
  return jogos;
}

function buscarJogoPorId(id) {
  return jogos.find(jogo => jogo.id === Number(id));
}

// UPDATE
function atualizarJogo(id, dados) {
  const indice = jogos.findIndex(jogo => jogo.id === Number(id));

  if (indice === -1) {
    return null;
  }

  jogos[indice] = {
    ...jogos[indice],
    nome: dados.nome,
    plataforma: dados.plataforma,
    genero: dados.genero,
    status: dados.status,
    nota: dados.nota === "" || dados.nota == null ? null : Number(dados.nota),
    horas: dados.horas === "" || dados.horas == null ? 0 : Number(dados.horas)
  };

  return jogos[indice];
}

// DELETE
function excluirJogo(id) {
  const indice = jogos.findIndex(jogo => jogo.id === Number(id));

  if (indice === -1) {
    return null;
  }

  return jogos.splice(indice, 1)[0];
}

app.get("/api/jogos", (req, res) => {
  res.json(listarJogos());
});

app.get("/api/jogos/:id", (req, res) => {
  const jogo = buscarJogoPorId(req.params.id);

  if (!jogo) {
    return res.status(404).json({ erro: "Jogo não encontrado." });
  }

  res.json(jogo);
});

app.post("/api/jogos", (req, res) => {
  if (!req.body.nome || !req.body.plataforma || !req.body.genero || !req.body.status) {
    return res.status(400).json({
      erro: "Preencha nome, plataforma, gênero e status."
    });
  }

  const novoJogo = criarJogo(req.body);
  res.status(201).json(novoJogo);
});

app.put("/api/jogos/:id", (req, res) => {
  if (!req.body.nome || !req.body.plataforma || !req.body.genero || !req.body.status) {
    return res.status(400).json({
      erro: "Preencha nome, plataforma, gênero e status."
    });
  }

  const jogoAtualizado = atualizarJogo(req.params.id, req.body);

  if (!jogoAtualizado) {
    return res.status(404).json({ erro: "Jogo não encontrado." });
  }

  res.json(jogoAtualizado);
});

app.delete("/api/jogos/:id", (req, res) => {
  const jogoExcluido = excluirJogo(req.params.id);

  if (!jogoExcluido) {
    return res.status(404).json({ erro: "Jogo não encontrado." });
  }

  res.json({
    mensagem: "Jogo excluído com sucesso.",
    jogo: jogoExcluido
  });
});

app.get("/", (req, res) => {
  res.send("GameLog API está funcionando.");
});

app.listen(PORT, () => {
  console.log(`GameLog API rodando em http://localhost:${PORT}`);
});
