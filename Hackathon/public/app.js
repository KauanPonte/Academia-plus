const state = {
  data: null,
  view: "home",
  activeChatId: null,
  activeProductId: "prod_calc",
  communityFilter: "mine",
  apiOnline: true
};

const FALLBACK_DATA = {
  currentUser: {
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
    badges: ["Monitor", "Vendedor confiavel", "Fundador da comunidade"]
  },
  users: [
    { id: "user_larissa", name: "Laura Fisio", username: "laura.fisio", course: "Fisioterapia", institution: "UNIFESP", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80", verified: true, badges: ["Monitor", "Vendedor confiavel", "Fundador da comunidade"] },
    { id: "user_joao", name: "Joao Med", username: "joao.med", course: "Medicina", institution: "USP", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80", verified: false, badges: ["Responde duvidas"] }
  ],
  institutions: [
    { id: "inst_unifesp", name: "UNIFESP", type: "Publica", domainHints: ["@aluno.unifesp.br", "@unifesp.br"] },
    { id: "inst_usp", name: "USP", type: "Publica", domainHints: ["@usp.br", "@aluno.usp.br"] },
    { id: "inst_ifce", name: "IFCE", type: "Publica", domainHints: ["@aluno.ifce.edu.br", "@ifce.edu.br"] }
  ],
  communities: [
    { id: "com_med_usp", title: "Medicina - USP", course: "Medicina", institution: "USP", scope: "institution", visibility: "publica", members: 4200, accent: "#0c7a5d" },
    { id: "com_dir_puc", title: "Direito - PUC-SP", course: "Direito", institution: "PUC-SP", scope: "institution", visibility: "privada", members: 3100, accent: "#1e4f91" },
    { id: "com_eng_ufrj", title: "Engenharia Civil - UFRJ", course: "Engenharia Civil", institution: "UFRJ", scope: "institution", visibility: "publica", members: 2700, accent: "#254b80" },
    { id: "com_psico_puc", title: "Psicologia - PUC-RS", course: "Psicologia", institution: "PUC-RS", scope: "institution", visibility: "privada", members: 1800, accent: "#da8c11" },
    { id: "com_brasil", title: "Geral Brasil", course: "Todos", institution: "Brasil", scope: "general", visibility: "publica", members: 18400, accent: "#7a3fe0" }
  ],
  products: [
    { id: "prod_calc", title: "Calculadora Casio fx-991EX", price: 120, originalPrice: 180, category: "Material de estudo", condition: "Otimo estado", location: "Sao Paulo, SP", image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQNk81xbhEeSiGGRlGxI_Zk4y9rngHD_khkK1wpAd9a69pEKw3XHCaSf4-WI-Of-qZkbs9qXs0ylqjvaa0weyre5EgvzxBro07HLaId042-RIOXUMCWqhmSKCU", description: "Perfeita para calculo, estatistica, fisica e muito mais.", sellerId: "user_larissa", saved: true },
    { id: "prod_jaleco", title: "Jaleco branco tamanho M", price: 80, originalPrice: 130, category: "Roupas e acessorios", condition: "Usado 2 vezes", location: "Sao Paulo, SP", image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTtjQaKs4vkPz1zWwa9N7HhbyvZWXFy976NrabiJk2H9tqBA11ypOE0IaVPmngKdQ-76LGk8i-xOvpPSsz0C723uz8kZgOPKA", description: "Tecido de otima qualidade, sem manchas ou rasgos.", sellerId: "user_joao", saved: true },
    { id: "prod_livro", title: "Anatomia Humana - Sobotta", price: 100, originalPrice: 190, category: "Livros", condition: "Com marcacoes leves", location: "Rio de Janeiro, RJ", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrjvduSjXPYE69WPb-UBFd4Xe6J_fFSbMB-w&s", description: "Livro bem cuidado, ideal para ciclos basicos.", sellerId: "user_joao", saved: true }
  ],
  posts: [
    { id: "post_1", authorId: "user_larissa", type: "sale", productId: "prod_calc", communityId: "com_brasil", likes: 23, comments: 5 },
    { id: "post_2", authorId: "user_joao", type: "discussion", text: "Alguem tem resumo bom de neuro para revisar antes da prova?", communityId: "com_med_usp", likes: 14, comments: 9 }
  ],
  chats: [
    { id: "chat_med", title: "Medicina - USP", type: "group", communityId: "com_med_usp", unread: 3, messages: [
      { id: "msg_1", senderId: "user_joao", message: "Alguem ja fez a lista de Neuro 2?", createdAt: new Date().toISOString(), deletedAt: null },
      { id: "msg_2", senderId: "user_larissa", message: "Posso mandar aqui meu resumo em PDF.", createdAt: new Date().toISOString(), deletedAt: null }
    ] },
    { id: "chat_sale", title: "Calculadora Casio", type: "direct", productId: "prod_calc", unread: 1, messages: [
      { id: "msg_4", senderId: "user_joao", message: "Oi! Ainda esta disponivel?", createdAt: new Date().toISOString(), deletedAt: null },
      { id: "msg_5", senderId: "user_larissa", message: "Esta sim. Posso entregar perto do campus.", createdAt: new Date().toISOString(), deletedAt: null }
    ] }
  ],
  privacy: {
    collected: ["nome de exibicao", "e-mail", "curso", "instituicao", "cidade opcional", "foto opcional"],
    avoided: ["CPF", "RG", "endereco completo", "dados bancarios"],
    controls: ["exportar dados", "excluir conta", "consentimento registrado", "documentos temporarios"]
  }
};

const money = value => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const byId = id => document.getElementById(id);

async function api(path, options = {}) {
  if (!state.apiOnline) return fallbackApi(path, options);
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erro na API");
  return data;
}

async function fallbackApi(path, options = {}) {
  const body = options.body ? JSON.parse(options.body) : {};
  if (path === "/api/app") return structuredClone(FALLBACK_DATA);
  if (path === "/api/products") {
    const product = {
      id: `prod_${Date.now()}`,
      title: body.title,
      price: Number(body.price),
      originalPrice: Number(body.originalPrice || body.price),
      category: body.category,
      condition: "Usado",
      location: body.location,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      description: body.description,
      sellerId: FALLBACK_DATA.currentUser.id,
      saved: false
    };
    FALLBACK_DATA.products.unshift(product);
    FALLBACK_DATA.posts.unshift({ id: `post_${Date.now()}`, authorId: FALLBACK_DATA.currentUser.id, type: "sale", productId: product.id, likes: 0, comments: 0 });
    return product;
  }
  if (path.includes("/messages")) {
    const chatId = path.split("/")[3];
    const chat = FALLBACK_DATA.chats.find(item => item.id === chatId);
    const message = { id: `msg_${Date.now()}`, senderId: FALLBACK_DATA.currentUser.id, message: body.message, createdAt: new Date().toISOString(), deletedAt: null };
    chat.messages.push(message);
    return message;
  }
  if (path === "/api/verification/request-code") return { ok: true, demoCode: "248913" };
  if (path === "/api/privacy/export") return { generatedAt: new Date().toISOString(), profile: FALLBACK_DATA.currentUser, products: FALLBACK_DATA.products.filter(product => product.sellerId === FALLBACK_DATA.currentUser.id) };
  return {};
}

function userById(id) {
  return state.data.users.find(user => user.id === id) || state.data.currentUser;
}

function productById(id) {
  return state.data.products.find(product => product.id === id);
}

function verificationBadge(user) {
  return user.verified
    ? `<span class="verify-badge">✓ Estudante Verificado</span>`
    : `<span class="verify-badge gray">👤 Não verificado</span>`;
}

function renderStories() {
  byId("stories").innerHTML = state.data.communities.slice(0, 6).map(community => `
    <button class="story" data-view="communities" title="${community.title}">
      <span class="story-logo" style="background:${community.accent}">${community.course.slice(0, 2).toUpperCase()}</span>
      ${community.course}<br><small>${community.institution}</small>
    </button>
  `).join("");
}

function renderFeed() {
  byId("feed").innerHTML = state.data.posts.map(post => {
    const author = userById(post.authorId);
    if (post.type === "sale") {
      const product = productById(post.productId);
      return `
        <article class="post-card">
          <div class="post-head">
            <span class="avatar" style="background-image:url('${author.photo}')"></span>
            <div class="meta">
              <strong>${author.username}</strong>
              <span>${author.course} • ${author.institution}</span>
            </div>
            <small>2h</small>
          </div>
          <img class="post-image" src="${product.image}" alt="${product.title}">
          <div class="post-body">
            <span class="sale-badge">A venda</span>
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <div class="price">${money(product.price)} <span class="old-price">${money(product.originalPrice)}</span></div>
            <div class="actions"><span>♡ ${post.likes}</span><span>▢ ${post.comments}</span><button class="text-btn" data-product="${product.id}">Ver detalhes</button></div>
          </div>
        </article>`;
    }
    return `
      <article class="post-card">
        <div class="post-head">
          <span class="avatar" style="background-image:url('${author.photo}')"></span>
          <div class="meta"><strong>${author.username}</strong><span>${author.course} • ${author.institution}</span></div>
        </div>
        <div class="post-body">
          <span class="sale-badge">Discussao</span>
          <p>${post.text}</p>
          <div class="actions"><span>♡ ${post.likes}</span><span>▢ ${post.comments}</span><button class="text-btn" data-view="chat">Abrir chat</button></div>
        </div>
      </article>`;
  }).join("");
}

function renderProducts() {
  const query = byId("product-search")?.value?.toLowerCase() || "";
  const products = state.data.products.filter(product =>
    [product.title, product.category, product.description].join(" ").toLowerCase().includes(query)
  );

  byId("product-grid").innerHTML = products.map(product => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.title}">
      <div>
        <h3>${product.title}</h3>
        <div class="price">${money(product.price)}</div>
        <button data-product="${product.id}">Detalhes</button>
      </div>
    </article>
  `).join("");
}

function renderCommunities() {
  const query = byId("community-search")?.value?.toLowerCase() || "";
  const communities = state.data.communities.filter(community => {
    const matchesText = [community.title, community.course, community.institution].join(" ").toLowerCase().includes(query);
    if (!matchesText) return false;
    if (state.communityFilter === "institution") return community.institution === state.data.currentUser.institution;
    if (state.communityFilter === "mine") return ["com_brasil", "com_med_usp"].includes(community.id);
    return true;
  });

  byId("community-list").innerHTML = communities.map(community => `
    <article class="community-card">
      <span class="community-icon" style="background:${community.accent}">${community.course.slice(0, 2).toUpperCase()}</span>
      <div class="meta">
        <strong>${community.title}</strong>
        <span>${community.visibility} • ${(community.members / 1000).toFixed(1)}k membros</span>
      </div>
      <button data-view="chat">Participar</button>
    </article>
  `).join("");
}

function renderChats() {
  const chats = state.data.chats;
  if (!state.activeChatId) state.activeChatId = chats[0]?.id;
  const active = chats.find(chat => chat.id === state.activeChatId) || chats[0];
  byId("conversation-list").innerHTML = chats.map(chat => `
    <button class="chat-row ${chat.id === active.id ? "active" : ""}" data-chat="${chat.id}">
      <span class="community-icon" style="background:#263f82">${chat.title.slice(0, 2).toUpperCase()}</span>
      <span class="meta"><strong>${chat.title}</strong><small>${chat.messages.at(-1)?.message || ""}</small></span>
    </button>
  `).join("");
  byId("conversation-title").textContent = active.title;
  byId("messages").innerHTML = active.messages.filter(message => !message.deletedAt).map(message => `
    <div class="bubble ${message.senderId === state.data.currentUser.id ? "me" : ""}">${message.message}</div>
  `).join("");
  byId("messages").scrollTop = byId("messages").scrollHeight;
}

function renderProfile() {
  const user = state.data.currentUser;
  byId("profile-hero").innerHTML = `
    <div class="profile-top">
      <span class="avatar" style="background-image:url('${user.photo}')"></span>
      <div class="meta">
        <strong>${user.username}</strong>
        <span>${user.course} • ${user.institution}</span>
        ${verificationBadge(user)}
      </div>
    </div>
    <div class="stats">
      <span><strong>${state.data.products.filter(product => product.sellerId === user.id).length}</strong>Publicacoes</span>
      <span><strong>48</strong>Seguidores</span>
      <span><strong>56</strong>Seguindo</span>
    </div>
    <div class="badges">${user.badges.map(badge => `<span class="badge">${badge}</span>`).join("")}</div>
  `;

  byId("saved-list").innerHTML = state.data.products.filter(product => product.saved || product.sellerId === user.id).map(product => `
    <article class="saved-row">
      <img src="${product.image}" alt="${product.title}">
      <div class="meta">
        <strong>${product.title}</strong>
        <span>${money(product.price)}</span>
        <small>Salvo ha 2 dias</small>
      </div>
    </article>
  `).join("");
}

function renderPrivacy() {
  const privacy = state.data.privacy;
  byId("privacy-lists").innerHTML = `
    <strong>Necessarios</strong>
    <ul>${privacy.collected.map(item => `<li>${item}</li>`).join("")}</ul>
    <strong>Evitados no MVP</strong>
    <ul>${privacy.avoided.map(item => `<li>${item}</li>`).join("")}</ul>
  `;
}

function renderDetail() {
  const product = productById(state.activeProductId);
  const panel = byId("detail-panel");
  if (!product) {
    panel.innerHTML = `<div class="detail-empty">Selecione um produto para ver detalhes.</div>`;
    return;
  }
  const seller = userById(product.sellerId);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  panel.innerHTML = `
    <img class="detail-image" src="${product.image}" alt="${product.title}">
    <div class="detail-body">
      <h2>${product.title}</h2>
      <div class="price">${money(product.price)} <span class="old-price">${money(product.originalPrice)}</span></div>
      <small style="color:var(--green);font-weight:800">Economize ${money(product.originalPrice - product.price)} (${discount}%)</small>
      <div class="seller-line" style="margin:16px 0">
        <span class="avatar" style="background-image:url('${seller.photo}')"></span>
        <div class="meta"><strong>${seller.username}</strong><span>${seller.course} • ${seller.institution}</span>${verificationBadge(seller)}</div>
      </div>
      <p>${product.description}</p>
      <div class="detail-tags"><span>${product.condition}</span><span>${product.category}</span><span>${product.location}</span></div>
      <div class="detail-actions"><button data-view="chat">Conversar</button><button>Comprar</button></div>
    </div>
  `;
}

function setView(view) {
  state.view = view;
  document.querySelectorAll(".content-view").forEach(item => item.classList.remove("active"));
  byId(`view-${view}`)?.classList.add("active");
  document.querySelectorAll(".bottom-nav button").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  byId("scope-label").textContent = view === "home" ? "Para você" : view[0].toUpperCase() + view.slice(1);
}

async function refresh() {
  try {
    state.data = await api("/api/app");
  } catch {
    state.apiOnline = false;
    state.data = await fallbackApi("/api/app");
  }
  renderStories();
  renderFeed();
  renderProducts();
  renderCommunities();
  renderChats();
  renderProfile();
  renderPrivacy();
  renderDetail();
}

document.addEventListener("click", async event => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) setView(viewButton.dataset.view);

  const productButton = event.target.closest("[data-product]");
  if (productButton) {
    state.activeProductId = productButton.dataset.product;
    renderDetail();
  }

  const chatButton = event.target.closest("[data-chat]");
  if (chatButton) {
    state.activeChatId = chatButton.dataset.chat;
    renderChats();
  }

  const filterButton = event.target.closest("[data-community-filter]");
  if (filterButton) {
    state.communityFilter = filterButton.dataset.communityFilter;
    document.querySelectorAll("[data-community-filter]").forEach(button => button.classList.toggle("active", button === filterButton));
    renderCommunities();
  }
});

byId("product-search").addEventListener("input", renderProducts);
byId("community-search").addEventListener("input", renderCommunities);
byId("open-publish").addEventListener("click", () => byId("publish-dialog").showModal());

byId("message-form").addEventListener("submit", async event => {
  event.preventDefault();
  const input = byId("message-input");
  if (!input.value.trim()) return;
  await api(`/api/chats/${state.activeChatId}/messages`, { method: "POST", body: JSON.stringify({ message: input.value.trim() }) });
  input.value = "";
  await refresh();
});

byId("publish-form").addEventListener("submit", async event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  await api("/api/products", {
    method: "POST",
    body: JSON.stringify(Object.fromEntries(form.entries()))
  });
  byId("publish-dialog").close();
  await refresh();
  setView("home");
});

byId("verification-form").addEventListener("submit", async event => {
  event.preventDefault();
  const output = byId("verification-result");
  try {
    const result = await api("/api/verification/request-code", {
      method: "POST",
      body: JSON.stringify({ email: byId("institutional-email").value })
    });
    output.textContent = `Codigo demo enviado: ${result.demoCode}`;
  } catch (error) {
    output.textContent = error.message;
  }
});

byId("export-data").addEventListener("click", async () => {
  const result = await api("/api/privacy/export", { method: "POST", body: "{}" });
  byId("export-output").textContent = JSON.stringify(result, null, 2);
});

byId("delete-account").addEventListener("click", () => {
  byId("export-output").textContent = "No MVP, esta acao abre um ticket de exclusao: remover dados pessoais, fotos/documentos e anonimizar historico necessario.";
});

refresh().then(() => setView("home"));
