const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const pwaDistDir = path.join(__dirname, "academia-plus-pwa", "dist");
const PUBLIC_DIR = fs.existsSync(path.join(pwaDistDir, "index.html")) ? pwaDistDir : path.join(__dirname, "public");
const DATA_FILE = path.join(__dirname, "data", "app-data.json");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject"
};

function uid(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

const initialData = {
  currentUserId: "user_larissa",
  users: [
    {
      id: "user_larissa",
      name: "Laura Fisio",
      username: "laura.fisio",
      email: "laura@aluno.unifesp.br",
      course: "Fisioterapia",
      institution: "UNIFESP",
      city: "Sao Paulo, SP",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
      verified: true,
      verifiedBy: "institutional_email",
      reputation: 5,
      badges: ["Monitor", "Vendedor confiavel", "Fundador da comunidade"],
      acceptedTerms: true,
      acceptedAt: "2026-06-28T12:00:00.000Z",
      role: "student"
    },
    {
      id: "user_joao",
      name: "Joao Med",
      username: "joao.med",
      email: "joao@email.com",
      course: "Medicina",
      institution: "USP",
      city: "Sao Paulo, SP",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
      verified: false,
      verifiedBy: null,
      reputation: 4.8,
      badges: ["Responde duvidas"],
      acceptedTerms: true,
      acceptedAt: "2026-06-28T12:20:00.000Z",
      role: "student"
    }
  ],
  institutions: [
    { id: "inst_unifesp", name: "UNIFESP", type: "Publica", domainHints: ["@aluno.unifesp.br", "@unifesp.br"] },
    { id: "inst_usp", name: "USP", type: "Publica", domainHints: ["@usp.br", "@aluno.usp.br"] },
    { id: "inst_pucsp", name: "PUC-SP", type: "Privada", domainHints: ["@aluno.pucsp.br", "@pucsp.br"] },
    { id: "inst_ufrj", name: "UFRJ", type: "Publica", domainHints: ["@ufrj.br"] },
    { id: "inst_ifce", name: "IFCE", type: "Publica", domainHints: ["@aluno.ifce.edu.br", "@ifce.edu.br"] },
    { id: "inst_fgv", name: "FGV", type: "Privada", domainHints: ["@fgv.edu.br"] }
  ],
  communities: [
    { id: "com_med_usp", title: "Medicina - USP", course: "Medicina", institution: "USP", scope: "institution", visibility: "publica", members: 4200, accent: "#0c7a5d" },
    { id: "com_dir_puc", title: "Direito - PUC-SP", course: "Direito", institution: "PUC-SP", scope: "institution", visibility: "privada", members: 3100, accent: "#1e4f91" },
    { id: "com_eng_ufrj", title: "Engenharia Civil - UFRJ", course: "Engenharia Civil", institution: "UFRJ", scope: "institution", visibility: "publica", members: 2700, accent: "#254b80" },
    { id: "com_psico_puc", title: "Psicologia - PUC-RS", course: "Psicologia", institution: "PUC-RS", scope: "institution", visibility: "privada", members: 1800, accent: "#da8c11" },
    { id: "com_brasil", title: "Geral Brasil", course: "Todos", institution: "Brasil", scope: "general", visibility: "publica", members: 18400, accent: "#7a3fe0" }
  ],
  products: [
    {
      id: "prod_calc",
      title: "Calculadora Casio fx-991EX",
      price: 120,
      originalPrice: 180,
      category: "Material de estudo",
      condition: "Otimo estado",
      location: "Sao Paulo, SP",
      image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQNk81xbhEeSiGGRlGxI_Zk4y9rngHD_khkK1wpAd9a69pEKw3XHCaSf4-WI-Of-qZkbs9qXs0ylqjvaa0weyre5EgvzxBro07HLaId042-RIOXUMCWqhmSKCU",
      description: "Perfeita para calculo, estatistica, fisica e muito mais.",
      sellerId: "user_larissa",
      saved: true,
      createdAt: "2026-06-28T10:00:00.000Z"
    },
    {
      id: "prod_jaleco",
      title: "Jaleco branco tamanho M",
      price: 80,
      originalPrice: 130,
      category: "Roupas e acessorios",
      condition: "Usado 2 vezes",
      location: "Sao Paulo, SP",
      image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTtjQaKs4vkPz1zWwa9N7HhbyvZWXFy976NrabiJk2H9tqBA11ypOE0IaVPmngKdQ-76LGk8i-xOvpPSsz0C723uz8kZgOPKA",
      description: "Tecido de otima qualidade, sem manchas ou rasgos.",
      sellerId: "user_joao",
      saved: true,
      createdAt: "2026-06-28T09:00:00.000Z"
    },
    {
      id: "prod_livro",
      title: "Anatomia Humana - Sobotta",
      price: 100,
      originalPrice: 190,
      category: "Livros",
      condition: "Com marcacoes leves",
      location: "Rio de Janeiro, RJ",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrjvduSjXPYE69WPb-UBFd4Xe6J_fFSbMB-w&s",
      description: "Livro bem cuidado, ideal para ciclos basicos.",
      sellerId: "user_joao",
      saved: true,
      createdAt: "2026-06-27T10:00:00.000Z"
    }
  ],
  posts: [
    { id: "post_1", authorId: "user_larissa", type: "sale", productId: "prod_calc", communityId: "com_brasil", likes: 23, comments: 5, createdAt: "2026-06-28T11:00:00.000Z" },
    { id: "post_2", authorId: "user_joao", type: "discussion", text: "Alguem tem resumo bom de neuro para revisar antes da prova?", communityId: "com_med_usp", likes: 14, comments: 9, createdAt: "2026-06-28T10:24:00.000Z" }
  ],
  chats: [
    {
      id: "chat_med",
      title: "Medicina - USP",
      type: "group",
      communityId: "com_med_usp",
      unread: 3,
      messages: [
        { id: "msg_1", senderId: "user_joao", message: "Alguem ja fez a lista de Neuro 2?", createdAt: "2026-06-28T10:21:00.000Z", deletedAt: null },
        { id: "msg_2", senderId: "user_larissa", message: "Posso mandar aqui meu resumo em PDF.", createdAt: "2026-06-28T10:22:00.000Z", deletedAt: null },
        { id: "msg_3", senderId: "user_joao", message: "Valeu! Tambem aviso se o prof. liberar a monitoria.", createdAt: "2026-06-28T10:25:00.000Z", deletedAt: null }
      ]
    },
    {
      id: "chat_sale",
      title: "Calculadora Casio",
      type: "direct",
      productId: "prod_calc",
      unread: 1,
      messages: [
        { id: "msg_4", senderId: "user_joao", message: "Oi! Ainda esta disponivel?", createdAt: "2026-06-28T09:41:00.000Z", deletedAt: null },
        { id: "msg_5", senderId: "user_larissa", message: "Esta sim. Posso entregar perto do campus.", createdAt: "2026-06-28T09:44:00.000Z", deletedAt: null }
      ]
    }
  ],
  reports: [],
  verifications: []
};

function ensureData() {
  if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

function readData() {
  ensureData();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Payload muito grande"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("JSON invalido"));
      }
    });
  });
}

function publicUser(user) {
  const { email, acceptedAt, acceptedTerms, ...safe } = user;
  return safe;
}

function buildSnapshot(data) {
  return {
    currentUser: data.users.find(user => user.id === data.currentUserId),
    users: data.users.map(publicUser),
    institutions: data.institutions,
    communities: data.communities,
    products: data.products,
    posts: data.posts,
    chats: data.chats,
    privacy: {
      collected: ["nome de exibicao", "e-mail", "curso", "instituicao", "cidade opcional", "foto opcional"],
      avoided: ["CPF", "RG", "endereco completo", "dados bancarios"],
      controls: ["exportar dados", "excluir conta", "consentimento registrado", "documentos temporarios"]
    }
  };
}

async function handleApi(req, res, url) {
  const data = readData();

  if (req.method === "GET" && url.pathname === "/api/app") {
    return sendJson(res, 200, buildSnapshot(data));
  }

  if (req.method === "POST" && url.pathname === "/api/products") {
    const body = await readBody(req);
    const product = {
      id: uid("prod"),
      title: String(body.title || "").slice(0, 90),
      price: Number(body.price || 0),
      originalPrice: Number(body.originalPrice || 0),
      category: String(body.category || "Material de estudo").slice(0, 60),
      condition: String(body.condition || "Usado").slice(0, 60),
      location: String(body.location || "Campus").slice(0, 80),
      image: body.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      description: String(body.description || "").slice(0, 280),
      sellerId: data.currentUserId,
      saved: false,
      createdAt: new Date().toISOString()
    };
    data.products.unshift(product);
    data.posts.unshift({ id: uid("post"), authorId: data.currentUserId, type: "sale", productId: product.id, communityId: body.communityId || "com_brasil", likes: 0, comments: 0, createdAt: product.createdAt });
    writeData(data);
    return sendJson(res, 201, product);
  }

  if (req.method === "POST" && url.pathname.match(/^\/api\/chats\/[^/]+\/messages$/)) {
    const chatId = url.pathname.split("/")[3];
    const body = await readBody(req);
    const chat = data.chats.find(item => item.id === chatId);
    if (!chat) return sendJson(res, 404, { error: "Chat não encontrado" });
    const message = { id: uid("msg"), senderId: data.currentUserId, message: String(body.message || "").slice(0, 500), createdAt: new Date().toISOString(), deletedAt: null };
    chat.messages.push(message);
    writeData(data);
    return sendJson(res, 201, message);
  }

  if (req.method === "POST" && url.pathname === "/api/verification/request-code") {
    const body = await readBody(req);
    const email = String(body.email || "").toLowerCase();
    const knownDomain = data.institutions.some(inst => inst.domainHints.some(domain => email.endsWith(domain.replace("@", "")) || email.endsWith(domain)));
    const code = knownDomain ? "248913" : null;
    data.verifications.push({ id: uid("ver"), userId: data.currentUserId, method: "institutional_email", email, status: knownDomain ? "code_sent" : "domain_unknown", createdAt: new Date().toISOString() });
    writeData(data);
    return sendJson(res, knownDomain ? 200 : 422, knownDomain ? { ok: true, demoCode: code } : { error: "Dominio institucional não reconhecido. Use documento temporario." });
  }

  if (req.method === "POST" && url.pathname === "/api/privacy/export") {
    const currentUser = data.users.find(user => user.id === data.currentUserId);
    return sendJson(res, 200, {
      generatedAt: new Date().toISOString(),
      profile: currentUser,
      products: data.products.filter(item => item.sellerId === data.currentUserId),
      posts: data.posts.filter(item => item.authorId === data.currentUserId),
      messages: data.chats.flatMap(chat => chat.messages.filter(message => message.senderId === data.currentUserId).map(message => ({ chatId: chat.id, message })))
    });
  }

  if (req.method === "POST" && url.pathname === "/api/reports") {
    const body = await readBody(req);
    const report = { id: uid("rep"), targetType: body.targetType, targetId: body.targetId, reason: String(body.reason || "moderacao").slice(0, 140), createdAt: new Date().toISOString() };
    data.reports.push(report);
    writeData(data);
    return sendJson(res, 201, report);
  }

  return sendJson(res, 404, { error: "Rota não encontrada" });
}

function serveStatic(req, res, url) {
  const cleanPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  let filePath = path.normalize(path.join(PUBLIC_DIR, cleanPath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) && fs.existsSync(path.join(PUBLIC_DIR, "index.html"))) {
    filePath = path.join(PUBLIC_DIR, "index.html");
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    serveStatic(req, res, url);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Erro interno" });
  }
});

server.listen(PORT, () => {
  ensureData();
  console.log(`Academia+ rodando em http://localhost:${PORT}`);
});
