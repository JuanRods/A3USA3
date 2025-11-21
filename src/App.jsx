import React, { useEffect, useState } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useParams,
  Outlet,
} from "react-router-dom";

import { useToast } from "./ToastContext.jsx";

// =========================================================
// CONFIG API
// =========================================================
const API_BASE_URL = "http://localhost:3000/api/v1";

// =========================================================
// MAPA DE IMAGENS – VERSÃO ROBUSTA POR NOME
// =========================================================

// 1) Função utilitária para normalizar nomes
function normalizeName(str) {
  if (!str) return "";
  return str
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-zA-Z0-9]+/g, " ") // tudo que não é letra/número vira espaço
    .trim()
    .toLowerCase();
}

// =========================================================
// MAPA DE IDS POR NOME (com base no CSV que você descreveu)
// =========================================================
const ID_POR_NOME = {
  "The Witcher 3: Wild Hunt": 1,
  "Grand Theft Auto V": 2,
  "Red Dead Redemption 2": 3,
  "The Legend of Zelda: Breath of the Wild": 4,
  Minecraft: 5,
  "Stardew Valley": 6,
  "Portal 2": 7,
  "Half-Life: Alyx": 8,
  "Cyberpunk 2077": 9,
  "Among Us": 10,
  "A Lenda do Herói": 11,
  "Enigma do Medo": 12,
  "Horizon Zero Dawn": 13,
  Bloodborne: 14,
  "Call of Duty: Modern Warfare": 15,
  "Sekiro: Shadows Die Twice": 16,
  "The Elder Scrolls V: Skyrim": 17,
  "Fallout 4": 18,
  "Resident Evil 7: Biohazard": 19,
  "Monster Hunter: World": 20,
  "Persona 5 Royal": 21,
  "Yakuza: Like a Dragon": 22,
};

// 2) Mapa bruto das imagens (nome "bonitinho") - SÓ LOCAL
const RAW_IMAGENS_POR_NOME = {
  "The Witcher 3: Wild Hunt": [
    "/img/witcher3.jpg",
    "/img/witcher3-2.jpg",
    "/img/witcher3-3.jpg",
    "/img/witcher3-4.jpg",
  ],

  "Grand Theft Auto V": [
    "/img/gta5.jpg",
    "/img/gta5-2.jpg",
    "/img/gta5-3.jpg",
    "/img/gta5-4.jpg",
  ],

  "Red Dead Redemption 2": [
    "/img/red-dead2.jpg",
    "/img/red-dead2-2.jpg",
    "/img/red-dead2-3.jpg",
    "/img/red-dead2-4.jpg",
  ],

  "The Legend of Zelda: Breath of the Wild": [
    "/img/zelda.jpg",
    "/img/zelda-1.jpg",
    "/img/zelda-2.jpg",
    "/img/zelda-3.jpg",
  ],

  Minecraft: [
    "/img/minecraft.jpg",
    "/img/minecraft-2.jpg",
    "/img/minecraft-3.jpg",
    "/img/minecraft-4.jpg",
  ],

  "Stardew Valley": [
    "/img/stardew.jpg",
    "/img/stardew-2.jpg",
    "/img/stardew-3.jpg",
    "/img/stardew-4.jpg",
  ],

  "Portal 2": [
    "/img/portal2.jpg",
    "/img/portal2-2.jpg",
    "/img/portal2-3.jpg",
    "/img/portal2-4.jpg",
  ],

  "Half-Life: Alyx": [
    "/img/half-life-alyx.jpg",
    "/img/half-life-alyx-2.jpg",
    "/img/half-life-alyx-3.jpg",
    "/img/half-life-alyx-4.jpg",
  ],

  "Cyberpunk 2077": [
    "/img/cyberpunk.jpg",
    "/img/cyberpunk-2.jpg",
    "/img/cyberpunk-3.jpg",
    "/img/cyberpunk-4.jpg",
  ],

  "Among Us": [
    "/img/among-us.jpg",
    "/img/among-us-2.jpg",
    "/img/among-us-3.jpg",
    "/img/among-us-4.jpg",
  ],

  "A Lenda do Herói": [
    "/img/a-lenda-do-heroi.jpg",
    "/img/a-lenda-do-heroi-2.jpg",
    "/img/a-lenda-do-heroi-3.jpg",
    "/img/a-lenda-do-heroi-4.jpg",
  ],

  "Enigma do Medo": [
    "/img/enigma-do-medo.jpg",
    "/img/enigma-do-medo-2.jpg",
    "/img/enigma-do-medo-3.jpg",
    "/img/enigma-do-medo-4.jpg",
  ],

  "Horizon Zero Dawn": [
    "/img/horizon.jpg",
    "/img/horizon-2.jpg",
    "/img/horizon-3.jpg",
    "/img/horizon-4.jpg",
  ],

  Bloodborne: [
    "/img/bloodborne.jpg",
    "/img/bloodborne-2.jpg",
    "/img/bloodborne-3.jpg",
    "/img/bloodborne-4.jpg",
  ],

  "Call of Duty: Modern Warfare": [
    "/img/cod-mw.jpg",
    "/img/cod-mw-2.jpg",
    "/img/cod-mw-3.jpg",
    "/img/cod-mw-4.jpg",
  ],

  "Sekiro: Shadows Die Twice": [
    "/img/sekiro.jpg",
    "/img/sekiro-2.jpg",
    "/img/sekiro-3.jpg",
    "/img/sekiro-4.jpg",
  ],

  "The Elder Scrolls V: Skyrim": [
    "/img/skyrim.jpg",
    "/img/skyrim-2.jpg",
    "/img/skyrim-3.jpg",
    "/img/skyrim-4.jpg",
  ],

  "Fallout 4": [
    "/img/fallout4.jpg",
    "/img/fallout4-2.jpg",
    "/img/fallout4-3.jpg",
    "/img/fallout4-4.jpg",
  ],

  "Resident Evil 7: Biohazard": [
    "/img/re7.jpg",
    "/img/re7-2.jpg",
    "/img/re7-3.jpg",
    "/img/re7-4.jpg",
  ],

  "Monster Hunter: World": [
    "/img/monster-hunter-world.jpg",
    "/img/monster-hunter-world-2.jpg",
    "/img/monster-hunter-world-3.jpg",
    "/img/monster-hunter-world-4.jpg",
  ],

  "Persona 5 Royal": [
    "/img/persona5.jpg",
    "/img/persona5-2.jpg",
    "/img/persona5-3.jpg",
    "/img/persona5-4.jpg",
  ],

  "Yakuza: Like a Dragon": [
    "/img/yakuza-like-a-dragon.jpg",
    "/img/yakuza-like-a-dragon-2.jpg",
    "/img/yakuza-like-a-dragon-3.jpg",
    "/img/yakuza-like-a-dragon-4.jpg",
  ],
};

// 3) Mapa com chave normalizada
const IMAGENS_POR_NOME_NORMALIZADO = {};
Object.entries(RAW_IMAGENS_POR_NOME).forEach(([nome, imgs]) => {
  IMAGENS_POR_NOME_NORMALIZADO[normalizeName(nome)] = imgs;
});

// 4) Helper: garante imagens locais em qualquer jogo
function withLocalImages(jogo) {
  if (!jogo) return jogo;

  const nomeOriginal = jogo.nome || "";
  const chave = normalizeName(nomeOriginal);

  const imgs = IMAGENS_POR_NOME_NORMALIZADO[chave];

  if (imgs && imgs.length) {
    return {
      ...jogo,
      imagens: imgs,
    };
  }

  // fallback: se o jogo já tiver imagens do backend, usa
  if (Array.isArray(jogo.imagens) && jogo.imagens.length > 0) {
    return jogo;
  }

  // fallback final: placeholder
  return {
    ...jogo,
    imagens: ["/img/placeholder.jpg"],
  };
}

// Componente para lidar com fallback entre várias imagens
function GameCardImage({ jogo }) {
  const [imgIndex, setImgIndex] = React.useState(0);

  const temImagens = Array.isArray(jogo.imagens) && jogo.imagens.length > 0;
  const srcAtual = temImagens ? jogo.imagens[imgIndex] : "/img/placeholder.jpg";

  return (
    <img
      src={srcAtual}
      alt={jogo.nome}
      onError={(e) => {
        // tenta próxima imagem se existir
        if (temImagens && imgIndex < jogo.imagens.length - 1) {
          setImgIndex((prev) => prev + 1);
        } else {
          // última tentativa → placeholder
          e.target.src = "/img/placeholder.jpg";
        }
      }}
      style={{
        width: "100%",
        height: "140px",
        objectFit: "cover",
        display: "block",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    />
  );
}

// =========================================================
// HOOK PARA CARREGAR CSS POR PÁGINA
// =========================================================
function usePageCss(files) {
  useEffect(() => {
    const links = files.map((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach((link) => {
        if (link.parentNode) link.parentNode.removeChild(link);
      });
    };
  }, [files.join("|")]);
}

// =========================================================
// FUNÇÕES AUXÍLIO AUTH
// =========================================================
function getAuthToken() {
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
}

function getLoggedUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    const role = user.perfil === "Administrador" ? "admin" : "user";
    return { ...user, role };
  } catch {
    return null;
  }
}

function setLoggedUser(user, token) {
  if (!user) {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  } else {
    localStorage.setItem("user", JSON.stringify(user));
    if (token) {
      localStorage.setItem("authToken", token);
    }
  }
}

async function fetchWithAuth(path, options = {}) {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    console.warn("⚠️ 401 Unauthorized em", path);
  }

  return res;
}

// =========================================================
/* PROTEÇÃO DE ROTA */
// =========================================================
function ProtectedRoute({ children, role }) {
  const logged = getLoggedUser();

  if (!logged) {
    return <Navigate to="/login" replace />;
  }

  if (role && logged.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// =========================================================
/* LAYOUTS COMUNS */
// =========================================================
function Sidebar() {
  usePageCss(["/css/layout.css"]);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    setLoggedUser(null);
    showToast("Você saiu da sua conta.", "info");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <img src="/img/chaos-icon.jpg" alt="Logo" className="logo-icon" />
      </div>

      <nav>
        <ul>
          <li>
            <Link to="/dashboard">
              <i className="fa-solid fa-house"></i>
              <span>Início</span>
            </Link>
          </li>
          <li>
            <Link to="/explorar">
              <i className="fa-solid fa-compass"></i>
              <span>Explorar</span>
            </Link>
          </li>
          <li>
            <Link to="/ranking">
              <i className="fa-solid fa-ranking-star"></i>
              <span>Ranking dos Melhores</span>
            </Link>
          </li>
          <li>
            <Link to="/perfil">
              <i className="fa-solid fa-gear"></i>
              <span>Configurações</span>
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={handleLogout}
              style={{ all: "unset", cursor: "pointer" }}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Sair</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

// Header integrado com Dashboard (usa props se vierem)
function HeaderWithSearch({ searchText, onSearchChange }) {
  usePageCss(["/css/layout.css", "/css/dashboard.css"]);
  const navigate = useNavigate();

  const value = searchText ?? "";
  const handleChange = onSearchChange || (() => {});

  return (
    <header>
      <div className="logo">TOK-STORE</div>

      <div className="search-container">
        <input
          type="text"
          id="busca"
          placeholder="Pesquise seu jogo aqui"
          value={value}
          onChange={handleChange}
        />
        <button className="search-btn" id="search-btn">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      <section className="nav-in-the-box">
        <nav>
          <button onClick={() => navigate("/wishlist")}>Lista de Desejos</button>
          <button onClick={() => navigate("/carrinho")}>
            <i className="fa-solid fa-cart-shopping"></i> Carrinho
          </button>
          <button onClick={() => navigate("/perfil")} id="person">
            <i className="fa-solid fa-user"></i>
          </button>
        </nav>
      </section>
    </header>
  );
}

function FooterDefault() {
  usePageCss(["/css/layout.css"]);
  return (
    <footer>
      <div>
        <strong>Tok-Story</strong>
        <br />
        Descriptive line about what your company does.
        <br />
        <a href="#">Instagram</a>
        <a href="#">LinkedIn</a>
      </div>
      <div>
        <strong>Support</strong>
        <br />
        <a href="#">Contact</a>
        <br />
        <a href="#">Support</a>
        <br />
        <a href="#">Legal</a>
      </div>
    </footer>
  );
}

// =========================================================
/* CHATBOT GLOBAL (mantido, só usa /chat) */
// =========================================================
function Chatbot() {
  usePageCss(["/css/chat.css"]);
  const [isOpen, setIsOpen] = useState(false);
  const [filtros, setFiltros] = useState({});
  const [caminho, setCaminho] = useState(["start"]);
  const [estadoAtual, setEstadoAtual] = useState("start");
  const [resultadoHtml, setResultadoHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const fluxo = {
    start: {
      pergunta: "👋 Vamos achar um jogo pra você.\nPor onde quer começar?",
      opcoes: [
        { label: "Já sei o gênero", next: "genero" },
        { label: "Não sei, me guia", next: "humor" },
      ],
    },
    genero: {
      pergunta: "🎮 Escolha um gênero principal:",
      opcoes: [
        { label: "Ação", value: "ação", next: "plataforma" },
        { label: "Tiro / Shooter", value: "shooter", next: "plataforma" },
        { label: "RPG", value: "rpg", next: "plataforma" },
        { label: "Aventura", value: "aventura", next: "plataforma" },
        { label: "Estratégia", value: "estratégia", next: "plataforma" },
        { label: "Arcade / Plataforma", value: "arcade", next: "plataforma" },
        { label: "Terror", value: "terror", next: "plataforma" },
        { label: "Indie", value: "indie", next: "plataforma" },
        { label: "Outro (digitar)", next: "genero_digitado" },
      ],
    },
    genero_digitado: {
      pergunta:
        "Digite o gênero ou estilos que você curte (ex: 'soulslike, corrida, esportes'):",
      input: "genero",
      next: "plataforma",
    },
    humor: {
      pergunta: "Que tipo de experiência você quer agora?",
      opcoes: [
        {
          label: "Relaxar / casual",
          value: "jogo leve e relaxante para familia",
          next: "plataforma",
        },
        {
          label: "História forte",
          value: "história forte e narrativa emocionante",
          next: "plataforma",
        },
        {
          label: "Competitivo",
          value: "competitivo e pvp online",
          next: "plataforma",
        },
        {
          label: "Co-op com amigos",
          value: "multiplayer co-op com amigos",
          next: "plataforma",
        },
        {
          label: "Assustador / terror",
          value: "terror assustador com zumbi",
          next: "plataforma",
        },
        {
          label: "Quebrar a cabeça",
          value: "puzzle com quebra-cabeca e enigma",
          next: "plataforma",
        },
      ],
    },
    plataforma: {
      pergunta: "📦 Em qual plataforma você quer jogar?",
      opcoes: [
        { label: "PC", value: "pc", next: "ano" },
        { label: "PlayStation", value: "playstation", next: "ano" },
        { label: "Xbox", value: "xbox", next: "ano" },
        { label: "Nintendo", value: "nintendo", next: "ano" },
        { label: "Mobile (Android / iOS)", value: "mobile", next: "ano" },
        { label: "Qualquer uma", value: "qualquer", next: "ano" },
      ],
    },
    ano: {
      pergunta: "📅 E em relação ao ano de lançamento?",
      opcoes: [
        { label: "Mais recentes (últimos anos)", value: "recentes", next: "nota" },
        { label: "Antes de 2015", value: "antes2015", next: "nota" },
        { label: "Antes de 2010", value: "antes2010", next: "nota" },
        { label: "Ano específico", next: "ano_digitado" },
        { label: "Tanto faz", value: "qualquer", next: "nota" },
      ],
    },
    ano_digitado: {
      pergunta: "Digite o ano desejado (ex: 2018):",
      input: "ano",
      next: "nota",
    },
    nota: {
      pergunta: "⭐ Quer definir uma nota mínima?",
      opcoes: [
        { label: "4.0 ou mais", value: "4.0", next: "faixa" },
        { label: "3.5 ou mais", value: "3.5", next: "faixa" },
        { label: "3.0 ou mais", value: "3.0", next: "faixa" },
        { label: "Não, tanto faz", value: "qualquer", next: "faixa" },
      ],
    },
    faixa: {
      pergunta: "🔞 Tem alguma restrição de faixa etária?",
      opcoes: [
        { label: "Qualquer", value: "qualquer", next: "tags" },
        { label: "Livre / família", value: "LIVRE", next: "tags" },
        { label: "+10", value: "+10", next: "tags" },
        { label: "+13", value: "+13", next: "tags" },
        { label: "+17", value: "+17", next: "tags" },
      ],
    },
    tags: {
      pergunta: "Quer adicionar alguma característica extra?",
      opcoes: [
        { label: "Não, pode seguir", value: "nenhuma", next: "confirmacao" },
        {
          label: "Mundo aberto",
          value: "mundo aberto exploracao aventura",
          next: "confirmacao",
        },
        {
          label: "Zumbis / Terror",
          value: "terror zumbi horror",
          next: "confirmacao",
        },
        {
          label: "Co-op / Multiplayer",
          value: "multiplayer co-op cooperativo online",
          next: "confirmacao",
        },
        {
          label: "Competitivo / PvP",
          value: "competitivo ranked pvp",
          next: "confirmacao",
        },
        {
          label: "Fantasia / Medieval",
          value: "fantasia medieval magia dragao",
          next: "confirmacao",
        },
        {
          label: "Puzzle / Quebra-cabeça",
          value: "puzzle quebra-cabeca enigma",
          next: "confirmacao",
        },
        {
          label: "Família / Casual",
          value: "familia leve relaxante kids",
          next: "confirmacao",
        },
        {
          label: "Indie / Alternativo",
          value: "indie pixel 2d metroidvania",
          next: "confirmacao",
        },
      ],
    },
    confirmacao: {
      pergunta: (f) => `
Confira o que você escolheu:<br><br>
🎮 Estilo / gênero: <b>${f.genero || f.humor || "não definido"}</b><br>
🖥 Plataforma: <b>${f.plataforma || "qualquer"}</b><br>
📅 Ano: <b>${f.ano || "qualquer"}</b><br>
⭐ Nota mínima: <b>${f.nota || "sem filtro"}</b><br>
🔞 Faixa etária: <b>${f.faixa || "qualquer"}</b><br>
🏷 Extras: <b>${f.tags || "nenhum"}</b><br><br>
Posso buscar jogos com base nisso?`,
      opcoes: [
        { label: "Sim, buscar jogos", next: "buscar" },
        { label: "Quero refazer os filtros", next: "start" },
      ],
    },
    buscar: {
      acao: "buscar",
    },
  };

  const node = fluxo[estadoAtual];

  function salvarValor(id, valor) {
    setFiltros((prev) => {
      const novo = { ...prev };
      if (id === "genero" || id === "genero_digitado") novo.genero = valor;
      if (id === "humor") novo.humor = valor;
      if (id === "plataforma") novo.plataforma = valor;
      if (id === "faixa") novo.faixa = valor;
      if (id === "nota") novo.nota = valor;
      if (id === "ano" || id === "ano_digitado") novo.ano = valor;
      if (id === "tags") novo.tags = valor;
      return novo;
    });
  }

  function irPara(next) {
    setResultadoHtml("");
    setLoading(false);
    setCaminho((prev) =>
      prev[prev.length - 1] === next ? prev : [...prev, next]
    );
    setEstadoAtual(next);
  }

  function voltar() {
    setResultadoHtml("");
    setLoading(false);
    setCaminho((prev) => {
      const novo = [...prev];
      novo.pop();
      const anterior = novo.pop() || "start";
      setEstadoAtual(anterior);
      return [anterior];
    });
  }

  function resetFiltros() {
    setFiltros({});
    setCaminho(["start"]);
    setEstadoAtual("start");
    setResultadoHtml("");
    setLoading(false);
    setInputValue("");
  }

  async function buscarJogos() {
    setLoading(true);
    setResultadoHtml("");

    const blocoTags = `
[GENERO=${filtros.genero || "qualquer"}]
[HUMOR=${filtros.humor || "qualquer"}]
[PLATAFORMA=${filtros.plataforma || "qualquer"}]
[FAIXA=${filtros.faixa || "qualquer"}]
[NOTA=${filtros.nota || "qualquer"}]
[ANO=${filtros.ano || "qualquer"}]
[TAGS=${filtros.tags || "nenhuma"}]
`.trim();

    const fraseNatural = `
Quero jogos do gênero ${filtros.genero || filtros.humor || "qualquer"} 
para jogar em ${filtros.plataforma || "qualquer plataforma"}, 
com nota mínima ${filtros.nota || "sem filtro"},
faixa etária ${filtros.faixa || "qualquer"},
ano ${filtros.ano || "qualquer"},
com essas características extras: ${filtros.tags || "nenhuma"}.
    `.trim();

    const mensagem = blocoTags + "\n\n" + fraseNatural;

    try {
      const resp = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem }),
      });

      if (!resp.ok) {
        setResultadoHtml(
          "❌ Erro ao buscar jogos no servidor.<br><br>Tente novamente em alguns instantes."
        );
        setLoading(false);
        return;
      }

      const data = await resp.json();
      let jogos = data.resposta || [];
      let intro = "";

      if (jogos[0]?.intro) {
        intro = jogos[0].intro;
        jogos = jogos.slice(1);
      }

      if (!Array.isArray(jogos) || jogos.length === 0) {
        setResultadoHtml(
          (intro || "⚠ Não encontramos jogos com esses filtros.") +
            "<br><br>Tente mudar gênero, plataforma ou ano para ampliar a busca."
        );
        setLoading(false);
        return;
      }

      let html = `
        <div style="margin-bottom: 12px; white-space: pre-line;">
          ${intro || "🎮 Aqui estão algumas recomendações para você:"}
        </div>
        <ul style="list-style:none; padding:0; margin:0;">
      `;

      jogos.forEach((j) => {
        html += `
          <li style="margin-bottom:14px; border-bottom:1px solid #1b2838; padding-bottom:10px;">
            <div style="font-weight:bold; font-size:14px;">
              ${j.nome} <span style="color:#66c0f4;">(${
          j.genero || "Gênero não informado"
        })</span>
            </div>

            <small>
              <b>Ano:</b> ${j.ano || "—"} • 
              <b>Plataforma:</b> ${j.plataforma || "—"}
            </small><br>
            <small><b>Publisher:</b> ${j.publisher || "—"}</small><br>
            <small><b>Nota:</b> ⭐ ${
              j.nota?.toFixed ? j.nota.toFixed(1) : j.nota || "N/A"
            }</small><br>
            <small><b>Faixa etária:</b> ${j.faixa_etaria || "N/A"}</small><br>
            <small style="color:#bbb; display:block; margin-top:4px;">
              <b>Descrição:</b> ${
                j.descricao || "Sem descrição disponível."
              }
            </small>
          </li>
        `;
      });

      html += `</ul>`;
      setResultadoHtml(html);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao chamar /chat:", err);
      setResultadoHtml(
        "❌ Ocorreu um erro ao conectar ao servidor.<br><br>Tente novamente mais tarde."
      );
      setLoading(false);
    }
  }

  useEffect(() => {
    if (estadoAtual === "buscar") {
      buscarJogos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoAtual]);

  const pergunta =
    node && node.pergunta
      ? typeof node.pergunta === "function"
        ? node.pergunta(filtros)
        : node.pergunta
      : "";

  function handleEnviarTexto() {
    const txt = inputValue.trim();
    if (!txt) return;
    if (!node || !node.input) return;

    setFiltros((prev) => ({ ...prev, [node.input]: txt }));
    setInputValue("");
    irPara(node.next);
  }

  return (
    <>
      <div
        id="chatbot-btn"
        title="Falar com o assistente"
        onClick={() => setIsOpen((o) => !o)}
      >
        <i className="fa-solid fa-robot"></i>
      </div>

      <div
        id="chatbot-box"
        className={isOpen ? "" : "hidden"}
        aria-hidden={isOpen ? "false" : "true"}
      >
        <div className="chat-header">Assistente Tok-Store</div>

        <div className="chat-body" id="chat-body">
          {estadoAtual === "buscar" ? (
            <>
              {loading ? (
                <p className="bot">
                  🔍 Buscando jogos compatíveis com as suas escolhas...
                </p>
              ) : (
                <p
                  className="bot"
                  dangerouslySetInnerHTML={{ __html: resultadoHtml }}
                ></p>
              )}
              <button className="option-btn reset" onClick={resetFiltros}>
                🔄 Reiniciar recomendação
              </button>
            </>
          ) : (
            <>
              <p
                className="bot"
                dangerouslySetInnerHTML={{
                  __html: pergunta.replace(/\n/g, "<br/>"),
                }}
              ></p>

              {node?.opcoes &&
                node.opcoes.map((op, idx) => (
                  <button
                    key={idx}
                    className="option-btn"
                    onClick={() => {
                      if (op.value) salvarValor(estadoAtual, op.value);
                      irPara(op.next);
                    }}
                  >
                    ➡ {op.label}
                  </button>
                ))}

              {estadoAtual !== "start" && (
                <button className="option-btn back" onClick={voltar}>
                  ⬅ Voltar
                </button>
              )}
            </>
          )}
        </div>

        <div className="chat-input">
          <input
            id="chat-input"
            placeholder="Digite sua mensagem..."
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEnviarTexto();
            }}
          />
          <button id="send-btn" onClick={handleEnviarTexto}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </>
  );
}

// =========================================================
/* LOGIN PAGE */
// =========================================================
function LoginPage() {
  usePageCss(["/css/login.css"]);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeForm, setActiveForm] = useState("login");

  // LOGIN
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // REGISTER
  const [regNome, setRegNome] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // FORGOT
  const [forgotEmail, setForgotEmail] = useState("");

  function showForm(formId) {
    setActiveForm(formId);
  }

  function decodeTokenPayload(token) {
    try {
      const base64Payload = token.split(".")[1];
      const payload = JSON.parse(atob(base64Payload));
      return payload;
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      return null;
    }
  }

  async function handleLogin() {
    const email = loginEmail.trim();
    const senha = loginPassword.trim();

    if (!email || !senha) {
      showToast("Preencha todos os campos!", "error");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Erro ao fazer login.", "error");
        return;
      }

      const { token } = data;

      if (!token) {
        showToast("Token não recebido do servidor.", "error");
        return;
      }

      const payload = decodeTokenPayload(token);

      if (!payload) {
        showToast("Erro ao processar dados do usuário.", "error");
        return;
      }

      const userData = {
        id: payload.id,
        nome: payload.nome,
        perfil: payload.perfil,
        email,
      };

      setLoggedUser(userData, token);

      showToast(`Bem-vindo de volta, ${payload.nome || email}!`, "success");

      if (payload.perfil === "Administrador") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      showToast("Erro de conexão com o servidor.", "error");
    }
  }

  async function handleRegister() {
    const nome = regNome.trim();
    const email = regEmail.trim();
    const senha = regPassword.trim();

    if (!nome || !email || !senha) {
      showToast("Preencha todos os campos!", "error");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Erro ao criar conta.", "error");
        return;
      }

      showToast(data.message || "Conta criada com sucesso!", "success");

      showForm("login");
      setLoginEmail(email);
      setRegPassword("");
    } catch (error) {
      console.error("Erro no registro:", error);
      showToast("Erro de conexão com o servidor.", "error");
    }
  }

  function handleForgot() {
    const email = forgotEmail.trim();
    if (!email) {
      showToast("Digite seu e-mail!", "error");
      return;
    }

    showToast(
      "Link de redefinição enviado para o e-mail (simulação).",
      "info"
    );
    showForm("login");
  }

  return (
    <>
      <header>
        <div className="logo">TOK-STORE</div>
      </header>

      <main>
        <div className="login-container">
          <img src="/img/Tok-Store-icon.jpg" alt="Avatar" />

          <div
            className={`form ${activeForm === "login" ? "active" : ""}`}
            id="login-form"
          >
            <h2>Entrar</h2>
            <input
              type="email"
              id="login-email"
              placeholder="E-MAIL"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              id="login-password"
              placeholder="SENHA"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button className="login-btn" onClick={handleLogin}>
              Entrar
            </button>

            <div className="links">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  showForm("forgot");
                }}
              >
                Esqueci a senha
              </a>{" "}
              |
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  showForm("register");
                }}
              >
                Criar conta
              </a>
            </div>
          </div>

          <div
            className={`form ${activeForm === "register" ? "active" : ""}`}
            id="register-form"
          >
            <h2>Criar Conta</h2>
            <input
              type="text"
              id="register-nome"
              placeholder="NOME"
              value={regNome}
              onChange={(e) => setRegNome(e.target.value)}
            />
            <input
              type="email"
              id="register-email"
              placeholder="E-MAIL"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
            <input
              type="password"
              id="register-password"
              placeholder="SENHA"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />
            <button className="login-btn" onClick={handleRegister}>
              Registrar
            </button>

            <div className="links">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  showForm("login");
                }}
              >
                Voltar ao login
              </a>
            </div>
          </div>

          <div
            className={`form ${activeForm === "forgot" ? "active" : ""}`}
            id="forgot-form"
          >
            <h2>Redefinir Senha</h2>
            <input
              type="email"
              id="forgot-email"
              placeholder="E-MAIL"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            <button className="login-btn" onClick={handleForgot}>
              Enviar redefinição
            </button>

            <div className="links">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  showForm("login");
                }}
              >
                Voltar ao login
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="column">
          <strong>Tok-Store</strong>
          <p>Explore, compre e jogue — o futuro dos games digitais.</p>
          <div className="social-icons">
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">X</a>
          </div>
        </div>

        <div className="column">
          <h4>Explorar</h4>
          <a href="#">Lançamentos</a>
          <a href="#">Ranking</a>
          <a href="#">Categorias</a>
        </div>

        <div className="column">
          <h4>Suporte</h4>
          <a href="#">Contato</a>
          <a href="#">Ajuda</a>
          <a href="#">Política</a>
        </div>
      </footer>
    </>
  );
}

// =========================================================
/* DASHBOARD */
// =========================================================
function DashboardPage() {
  usePageCss(["/css/layout.css", "/css/dashboard.css"]);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState("Todos");
  const [searchText, setSearchText] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconesPorCategoria = {
    "Ação": "fa-gun",
    "RPG": "fa-hat-wizard",
    "Aventura": "fa-mountain-sun",
    "Estratégia": "fa-chess-board",
    "Terror": "fa-ghost",
    "Indie": "fa-puzzle-piece",
    "FPS": "fa-bullseye",
    "Exploração": "fa-compass",
    "Futurista": "fa-robot",
    "Mundo Aberto": "fa-earth-americas",
    "Desafio": "fa-fire"
  };


  // ======================================================
  // 🔥 CARREGAR JOGOS DA API /public/jogos
  // ======================================================
  useEffect(() => {
    async function carregarJogos() {
      try {
        const resp = await fetch(`${API_BASE_URL}/public/jogos`);
        if (!resp.ok) {
          showToast("Erro ao carregar jogos do servidor.", "error");
          setLoading(false);
          return;
        }

        const data = await resp.json();
        const lista = Array.isArray(data) ? data : [];

        const listaComImagens = lista.map((jogoOriginal, idx) => {
          const transformado = withLocalImages(jogoOriginal) || {};

          const idDoBack =
            jogoOriginal.id ??
            jogoOriginal.ID ??
            jogoOriginal.id_jogo ??
            jogoOriginal.jogoId ??
            ID_POR_NOME[jogoOriginal.nome?.trim()] ??
            null;

          const idFinal = idDoBack ?? idx + 1;

          return {
            ...jogoOriginal,
            ...transformado,
            id: idFinal,
          };
        });

        console.log(
          "Jogos carregados do backend + imagens:",
          listaComImagens.map((j) => ({
            id: j.id,
            nome: j.nome,
            imagens: j.imagens,
          }))
        );

        setJogos(listaComImagens);
      } catch (err) {
        console.error(err);
        showToast("Erro de conexão ao carregar jogos.", "error");
      } finally {
        setLoading(false);
      }
    }

    carregarJogos();
  }, [showToast]);

  // ======================================================
  // 🔎 FUNÇÃO AUXILIAR: descobrir ID do jogo no servidor
  // ======================================================
  async function resolverJogoIdNoServidor(jogo) {
    try {
      // 1) Se o jogo já tiver id, usa direto
      if (jogo?.id) {
        console.log("ID do próprio objeto jogo:", jogo.nome, "→", jogo.id);
        return jogo.id;
      }

      // 2) Sem nome, nem tenta
      if (!jogo?.nome) {
        showToast("Não foi possível identificar esse jogo (sem nome).", "error");
        return null;
      }

      // 3) Tenta achar o jogo dentro do state `jogos`
      const nomeAlvo = normalizeName(jogo.nome);

      const local = jogos.find(
        (j) => normalizeName(j.nome) === nomeAlvo && j.id
      );

      if (local?.id) {
        console.log("ID obtido via state jogos:", jogo.nome, "→", local.id);
        return local.id;
      }

      // 4) Tenta pelo mapa fixo de IDs
      const idMapa = ID_POR_NOME[jogo.nome.trim()];
      if (idMapa) {
        console.log("ID obtido pelo mapa fixo:", jogo.nome, "→", idMapa);
        return idMapa;
      }

      console.log("Resolvendo ID via /public/jogos:", jogo.nome);

      // 5) Fallback final: pega de novo a lista do servidor e descobre pela posição
      const resp = await fetch(`${API_BASE_URL}/public/jogos`);
      if (!resp.ok) {
        showToast("Não foi possível buscar o jogo no servidor.", "error");
        return null;
      }

      const data = await resp.json();
      const lista = Array.isArray(data) ? data : [];

      const idx = lista.findIndex(
        (j) => normalizeName(j.nome) === nomeAlvo
      );

      if (idx === -1) {
        showToast("Jogo não encontrado no servidor para adicionar.", "error");
        return null;
      }

      const jogoId = idx + 1;
      console.log(
        "ID inferido pela posição em /public/jogos:",
        jogo.nome,
        "→ index",
        idx,
        "→ id",
        jogoId
      );

      return jogoId;
    } catch (err) {
      console.error(err);
      showToast("Erro ao localizar jogo no servidor.", "error");
      return null;
    }
  }

  // ======================================================
  // ❤️ FAVORITOS (BANCO) — /lista-desejo
  // ======================================================
  async function adicionarFavorito(jogo) {
    try {
      const jogoId = jogo.id || (await resolverJogoIdNoServidor(jogo));
      if (!jogoId) return;

      console.log("Wishlist → enviando:", jogo.nome, "→ jogoId:", jogoId);

      const resp = await fetchWithAuth("/lista-desejo", {
        method: "POST",
        body: JSON.stringify({ jogoId }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        console.warn("Erro ao adicionar wishlist:", resp.status, err);
        showToast(
          err.message || "Erro ao adicionar jogo à lista de desejos.",
          "error"
        );
        return;
      }

      showToast(`${jogo.nome} foi adicionado à wishlist.`, "success");
    } catch (err) {
      console.error(err);
      showToast("Erro de conexão ao salvar na wishlist.", "error");
    }
  }

  // ======================================================
  // 🛒 CARRINHO (BANCO) — /carrinho/add
  // ======================================================
  async function comprarJogo(jogo) {
    try {
      const jogoId = jogo.id || (await resolverJogoIdNoServidor(jogo));
      if (!jogoId) return;

      console.log("Carrinho → enviando para /carrinho/add:", {
        jogoId,
        nome: jogo.nome,
      });

      const resp = await fetchWithAuth("/carrinho/add", {
        method: "POST",
        body: JSON.stringify({ jogoId }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        console.warn("Erro ao adicionar carrinho:", resp.status, err);
        showToast(err.message || "Erro ao adicionar ao carrinho.", "error");
        return;
      }

      showToast("Jogo adicionado ao carrinho!", "success");
    } catch (err) {
      console.error(err);
      showToast("Erro de conexão ao adicionar ao carrinho.", "error");
    }
  }

  // ======================================================
  // 🎯 FILTROS (categoria + busca)
  // ======================================================
  const categoriasUnicas = [
    "Todos",
    ...Array.from(new Set(jogos.map((j) => j.categoria || "Outros"))),
  ];

  const jogosFiltrados = jogos.filter((j) => {
    let ok = true;

    if (categoriaSelecionada !== "Todos")
      ok = ok && (j.categoria || "").includes(categoriaSelecionada);

    if (searchText.trim())
      ok =
        ok &&
        j.nome.toLowerCase().includes(searchText.toLowerCase());

    return ok;
  });

  // ======================================================
  // 🖼 Banners
  // ======================================================
  const banners = [
    {
      titulo: "The Witcher 3: Wild Hunt",
      texto: "Explore um mundo vasto e sombrio, cheio de monstros e aventuras.",
      id: "banner1",
    },
    {
      titulo: "The Legend of Zelda: Breath of the Wild",
      texto: "Descubra os segredos de um reino mágico em um mundo aberto.",
      id: "banner2",
    },
    {
      titulo: "Red Dead Redemption 2",
      texto: "Viva a vida de um fora da lei no Velho Oeste.",
      id: "banner3",
    },
  ];

  function prevBanner() {
    setCarouselIndex((i) => (i - 1 + banners.length) % banners.length);
  }

  function nextBanner() {
    setCarouselIndex((i) => (i + 1) % banners.length);
  }

  // ======================================================
  // RENDERIZAÇÃO
  // ======================================================
  return (
    <div className="main-content">
      <HeaderWithSearch
        searchText={searchText}
        onSearchChange={(e) => setSearchText(e.target.value)}
      />

      <Sidebar />

      {/* ===================== CARROSSEL ===================== */}
      <section className="carousel-container" aria-label="Destaques">
        <div
          className="carousel-slide"
          style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
        >
          {banners.map((b) => (
            <div className="carousel-item" id={b.id} key={b.id}>
              <div className="banner-content">
                <h2>{b.titulo}</h2>
                <p>{b.texto}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-btn prev-btn" onClick={prevBanner}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button className="carousel-btn next-btn" onClick={nextBanner}>
          <i className="fa-solid fa-chevron-right"></i>
        </button>

        <div className="nav-dots">
          {banners.map((b, idx) => (
            <span
              key={b.id + "-dot"}
              className={idx === carouselIndex ? "active" : ""}
              onClick={() => setCarouselIndex(idx)}
            ></span>
          ))}
        </div>
      </section>

      {/* ===================== CATÁLOGO ===================== */}
      <main className="store">
        <div className="filter-wrapper">
          <button id="toggle-genres">
            <i className="fa-solid fa-filter"></i> Filtros
          </button>
        </div>

        {/* FILTRO POR CATEGORIA */}
        <ul className="cards-category" id="category-list">
          {categoriasUnicas.map((cat) => {
            const iconClass = iconesPorCategoria[cat] || "fa-gamepad";

            return (
              <li
                key={cat}
                className={`cardc ${
                  categoriaSelecionada === cat ? "selected" : ""
                }`}
                onClick={() => setCategoriaSelecionada(cat)}
              >
                <i className={`fa-solid ${iconClass}`}></i> {cat}
              </li>
            );
          })}
        </ul>

        {/* LISTA DE JOGOS */}
        <section
          className="card_buys-container"
          id="card_buys-container"
        >
          {loading ? (
            <p>Carregando jogos...</p>
          ) : jogosFiltrados.length === 0 ? (
            <p>Nenhum jogo encontrado.</p>
          ) : (
            jogosFiltrados.map((jogo) => {
              const randomRating = (Math.random() * 2 + 3).toFixed(1);

              return (
                <div
                  key={jogo.id || jogo.nome}
                  className="card_buy"
                  onClick={() => {
                    if (!jogo.nome) {
                      showToast(
                        "Jogo sem nome não pode abrir descrição.",
                        "error"
                      );
                      return;
                    }
                    navigate(
                      `/descricao/${encodeURIComponent(jogo.nome)}`
                    );
                  }}
                >
                  <GameCardImage jogo={jogo} />

                  <div className="card-top">
                    <div className="card-rating">
                      <i className="fa-solid fa-star"></i> {randomRating}
                    </div>

                    <div
                      className="add-wishlist"
                      title="Adicionar à lista de desejos"
                      onClick={(e) => {
                        e.stopPropagation();
                        adicionarFavorito(jogo);
                      }}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </div>
                  </div>

                  <div className="card-info">
                    <h3>{jogo.nome}</h3>
                    <p>{jogo.descricao}</p>
                    <span className="price">
                      R$ {Number(jogo.preco).toFixed(2)}
                    </span>

                    <button
                      className="buy-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        comprarJogo(jogo);
                      }}
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      <FooterDefault />
    </div>
  );
}

// =========================================================
/* CARRINHO (API) */
// =========================================================
function CartPage() {
  usePageCss(["/css/layout.css", "/css/dashboard.css", "/css/carrinho.css"]);
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // ==========================
  // CARREGAR CARRINHO DA API (/carrinho/ativo) + JOGOS
  // ==========================
  async function carregarCarrinho() {
    try {
      const resp = await fetchWithAuth("/carrinho/ativo");
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        showToast(err.message || "Erro ao carregar carrinho.", "error");
        setCarrinho([]);
        setLoading(false);
        return;
      }

      const data = await resp.json();

      if (data.message === "Carrinho vazio.") {
        setCarrinho([]);
        setLoading(false);
        return;
      }

      const carrinhoApi = data.carrinho || data;
      const itensBrutos = carrinhoApi.itens || [];

      if (!itensBrutos.length) {
        setCarrinho([]);
        setLoading(false);
        return;
      }

      // 2) Buscar todos os jogos públicos uma vez
      const respJogos = await fetch(`${API_BASE_URL}/public/jogos`);
      let todosJogos = [];
      if (respJogos.ok) {
        const dataJogos = await respJogos.json();
        const listaJogos = Array.isArray(dataJogos) ? dataJogos : [];
        todosJogos = listaJogos.map((j, idx) => {
          const idDoBack =
            j.id ??
            j.ID ??
            j.id_jogo ??
            j.jogoId ??
            ID_POR_NOME[j.nome?.trim()] ??
            idx + 1;

          const jogoComImg = withLocalImages(j);

          return {
            ...jogoComImg,
            id: idDoBack,
          };
        });
      }

      // 3) Montar itens com o objeto "jogo" completo
      const itensNormalizados = itensBrutos.map((item) => {
        const jogoBase =
          todosJogos.find(
            (j) =>
              j.id === item.fkJogo ||
              j.id === item.fk_jogo ||
              j.id === item.jogoId
          ) || {};

        return {
          ...item,
          jogo: jogoBase,
          quantidade: 1,
        };
      });

      console.log("Itens do carrinho normalizados:", itensNormalizados);
      setCarrinho(itensNormalizados);
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao carregar carrinho.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCarrinho();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================
  // TOTAL / SUBTOTAL (cada item conta 1x)
  // ==========================
  const total = carrinho.reduce((acc, item) => {
    const jogo = item.jogo || {};
    const preco = Number(jogo.preco || 0);
    return acc + preco;
  }, 0);

  // ==========================
  // REMOVER ITEM (DELETE /carrinho/:gameId)
  // ==========================
  async function removerItem(item) {
    const jogo = item.jogo || {};
    const jogoId = jogo.id || item.fkJogo || item.fk_jogo || item.jogoId;

    if (!jogoId) {
      showToast("Item inválido para remoção.", "error");
      return;
    }

    try {
      const resp = await fetchWithAuth(`/carrinho/${jogoId}`, {
        method: "DELETE",
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        showToast(err.message || "Erro ao remover item.", "error");
        return;
      }

      showToast("Item removido do carrinho.", "info");
      await carregarCarrinho();
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao remover item.", "error");
    }
  }

  // ==========================
  // CHECKOUT (POST /vendas/checkout)
  // ==========================
  async function handleCheckout() {
    if (!carrinho.length) {
      showToast("Seu carrinho está vazio!", "error");
      return;
    }

    try {
      const resp = await fetchWithAuth("/vendas/checkout", {
        method: "POST",
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        showToast(err.message || "Erro ao finalizar compra.", "error");
        return;
      }

      const data = await resp.json().catch(() => ({}));
      showToast(
        data.message || `Compra finalizada! Total: R$ ${total.toFixed(2)}`,
        "success"
      );

      await carregarCarrinho();
      navigate("/dashboard");
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao finalizar compra.", "error");
    }
  }

  return (
    <>
      <Sidebar />
      <header>
        <div className="logo">TOK-STORE</div>
        <div className="search-container">
          <input type="text" placeholder="Pesquise seu jogo aqui" />
          <button className="search-btn">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </header>

      <main className="cart-page">
        <section className="cart-items">
          <h1>Carrinho de Compras</h1>
          <p className="cart-subtitle">Itens no carrinho</p>

          <div id="cart-items">
            {loading ? (
              <p className="cart-empty">Carregando carrinho...</p>
            ) : carrinho.length === 0 ? (
              <p className="cart-empty">Seu carrinho está vazio.</p>
            ) : (
              carrinho.map((item, index) => {
                const jogo = item.jogo || {};
                const jogoComImg = withLocalImages(jogo);
                const imgSrc =
                  (jogoComImg.imagens && jogoComImg.imagens[0]) ||
                  "/img/placeholder.jpg";

                return (
                  <div className="cart-item" key={index}>
                    <div className="cart-left">
                      <img
                        src={imgSrc}
                        alt={jogoComImg.nome}
                        className="cart-img"
                        onClick={() => {
                          if (jogoComImg.nome) {
                            navigate(
                              `/descricao/${encodeURIComponent(
                                jogoComImg.nome
                              )}`
                            );
                          }
                        }}
                        onError={(e) => {
                          e.target.src = "/img/placeholder.jpg";
                        }}
                      />
                      <div className="cart-details">
                        <h3>{jogoComImg.nome}</h3>
                        <p className="cart-price">
                          R$ {Number(jogoComImg.preco || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="cart-right">
                      <span className="qty">1x</span>
                      <i
                        className="fa-solid fa-trash remove-item"
                        title="Remover"
                        onClick={() => removerItem(item)}
                      ></i>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <aside className="cart-summary">
          <h2>Resumo do Pedido</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span id="subtotal">R$ {total.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span id="cart-total">R$ {total.toFixed(2)}</span>
          </div>

          <button
            className="checkout"
            onClick={handleCheckout}
            disabled={!carrinho.length}
            style={{ opacity: carrinho.length ? 1 : 0.5 }}
          >
            Finalizar Compra
          </button>
        </aside>
      </main>

      <aside className="side-showcase">
        <div className="showcase-track"></div>
      </aside>

      <footer>
        <div className="ft-left">
          <strong>Tok-Story</strong>
          <br />
          Explore novos mundos e histórias inesquecíveis.
          <br />
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
        </div>
        <div className="ft-right">
          <strong>Suporte</strong>
          <br />
          <a href="#">Contato</a>
          <br />
          <a href="#">Ajuda</a>
          <br />
          <a href="#">Legal</a>
        </div>
      </footer>
    </>
  );
}

// =========================================================
/* DESCRIÇÃO (JOGO VIA API + AVALIAÇÕES VIA API) */
// =========================================================
function DescricaoPage() {
  usePageCss([
    "/css/layout.css",
    "/css/descrição.css",
    "/css/dashboard.css",
    "/css/manipulate.css",
    "/css/chat.css",
  ]);

  const { index } = useParams(); // /descricao/:index  -> index = nome codificado
  const jogoNome = decodeURIComponent(index);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [jogo, setJogo] = useState(null);
  const [selectedImg, setSelectedImg] = useState("/img/placeholder.jpg");

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userAvaliacao, setUserAvaliacao] = useState(null);

  const [ratingsData, setRatingsData] = useState([]);
  const [avg, setAvg] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(true);

  // =========================
  // 1) Carregar JOGO do backend pelo NOME
  // =========================
  useEffect(() => {
    async function carregarJogo() {
      try {
        const resp = await fetch(`${API_BASE_URL}/public/jogos`);
        if (!resp.ok) {
          showToast("Erro ao carregar jogo do servidor.", "error");
          return;
        }

        const data = await resp.json();
        const lista = Array.isArray(data) ? data : [];

        const nomeAlvo = normalizeName(jogoNome);

        const idx = lista.findIndex(
          (j) => normalizeName(j.nome) === nomeAlvo
        );

        if (idx === -1) {
          showToast("Jogo não encontrado.", "error");
          return;
        }

        const jogoOriginal = lista[idx];

        const idDoBack =
          jogoOriginal.id ??
          jogoOriginal.ID ??
          jogoOriginal.id_jogo ??
          jogoOriginal.jogoId ??
          ID_POR_NOME[jogoOriginal.nome?.trim()] ??
          idx + 1;

        const jogoComImg = withLocalImages({
          ...jogoOriginal,
          id: idDoBack,
        });

        setJogo(jogoComImg);
        if (jogoComImg.imagens?.length) {
          setSelectedImg(jogoComImg.imagens[0]);
        }
      } catch (err) {
        console.error(err);
        showToast("Erro de conexão ao carregar jogo.", "error");
      }
    }

    carregarJogo();
  }, [jogoNome, showToast]);

  // =========================
  // 2) Carregar AVALIAÇÕES do backend (quando já tiver o jogo.id)
  // =========================
  useEffect(() => {
    if (!jogo?.id) return;

    const jogoId = jogo.id;

    async function carregarAvaliacoes() {
      setLoadingAvaliacoes(true);

      try {
        // média + lista de avaliações
        const respMedia = await fetchWithAuth(`/avaliacoes/media/${jogoId}`);

        if (respMedia.status === 200) {
          const data = await respMedia.json();
          setAvg(data.media || 0);
          setTotalReviews(data.totalAvaliacoes || 0);
          setRatingsData(data.avaliacoes || []);
        } else if (respMedia.status === 204) {
          setAvg(0);
          setTotalReviews(0);
          setRatingsData([]);
        }

        // avaliação do usuário logado (se existir)
        const respUser = await fetchWithAuth(`/avaliacoes?jogoId=${jogoId}`);
        if (respUser.status === 200) {
          const av = await respUser.json();
          setUserAvaliacao(av);
          setRating(av.nota);
          setReviewText(av.comentario || "");
        } else if (respUser.status === 204) {
          setUserAvaliacao(null);
        }
      } catch (err) {
        console.error("Erro ao carregar avaliações:", err);
        showToast("Erro ao carregar avaliações do servidor.", "error");
      } finally {
        setLoadingAvaliacoes(false);
      }
    }

    carregarAvaliacoes();
  }, [jogo, showToast]);

  // =========================
  // 3) Enquanto o jogo não carregar
  // =========================
  if (!jogo) {
    return (
      <h1 style={{ color: "#fff", padding: "2rem" }}>Carregando jogo...</h1>
    );
  }

  // =========================
  // 4) Ações: Carrinho & Wishlist
  // =========================
  async function addToCart() {
    if (!jogo?.id) {
      showToast("Jogo inválido para adicionar ao carrinho.", "error");
      return;
    }
    const jogoId = jogo.id;

    try {
      const resp = await fetchWithAuth("/carrinho/add", {
        method: "POST",
        body: JSON.stringify({ jogoId }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        showToast(err.message || "Erro ao adicionar ao carrinho.", "error");
        return;
      }

      showToast("Jogo adicionado ao carrinho!", "success");
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao adicionar ao carrinho.", "error");
    }
  }

  async function toggleFav() {
    if (!jogo?.id) {
      showToast("Jogo inválido para wishlist.", "error");
      return;
    }
    const jogoId = jogo.id;

    try {
      const resp = await fetchWithAuth("/lista-desejo", {
        method: "POST",
        body: JSON.stringify({ jogoId }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        showToast(
          err.message || "Erro ao adicionar à lista de desejos.",
          "error"
        );
        return;
      }

      showToast("Jogo adicionado à wishlist!", "success");
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao salvar na wishlist.", "error");
    }
  }

  // =========================
  // 5) Enviar/Atualizar avaliação
  // =========================
  async function handleSubmitReview() {
    if (!jogo?.id) {
      showToast("Jogo inválido para avaliação.", "error");
      return;
    }
    const jogoId = jogo.id;

    const text = reviewText.trim();
    if (rating === 0 || text === "") {
      showToast("Selecione uma nota e escreva um comentário.", "error");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      showToast("Você precisa estar autenticado para avaliar.", "info");
      return;
    }

    try {
      const payload = {
        jogoId,
        nota: rating,
        comentario: text,
      };

      const method = userAvaliacao ? "PUT" : "POST";

      const resp = await fetchWithAuth("/avaliacoes", {
        method,
        body: JSON.stringify(payload),
      });

      if (resp.status === 201 || resp.status === 200) {
        const data = await resp.json();
        showToast(data.message || "Avaliação salva com sucesso!", "success");

        const respMedia = await fetchWithAuth(`/avaliacoes/media/${jogoId}`);
        if (respMedia.status === 200) {
          const m = await respMedia.json();
          setAvg(m.media || 0);
          setTotalReviews(m.totalAvaliacoes || 0);
          setRatingsData(m.avaliacoes || []);
        }

        const respUser = await fetchWithAuth(
          `/avaliacoes?jogoId=${jogoId}`
        );
        if (respUser.status === 200) {
          const av = await respUser.json();
          setUserAvaliacao(av);
          setRating(av.nota);
          setReviewText(av.comentario || "");
        }
      } else {
        const errData = await resp.json().catch(() => ({}));
        showToast(errData.message || "Erro ao salvar avaliação.", "error");
      }
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      showToast("Erro de conexão ao enviar avaliação.", "error");
    }
  }

  return (
    <>
      <header>
        <div className="logo">TOK-STORE</div>

        <div className="search-container">
          <input
            type="text"
            id="busca"
            placeholder="Pesquise seu jogo aqui"
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate("/dashboard");
            }}
          />
          <button
            className="search-btn"
            id="search-btn"
            onClick={() => navigate("/dashboard")}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        <section className="nav-in-the-box">
          <nav>
            <button onClick={() => navigate("/wishlist")}>
              Lista de Desejos
            </button>
            <button onClick={() => navigate("/carrinho")}>
              <i className="fa-solid fa-cart-shopping"></i> Carrinho
            </button>
            <button onClick={() => navigate("/perfil")} id="person">
              <i className="fa-solid fa-user"></i>
            </button>
          </nav>
        </section>
      </header>

      <Sidebar />

      <main className="game-container">
        {/* BLOCO PRINCIPAL - infos do jogo */}
        <section className="main-info">
          <div className="media-preview">
            <img id="game-banner" src={selectedImg} alt="Imagem do jogo" />
            <div className="thumbnail-row" id="thumbnails">
              {(jogo.imagens && jogo.imagens.length
                ? jogo.imagens
                : [selectedImg]
              ).map((imgSrc, i) => (
                <img
                  key={i}
                  src={imgSrc}
                  alt={`${jogo.nome} imagem ${i + 1}`}
                  className={`thumb ${
                    selectedImg === imgSrc ? "active" : ""
                  }`}
                  onClick={() => setSelectedImg(imgSrc)}
                  onError={(e) => {
                    e.target.src = "/img/placeholder.jpg";
                  }}
                />
              ))}
            </div>
          </div>

          <div className="game-details">
            <h1 id="game-title">{jogo.nome}</h1>
            <p id="game-description">{jogo.descricao}</p>
            <p>
              <strong>Desenvolvedor:</strong>{" "}
              <span id="game-dev">
                {jogo.dev || jogo.empresa || "—"}
              </span>
            </p>
            <p>
              <strong>Categoria:</strong>{" "}
              <span id="game-cat">{jogo.categoria || "—"}</span>
            </p>
            <p>
              <strong>Ano:</strong>{" "}
              <span id="game-year">{jogo.ano || "—"}</span>
            </p>
            <p className="price">
              <strong>Preço:</strong> R${" "}
              <span id="game-price">
                {Number(jogo.preco).toFixed(2)}
              </span>
            </p>
            <button className="buy-btn" onClick={addToCart}>
              Comprar
            </button>
            <button className="fav-btn" onClick={toggleFav}>
              <i className="fa-solid fa-star"></i> Adicionar à lista de
              desejos
            </button>
          </div>
        </section>

        {/* BLOCO DE AVALIAÇÕES */}
        <section className="rating-section">
          <h2>Avalie este jogo</h2>

          <div className="average-rating" id="average-rating">
            {loadingAvaliacoes ? (
              <>Carregando avaliações...</>
            ) : (
              <>
                ⭐ <span id="avg-value">{avg.toFixed(1)}</span> de 5 —{" "}
                <span id="total-reviews">{totalReviews}</span>{" "}
                avaliações
              </>
            )}
          </div>

          <div className="star-rating" id="star-rating">
            {[5, 4, 3, 2, 1].map((value) => (
              <i
                key={value}
                className={`fa-solid fa-star ${
                  rating >= value ? "active" : ""
                }`}
                data-value={value}
                onClick={() => setRating(value)}
              ></i>
            ))}
          </div>

          <textarea
            id="review-text"
            placeholder="Deixe seu comentário..."
            rows="4"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
          <button id="submit-review" onClick={handleSubmitReview}>
            {userAvaliacao ? "Atualizar Avaliação" : "Enviar Avaliação"}
          </button>

          <div className="reviews-list" id="reviews-list">
            <h3>Comentários Recentes</h3>
            <ul id="reviews">
              {ratingsData.length === 0 ? (
                <li>Esse jogo ainda não possui avaliações.</li>
              ) : (
                [...ratingsData]
                  .slice()
                  .reverse()
                  .map((r, idx) => (
                    <li key={idx}>
                      <strong>{"⭐".repeat(r.nota || 0)}</strong> —{" "}
                      {r.comentario}
                    </li>
                  ))
              )}
            </ul>
          </div>
        </section>
      </main>

      <div id="theme-toggle" title="Alternar modo claro/escuro">
        <i className="fa-solid fa-moon"></i>
      </div>
    </>
  );
}

// =========================================================
/* WISHLIST (API) */
// =========================================================
function WishlistPage() {
  usePageCss(["/css/layout.css", "/css/dashboard.css", "/css/wishlist.css"]);
  const loggedUser = getLoggedUser();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function carregarWishlist() {
      if (!loggedUser) {
        setLoading(false);
        return;
      }

      try {
        const resp = await fetchWithAuth("/lista-desejo");
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          showToast(
            err.message || "Erro ao carregar lista de desejos.",
            "error"
          );
          setWishlist([]);
          setLoading(false);
          return;
        }

        const data = await resp.json();
        const itens = Array.isArray(data)
          ? data
          : data.itens || [];

        const itensComImg = itens.map((item) => {
          if (item.jogo) {
            const j = item.jogo;
            const idFix =
              j.id ??
              j.ID ??
              j.id_jogo ??
              j.jogoId ??
              ID_POR_NOME[j.nome?.trim()];
            return {
              ...item,
              jogo: withLocalImages({
                ...j,
                id: idFix ?? j.id,
              }),
            };
          }
          const idFix =
            item.id ??
            item.ID ??
            item.id_jogo ??
            item.jogoId ??
            ID_POR_NOME[item.nome?.trim()];
          return withLocalImages({
            ...item,
            id: idFix ?? item.id,
          });
        });

        setWishlist(itensComImg);
      } catch (e) {
        console.error(e);
        showToast("Erro de conexão ao carregar wishlist.", "error");
      } finally {
        setLoading(false);
      }
    }

    carregarWishlist();
  }, [loggedUser, showToast]);

  if (!loggedUser) {
    return (
      <div className="main-content">
        <HeaderWithSearch />
        <Sidebar />
        <main className="wishlist-container">
          <h1>Lista de Desejos</h1>
          <p>Você precisa estar logado para ver sua wishlist.</p>
        </main>
      </div>
    );
  }

  async function remover(item) {
    const jogoBase = item.jogo || item;
    const jogoId = jogoBase.id || item.jogoId;

    if (!jogoId) {
      showToast("Jogo inválido para remover da wishlist.", "error");
      return;
    }

    if (!window.confirm(`Remover ${jogoBase.nome} da wishlist?`)) return;

    try {
      const resp = await fetchWithAuth("/lista-desejo", {
        method: "DELETE",
        body: JSON.stringify({ jogoId }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        showToast(
          err.message || "Erro ao remover da wishlist.",
          "error"
        );
        return;
      }

      showToast(`${jogoBase.nome} foi removido da wishlist.`, "info");
      setWishlist((prev) =>
        prev.filter(
          (i) => (i.jogo?.id || i.id || i.jogoId) !== jogoId
        )
      );
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao remover da wishlist.", "error");
    }
  }

  async function addCarrinho(item) {
    const jogoBase = item.jogo || item;
    const jogoId = jogoBase.id || item.jogoId;

    if (!jogoId) {
      showToast("Jogo inválido para adicionar ao carrinho.", "error");
      return;
    }

    try {
      const resp = await fetchWithAuth("/carrinho/add", {
        method: "POST",
        body: JSON.stringify({ jogoId }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        showToast(err.message || "Erro ao adicionar ao carrinho.", "error");
        return;
      }

      showToast(
        `${jogoBase.nome} foi adicionado ao carrinho!`,
        "success"
      );
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao adicionar ao carrinho.", "error");
    }
  }

  return (
    <div className="main-content">
      <HeaderWithSearch />
      <Sidebar />

      <main className="wishlist-container">
        <h1>Lista de Desejos</h1>
        <p id="wishlist-count">
          {loading
            ? "Carregando..."
            : wishlist.length === 0
            ? "Nenhum jogo salvo"
            : `${wishlist.length} jogo${
                wishlist.length > 1 ? "s" : ""
              } salvo${wishlist.length > 1 ? "s" : ""}`}
        </p>

        <section id="wishlist-list" className="wishlist-list">
          {loading ? (
            <p>Carregando itens...</p>
          ) : wishlist.length === 0 ? (
            <p>Você ainda não adicionou jogos à sua lista de desejos.</p>
          ) : (
            wishlist.map((item, index) => {
              const jogoBase = item.jogo || item;
              const jogo = withLocalImages(jogoBase);
              const imgSrc =
                (jogo.imagens && jogo.imagens[0]) ||
                "/img/placeholder.jpg";
              const randomNota =
                jogo.nota || (4 + Math.random()).toFixed(1);

              return (
                <div className="wishlist-card" key={index}>
                  <img
                    src={imgSrc}
                    alt={jogo.nome}
                    onError={(e) => {
                      e.target.src = "/img/placeholder.jpg";
                    }}
                  />
                  <button
                    className="remove-btn"
                    onClick={() => remover(item)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="wishlist-info">
                    <h3>{jogo.nome}</h3>
                    <p>{jogo.descricao}</p>
                    <div className="rating">
                      <i className="fa-solid fa-star"></i>{" "}
                      {randomNota}
                    </div>
                    <p className="price">
                      R$ {Number(jogo.preco).toFixed(2)}
                    </p>
                  </div>
                  <div className="wishlist-actions">
                    <button
                      className="btn-cart"
                      onClick={() => addCarrinho(item)}
                    >
                      <i className="fa-solid fa-cart-shopping"></i>{" "}
                      Carrinho
                    </button>
                    <button
                      className="btn-buy"
                      onClick={() =>
                        showToast(
                          `Compra iniciada para ${jogo.nome} (simulação).`,
                          "info"
                        )
                      }
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      <FooterDefault />
    </div>
  );
}

// =========================================================
/* EXPLORAR (somente visual, por enquanto) */
// =========================================================
function ExplorePage() {
  usePageCss(["/css/layout.css", "/css/explorar.css"]);

  return (
    <div className="container">
      <header className="header">
        <div className="title">
          <i className="fa-solid fa-compass"></i> Explorar
        </div>
        <div className="search-support">
          <input type="text" placeholder="Buscar jogo..." />
          <button>
            <i className="fa-solid fa-headset"></i> Suporte
          </button>
        </div>
      </header>

      <Sidebar />

      <section className="hero-banner">
        <div className="hero-content">
          <h1>Descubra Novos Mundos</h1>
          <p>
            Explore os jogos mais populares, as últimas novidades e experiências
            únicas criadas para você.
          </p>
          <button className="explore-btn">
            <i className="fa-solid fa-gamepad"></i> Ver Lançamentos
          </button>
        </div>
      </section>

      <section className="recommendations">
        <h2>
          <i className="fa-solid fa-fire"></i> Recomendados para Você
        </h2>
        <div className="game-cards">
          <div className="game-card">
            <img src="/img/the-witcher-3.jpg" alt="The Witcher 3" />
            <div className="game-info">
              <h3>The Witcher 3</h3>
              <p>
                RPG de mundo aberto com uma das histórias mais envolventes já
                criadas.
              </p>
            </div>
          </div>
          <div className="game-card">
            <img src="/img/red-dead2.jpg" alt="Red Dead Redemption 2" />
            <div className="game-info">
              <h3>Red Dead Redemption 2</h3>
              <p>Explore o Velho Oeste em uma jornada cinematográfica e intensa.</p>
            </div>
          </div>
          <div className="game-card">
            <img src="/img/elden-ring.jpg" alt="Elden Ring" />
            <div className="game-info">
              <h3>Elden Ring</h3>
              <p>
                Desafie-se em um vasto e misterioso mundo criado por FromSoftware.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="categories">
        <h2>
          <i className="fa-solid fa-layer-group"></i> Categorias Populares
        </h2>
        <div className="category-grid">
          <div className="category-card action">
            <i className="fa-solid fa-gun"></i> Ação
          </div>
          <div className="category-card rpg">
            <i className="fa-solid fa-hat-wizard"></i> RPG
          </div>
          <div className="category-card adventure">
            <i className="fa-solid fa-mountain-sun"></i> Aventura
          </div>
          <div className="category-card strategy">
            <i className="fa-solid fa-chess-board"></i> Estratégia
          </div>
          <div className="category-card horror">
            <i className="fa-solid fa-ghost"></i> Terror
          </div>
          <div className="category-card indie">
            <i className="fa-solid fa-puzzle-piece"></i> Indie
          </div>
        </div>
      </section>

      <footer>
        <div>
          <strong>TOK-STORY</strong>
          <p>A sua loja digital de games preferida.</p>
          <div className="links">
            <a href="#">
              <i className="fa-brands fa-instagram"></i> Instagram
            </a>
            <a href="#">
              <i className="fa-brands fa-linkedin"></i> LinkedIn
            </a>
          </div>
        </div>
        <div>
          <strong>Suporte</strong>
          <a href="#">Contato</a>
          <a href="#">Ajuda</a>
          <a href="#">Termos Legais</a>
        </div>
      </footer>
    </div>
  );
}

// =========================================================
/* PERFIL (ainda estático, só visual) */
// =========================================================
function ProfilePage() {
  usePageCss(["/css/layout.css", "/css/perfil.css"]);

  return (
    <div className="container">
      <header className="header">
        <div className="title">
          <i className="fa-solid fa-gear"></i> Configurações
        </div>
        <div className="search-support">
          <input type="text" placeholder="Pesquisar jogos..." />
          <button>
            <i className="fa-solid fa-headset"></i> Suporte
          </button>
        </div>
      </header>

      <Sidebar />

      <main className="content">
        <section className="profile-info">
          <h2>Informações do Perfil</h2>
          <div className="profile-details">
            <div className="avatar">
              <i className="fa-solid fa-user"></i>
            </div>
            <p>
              <strong>Nome:</strong> Juans “Gami” Rodrigues
            </p>
            <p>
              <strong>Email:</strong> juans.rodrigues@email.com
            </p>
            <p>
              <strong>Data de Cadastro:</strong> 10/06/2023
            </p>
            <p>
              <strong>Jogos Comprados:</strong> 12
            </p>
            <button className="edit-btn">
              <i className="fa-solid fa-pen"></i> Editar Perfil
            </button>
          </div>
        </section>

        <section className="profile-settings">
          <h2>Preferências</h2>
          <form id="profile-settings-form">
            <label>
              <input type="checkbox" defaultChecked /> Notificações por email
            </label>

            <label>
              <input type="checkbox" defaultChecked /> Notificações push
            </label>
            <button type="submit">
              <i className="fa-solid fa-save"></i> Salvar Alterações
            </button>
          </form>
        </section>
      </main>

      <section className="profile-stats">
        <h2>Suas Estatísticas</h2>
        <div className="stats-grid">
          <div className="stat-card blue">
            <i className="fa-solid fa-gamepad"></i>
            <h3>12</h3>
            <p>Jogos Possuídos</p>
          </div>
          <div className="stat-card green">
            <i className="fa-solid fa-clock"></i>
            <h3>47h</h3>
            <p>Tempo de Jogo</p>
          </div>
          <div className="stat-card purple">
            <i className="fa-solid fa-trophy"></i>
            <h3>23</h3>
            <p>Conquistas</p>
          </div>
          <div className="stat-card red">
            <i className="fa-solid fa-heart"></i>
            <h3>8</h3>
            <p>Lista de Desejos</p>
          </div>
        </div>
      </section>

      <footer>
        <div>
          <strong>TOK-STORY</strong>
          <p>A sua loja digital de games preferida.</p>
          <div className="links">
            <a href="#">
              <i className="fa-brands fa-instagram"></i> Instagram
            </a>
            <a href="#">
              <i className="fa-brands fa-linkedin"></i> LinkedIn
            </a>
          </div>
        </div>
        <div>
          <strong>Suporte</strong>
          <a href="#">Contato</a>
          <a href="#">Ajuda</a>
          <a href="#">Termos Legais</a>
        </div>
      </footer>
    </div>
  );
}

// =========================================================
/* RANKING (visual) */
// =========================================================
function RankingPage() {
  usePageCss(["/css/layout.css", "/css/ranking.css"]);

  return (
    <div className="container">
      <header className="header">
        <div className="title">
          <i className="fa-solid fa-ranking-star"></i> Ranking de Jogos
        </div>
        <div className="search-support">
          <input type="text" placeholder="Buscar jogo..." />
          <button>
            <i className="fa-solid fa-headset"></i> Suporte
          </button>
        </div>
      </header>

      <Sidebar />

      <main className="ranking-container">
        <h2>Top Jogos Avaliados</h2>

        <div className="ranking-list">
          <div className="ranking-item gold">
            <span className="rank-number">#1</span>
            <img src="/img/the-witcher-3.jpg" alt="The Witcher 3" />
            <div className="info">
              <h3>The Witcher 3: Wild Hunt</h3>
              <p>
                <i className="fa-solid fa-star"></i> 9.8 / 10
              </p>
            </div>
            <button className="view-btn">
              <i className="fa-solid fa-eye"></i> Ver Jogo
            </button>
          </div>

          <div className="ranking-item silver">
            <span className="rank-number">#2</span>
            <img src="/img/red-dead2.jpg" alt="Red Dead Redemption 2" />
            <div className="info">
              <h3>Red Dead Redemption 2</h3>
              <p>
                <i className="fa-solid fa-star"></i> 9.7 / 10
              </p>
            </div>
            <button className="view-btn">
              <i className="fa-solid fa-eye"></i> Ver Jogo
            </button>
          </div>

          <div className="ranking-item bronze">
            <span className="rank-number">#3</span>
            <img src="/img/zelda.jpg" alt="The Legend of Zelda: Breath of the Wild" />
            <div className="info">
              <h3>The Legend of Zelda: Breath of the Wild</h3>
              <p>
                <i className="fa-solid fa-star"></i> 9.6 / 10
              </p>
            </div>
            <button className="view-btn">
              <i className="fa-solid fa-eye"></i> Ver Jogo
            </button>
          </div>

          <div className="ranking-item">
            <span className="rank-number">#4</span>
            <img src="/img/gta5.jpg" alt="Grand Theft Auto V" />
            <div className="info">
              <h3>Grand Theft Auto V</h3>
              <p>
                <i className="fa-solid fa-star"></i> 9.4 / 10
              </p>
            </div>
            <button className="view-btn">
              <i className="fa-solid fa-eye"></i> Ver Jogo
            </button>
          </div>

          <div className="ranking-item">
            <span className="rank-number">#5</span>
            <img src="/img/elden-ring.jpg" alt="Elden Ring" />
            <div className="info">
              <h3>Elden Ring</h3>
              <p>
                <i className="fa-solid fa-star"></i> 9.3 / 10
              </p>
            </div>
            <button className="view-btn">
              <i className="fa-solid fa-eye"></i> Ver Jogo
            </button>
          </div>
        </div>
      </main>

      <footer>
        <div>
          <strong>TOK-STORY</strong>
          <p>A sua loja digital de games preferida.</p>
          <div className="links">
            <a href="#">
              <i className="fa-brands fa-instagram"></i> Instagram
            </a>
            <a href="#">
              <i className="fa-brands fa-linkedin"></i> LinkedIn
            </a>
          </div>
        </div>
        <div>
          <strong>Suporte</strong>
          <a href="#">Contato</a>
          <a href="#">Ajuda</a>
          <a href="#">Termos Legais</a>
        </div>
      </footer>
    </div>
  );
}

// =========================================================
/* ADMIN LAYOUT */
// =========================================================
function AdminLayout() {
  usePageCss(["/css/admin.css"]);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    setLoggedUser(null);
    showToast("Você saiu do painel administrativo.", "info");
    navigate("/login");
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-title">TOK-STORE</span>
          <span className="logo-subtitle">Admin</span>
        </div>

        <nav className="menu">
          <Link to="/admin">
            <i className="fa-solid fa-chart-line"></i> Dashboard
          </Link>
          <Link to="/admin/empresas">
            <i className="fa-solid fa-building"></i> Empresas
          </Link>
          <Link to="/admin/categorias">
            <i className="fa-solid fa-tags"></i> Categorias
          </Link>
          <Link to="/admin/jogos">
            <i className="fa-solid fa-gamepad"></i> Jogos
          </Link>
          <Link to="/admin/carrinho">
            <i className="fa-solid fa-cart-shopping"></i> Carrinho
          </Link>
          <Link to="/admin/compras">
            <i className="fa-solid fa-credit-card"></i> Compras
          </Link>
          <Link to="/admin/avaliacoes">
            <i className="fa-solid fa-comments"></i> Avaliações
          </Link>
          <Link to="/admin/relatorios">
            <i className="fa-solid fa-chart-column"></i> Relatórios
          </Link>

          <button
            type="button"
            className="logout"
            onClick={handleLogout}
            style={{ all: "unset", cursor: "pointer", display: "block" }}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Sair
          </button>
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

// =========================================================
/* ADMIN - DASHBOARD */
// =========================================================
function AdminDashboard({ onNavigate }) {
  usePageCss(["/css/relatorio.css"]);

  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    usuarios: 0,
    jogos: 0,
    vendasTotal: 0,
    vendasHoje: 0,
    valorHoje: 0,
    valorTotal: 0,
  });

  const [ultimasVendas, setUltimasVendas] = useState([]);
  const [ultimosJogos, setUltimosJogos] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const [rUsers, rJogos, rVendas] = await Promise.all([
          fetchWithAuth("/usuarios"),
          fetchWithAuth("/jogos"),
          fetchWithAuth("/vendas"),
        ]);

        const usuarios = rUsers.ok ? await rUsers.json() : [];
        const jogos = rJogos.ok ? await rJogos.json() : [];
        const vendas = rVendas.ok ? await rVendas.json() : [];

        const arrUsuarios = Array.isArray(usuarios) ? usuarios : [];
        const arrJogos = Array.isArray(jogos) ? jogos : [];
        const arrVendas = Array.isArray(vendas) ? vendas : [];

        const hojeISO = new Date().toISOString().slice(0, 10);
        let vendasHoje = 0;
        let valorHoje = 0;
        let valorTotal = 0;

        arrVendas.forEach((v) => {
          const data = (v.data || v.data_venda || "").slice(0, 10);
          const valor = Number(v.valor_total || v.valorTotal || 0);

          valorTotal += valor;
          if (data === hojeISO) {
            vendasHoje++;
            valorHoje += valor;
          }
        });

        setMetrics({
          usuarios: arrUsuarios.length,
          jogos: arrJogos.length,
          vendasTotal: arrVendas.length,
          vendasHoje,
          valorHoje,
          valorTotal,
        });

        const ultimas = [...arrVendas]
          .sort((a, b) => (new Date(b.data) - new Date(a.data)))
          .slice(0, 5);
        setUltimasVendas(ultimas);

        const ultJogos = [...arrJogos].slice(-5).reverse();
        setUltimosJogos(ultJogos);
      } catch (e) {
        console.error(e);
        showToast("Erro ao carregar dados do dashboard admin.", "error");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [showToast]);

  function irPara(view) {
    if (onNavigate) onNavigate(view);
  }

  return (
    <>
      <header className="header">
        <h1>Dashboard Administrativo</h1>
        <div className="user">
          <span>Bem-vindo, Administrador</span>
        </div>
      </header>

      <section className="welcome">
        <h2>Visão Geral</h2>
        <p>
          Acompanhe rapidamente os principais números da Tok-Store:
          usuários, jogos e vendas.
        </p>
      </section>

      <section className="cards">
        <div
          className="card"
          onClick={() => irPara("usuarios")}
          style={{ cursor: onNavigate ? "pointer" : "default" }}
        >
          <h3>Usuários</h3>
          <p>{loading ? "..." : metrics.usuarios}</p>
          <span className="card-subtitle">
            Total de contas cadastradas
          </span>
        </div>

        <div
          className="card"
          onClick={() => irPara("jogos")}
          style={{ cursor: onNavigate ? "pointer" : "default" }}
        >
          <h3>Jogos</h3>
          <p>{loading ? "..." : metrics.jogos}</p>
          <span className="card-subtitle">
            Jogos disponíveis na loja
          </span>
        </div>

        <div
          className="card"
          onClick={() => irPara("compras")}
          style={{ cursor: onNavigate ? "pointer" : "default" }}
        >
          <h3>Vendas (Total)</h3>
          <p>{loading ? "..." : metrics.vendasTotal}</p>
          <span className="card-subtitle">
            R$ {metrics.valorTotal.toFixed(2)}
          </span>
        </div>

        <div
          className="card"
          onClick={() => irPara("compras")}
          style={{ cursor: onNavigate ? "pointer" : "default" }}
        >
          <h3>Vendas Hoje</h3>
          <p>{loading ? "..." : metrics.vendasHoje}</p>
          <span className="card-subtitle">
            R$ {metrics.valorHoje.toFixed(2)}
          </span>
        </div>
      </section>

      <section className="charts">
        <div className="chart-card">
          <h3>Últimas Vendas</h3>
          {loading ? (
            <p>Carregando...</p>
          ) : ultimasVendas.length === 0 ? (
            <p>Nenhuma venda registrada.</p>
          ) : (
            <table className="mini-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuário</th>
                  <th>Qtde</th>
                  <th>Valor</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {ultimasVendas.map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.usuario_nome || v.usuario || v.fk_usuario}</td>
                    <td>{v.quantidade}</td>
                    <td>R$ {Number(v.valor_total || v.valorTotal || 0).toFixed(2)}</td>
                    <td>
                      {(v.data || v.data_venda || "")
                        .replace("T", " ")
                        .substring(0, 16)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="chart-card">
          <h3>Jogos Recentes</h3>
          {loading ? (
            <p>Carregando...</p>
          ) : ultimosJogos.length === 0 ? (
            <p>Nenhum jogo cadastrado ainda.</p>
          ) : (
            <ul className="mini-list">
              {ultimosJogos.map((j) => (
                <li key={j.id}>
                  <strong>{j.nome}</strong> —{" "}
                  <span>{j.ano}</span> •{" "}
                  <span>R$ {Number(j.preco).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

// =========================================================
/* ADMIN - EMPRESAS */
// =========================================================
function AdminEmpresasPage() {
  usePageCss(["/css/admin.css"]);

  return (
    <>
      <header className="header">
        <div>
          <h1>Empresas</h1>
          <p>Gerencie as empresas desenvolvedoras/publicadoras de jogos.</p>
        </div>
      </header>

      <section className="form-section">
        <h2>Cadastrar Empresa</h2>
        <form
          className="empresa-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="form-group">
            <label htmlFor="nomeEmpresa">Nome da Empresa</label>
            <input
              type="text"
              id="nomeEmpresa"
              placeholder="Ex: CD Projekt Red"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cnpjEmpresa">CNPJ</label>
            <input
              type="text"
              id="cnpjEmpresa"
              placeholder="00.000.000/0000-00"
            />
          </div>

          <button type="submit" className="btn-salvar">
            <i className="fa-solid fa-floppy-disk"></i> Salvar
          </button>
        </form>
      </section>

      <section className="table-section">
        <h2>Empresas Cadastradas</h2>
        <table className="empresa-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>CNPJ</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Nintendo</td>
              <td>—</td>
              <td>
                <button className="btn-editar">
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button className="btn-excluir">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

// =========================================================
/* ADMIN - CATEGORIAS */
// =========================================================
function AdminCategoriasPage() {
  usePageCss(["/css/categorias.css"]);

  return (
    <>
      <header className="header">
        <div>
          <h1>Categorias</h1>
          <p>Gerencie as categorias de jogos disponíveis na loja.</p>
        </div>
      </header>

      <section className="form-section">
        <h2>Cadastrar Categoria</h2>
        <form
          className="categoria-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="form-group">
            <label htmlFor="nomeCategoria">Nome da Categoria</label>
            <input
              type="text"
              id="nomeCategoria"
              placeholder="Ex: RPG, Ação, Terror..."
            />
          </div>

          <button type="submit" className="btn-salvar">
            <i className="fa-solid fa-floppy-disk"></i> Salvar
          </button>
        </form>
      </section>

      <section className="table-section">
        <h2>Categorias Cadastradas</h2>
        <table className="categoria-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Ação</td>
              <td>
                <button className="btn-editar">
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button className="btn-excluir">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

// =========================================================
/* ADMIN - JOGOS */
// =========================================================
function AdminJogosPage() {
  usePageCss(["/css/jogos.css"]);

  return (
    <>
      <header className="header">
        <div>
          <h1>Jogos</h1>
          <p>Cadastre e gerencie os jogos disponíveis na Tok-Store.</p>
        </div>
      </header>

      <section className="form-section">
        <h2>Cadastrar Jogo</h2>
        <form
          className="jogo-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nomeJogo">Nome</label>
              <input type="text" id="nomeJogo" placeholder="Nome do jogo" />
            </div>

            <div className="form-group">
              <label htmlFor="anoJogo">Ano</label>
              <input type="number" id="anoJogo" placeholder="2015" />
            </div>

            <div className="form-group">
              <label htmlFor="precoJogo">Preço</label>
              <input type="number" id="precoJogo" placeholder="59.99" />
            </div>

            <div className="form-group">
              <label htmlFor="empresaJogo">Empresa</label>
              <select id="empresaJogo">
                <option value="">Selecione</option>
                <option value="1">Nintendo</option>
                <option value="2">CD Projekt Red</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="categoriaJogo">Categoria</label>
              <select id="categoriaJogo">
                <option value="">Selecione</option>
                <option value="RPG">RPG</option>
                <option value="Ação">Ação</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descricaoJogo">Descrição</label>
            <textarea
              id="descricaoJogo"
              rows="3"
              placeholder="Descreva o jogo..."
            ></textarea>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="imgCapa">Imagem de capa</label>
              <input type="text" id="imgCapa" placeholder="/img/..." />
            </div>
            <div className="form-group">
              <label htmlFor="img1">Imagem 1</label>
              <input type="text" id="img1" placeholder="/img/..." />
            </div>
            <div className="form-group">
              <label htmlFor="img2">Imagem 2</label>
              <input type="text" id="img2" placeholder="/img/..." />
            </div>
            <div className="form-group">
              <label htmlFor="img3">Imagem 3</label>
              <input type="text" id="img3" placeholder="/img/..." />
            </div>
          </div>

          <button type="submit" className="btn-salvar">
            <i className="fa-solid fa-floppy-disk"></i> Salvar
          </button>
        </form>
      </section>

      <section className="table-section">
        <h2>Jogos Cadastrados</h2>
        <table className="jogo-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Ano</th>
              <th>Preço</th>
              <th>Empresa</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>The Witcher 3</td>
              <td>2015</td>
              <td>R$ 59,99</td>
              <td>CD Projekt Red</td>
              <td>RPG</td>
              <td>
                <button className="btn-editar">
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button className="btn-excluir">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

// =========================================================
/* ADMIN - CARRINHO */
// =========================================================
function AdminCarrinhoPage() {
  usePageCss(["/css/carrinhoadmin.css"]);

  return (
    <>
      <header className="header">
        <div>
          <h1>Carrinhos Abertos</h1>
          <p>Acompanhe os carrinhos em andamento.</p>
        </div>
      </header>

      <section className="table-section">
        <h2>Lista de Carrinhos</h2>
        <table className="carrinho-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Qtd. Itens</th>
              <th>Valor Estimado</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>—</td>
              <td>0</td>
              <td>R$ 0,00</td>
              <td>Aberto</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

// =========================================================
/* ADMIN - COMPRAS */
// =========================================================
function AdminComprasPage() {
  usePageCss(["/css/adminCompras.css"]);

  return (
    <>
      <header className="header">
        <div>
          <h1>Compras</h1>
          <p>Histórico de compras realizadas na Tok-Store.</p>
        </div>
      </header>

      <section className="table-section">
        <h2>Lista de Compras</h2>
        <table className="compras-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Valor Total</th>
              <th>Qtd. Itens</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>—</td>
              <td>R$ 0,00</td>
              <td>0</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

// =========================================================
/* ADMIN - AVALIAÇÕES */
// =========================================================
function AdminAvaliacoesPage() {
  usePageCss(["/css/avaliacoesAdmin.css"]);

  return (
    <>
      <header className="header">
        <div>
          <h1>Avaliações</h1>
          <p>Veja e gerencie as avaliações dos jogos.</p>
        </div>
      </header>

      <section className="table-section">
        <h2>Lista de Avaliações</h2>
        <table className="avaliacoes-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Jogo</th>
              <th>Usuário</th>
              <th>Nota</th>
              <th>Comentário</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>The Witcher 3</td>
              <td>Cliente</td>
              <td>5</td>
              <td>Muito bom!</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

// =========================================================
/* ADMIN - RELATÓRIOS */
// =========================================================
function AdminRelatoriosPage() {
  usePageCss(["/css/relatorios.css"]);

  return (
    <>
      <header className="header">
        <div>
          <h1>Relatórios e Análises</h1>
          <p>Acompanhe as métricas de vendas e desempenho dos jogos.</p>
        </div>
      </header>

      <section className="cards">
        <div className="card blue">
          <h3>Vendas (Hoje)</h3>
          <p className="value">R$ 0,00</p>
        </div>
        <div className="card purple">
          <h3>Vendas (Mês)</h3>
          <p className="value">R$ 0,00</p>
        </div>
        <div className="card green">
          <h3>Jogos Mais Vendidos</h3>
          <p className="value">0</p>
        </div>
        <div className="card orange">
          <h3>Clientes Ativos</h3>
          <p className="value">0</p>
        </div>
      </section>

      <section className="charts-grid">
        <div className="chart-card">
          <h2>Vendas por Dia</h2>
          <canvas id="chartVendasDia"></canvas>
        </div>
        <div className="chart-card">
          <h2>Jogos Mais Vendidos</h2>
          <canvas id="chartJogosMaisVendidos"></canvas>
        </div>
        <div className="chart-card">
          <h2>Vendas por Categoria</h2>
          <canvas id="chartCategorias"></canvas>
        </div>
        <div className="chart-card">
          <h2>Ticket Médio</h2>
          <canvas id="chartTicketMedio"></canvas>
        </div>
      </section>
    </>
  );
}

// =========================================================
/* APP ROOT */
// =========================================================
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="user">
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/carrinho"
          element={
            <ProtectedRoute role="user">
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/descricao/:index"
          element={
            <ProtectedRoute role="user">
              <DescricaoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute role="user">
              <WishlistPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/explorar"
          element={
            <ProtectedRoute role="user">
              <ExplorePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute role="user">
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ranking"
          element={
            <ProtectedRoute role="user">
              <RankingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="empresas" element={<AdminEmpresasPage />} />
          <Route path="categorias" element={<AdminCategoriasPage />} />
          <Route path="jogos" element={<AdminJogosPage />} />
          <Route path="carrinho" element={<AdminCarrinhoPage />} />
          <Route path="compras" element={<AdminComprasPage />} />
          <Route path="avaliacoes" element={<AdminAvaliacoesPage />} />
          <Route path="relatorios" element={<AdminRelatoriosPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Chatbot />
    </Router>
  );
}
