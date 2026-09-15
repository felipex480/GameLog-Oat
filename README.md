# 🎮 GameLog - OAT1

Projeto de CRUD desenvolvido para a disciplina de Desenvolvimento de APIs.

## Tema

GameLog é uma biblioteca de jogos que permite:

- **Create:** cadastrar um jogo;
- **Read:** listar e consultar jogos;
- **Update:** editar os dados de um jogo;
- **Delete:** excluir um jogo.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- API REST
- Array como armazenamento

## Estrutura

```text
GameLog/
├── package.json
├── server.js
├── README.md
└── public/
    ├── index.html
    ├── style.css
    └── script.js
```

## Executar localmente

Abra o terminal na pasta do projeto:

```bash
npm install
npm start
```

Depois acesse:

```text
http://localhost:3000
```

## GitHub Pages

O GitHub Pages hospeda somente o Front-End estático. Por isso, o `server.js` precisa ser executado em um serviço que aceite Node.js.

Depois de publicar a API, abra:

```text
public/script.js
```

e altere:

```javascript
const API_URL = "http://localhost:3000/api";
```

para a URL pública da sua API, por exemplo:

```javascript
const API_URL = "https://sua-api.exemplo.com/api";
```

Depois publique o conteúdo da pasta `public` no GitHub Pages.

## Observação sobre o Array

Os dados ficam armazenados somente na memória do servidor. Portanto, se o servidor for reiniciado, os dados voltam para os jogos iniciais definidos em `server.js`.

Isso é intencional para atender ao requisito da atividade de utilizar um **Array como estrutura de armazenamento**.
