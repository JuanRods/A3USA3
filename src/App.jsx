import React, { useEffect, useState, useRef } from "react";

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

import Chart from "chart.js/auto";
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
  const { showToast, showConfirmToast } = useToast();

  const handleLogoutConfirm = () => {
    setLoggedUser(null);
    showToast("Você saiu da sua conta.", "info");
    navigate("/login");
  };

  const handleLogout = () => {
    showConfirmToast(
      `
        <strong>Sair da conta?</strong><br/>
        <span style="font-size: 0.9rem; color: #ccc;">
          Você precisará fazer login novamente para acessar seus jogos.
        </span>
      `,
      handleLogoutConfirm,
      {
        type: "warning",
        confirmText: "Sim, sair",
        cancelText: "Cancelar",
      }
    );
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
              className="sidebar-link-logout"
              onClick={handleLogout}
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
  const handleChange = onSearchChange || (() => { });

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
              ${j.nome} <span style="color:#66c0f4;">(${j.genero || "Gênero não informado"
          })</span>
            </div>

            <small>
              <b>Ano:</b> ${j.ano || "—"} • 
              <b>Plataforma:</b> ${j.plataforma || "—"}
            </small><br>
            <small><b>Publisher:</b> ${j.publisher || "—"}</small><br>
            <small><b>Nota:</b> ⭐ ${j.nota?.toFixed ? j.nota.toFixed(1) : j.nota || "N/A"
          }</small><br>
            <small><b>Faixa etária:</b> ${j.faixa_etaria || "N/A"}</small><br>
            <small style="color:#bbb; display:block; margin-top:4px;">
              <b>Descrição:</b> ${j.descricao || "Sem descrição disponível."
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
  const [regNascimento, setRegNascimento] = useState(""); // <-- NOVO

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
    const nascimento = regNascimento.trim(); // vem do input type="date" (AAAA-MM-DD)

    if (!nome || !email || !senha || !nascimento) {
      showToast("Preencha todos os campos!", "error");
      return;
    }

    // Converte "aaaa-mm-dd" -> "dd/mm/aaaa" para bater com o backend atual
    let dataNascimento = nascimento;
    try {
      const [ano, mes, dia] = nascimento.split("-");
      dataNascimento = `${dia}/${mes}/${ano}`;
    } catch {
      showToast("Data de nascimento inválida.", "error");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha, dataNascimento }),
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
      setRegNascimento("");
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

          {/* ==== FORM LOGIN ==== */}
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

          {/* ==== FORM REGISTRO ==== */}
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

            {/* NOVO CAMPO: DATA DE NASCIMENTO */}
            <input
              type="date"
              id="register-nascimento"
              className="input-date"
              placeholder="DATA DE NASCIMENTO"
              value={regNascimento}
              onChange={(e) => setRegNascimento(e.target.value)}
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

          {/* ==== FORM ESQUECI A SENHA ==== */}
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

  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [searchText, setSearchText] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👉 novo estado pra esconder/mostrar categorias// 👉 começa escondido
const [mostrarCategorias, setMostrarCategorias] = useState(false);
const iconesPorCategoria = {
  "Ação": "fa-burst",
  "Aventura": "fa-person-hiking",
  "RPG": "fa-hat-wizard",
  "Estratégia": "fa-chess-knight",
  "Simulação": "fa-cogs",
  "Esportes": "fa-football",
  "Corrida": "fa-car-side",
  "Puzzle": "fa-puzzle-piece",
  "Luta": "fa-hand-fist",
  "Tiro": "fa-crosshairs",
  "Plataforma": "fa-shoe-prints",
  "Horror": "fa-skull",
  "Indie": "fa-lightbulb",
  "Outros": "fa-gamepad"
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

        const listaComNotas = await Promise.all(
          listaComImagens.map(async (jogo) => {
            if (!jogo.id) return jogo;

            try {
              const respMedia = await fetchWithAuth(
                `/avaliacoes/media/${jogo.id}`
              );

              if (respMedia.status === 200) {
                const m = await respMedia.json();
                return {
                  ...jogo,
                  notaMedia:
                    typeof m.media === "number" ? m.media : null,
                  totalAvaliacoes: m.totalAvaliacoes ?? 0,
                };
              }

              return jogo;
            } catch (e) {
              console.error(
                "Erro ao buscar média de avaliações para",
                jogo.nome,
                e
              );
              return jogo;
            }
          })
        );

        setJogos(listaComNotas);
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
      if (jogo?.id) {
        console.log("ID do próprio objeto jogo:", jogo.nome, "→", jogo.id);
        return jogo.id;
      }

      if (!jogo?.nome) {
        showToast("Não foi possível identificar esse jogo (sem nome).", "error");
        return null;
      }

      const nomeAlvo = normalizeName(jogo.nome);

      const local = jogos.find(
        (j) => normalizeName(j.nome) === nomeAlvo && j.id
      );

      if (local?.id) {
        console.log("ID obtido via state jogos:", jogo.nome, "→", local.id);
        return local.id;
      }

      const idMapa = ID_POR_NOME[jogo.nome.trim()];
      if (idMapa) {
        console.log("ID obtido pelo mapa fixo:", jogo.nome, "→", idMapa);
        return idMapa;
      }

      console.log("Resolvendo ID via /public/jogos:", jogo.nome);

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
          <button
            id="toggle-genres"
            type="button"
            onClick={() => setMostrarCategorias((v) => !v)}
          >
            <i className="fa-solid fa-filter"></i>{" "}
            {mostrarCategorias ? "Ocultar filtros" : "Mostrar filtros"}
          </button>
        </div>

        {/* FILTRO POR CATEGORIA (esconde/mostra) */}
        {mostrarCategorias && (
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
        )}

        {/* LISTA DE JOGOS */}
        <section className="card_buys-container" id="card_buys-container">
          {loading ? (
            <p>Carregando jogos...</p>
          ) : jogosFiltrados.length === 0 ? (
            <p>Nenhum jogo encontrado.</p>
          ) : (
            jogosFiltrados.map((jogo) => {
              const notaNumero =
                typeof jogo.notaMedia === "number"
                  ? jogo.notaMedia
                  : typeof jogo.media === "number"
                  ? jogo.media
                  : typeof jogo.nota === "number"
                  ? jogo.nota
                  : null;

              const notaExibida =
                notaNumero !== null ? notaNumero.toFixed(1) : "—";

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
                    <div
                      className="card-rating"
                      title={
                        typeof jogo.totalAvaliacoes === "number" &&
                        jogo.totalAvaliacoes > 0
                          ? `${jogo.totalAvaliacoes} avaliação(ões)`
                          : "Ainda sem avaliações"
                      }
                    >
                      <i className="fa-solid fa-star"></i> {notaExibida}
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
  const { showToast, showConfirmToast } = useToast(); // ⬅️ agora pega o confirm também

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
  // REMOVER ITEM (DELETE /carrinho/:gameId) COM CONFIRMAÇÃO
  // ==========================
  function removerItem(item) {
    const jogo = item.jogo || {};
    const jogoId = jogo.id || item.fkJogo || item.fk_jogo || item.jogoId;
    const jogoNome = jogo.nome || "este jogo";

    if (!jogoId) {
      showToast("Item inválido para remoção.", "error");
      return;
    }

    showConfirmToast(
      `
        <strong>Remover item do carrinho?</strong><br>
        Deseja realmente remover <strong>${jogoNome}</strong> do seu carrinho?
      `,
      async () => {
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
      },
      {
        type: "warning",
        confirmText: "Sim, remover",
        cancelText: "Cancelar",
      }
    );
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
                  className={`thumb ${selectedImg === imgSrc ? "active" : ""
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
                className={`fa-solid fa-star ${rating >= value ? "active" : ""
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
  const { showToast, showConfirmToast } = useToast();

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

        // 1) Garante imagens e IDs consistentes
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

        // 2) Para cada jogo, buscar média de avaliação no backend
        const itensComImgENota = await Promise.all(
          itensComImg.map(async (item) => {
            const jogoBase = item.jogo || item;
            const jogoId = jogoBase.id;

            if (!jogoId) return item;

            try {
              const respMedia = await fetchWithAuth(
                `/avaliacoes/media/${jogoId}`
              );

              if (respMedia.status === 200) {
                const m = await respMedia.json();

                const jogoComNota = {
                  ...jogoBase,
                  notaMedia:
                    typeof m.media === "number" ? m.media : null,
                  totalAvaliacoes: m.totalAvaliacoes ?? 0,
                };

                if (item.jogo) {
                  return {
                    ...item,
                    jogo: jogoComNota,
                  };
                }

                return jogoComNota;
              }

              // sem avaliações / outro status → deixa como está
              return item;
            } catch (e) {
              console.error("Erro ao buscar média para wishlist:", e);
              return item;
            }
          })
        );

        setWishlist(itensComImgENota);
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

  // ⛔ agora usando confirmToast estilizado
  showConfirmToast(
    `
      <strong>Remover da Wishlist?</strong><br>
      Deseja realmente remover <strong>${jogoBase.nome}</strong> da sua lista de desejos?
    `,
    async () => {
      try {
        const resp = await fetchWithAuth("/lista-desejo", {
          method: "DELETE",
          body: JSON.stringify({ jogoId }),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          showToast(err.message || "Erro ao remover da wishlist.", "error");
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
    },
    {
      type: "warning",
      confirmText: "Sim, remover",
      cancelText: "Cancelar",
    }
  );
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
              : `${wishlist.length} jogo${wishlist.length > 1 ? "s" : ""
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

              // ✅ nota real vinda do backend (/avaliacoes/media)
              const notaNumero =
                typeof jogo.notaMedia === "number"
                  ? jogo.notaMedia
                  : typeof jogo.media === "number"
                    ? jogo.media
                    : typeof jogo.nota === "number"
                      ? jogo.nota
                      : null;

              const notaExibida =
                notaNumero !== null ? notaNumero.toFixed(1) : "—";

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
                    <div
                      className="rating"
                      title={
                        typeof jogo.totalAvaliacoes === "number" &&
                          jogo.totalAvaliacoes > 0
                          ? `${jogo.totalAvaliacoes} avaliação(ões)`
                          : "Ainda sem avaliações"
                      }
                    >
                      <i className="fa-solid fa-star"></i>{" "}
                      {notaExibida}
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

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [searchText, setSearchText] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);


  
  // ============================
  // CARREGAR JOGOS DO BACK-END
  // ============================
  useEffect(() => {
    async function carregarJogos() {
      try {
        setLoading(true);

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

        // pegar média de avaliação pra cada jogo
        const listaComNotas = await Promise.all(
          listaComImagens.map(async (jogo) => {
            if (!jogo.id) return jogo;

            try {
              const respMedia = await fetchWithAuth(
                `/avaliacoes/media/${jogo.id}`
              );

              if (respMedia.status === 200) {
                const m = await respMedia.json();
                return {
                  ...jogo,
                  notaMedia:
                    typeof m.media === "number" ? m.media : null,
                  totalAvaliacoes: m.totalAvaliacoes ?? 0,
                };
              }

              return jogo;
            } catch (e) {
              console.error(
                "Erro ao buscar média de avaliações para",
                jogo.nome,
                e
              );
              return jogo;
            }
          })
        );

        setJogos(listaComNotas);
      } catch (err) {
        console.error(err);
        showToast("Erro de conexão ao carregar jogos.", "error");
      } finally {
        setLoading(false);
      }
    }

    carregarJogos();
  }, [showToast]);

  // ============================
  // AUX: resolver ID do jogo
  // ============================
  async function resolverJogoIdNoServidor(jogo) {
    try {
      if (jogo?.id) return jogo.id;

      if (!jogo?.nome) {
        showToast("Não foi possível identificar esse jogo (sem nome).", "error");
        return null;
      }

      const nomeAlvo = normalizeName(jogo.nome);

      const local = jogos.find(
        (j) => normalizeName(j.nome) === nomeAlvo && j.id
      );
      if (local?.id) return local.id;

      const idMapa = ID_POR_NOME[jogo.nome.trim()];
      if (idMapa) return idMapa;

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

      return idx + 1;
    } catch (err) {
      console.error(err);
      showToast("Erro ao localizar jogo no servidor.", "error");
      return null;
    }
  }

  // ============================
  // WISHLIST / CARRINHO
  // ============================
  async function adicionarFavorito(jogo) {
    try {
      const jogoId = jogo.id || (await resolverJogoIdNoServidor(jogo));
      if (!jogoId) return;

      const resp = await fetchWithAuth("/lista-desejo", {
        method: "POST",
        body: JSON.stringify({ jogoId }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
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

  async function comprarJogo(jogo) {
    try {
      const jogoId = jogo.id || (await resolverJogoIdNoServidor(jogo));
      if (!jogoId) return;

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
    } catch (err) {
      console.error(err);
      showToast("Erro de conexão ao adicionar ao carrinho.", "error");
    }
  }

  // ============================
  // CATEGORIAS / FILTRO
  // ============================
  const categoriasUnicas = [
    "Todos",
    ...Array.from(new Set(jogos.map((j) => j.categoria || "Outros"))),
  ];

  const jogosFiltradosOrdenados = [...jogos]
    .filter((j) => {
      let ok = true;

      if (categoriaAtiva !== "Todos") {
        ok = ok && (j.categoria || "").includes(categoriaAtiva);
      }

      if (searchText.trim()) {
        ok =
          ok &&
          (j.nome || "")
            .toLowerCase()
            .includes(searchText.toLowerCase());
      }

      return ok;
    })
    .sort((a, b) => {
      const notaA =
        typeof a.notaMedia === "number"
          ? a.notaMedia
          : typeof a.media === "number"
            ? a.media
            : typeof a.nota === "number"
              ? a.nota
              : 0;

      const notaB =
        typeof b.notaMedia === "number"
          ? b.notaMedia
          : typeof b.media === "number"
            ? b.media
            : typeof b.nota === "number"
              ? b.nota
              : 0;

      return notaB - notaA;
    });

  // jogos destaque (recomendações): top 3
  const jogosRecomendados = jogosFiltradosOrdenados.slice(0, 3);

  return (
    <div className="container">
      {/* header local da página */}
      <header className="header">
        <div className="title">
          <i className="fa-solid fa-compass"></i> Explorar
        </div>
        <div className="search-support">
          <input
            type="text"
            placeholder="Buscar jogo..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button>
            <i className="fa-solid fa-headset"></i> Suporte
          </button>
        </div>
      </header>

      <Sidebar />

      {/* HERO */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Descubra Novos Mundos</h1>
          <p>
            Explore todos os jogos disponíveis, veja avaliações da
            comunidade e encontre seu próximo vício digital.
          </p>
          <button
            className="explore-btn"
            onClick={() => {
              const anchor = document.getElementById("all-games-anchor");
              if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <i className="fa-solid fa-gamepad" /> Ver Todos os Jogos
          </button>
        </div>
      </section>

      {/* RECOMENDADOS */}
      <section className="recommendations">
        <h2>
          <i className="fa-solid fa-fire"></i> Recomendados para você
        </h2>

        <div className="game-cards">
          {jogosRecomendados.length === 0 ? (
            <p>Nenhum jogo recomendado no momento.</p>
          ) : (
            jogosRecomendados.map((jogo) => {
              const notaNumero =
                typeof jogo.notaMedia === "number"
                  ? jogo.notaMedia
                  : typeof jogo.media === "number"
                    ? jogo.media
                    : typeof jogo.nota === "number"
                      ? jogo.nota
                      : null;

              const notaExibida =
                notaNumero !== null ? notaNumero.toFixed(1) : "—";

              const capaSrc =
                (jogo.imagens && jogo.imagens[0]) ||
                "/img/placeholder.jpg";

              return (
                <div
                  className="game-card"
                  key={jogo.id || jogo.nome}
                  onClick={() =>
                    navigate(
                      `/descricao/${encodeURIComponent(jogo.nome)}`
                    )
                  }
                >
                  <img
                    src={capaSrc}
                    alt={jogo.nome}
                    onError={(e) => {
                      e.target.src = "/img/placeholder.jpg";
                    }}
                  />
                  <div className="game-info">
                    <h3>{jogo.nome}</h3>
                    <p>{jogo.descricao}</p>

                    <div className="game-meta">
                      {jogo.categoria || "Categoria"} •{" "}
                      {jogo.ano || "Ano N/D"}
                    </div>

                    <div className="recommended-actions">
                      <span className="rating-badge">
                        <i className="fa-solid fa-star" />{" "}
                        {notaExibida}
                      </span>

                      <button
                        className="mini-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          comprarJogo(jogo);
                        }}
                      >
                        Comprar
                      </button>

                      <button
                        className="mini-btn ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          adicionarFavorito(jogo);
                        }}
                      >
                        <i className="fa-solid fa-heart" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="categories">
        <h2>
          <i className="fa-solid fa-layer-group"></i> Categorias
        </h2>

        <div className="category-grid">
          {categoriasUnicas.map((cat) => (
            <div
              key={cat}
              className={`category-card ${categoriaAtiva === cat ? "active" : ""
                }`}
              onClick={() => setCategoriaAtiva(cat)}
            >
              <i className="fa-solid fa-gamepad" /> {cat}
            </div>
          ))}
        </div>
      </section>

      {/* TODOS OS JOGOS – ESTILO LINHA / RANKING (SEM NÚMERO) */}
      <section className="all-games" id="all-games-anchor">
        <h2>
          <i className="fa-solid fa-list"></i> Todos os Jogos
        </h2>

        {loading ? (
          <p>Carregando jogos...</p>
        ) : jogosFiltradosOrdenados.length === 0 ? (
          <p className="error-msg">
            Nenhum jogo encontrado com esses filtros.
          </p>
        ) : (
          <div className="all-games-list">
            {jogosFiltradosOrdenados.map((jogo, idx) => {
              const notaNumero =
                typeof jogo.notaMedia === "number"
                  ? jogo.notaMedia
                  : typeof jogo.media === "number"
                    ? jogo.media
                    : typeof jogo.nota === "number"
                      ? jogo.nota
                      : null;

              const notaExibida =
                notaNumero !== null ? notaNumero.toFixed(1) : "—";

              return (
                <div
                  key={jogo.id || jogo.nome || idx}
                  className="ranking-row"
                  onClick={() =>
                    navigate(
                      `/descricao/${encodeURIComponent(jogo.nome)}`
                    )
                  }
                >
                  {/* ESQUERDA: capa + infos */}
                  <div className="ranking-game-main">
                    <div className="ranking-game-thumb">
                      <GameCardImage jogo={jogo} />
                    </div>
                    <div className="ranking-game-info">
                      <h3>{jogo.nome}</h3>
                      <p className="ranking-game-meta">
                        {jogo.categoria || "Categoria"} •{" "}
                        {jogo.ano || "Ano N/D"}
                      </p>
                    </div>
                  </div>

                  {/* MEIO: nota */}
                  <div className="ranking-game-rating">
                    <div
                      className="rating-badge big"
                      title={
                        typeof jogo.totalAvaliacoes === "number" &&
                          jogo.totalAvaliacoes > 0
                          ? `${jogo.totalAvaliacoes} avaliação(ões)`
                          : "Ainda sem avaliações"
                      }
                    >
                      <i className="fa-solid fa-star" /> {notaExibida}
                      <span className="rating-total"></span>
                    </div>
                  </div>

                  {/* DIREITA: preço + botões */}
                  <div className="ranking-game-actions">
                    <div className="ranking-price">
                      R$ {Number(jogo.preco || 0).toFixed(2)}
                    </div>

                    <button
                      className="ranking-btn outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/descricao/${encodeURIComponent(jogo.nome)}`
                        );
                      }}
                    >
                      <i className="fa-solid fa-eye" /> Ver Jogo
                    </button>

                    <button
                      className="ranking-btn primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        comprarJogo(jogo);
                      }}
                    >
                      <i className="fa-solid fa-cart-shopping" /> Comprar
                    </button>

                    <button
                      className="ranking-btn ghost"
                      title="Adicionar à lista de desejos"
                      onClick={(e) => {
                        e.stopPropagation();
                        adicionarFavorito(jogo);
                      }}
                    >
                      <i className="fa-solid fa-heart" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
    
  );
}




// =========================================================
/* PERFIL (ainda estático, só visual) */
// =========================================================
// =========================================================
/* PERFIL (integrado com backend + jogos comprados) */
// =========================================================
function ProfilePage() {
  usePageCss(["/css/layout.css", "/css/perfil.css"]);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [usuario, setUsuario] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  // stats
  const [jogosCount, setJogosCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [totalGasto, setTotalGasto] = useState(0);

  // histórico de compras (vem de /vendas)
  const [compras, setCompras] = useState([]);

  // troca de senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  // NOVO: controla se o formulário de alterar senha está visível
  const [mostrarAlterarSenha, setMostrarAlterarSenha] = useState(false);

  function formatarDataCompra(valorData) {
    if (!valorData) return "—";
    const d = new Date(valorData);
    if (Number.isNaN(d.getTime())) return "—";
    return (
      d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      " " +
      d.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }

  // ========= carregar dados =========
  useEffect(() => {
    const logged = getLoggedUser();
    if (!logged) {
      setLoading(false);
      navigate("/login");
      return;
    }

    async function carregarTudo() {
      try {
        setLoading(true);

        // 1) Dados do usuário
        try {
          const respUser = await fetchWithAuth(`/usuarios/${logged.id}`);
          if (respUser.status === 401) {
            showToast("Sessão expirada. Faça login novamente.", "error");
            navigate("/login");
            return;
          }

          if (respUser.ok) {
            const data = await respUser.json();
            console.log("USUARIO /usuarios/:id =>", data);
            setUsuario(data);
            setNome(data.nome || logged.nome || "");
            setEmail(data.email || logged.email || "");
          } else {
            showToast("Não foi possível carregar os dados do perfil.", "error");
            setUsuario(logged);
            setNome(logged.nome || "");
            setEmail(logged.email || "");
          }
        } catch (e) {
          console.error(e);
          showToast("Erro ao carregar dados do usuário.", "error");
        }

        // 2) Histórico de compras (/vendas)
        try {
          const respVendas = await fetchWithAuth("/vendas");
          console.log("STATUS /vendas:", respVendas.status);

          if (respVendas.status === 200) {
            const vendas = await respVendas.json();
            const lista = Array.isArray(vendas) ? vendas : [];

            setCompras(lista);

            const totalJogos = lista.reduce(
              (acc, v) => acc + Number(v.quantidade || 0),
              0
            );

            const totalGastoCalc = lista.reduce(
              (acc, v) =>
                acc + Number(v.valor_total ?? v.valorTotal ?? 0),
              0
            );

            setJogosCount(totalJogos);
            setTotalGasto(totalGastoCalc);
          } else if (respVendas.status === 204) {
            setCompras([]);
            setJogosCount(0);
            setTotalGasto(0);
            console.log("Nenhuma venda encontrada para este usuário.");
          }
        } catch (e) {
          console.error(e);
          showToast("Erro ao carregar histórico de compras.", "error");
        }

        // 3) Wishlist (/lista-desejo)
        try {
          const respWish = await fetchWithAuth("/lista-desejo");
          if (respWish.status === 200) {
            const data = await respWish.json();
            const itens = Array.isArray(data) ? data : data.itens || [];
            setWishlistCount(itens.length);
          } else if (respWish.status === 204) {
            setWishlistCount(0);
          }
        } catch (e) {
          console.error(e);
          showToast("Erro ao carregar lista de desejos.", "error");
        }
      } finally {
        setLoading(false);
      }
    }

    carregarTudo();
  }, [navigate, showToast]);

  // ========= salvar perfil =========
  async function handleSaveProfile(e) {
    e.preventDefault();

    const logged = getLoggedUser();
    if (!logged) {
      navigate("/login");
      return;
    }

    if (!nome.trim()) {
      showToast("O nome não pode ficar vazio.", "error");
      return;
    }

    // só manda nome agora
    const body = { nome: nome.trim() };

    try {
      setSalvandoPerfil(true);

      const resp = await fetchWithAuth(`/usuarios/${logged.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        showToast(data.message || "Erro ao atualizar perfil.", "error");
        return;
      }

      showToast(data.message || "Perfil atualizado com sucesso!", "success");

      const token = getAuthToken();
      setLoggedUser(
        {
          ...(usuario || logged),
          nome: nome.trim(),
        },
        token
      );

      setEditMode(false);
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao atualizar perfil.", "error");
    } finally {
      setSalvandoPerfil(false);
    }
  }

  // ========= trocar senha =========
  async function handleChangePassword(e) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Preencha todas as senhas.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("A confirmação da nova senha não confere.", "error");
      return;
    }

    try {
      setSalvandoSenha(true);

      const resp = await fetchWithAuth("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        showToast(data.message || "Erro ao alterar senha.", "error");
        return;
      }

      showToast(data.message || "Senha alterada com sucesso!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // opcional: fechar o bloco depois de alterar
      // setMostrarAlterarSenha(false);
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao alterar senha.", "error");
    } finally {
      setSalvandoSenha(false);
    }
  }

  const perfilNome =
    (usuario && (usuario.perfil || usuario.perfilNome)) ||
    getLoggedUser()?.perfil ||
    "Cliente";

  return (
    <div className="container">
      {/* cabeçalho da página de perfil */}
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
        {/* ================== BLOCO INFO PERFIL ================== */}
        <section className="profile-info">
          <h2>Informações do Perfil</h2>

          {loading ? (
            <p>Carregando dados do perfil...</p>
          ) : (
            <div className="profile-details">
              <div className="avatar">
                <i className="fa-solid fa-user"></i>
              </div>

              {!editMode ? (
                <>
                  <p>
                    <strong>Nome:</strong> {nome || "-"}
                  </p>
                  <p>
                    <strong>Email:</strong> {email || "-"}
                  </p>
                  <p>
                    <strong>Perfil:</strong> {perfilNome}
                  </p>

                  <p>
                    <strong>Jogos Comprados:</strong> {jogosCount}
                  </p>

                  <button
                    className="edit-btn"
                    type="button"
                    onClick={() => setEditMode(true)}
                  >
                    <i className="fa-solid fa-pen"></i> Editar Perfil
                  </button>
                </>
              ) : (
                <form
                  className="profile-edit-form"
                  onSubmit={handleSaveProfile}
                >
                  <label>
                    Nome
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </label>

                  <div className="profile-edit-actions">
                    <button
                      type="button"
                      className="edit-cancel-btn"
                      onClick={() => {
                        if (usuario) {
                          setNome(usuario.nome || nome);
                        }
                        setEditMode(false);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="edit-save-btn"
                      disabled={salvandoPerfil}
                    >
                      {salvandoPerfil ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </section>

        {/* ================== BLOCO SEGURANÇA / SENHA ================== */}
        <section className="profile-settings">
          <h2>Segurança</h2>

          {/* Botão que mostra/esconde o formulário de alterar senha */}
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() =>
              setMostrarAlterarSenha((prev) => !prev)
            }
          >
            <i className="fa-solid fa-lock"></i>{" "}
            {mostrarAlterarSenha ? "Fechar Alterar Senha" : "Alterar Senha"}
          </button>

          {mostrarAlterarSenha && (
            <form className="password-form" onSubmit={handleChangePassword}>
              <label>
                Senha atual
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </label>

              <label>
                Nova senha
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>

              <label>
                Confirmar nova senha
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>

              <button type="submit" disabled={salvandoSenha}>
                <i className="fa-solid fa-lock"></i>{" "}
                {salvandoSenha ? "Atualizando..." : "Atualizar Senha"}
              </button>
            </form>
          )}

          <h2 style={{ marginTop: "25px" }}>Preferências</h2>
          <form id="profile-settings-form">
            <label>
              <input type="checkbox" defaultChecked /> Notificações por email
            </label>

            <label>
              <input type="checkbox" defaultChecked /> Notificações push
            </label>
            <button type="button">
              <i className="fa-solid fa-save"></i> (Demo) Salvar Preferências
            </button>
          </form>
        </section>
      </main>

      {/* ================== HISTÓRICO DE COMPRAS ================== */}
      <section className="profile-games">
        <h2>Histórico de Compras</h2>

        {loading ? (
          <p>Carregando compras...</p>
        ) : compras.length === 0 ? (
          <p>Você ainda não finalizou nenhuma compra.</p>
        ) : (
          <div className="purchases-grid">
            {compras.map((venda) => (
              <div className="purchase-card" key={venda.id}>
                <h3>Pedido #{venda.id}</h3>
                <p>
                  <strong>Data:</strong>{" "}
                  {formatarDataCompra(venda.data)}
                </p>
                <p>
                  <strong>Jogos nessa compra:</strong>{" "}
                  {venda.quantidade}
                </p>
                <p>
                  <strong>Valor total:</strong> R${" "}
                  {Number(
                    venda.valor_total || venda.valorTotal || 0
                  ).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================== STATS ================== */}
      <section className="profile-stats">
        <h2>Suas Estatísticas</h2>
        <div className="stats-grid">
          <div className="stat-card blue">
            <i className="fa-solid fa-gamepad"></i>
            <h3>{jogosCount}</h3>
            <p>Jogos Possuídos</p>
          </div>
          <div className="stat-card red">
            <i className="fa-solid fa-heart"></i>
            <h3>{wishlistCount}</h3>
            <p>Lista de Desejos</p>
          </div>
          <div className="stat-card green">
            <i className="fa-solid fa-coins"></i>
            <h3>R$ {totalGasto.toFixed(2)}</h3>
            <p>Total Gasto</p>
          </div>
        </div>
      </section>
    </div>
  );
}




// =========================================================
/* RANKING (visual) */
// =========================================================
function RankingPage() {
  usePageCss(["/css/layout.css", "/css/ranking.css"]);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Helper pra achar a nota média do jogo
  function getNotaMedia(jogo) {
    if (typeof jogo.notaMedia === "number") return jogo.notaMedia;
    if (typeof jogo.media === "number") return jogo.media;
    if (typeof jogo.nota === "number") return jogo.nota;
    return null;
  }

  useEffect(() => {
    async function carregarRanking() {
      try {
        setLoading(true);

        // 1) Buscar todos os jogos públicos
        const resp = await fetch(`${API_BASE_URL}/public/jogos`);
        if (!resp.ok) {
          showToast("Erro ao carregar jogos para o ranking.", "error");
          setLoading(false);
          return;
        }

        const data = await resp.json();
        const lista = Array.isArray(data) ? data : [];

        // 2) Acrescentar imagens locais e garantir um id
        const listaComImagens = lista.map((jogoOriginal, idx) => {
          const transformado = withLocalImages(jogoOriginal) || {};

          const idDoBack =
            jogoOriginal.id ??
            jogoOriginal.ID ??
            jogoOriginal.id_jogo ??
            jogoOriginal.jogoId ??
            (jogoOriginal.nome
              ? ID_POR_NOME[jogoOriginal.nome.trim()]
              : null);

          const idFinal = idDoBack ?? idx + 1;

          return {
            ...jogoOriginal,
            ...transformado,
            id: idFinal,
          };
        });

        // 3) Buscar média de avaliações /avaliacoes/media/:id
        const listaComNotas = await Promise.all(
          listaComImagens.map(async (jogo) => {
            if (!jogo.id) return jogo;

            try {
              const respMedia = await fetchWithAuth(
                `/avaliacoes/media/${jogo.id}`
              );

              if (respMedia.status === 200) {
                const m = await respMedia.json();
                return {
                  ...jogo,
                  notaMedia:
                    typeof m.media === "number" ? m.media : null,
                  totalAvaliacoes: m.totalAvaliacoes ?? 0,
                };
              }

              // sem avaliações (204) ou outro status
              return {
                ...jogo,
                notaMedia: null,
                totalAvaliacoes: 0,
              };
            } catch (e) {
              console.error(
                "Erro ao carregar média de avaliações para",
                jogo.nome,
                e
              );
              return jogo;
            }
          })
        );

        // 4) Ordenar por nota (desc) e guardar
        listaComNotas.sort((a, b) => {
          const notaA = getNotaMedia(a) ?? 0;
          const notaB = getNotaMedia(b) ?? 0;
          return notaB - notaA;
        });

        setJogos(listaComNotas);
      } catch (err) {
        console.error(err);
        showToast("Erro de conexão ao carregar ranking.", "error");
      } finally {
        setLoading(false);
      }
    }

    carregarRanking();
  }, [showToast]);

  // filtro por texto da busca
  const jogosFiltrados = jogos.filter((j) =>
    searchText.trim()
      ? j.nome?.toLowerCase().includes(searchText.toLowerCase())
      : true
  );

  // 🔥 só os 5 melhores
  const top5 = jogosFiltrados.slice(0, 5);

  return (
    <div className="container">
      <header className="header">
        <div className="title">
          <i className="fa-solid fa-ranking-star"></i> Ranking de Jogos
        </div>
        <div className="search-support">
          <input
            type="text"
            placeholder="Buscar jogo..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button>
            <i className="fa-solid fa-headset"></i> Suporte
          </button>
        </div>
      </header>

      <Sidebar />

      <main className="ranking-container">
        <h2>Top Jogos Avaliados</h2>

        {loading ? (
          <p>Carregando ranking...</p>
        ) : top5.length === 0 ? (
          <p>Nenhum jogo encontrado para esse filtro.</p>
        ) : (
          <div className="ranking-list">
            {top5.map((jogo, index) => {
              const rank = index + 1;
              const notaNumero = getNotaMedia(jogo);
              const notaExibida =
                notaNumero !== null ? notaNumero.toFixed(1) : "—";
              const totalAvaliacoes = jogo.totalAvaliacoes ?? 0;

              // classes pra #1, #2, #3
              let extraClass = "";
              if (rank === 1) extraClass = "gold";
              else if (rank === 2) extraClass = "silver";
              else if (rank === 3) extraClass = "bronze";

              const imgSrc =
                (jogo.imagens && jogo.imagens[0]) ||
                "/img/placeholder.jpg";

              return (
                <div
                  key={jogo.id || jogo.nome}
                  className={`ranking-item ${extraClass}`}
                  onClick={() => {
                    if (!jogo.nome) return;
                    navigate(
                      `/descricao/${encodeURIComponent(jogo.nome)}`
                    );
                  }}
                >
                  <span className="rank-number">#{rank}</span>

                  <img
                    src={imgSrc}
                    alt={jogo.nome}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/placeholder.jpg";
                    }}
                  />

                  <div className="info">
                    <h3>{jogo.nome}</h3>
                    <p>
                      <i className="fa-solid fa-star"></i>{" "}
                      {notaExibida}{" "}
                      {totalAvaliacoes > 0 && (
                        <span className="total-avaliacoes">
                          ({totalAvaliacoes})
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!jogo.nome) return;
                      navigate(
                        `/descricao/${encodeURIComponent(jogo.nome)}`
                      );
                    }}
                  >
                    <i className="fa-solid fa-eye"></i> Ver Jogo
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

    
    </div>
  );
}

// =========================================================
/* ADMIN - SIDEBAR */
// =========================================================
function SideBarAdmin({ onLogout }) {
  return (
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
        <Link to="/admin/avaliacoes">
          <i className="fa-solid fa-comments"></i> Avaliações
        </Link>
        <Link to="/admin/relatorios">
          <i className="fa-solid fa-chart-column"></i> Relatórios
        </Link>

        <button
          type="button"
          className="sidebar-link-logout"
          onClick={onLogout}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Sair</span>
        </button>
      </nav>
    </aside>
  );
}

  function AdminLayout() {
    usePageCss(["/css/admin.css"]);
    const navigate = useNavigate();
    const { showToast, showConfirmToast } = useToast();

    const handleLogoutConfirmado = () => {
      setLoggedUser(null);
      showToast("Você saiu do painel administrativo.", "info");
      navigate("/login");
    };

    const handleLogout = () => {
      showConfirmToast(
        "Tem certeza que deseja sair do painel administrativo?",
        handleLogoutConfirmado,
        {
          type: "warning",
          confirmText: "Sair",
          cancelText: "Cancelar",
        }
      );
    };

    return (
      <div className="container">
        <SideBarAdmin onLogout={handleLogout} />

        <main className="content">
          <Outlet />
        </main>
      </div>
    );
  }

  /* =========================================
    ADMIN - DASHBOARD (já conversando com /usuarios, /jogos, /vendas)
  ========================================= */
function AdminDashboard({ onNavigate }) {
  usePageCss(["/css/relatorio.css"]);

  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    usuarios: 0,
    jogos: 0,
  });

  const [ultimosJogos, setUltimosJogos] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const [rUsers, rJogos] = await Promise.all([
          fetchWithAuth("/usuarios"),
          fetchWithAuth("/jogos"),
        ]);

        const usuarios = rUsers.ok ? await rUsers.json() : [];
        const jogos = rJogos.ok ? await rJogos.json() : [];

        const arrUsuarios = Array.isArray(usuarios) ? usuarios : [];
        const arrJogos = Array.isArray(jogos) ? jogos : [];

        setMetrics({
          usuarios: arrUsuarios.length,
          jogos: arrJogos.length,
        });

        const ult = [...arrJogos].slice(-5).reverse();
        setUltimosJogos(ult);
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
        <p>Acompanhe rapidamente os principais números da Tok-Store.</p>
      </section>

      {/* CARDS PRINCIPAIS */}
      <section className="cards">
        <div
          className="card"
          onClick={() => irPara("usuarios")}
          style={{ cursor: onNavigate ? "pointer" : "default" }}
        >
          <h3>Usuários</h3>
          <p>{loading ? "..." : metrics.usuarios}</p>
          <span className="card-subtitle">Total de contas cadastradas</span>
        </div>

        <div
          className="card"
          onClick={() => irPara("jogos")}
          style={{ cursor: onNavigate ? "pointer" : "default" }}
        >
          <h3>Jogos</h3>
          <p>{loading ? "..." : metrics.jogos}</p>
          <span className="card-subtitle">Jogos disponíveis na loja</span>
        </div>
      </section>

      {/* JOGOS RECENTES */}
      <section className="charts">
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
                  <strong>{j.nome}</strong> — <span>{j.ano}</span> •{" "}
                  <span>R$ {Number(j.preco || 0).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}



  /* =========================================
    ADMIN - EMPRESAS (CRUD /empresas)
  ========================================= */
function AdminEmpresasPage() {
  usePageCss(["/css/empresas.css"]);
  const { showToast, showConfirmToast } = useToast();

  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [editId, setEditId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const [formAberto, setFormAberto] = useState(false);

  // ================================
  // Carregar lista de empresas
  // ================================
  async function carregarEmpresas() {
    try {
      setLoading(true);
      const resp = await fetchWithAuth("/empresas");
      if (!resp.ok) {
        showToast("Erro ao carregar empresas.", "error");
        setEmpresas([]);
        return;
      }
      const data = await resp.json();
      setEmpresas(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao carregar empresas.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarEmpresas();
  }, []);

  // ================================
  // Form helpers
  // ================================
  function limparForm() {
    setNome("");
    setEditId(null);
    // se quiser fechar o form ao cancelar:
    // setFormAberto(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nome.trim()) {
      showToast("Informe o nome da empresa.", "error");
      return;
    }

    const body = { nome: nome.trim() };

    try {
      setSalvando(true);
      let resp;

      if (editId) {
        resp = await fetchWithAuth(`/empresas/${editId}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        resp = await fetchWithAuth("/empresas", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        showToast(
          data.message || data.error || "Erro ao salvar empresa.",
          "error"
        );
        return;
      }

      showToast(
        data.message ||
          (editId
            ? "Empresa atualizada com sucesso."
            : "Empresa criada com sucesso."),
        "success"
      );

      limparForm();
      carregarEmpresas();
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao salvar empresa.", "error");
    } finally {
      setSalvando(false);
    }
  }

  function handleEditar(empresa) {
    setEditId(empresa.id);
    setNome(empresa.nome || "");
    setFormAberto(true);
  }

  // ================================
  // Exclusão com toast de confirmação
  // ================================
  async function excluirEmpresa(empresa) {
  try {
    const resp = await fetchWithAuth(`/empresas/${empresa.id}`, {
      method: "DELETE",
    });
    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      // elemento em uso (FK, etc.)
      if (resp.status === 409 || resp.status === 500) {
        showToast(
          "Não é possível exclusão devido a este elemento estar em uso.",
          "error"
        );
      } else {
        const msgBack =
          data.error || data.message || "Erro ao excluir empresa.";
        showToast(msgBack, "error");
      }
      return;
    }

    showToast(data.message || "Empresa excluída com sucesso.", "success");
    carregarEmpresas();
  } catch (e) {
    console.error(e);
    showToast("Erro de conexão ao excluir empresa.", "error");
  }
}


  function handleExcluir(empresa) {
    showConfirmToast(
      `Tem certeza que deseja excluir a empresa "${empresa.nome}"?`,
      () => excluirEmpresa(empresa),
      {
        type: "warning",
        confirmText: "Excluir",
        cancelText: "Cancelar",
      }
    );
  }

  // ================================
  // Render
  // ================================
  return (
    <>
      <header className="header">
        <div className="header-left">
          <button
            type="button"
            className={`btn-toggle-form ${formAberto ? "aberto" : ""}`}
            onClick={() => setFormAberto((prev) => !prev)}
            title={formAberto ? "Fechar cadastro" : "Nova empresa"}
          >
            <i className="fa-solid fa-plus"></i>
          </button>

          <div>
            <h1>Empresas</h1>
            <p>Gerencie as empresas desenvolvedoras/publicadoras de jogos.</p>
          </div>
        </div>
      </header>

      {(formAberto || editId) && (
        <section className="form-section">
          <h2>{editId ? "Editar Empresa" : "Cadastrar Empresa"}</h2>
          <form className="empresa-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nomeEmpresa">Nome da Empresa</label>
              <input
                type="text"
                id="nomeEmpresa"
                placeholder="Ex: CD Projekt Red"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn-salvar" disabled={salvando}>
                <i className="fa-solid fa-floppy-disk"></i>{" "}
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={limparForm}
                >
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      <section className="table-section">
        <h2>Empresas Cadastradas</h2>
        {loading ? (
          <p>Carregando empresas...</p>
        ) : empresas.length === 0 ? (
          <p>Nenhuma empresa cadastrada.</p>
        ) : (
          <table className="empresa-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.nome}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-editar"
                      onClick={() => handleEditar(emp)}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-excluir"
                      onClick={() => handleExcluir(emp)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}



  /* =========================================
    ADMIN - CATEGORIAS (CRUD /categorias)
  ========================================= */
 function AdminCategoriasPage() {
  usePageCss(["/css/categorias.css"]);
  const { showToast, showConfirmToast } = useToast();

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [editId, setEditId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  // NOVO: controla se o formulário está visível
  const [formAberto, setFormAberto] = useState(false);

  async function carregarCategorias() {
    try {
      setLoading(true);
      const resp = await fetchWithAuth("/categorias");
      if (!resp.ok) {
        showToast("Erro ao carregar categorias.", "error");
        setCategorias([]);
        return;
      }
      const data = await resp.json();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao carregar categorias.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  function limparForm() {
    setNome("");
    setEditId(null);
    // se quiser que feche o form ao cancelar:
    // setFormAberto(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nome.trim()) {
      showToast("Informe o nome da categoria.", "error");
      return;
    }

    const body = { nome: nome.trim() };

    try {
      setSalvando(true);
      let resp;
      if (editId) {
        resp = await fetchWithAuth(`/categorias/${editId}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        resp = await fetchWithAuth("/categorias", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        showToast(data.message || "Erro ao salvar categoria.", "error");
        return;
      }

      showToast(
        data.message ||
          (editId
            ? "Categoria atualizada com sucesso."
            : "Categoria criada com sucesso."),
        "success"
      );
      limparForm();
      carregarCategorias();
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao salvar categoria.", "error");
    } finally {
      setSalvando(false);
    }
  }

async function excluirCategoria(cat) {
  try {
    const resp = await fetchWithAuth(`/categorias/${cat.id}`, {
      method: "DELETE",
    });
    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      // elemento em uso (FK, etc.)
      if (resp.status === 409 || resp.status === 500) {
        showToast(
          "Não é possível exclusão devido a este elemento estar em uso.",
          "error"
        );
      } else {
        showToast(
          data.message || "Erro ao excluir categoria.",
          "error"
        );
      }
      return;
    }

    showToast(
      data.message || "Categoria excluída com sucesso.",
      "success"
    );
    carregarCategorias();
  } catch (e) {
    console.error(e);
    showToast("Erro de conexão ao excluir categoria.", "error");
  }
}


  function handleExcluir(cat) {
    showConfirmToast(
      `Tem certeza que deseja excluir a categoria "${cat.nome}"?`,
      () => excluirCategoria(cat),
      {
        type: "warning",
        confirmText: "Excluir",
        cancelText: "Cancelar",
      }
    );
  }

  function handleEditar(cat) {
    setEditId(cat.id);
    setNome(cat.nome || "");
    // garante que o formulário apareça ao editar
    setFormAberto(true);
  }

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button
            type="button"
            className={`btn-toggle-form ${formAberto ? "aberto" : ""}`}
            onClick={() => setFormAberto((prev) => !prev)}
            title={formAberto ? "Fechar cadastro" : "Nova categoria"}
          >
            <i className="fa-solid fa-plus"></i>
          </button>

          <div>
            <h1>Categorias</h1>
            <p>Gerencie as categorias de jogos disponíveis na loja.</p>
          </div>
        </div>
      </header>

      {(formAberto || editId) && (
        <section className="form-section">
          <h2>{editId ? "Editar Categoria" : "Cadastrar Categoria"}</h2>
          <form className="categoria-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nomeCategoria">Nome da Categoria</label>
              <input
                type="text"
                id="nomeCategoria"
                placeholder="Ex: RPG, Ação, Terror..."
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn-salvar" disabled={salvando}>
                <i className="fa-solid fa-floppy-disk"></i>{" "}
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={limparForm}
                >
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      <section className="table-section">
        <h2>Categorias Cadastradas</h2>
        {loading ? (
          <p>Carregando categorias...</p>
        ) : categorias.length === 0 ? (
          <p>Nenhuma categoria cadastrada.</p>
        ) : (
          <table className="categoria-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.nome}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-editar"
                      onClick={() => handleEditar(cat)}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-excluir"
                      onClick={() => handleExcluir(cat)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

  /* =========================================
    ADMIN - JOGOS (CRUD /jogos, usando /empresas e /categorias)
  ========================================= */
function AdminJogosPage() {
  usePageCss(["/css/jogos.css"]);
  const { showToast, showConfirmToast } = useToast();

  const [jogos, setJogos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);
  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [salvando, setSalvando] = useState(false);

  // NOVO: controla se o formulário está visível
  const [formAberto, setFormAberto] = useState(false);

  async function carregarDados() {
    try {
      setLoading(true);

      const [rJogos, rEmpresas, rCategorias] = await Promise.all([
        fetchWithAuth("/jogos"),
        fetchWithAuth("/empresas"),
        fetchWithAuth("/categorias"),
      ]);

      const jogosJson = rJogos.ok ? await rJogos.json() : [];
      const empJson = rEmpresas.ok ? await rEmpresas.json() : [];
      const catJson = rCategorias.ok ? await rCategorias.json() : [];

      setJogos(Array.isArray(jogosJson) ? jogosJson : []);
      setEmpresas(Array.isArray(empJson) ? empJson : []);
      setCategorias(Array.isArray(catJson) ? catJson : []);
    } catch (e) {
      console.error(e);
      showToast("Erro ao carregar jogos/empresas/categorias.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function limparForm() {
    setEditId(null);
    setNome("");
    setAno("");
    setPreco("");
    setDescricao("");
    setEmpresaId("");
    setCategoriaId("");
    // se quiser, já pode fechar o formulário ao limpar:
    // setFormAberto(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nome.trim()) {
      showToast("Informe o nome do jogo.", "error");
      return;
    }

    if (!empresaId) {
      showToast("Selecione a empresa do jogo.", "error");
      return;
    }

    if (!categoriaId) {
      showToast("Selecione a categoria do jogo.", "error");
      return;
    }

    const body = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      ano: ano ? Number(ano) : null,
      preco: preco ? Number(preco) : 0,
      desconto: 0,
      fkEmpresa: Number(empresaId),
      fkCategoria: Number(categoriaId),
    };

    try {
      setSalvando(true);
      let resp;
      if (editId) {
        resp = await fetchWithAuth(`/jogos/${editId}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        resp = await fetchWithAuth("/jogos", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        showToast(data.message || "Erro ao salvar jogo.", "error");
        return;
      }

      showToast(
        data.message ||
          (editId
            ? "Jogo atualizado com sucesso."
            : "Jogo cadastrado com sucesso."),
        "success"
      );
      limparForm();
      carregarDados();
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao salvar jogo.", "error");
    } finally {
      setSalvando(false);
    }
  }

  function handleEditar(j) {
    setEditId(j.id);
    setNome(j.nome || "");
    setAno(j.ano || "");
    setPreco(j.preco || "");
    setDescricao(j.descricao || "");

    setEmpresaId(j.fkEmpresa || j.fk_empresa || j.empresaId || "");
    setCategoriaId(j.fkCategoria || j.fk_categoria || j.categoriaId || "");

    // ao editar, garante que o formulário apareça
    setFormAberto(true);
  }

  async function excluirJogo(jogo) {
    try {
      const resp = await fetchWithAuth(`/jogos/${jogo.id}`, {
        method: "DELETE",
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        if (resp.status === 500) {
          showToast("Este jogo não pode ser excluído.", "error");
        } else {
          showToast(
            data.message || data.error || "Erro ao excluir jogo.",
            "error"
          );
        }
        return;
      }

      showToast(data.message || "Jogo excluído com sucesso.", "success");
      carregarDados();
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao excluir jogo.", "error");
    }
  }

  function handleExcluir(jogo) {
    showConfirmToast(
      `Tem certeza que deseja excluir o jogo "${jogo.nome}"?`,
      () => excluirJogo(jogo),
      {
        type: "warning",
        confirmText: "Excluir",
        cancelText: "Cancelar",
      }
    );
  }

  function getEmpresaNome(j) {
    const empId = j.fkEmpresa || j.fk_empresa || j.empresaId;
    const emp = empresas.find((e) => e.id === empId);
    return emp ? emp.nome : j.empresaNome || j.empresa || "—";
  }

  function getCategoriaNome(j) {
    const catId = j.fkCategoria || j.fk_categoria || j.categoriaId;
    const cat = categorias.find((c) => c.id === catId);
    return cat ? cat.nome : j.categoriaNome || j.categoria || "—";
  }

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button
            type="button"
            className={`btn-toggle-form ${formAberto ? "aberto" : ""}`}
            onClick={() => setFormAberto((prev) => !prev)}
            title={formAberto ? "Fechar cadastro" : "Novo jogo"}
          >
            <i className="fa-solid fa-plus"></i>
          </button>

          <div>
            <h1>Jogos</h1>
            <p>Cadastre e gerencie os jogos disponíveis na Tok-Store.</p>
          </div>
        </div>
      </header>

      {(formAberto || editId) && (
        <section className="form-section">
          <h2>{editId ? "Editar Jogo" : "Cadastrar Jogo"}</h2>
          <form className="jogo-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nomeJogo">Nome</label>
                <input
                  type="text"
                  id="nomeJogo"
                  placeholder="Nome do jogo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="anoJogo">Ano</label>
                <input
                  type="number"
                  id="anoJogo"
                  placeholder="2015"
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="precoJogo">Preço</label>
                <input
                  type="number"
                  id="precoJogo"
                  placeholder="59.99"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="empresaJogo">Empresa</label>
                <select
                  id="empresaJogo"
                  value={empresaId}
                  onChange={(e) => setEmpresaId(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {empresas.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="categoriaJogo">Categoria</label>
                <select
                  id="categoriaJogo"
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="descricaoJogo">Descrição</label>
              <textarea
                id="descricaoJogo"
                rows="3"
                placeholder="Descreva o jogo..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              ></textarea>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn-salvar" disabled={salvando}>
                <i className="fa-solid fa-floppy-disk"></i>{" "}
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={limparForm}
                >
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      <section className="table-section">
        <h2>Jogos Cadastrados</h2>
        {loading ? (
          <p>Carregando jogos...</p>
        ) : jogos.length === 0 ? (
          <p>Nenhum jogo cadastrado ainda.</p>
        ) : (
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
              {jogos.map((j) => (
                <tr key={j.id}>
                  <td>{j.id}</td>
                  <td>{j.nome}</td>
                  <td>{j.ano}</td>
                  <td>R$ {Number(j.preco || 0).toFixed(2)}</td>
                  <td>{getEmpresaNome(j)}</td>
                  <td>{getCategoriaNome(j)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-editar"
                      onClick={() => handleEditar(j)}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-excluir"
                      onClick={() => handleExcluir(j)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

/* =========================================
  ADMIN - AVALIAÇÕES (TODAS DO SISTEMA)
========================================= */
function AdminAvaliacoesPage() {
  usePageCss(["/css/avaliacoesAdmin.css"]);
  const { showToast } = useToast();

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregarAvaliacoes() {
    try {
      setLoading(true);

      // 1) Carrega todos os jogos
      const respJogos = await fetchWithAuth("/jogos");

      if (!respJogos.ok) {
        const err = await respJogos.json().catch(() => ({}));
        showToast(err.message || "Erro ao carregar jogos para avaliações.", "error");
        setAvaliacoes([]);
        return;
      }

      let jogos = [];
      try {
        jogos = await respJogos.json();
      } catch (e) {
        console.warn("Resposta de /jogos sem JSON válido:", e);
        jogos = [];
      }

      if (!Array.isArray(jogos) || jogos.length === 0) {
        setAvaliacoes([]);
        return;
      }

      // 2) Para cada jogo, busca /avaliacoes/media/:jogoId
      const todasAvaliacoesMatriz = await Promise.all(
        jogos.map(async (jogo) => {
          try {
            const r = await fetchWithAuth(`/avaliacoes/media/${jogo.id}`);

            // 204 = nenhum dado pra aquele jogo
            if (r.status === 204) return [];

            if (!r.ok) return [];

            const body = await r.json().catch(() => null);
            if (!body || !Array.isArray(body.avaliacoes)) return [];

            // anexa o nome do jogo em cada avaliação
            return body.avaliacoes.map((a) => ({
              ...a,
              jogo_nome: jogo.nome,
            }));
          } catch (e) {
            console.error("Erro ao buscar avaliações do jogo", jogo.id, e);
            return [];
          }
        })
      );

      // 3) Achata a matriz em um único array
      const todasAvaliacoes = todasAvaliacoesMatriz.flat();

      // (opcional) ordena por data desc se existir campo data
      todasAvaliacoes.sort((a, b) => {
        const da = new Date(a.data || 0).getTime();
        const db = new Date(b.data || 0).getTime();
        return db - da;
      });

      setAvaliacoes(todasAvaliacoes);
    } catch (e) {
      console.error(e);
      showToast("Erro de conexão ao carregar avaliações.", "error");
      setAvaliacoes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  function getJogoNome(a) {
    return (
      a.jogo_nome ||
      a.jogoNome ||
      a.jogo ||
      a.nomeJogo ||
      `Jogo #${a.fk_jogo || a.fkJogo || a.jogoId || "?"}`
    );
  }

  function getUsuarioNome(a) {
    // Como o DAO não faz join com usuário, usamos o id como fallback
    return (
      a.usuario_nome ||
      a.usuarioNome ||
      a.usuario ||
      `Usuário #${a.fk_usuario || a.fkUsuario || a.usuarioId || "?"}`
    );
  }

  function formatarData(val) {
    if (!val) return "—";
    try {
      const d = new Date(val);
      if (Number.isNaN(d.getTime())) return val;
      return (
        d.toLocaleDateString("pt-BR") +
        " " +
        d.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      return val;
    }
  }

  return (
    <>
      <header className="header">
        <div>
          <h1>Avaliações</h1>
          <p>Veja todas as avaliações registradas nos jogos.</p>
        </div>
      </header>

      <section className="table-section">
        <h2>Lista de Avaliações</h2>

        {loading ? (
          <p>Carregando avaliações...</p>
        ) : avaliacoes.length === 0 ? (
          <p>Nenhuma avaliação cadastrada.</p>
        ) : (
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
              {avaliacoes.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{getJogoNome(a)}</td>
                  <td>{getUsuarioNome(a)}</td>
                  <td>{a.nota || a.rating || "—"}</td>
                  <td>{a.comentario || a.texto || "—"}</td>
                  <td>{formatarData(a.data || a.created_at || a.criadoEm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}



function AdminRelatoriosPage() {
  usePageCss(["/css/relatorios.css"]);
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  const [jogosMaisVendidos, setJogosMaisVendidos] = useState([]);
  const [vendasPorCategoria, setVendasPorCategoria] = useState([]);
  const [vendasPorEmpresa, setVendasPorEmpresa] = useState([]);
  const [vendasPorMes, setVendasPorMes] = useState([]);
  const [avaliacoesMedias, setAvaliacoesMedias] = useState([]);

  const [filtroAtivo, setFiltroAtivo] = useState("vendas");

  const chartJogosRef = useRef(null);
  const chartCategoriasRef = useRef(null);
  const chartEmpresasRef = useRef(null);
  const chartMesRef = useRef(null);
  const chartAvaliacoesRef = useRef(null);

  const chartInstancesRef = useRef({
    jogos: null,
    categorias: null,
    empresas: null,
    mes: null,
    avaliacoes: null,
  });

  const BASE_COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#6366f1",
    "#ef4444",
    "#06b6d4",
    "#8b5cf6",
    "#f97316",
  ];

  // ============================================================
  //                 CARREGAR DADOS (TODAS AS VENDAS)
  // ============================================================
  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);

        const [
          respVendas,
          respJogos,
          respEmpresas,
          respCategorias,
          respRelatorioJogos,
        ] = await Promise.all([
          fetchWithAuth("/vendas"),
          fetchWithAuth("/jogos"),
          fetchWithAuth("/empresas"),
          fetchWithAuth("/categorias"),
          fetchWithAuth("/relatorios/jogos-mais-vendidos?top=10"),
        ]);

        if (!respVendas.ok) {
          showToast("Erro ao carregar dados de vendas.", "error");
          setLoading(false);
          return;
        }

        const vendasJson = await respVendas.json().catch(() => []);
        const jogosJson = respJogos.ok
          ? await respJogos.json().catch(() => [])
          : [];
        const empJson = respEmpresas.ok
          ? await respEmpresas.json().catch(() => [])
          : [];
        const catJson = respCategorias.ok
          ? await respCategorias.json().catch(() => [])
          : [];
        const relJogosJson = respRelatorioJogos.ok
          ? await respRelatorioJogos.json().catch(() => [])
          : [];

        const vendas = Array.isArray(vendasJson) ? vendasJson : [];
        const jogos = Array.isArray(jogosJson) ? jogosJson : [];
        const empresas = Array.isArray(empJson) ? empJson : [];
        const categorias = Array.isArray(catJson) ? catJson : [];
        const relJogos = Array.isArray(relJogosJson) ? relJogosJson : [];

        // MAPAS AUXILIARES
        const mapJogoPorNome = new Map();
        jogos.forEach((j) => {
          if (j.nome) mapJogoPorNome.set(j.nome, j);
        });

        const mapEmpresaIdNome = new Map();
        empresas.forEach((e) => mapEmpresaIdNome.set(e.id, e.nome));

        const mapCategoriaIdNome = new Map();
        categorias.forEach((c) => mapCategoriaIdNome.set(c.id, c.nome));

        // ============================================================
        //           AGRUPAR VENDAS POR MÊS (PARA O GRÁFICO)
        // ============================================================
               // ============================================================
        //           AGRUPAR VENDAS POR MÊS (PARA O GRÁFICO)
        // ============================================================
        const mapVendasPorMes = new Map();

        vendas.forEach((v) => {
          const dataRaw = v.data || v.data_venda || v.dataVenda;
          if (!dataRaw) return;

          const d = new Date(dataRaw);
          if (Number.isNaN(d.getTime())) return;

          const mesKey = `${d.getFullYear()}-${String(
            d.getMonth() + 1
          ).padStart(2, "0")}`;

          const valorVenda = Number(v.valor_total || v.valorTotal || 0);

          const regMes = mapVendasPorMes.get(mesKey) || {
            mes: mesKey,
            valor: 0,
          };
          regMes.valor += valorVenda;
          mapVendasPorMes.set(mesKey, regMes);
        });

        // transforma em array ordenado
        let vendasPorMesArr = Array.from(mapVendasPorMes.values()).sort((a, b) =>
          a.mes > b.mes ? 1 : -1
        );

        // ============================================================
        //           SIMULAÇÃO SE NÃO HOUVER DADOS REAIS
        // ============================================================
        // ============================================================
//           SIMULAÇÃO SE NÃO HOUVER DADOS REAIS
// ============================================================
if (vendasPorMesArr.length === 0) {
  const agora = new Date();
  const mock = [];

  const nomesMes = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // últimos 6 meses simulados
  for (let i = 5; i >= 0; i--) {
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);

    const mesKey = nomesMes[d.getMonth()]; // ← aqui fica o nome PT-BR

    // valores simulados (pode ajustar como quiser)
    const valorSimulado = 2000 + Math.round(Math.random() * 3000);

    mock.push({
      mes: mesKey,
      valor: valorSimulado,
    });
  }

  vendasPorMesArr = mock;
}

        setVendasPorMes(vendasPorMesArr);


        // ============================================================
        //        TOP JOGOS PELO ENDPOINT /relatorios
        // ============================================================
        const jogosMaisVendidosArr = relJogos.map((r, index) => {
          const jogoRelacionado = mapJogoPorNome.get(r.nome) || {};
          const preco = Number(jogoRelacionado.preco || 0);

          const categoriaId =
            jogoRelacionado.fkCategoria ||
            jogoRelacionado.fk_categoria ||
            jogoRelacionado.categoriaId;

          const empresaNome =
            r.empresa ||
            mapEmpresaIdNome.get(jogoRelacionado.fkEmpresa) ||
            "—";

          const qtd = Number(r.total || r.total_vendas || 0);

          return {
            jogoId: jogoRelacionado.id || index + 1,
            nome: r.nome,
            empresa: empresaNome,
            qtd,
            valor: preco * qtd,
            categoriaId: categoriaId || null,
          };
        });

        setJogosMaisVendidos(jogosMaisVendidosArr);

        // ============================================================
        //           RANKING POR CATEGORIA
        // ============================================================
        const mapCat = new Map();
        jogosMaisVendidosArr.forEach((j) => {
          const catNome = mapCategoriaIdNome.get(j.categoriaId) || "Outros";

          const reg = mapCat.get(catNome) || {
            categoria: catNome,
            qtd: 0,
            valor: 0,
          };
          reg.qtd += j.qtd;
          reg.valor += j.valor;
          mapCat.set(catNome, reg);
        });

        setVendasPorCategoria(
          Array.from(mapCat.values()).sort((a, b) => b.qtd - a.qtd)
        );

        // ============================================================
        //             RANKING POR EMPRESA
        // ============================================================
        const mapEmp = new Map();
        jogosMaisVendidosArr.forEach((j) => {
          const empNome = j.empresa || "Outras";
          const reg =
            mapEmp.get(empNome) || { empresa: empNome, qtd: 0, valor: 0 };
          reg.qtd += j.qtd;
          reg.valor += j.valor;
          mapEmp.set(empNome, reg);
        });

        setVendasPorEmpresa(
          Array.from(mapEmp.values()).sort((a, b) => b.valor - a.valor)
        );

        // ============================================================
        //           AVALIAÇÕES MÉDIAS – TOP 5 JOGOS
        // ============================================================
        let avaliacoes = [];

        try {
          avaliacoes = await Promise.all(
            jogosMaisVendidosArr.slice(0, 5).map(async (j) => {
              if (!j.jogoId) return { nome: j.nome, media: 0 };

              try {
                const r = await fetchWithAuth(`/avaliacoes/media/${j.jogoId}`);
                if (r.status === 200) {
                  const body = await r.json();
                  return { nome: j.nome, media: body.media || 0 };
                }
              } catch (e) {
                console.error("Erro ao buscar média:", e);
              }
              return { nome: j.nome, media: 0 };
            })
          );
        } catch (e) {
          avaliacoes = [];
        }

        setAvaliacoesMedias(avaliacoes);
      } catch (e) {
        console.error(e);
        showToast("Erro ao carregar relatórios.", "error");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [showToast]);

  // ============================================================
  //                CRIAÇÃO DOS GRÁFICOS
  // ============================================================
  useEffect(() => {
    if (loading) return;

    Object.entries(chartInstancesRef.current).forEach(([k, inst]) => {
      if (inst) inst.destroy();
      chartInstancesRef.current[k] = null;
    });

    // Jogos mais vendidos
    if (chartJogosRef.current && jogosMaisVendidos.length > 0) {
      chartInstancesRef.current.jogos = new Chart(
        chartJogosRef.current.getContext("2d"),
        {
          type: "bar",
          data: {
            labels: jogosMaisVendidos.map((j) => j.nome),
            datasets: [
              {
                label: "Quantidade vendida",
                data: jogosMaisVendidos.map((j) => j.qtd),
                backgroundColor: "#3b82f6",
                borderRadius: 6,
              },
            ],
          },
          options: { responsive: true, plugins: { legend: { display: false } } },
        }
      );
    }

    // Categorias
    if (chartCategoriasRef.current && vendasPorCategoria.length > 0) {
      const labels = vendasPorCategoria.map((c) => c.categoria);
      const dataVals = vendasPorCategoria.map((c) => c.qtd);
      const backgroundColor = labels.map(
        (_, idx) => BASE_COLORS[idx % BASE_COLORS.length]
      );

      chartInstancesRef.current.categorias = new Chart(
        chartCategoriasRef.current.getContext("2d"),
        {
          type: "pie",
          data: {
            labels,
            datasets: [
              {
                label: "Jogos vendidos",
                data: dataVals,
                backgroundColor,
                borderColor: "#ffffff",
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "bottom",
                labels: { usePointStyle: true, boxWidth: 10 },
              },
            },
          },
        }
      );
    }

    // Empresas
    if (chartEmpresasRef.current && vendasPorEmpresa.length > 0) {
      chartInstancesRef.current.empresas = new Chart(
        chartEmpresasRef.current.getContext("2d"),
        {
          type: "bar",
          data: {
            labels: vendasPorEmpresa.map((e) => e.empresa),
            datasets: [
              {
                label: "Faturamento (R$)",
                data: vendasPorEmpresa.map((e) => e.valor),
                backgroundColor: "#6366f1",
                borderRadius: 6,
              },
            ],
          },
          options: {
            indexAxis: "y",
            responsive: true,
            plugins: { legend: { display: false } },
          },
        }
      );
    }

    // Vendas por mês (Evolução Mensal das Vendas)
    if (chartMesRef.current && vendasPorMes.length > 0) {
      chartInstancesRef.current.mes = new Chart(
        chartMesRef.current.getContext("2d"),
        {
          type: "line",
          data: {
            labels: vendasPorMes.map((m) => m.mes.replace("-", "/")),
            datasets: [
              {
                label: "Faturamento (R$)",
                data: vendasPorMes.map((m) => m.valor),
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.15)",
                tension: 0.3,
                fill: true,
                pointRadius: 3,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: true } },
          },
        }
      );
    }

    // Avaliações – radar
    if (chartAvaliacoesRef.current && avaliacoesMedias.length > 0) {
      chartInstancesRef.current.avaliacoes = new Chart(
        chartAvaliacoesRef.current.getContext("2d"),
        {
          type: "radar",
          data: {
            labels: avaliacoesMedias.map((a) => a.nome),
            datasets: [
              {
                label: "Nota média (0–5)",
                data: avaliacoesMedias.map((a) => a.media),
                borderColor: "#0ea5e9",
                backgroundColor: "rgba(14,165,233,0.35)",
                borderWidth: 3,
                pointBackgroundColor: "#0369a1",
                pointBorderColor: "#fff",
                pointRadius: 5,
                pointHoverRadius: 7,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
            scales: {
              r: {
                min: 0,
                max: 5,
                ticks: {
                  stepSize: 1,
                  display: true,
                  color: "#475569",
                },
                grid: {
                  color: "rgba(0,0,0,0.18)",
                  lineWidth: 1.4,
                },
                angleLines: {
                  color: "rgba(0,0,0,0.2)",
                  lineWidth: 1.3,
                },
                pointLabels: {
                  color: "#1e293b",
                  font: { size: 12, weight: "500" },
                },
              },
            },
          },
        }
      );
    }
  }, [
    loading,
    filtroAtivo,
    jogosMaisVendidos,
    vendasPorCategoria,
    vendasPorEmpresa,
    vendasPorMes,
    avaliacoesMedias,
  ]);

  // derivados
  const categoriaMaisVendida =
    vendasPorCategoria.length > 0
      ? vendasPorCategoria.reduce((best, cur) =>
          cur.qtd > best.qtd ? cur : best
        )
      : null;

  const jogoMelhorAvaliado =
    avaliacoesMedias.length > 0
      ? avaliacoesMedias.reduce((best, cur) =>
          cur.media > best.media ? cur : best
        )
      : null;

  const empresaTop =
    vendasPorEmpresa.length > 0 ? vendasPorEmpresa[0] : null;

  // ============================================================
  //                      RENDER
  // ============================================================
  return (
    <>
      <header className="relatorios-header">
        <h1>Relatórios e Indicadores</h1>
        <p>Acompanhe estatísticas reais da Tok-Store.</p>
      </header>

      {/* BOTÕES DE FILTRO (mantidos) */}
      <div className="buttons relatorios-buttons">
        <button
          className={`btn primary ${filtroAtivo === "vendas" ? "active" : ""}`}
          onClick={() => setFiltroAtivo("vendas")}
        >
          📊 Vendas
        </button>

        <button
          className={`btn secondary ${
            filtroAtivo === "empresas" ? "active" : ""
          }`}
          onClick={() => setFiltroAtivo("empresas")}
        >
          🏢 Empresas
        </button>

        <button
          className={`btn success ${
            filtroAtivo === "categorias" ? "active" : ""
          }`}
          onClick={() => setFiltroAtivo("categorias")}
        >
          🧩 Categorias
        </button>

        <button
          className={`btn warning ${
            filtroAtivo === "rankings" ? "active" : ""
          }`}
          onClick={() => setFiltroAtivo("rankings")}
        >
          ⭐ Rankings
        </button>
      </div>

      {/* GRÁFICOS */}
      <section className="charts relatorios-charts">
        {filtroAtivo === "vendas" && (
          <>
            <div className="chart-card">
              <h3>Jogos Mais Vendidos</h3>
              <div className="chart-wrapper">
                {loading ? (
                  <p>Carregando...</p>
                ) : jogosMaisVendidos.length === 0 ? (
                  <p>Nenhuma venda registrada.</p>
                ) : (
                  <canvas ref={chartJogosRef} />
                )}
              </div>
            </div>

            <div className="chart-card">
              <h3>Evolução Mensal das Vendas</h3>
              <div className="chart-wrapper">
                {loading ? (
                  <p>Carregando...</p>
                ) : vendasPorMes.length === 0 ? (
                  <p>Sem histórico de vendas mensais.</p>
                ) : (
                  <canvas ref={chartMesRef} />
                )}
              </div>
            </div>
          </>
        )}

        {filtroAtivo === "empresas" && (
          <>
            <div className="chart-card">
              <h3>Faturamento por Empresa</h3>
              <div className="chart-wrapper">
                {loading ? (
                  <p>Carregando...</p>
                ) : vendasPorEmpresa.length === 0 ? (
                  <p>Sem dados de empresas.</p>
                ) : (
                  <canvas ref={chartEmpresasRef} />
                )}
              </div>
            </div>

            <div className="chart-card">
              <h3>Empresa que Mais Vende</h3>
              {loading ? (
                <p>Carregando...</p>
              ) : !empresaTop ? (
                <p>Sem dados.</p>
              ) : (
                <div>
                  <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                    {empresaTop.empresa}
                  </p>
                  <p>
                    Quantidade vendida total:{" "}
                    <strong>{empresaTop.qtd}</strong>
                  </p>
                  <p>
                    Faturamento:{" "}
                    <strong>
                      R$ {Number(empresaTop.valor || 0).toFixed(2)}
                    </strong>
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {filtroAtivo === "categorias" && (
          <>
            <div className="chart-card">
              <h3>Ranking por Categoria</h3>
              <div className="chart-wrapper pie-chart">
                {loading ? (
                  <p>Carregando...</p>
                ) : vendasPorCategoria.length === 0 ? (
                  <p>Sem dados de categorias.</p>
                ) : (
                  <canvas ref={chartCategoriasRef} />
                )}
              </div>
            </div>

            <div className="chart-card">
              <h3>Categoria Mais Vendida</h3>
              {loading ? (
                <p>Carregando...</p>
              ) : !categoriaMaisVendida ? (
                <p>Sem dados.</p>
              ) : (
                <div>
                  <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                    {categoriaMaisVendida.categoria}
                  </p>
                  <p>
                    Quantidade vendida:{" "}
                    <strong>{categoriaMaisVendida.qtd}</strong>
                  </p>
                  <p>
                    Faturamento estimado:{" "}
                    <strong>
                      R$ {Number(categoriaMaisVendida.valor || 0).toFixed(2)}
                    </strong>
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {filtroAtivo === "rankings" && (
          <>
            <div className="chart-card">
              <h3>Avaliações Médias (Top Jogos)</h3>
              <div className="chart-wrapper radar-chart">
                {loading ? (
                  <p>Carregando...</p>
                ) : avaliacoesMedias.length === 0 ? (
                  <p>Sem dados de avaliações.</p>
                ) : (
                  <canvas ref={chartAvaliacoesRef} />
                )}
              </div>
            </div>

            <div className="chart-card">
              <h3>Jogo com Melhor Avaliação</h3>
              {loading ? (
                <p>Carregando...</p>
              ) : !jogoMelhorAvaliado ? (
                <p>Sem dados.</p>
              ) : (
                <div>
                  <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                    {jogoMelhorAvaliado.nome}
                  </p>
                  <p>
                    Nota média:{" "}
                    <strong>
                      {Number(jogoMelhorAvaliado.media || 0).toFixed(1)}
                    </strong>
                  </p>
                  <p>Baseado nas avaliações registradas.</p>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}




/* =========================================
   APP ROOT (corrigindo rotas /admin)
========================================= */
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

        {/* ROTAS ADMIN ANINHADAS (usa <Outlet /> no AdminLayout) */}
        <Route
          path="/admin/*"
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
          <Route path="avaliacoes" element={<AdminAvaliacoesPage />} />
          <Route path="relatorios" element={<AdminRelatoriosPage />} />
        </Route>
      </Routes>

      <Chatbot />
    </Router>
  );
}
