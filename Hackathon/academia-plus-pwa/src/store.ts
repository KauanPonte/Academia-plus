import { reactive } from 'vue'
import { Product } from '@/model/product.model'
import Cart from '@/model/cart.model'
import type { Category } from '@/model/category.model'

interface Community {
  id: number
  title: string
  institution: string
  course: string
  members: string
  visibility: 'Publica' | 'Privada'
  color: string
}

export type FeedPostType = 'sale' | 'question' | 'event' | 'internship' | 'mentoring'

interface FeedPost {
  id: number
  author: string
  course: string
  institution: string
  avatar: string
  type: FeedPostType
  productId?: number
  text?: string
  likes: number
  comments: number
  distance?: string
  publishedAt: string
}

export interface ChatPreview {
  id: number
  title: string
  lastMessage: string
  unread: number
  messages: ChatMessage[]
}

export interface ChatMessage {
  text: string
  mine?: boolean
  senderName?: string
  senderAvatar?: string
}

interface StoreStats {
  totalSales: number
  activeClients: number
  monthlyGrowth: number
  answeredQuestions: number
  activeCommunities: number
  eventsToday: number
}

interface Store {
  cart: Cart
  products: Product[]
  communities: Community[]
  feedPosts: FeedPost[]
  chats: ChatPreview[]
  stats: StoreStats
}

const studyMaterial: Category = { id: 1, name: 'Material de estudo' }
const clothing: Category = { id: 2, name: 'Roupas e acessorios' }
const books: Category = { id: 3, name: 'Livros' }
const tech: Category = { id: 4, name: 'Tecnologia' }
const tools: Category = { id: 5, name: 'Ferramentas e projetos' }
const CHAT_STORAGE_KEY = 'academia-plus-chats'
const SAVED_PRODUCTS_STORAGE_KEY = 'academia-plus-saved-products'
const FOLLOWING_SELLERS_STORAGE_KEY = 'academia-plus-following-sellers'

function loadStoredArray<T>(key: string): T[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const savedItems = window.localStorage.getItem(key)
    const parsedItems = savedItems ? JSON.parse(savedItems) : []

    return Array.isArray(parsedItems) ? parsedItems : []
  } catch {
    return []
  }
}

function persistStoredArray<T>(key: string, items: T[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(items))
}

export const savedProductIds = reactive(new Set<number>(loadStoredArray<number>(SAVED_PRODUCTS_STORAGE_KEY)))
export const followedSellers = reactive(new Set<string>(loadStoredArray<string>(FOLLOWING_SELLERS_STORAGE_KEY)))

export const store = reactive<Store>({
  cart: new Cart(),
  products: [
    new Product(
      1,
      'Calculadora Casio fx-991EX',
      'Perfeita para calculo, estatistica, fisica e provas. Produto usado em otimo estado.',
      120,
      studyMaterial,
      'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQNk81xbhEeSiGGRlGxI_Zk4y9rngHD_khkK1wpAd9a69pEKw3XHCaSf4-WI-Of-qZkbs9qXs0ylqjvaa0weyre5EgvzxBro07HLaId042-RIOXUMCWqhmSKCU',
      'joao.backend',
      'Engenharia de Software',
      'IFCE',
      'Fortaleza, CE',
      'CE',
      'Otimo estado',
      18,
    ),
    new Product(
      2,
      'Jaleco branco tamanho M',
      'Usado poucas vezes, tecido de boa qualidade, sem manchas ou rasgos.',
      80,
      clothing,
      'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTtjQaKs4vkPz1zWwa9N7HhbyvZWXFy976NrabiJk2H9tqBA11ypOE0IaVPmngKdQ-76LGk8i-xOvpPSsz0C723uz8kZgOPKA',
      'maria.front',
      'Medicina',
      'UFC',
      'Fortaleza, CE',
      'CE',
      'Usado 2 vezes',
      12,
    ),
    new Product(
      3,
      'Anatomia Humana - Sobotta',
      'Livro usado para ciclo basico, com poucas marcacoes e paginas preservadas.',
      100,
      books,
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrjvduSjXPYE69WPb-UBFd4Xe6J_fFSbMB-w&s',
      'maria.front',
      'Medicina',
      'UFC',
      'Fortaleza, CE',
      'CE',
      'Com marcacoes leves',
      9,
    ),
    new Product(
      4,
      'Planner universitario 2026',
      'Planner semi novo para organizar aulas, provas, estágios e monitorias.',
      35,
      studyMaterial,
      'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRRDJqnrjpp7xcAoFpTMzt2gzLbrS4UEVbZslmu4aCoL9tq98JDvlP3OnPIIExT92lHUQJK3p_akXLEYOlckh_KvMjKJYRo',
      'larissa.dev',
      'Sistemas de Informacao',
      'IFCE',
      'Fortaleza, CE',
      'CE',
      'Semi novo',
      6,
    ),
    new Product(
      5,
      'Livro Calculo Volume 1',
      'Edicao conservada, ideal para Calculo I e revisoes antes das provas.',
      70,
      books,
      'https://http2.mlstatic.com/D_NQ_NP_925268-MLB85716406927_062025-O.jpg',
      'pedro.db',
      'Ciencia da Computacao',
      'UFC',
      'Fortaleza, CE',
      'CE',
      'Bom estado',
      11,
    ),
    new Product(
      6,
      'Notebook Lenovo i5',
      'Notebook usado para estudos, VS Code, aulas online e trabalhos academicos.',
      1450,
      tech,
      'https://photos.enjoei.com.br/notebook-lenovo-ideapad-s145-i5-10-geracao/1200xN/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy8xMDIxODg0My9iMGJkNTcyOTEwYmIxODc1OWQ2NDkxMGNlMmRjNWU5Ny5qcGc',
      'ana.estudos',
      'Administracao',
      'FGV',
      'Sao Paulo, SP',
      'SP',
      'Com marcas de uso',
      25,
    ),
    new Product(
      7,
      'Mochila executiva impermeavel',
      'Cabe notebook, livros e material de laboratorio. Pouco uso.',
      95,
      clothing,
      'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSr65cR1IIFf87b1Gz3kFvFEd3Umi3U8VS2j6UczED1MEnsZr-F19xzmpbNZmagnCb-2wqilL9wCiLLYtu-bFfi15t3-lwD',
      'biomed.aline',
      'Biomedicina',
      'UFRJ',
      'Rio de Janeiro, RJ',
      'RJ',
      'Otimo estado',
      7,
    ),
    new Product(
      8,
      'Regua T para desenho tecnico',
      'Regua T 80 cm para arquitetura, engenharia e desenho tecnico.',
      45,
      tools,
      'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcR2UyttWDV2cfPeLyiUChRgw1_JRqh2z1pdSvHEZUbp53pYuvVFSXKwbsds5LSU7nB0wX8dUUjyKX6CwYX-mO89O3KQI1cO7lFiYrtGfZyJsSm_8lRLTe5f',
      'carlos.eng',
      'Engenharia Civil',
      'UFRJ',
      'Rio de Janeiro, RJ',
      'RJ',
      'Usada',
      4,
    ),
    new Product(
      9,
      'Fone JBL Tune',
      'Fone para aulas, reunioes e estudos. Bateria funcionando bem.',
      90,
      tech,
      'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ1XSI8I6NkI5i31ZPOxeHoVl40vu9PMaCCLC238vsBX6IDOx4aaqtGXh3KVD_6mr1WtTijZbTFfBWB7jc0gGafc2CbfqxQ',
      'laura.fisio',
      'Fisioterapia',
      'UNIFESP',
      'Sao Paulo, SP',
      'SP',
      'Bom estado',
      10,
    ),
    new Product(
      10,
      'Kit Arduino Uno com sensores',
      'Kit para projetos de eletronica, IoT e disciplinas praticas.',
      160,
      tools,
      'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTnRvcO-yTduCIT4JJMI9rHc9opP2T35rfoIxIxEWOniVZBVeTvmoXdiu93sC1QeZK5OZdGROF-H8ek2-ie_pNeT_6haiQaQTgtNZU33eZ3IfeTl97g3MtdRg',
      'pedro.db',
      'Ciencia da Computacao',
      'UFC',
      'Fortaleza, CE',
      'CE',
      'Completo',
      16,
    ),
  ],
  communities: [
    {
      id: 1,
      title: 'Engenharia IFCE',
      institution: 'IFCE',
      course: 'Engenharia',
      members: '12,4k',
      visibility: 'Publica',
      color: 'bg-emerald-700',
    },
    {
      id: 2,
      title: 'Medicina UFC',
      institution: 'UFC',
      course: 'Medicina',
      members: '9,1k',
      visibility: 'Publica',
      color: 'bg-rose-700',
    },
    {
      id: 3,
      title: 'Direito USP',
      institution: 'USP',
      course: 'Direito',
      members: '8,3k',
      visibility: 'Privada',
      color: 'bg-sky-700',
    },
    {
      id: 4,
      title: 'Ciencia da Computacao UFC',
      institution: 'UFC',
      course: 'Computacao',
      members: '6,8k',
      visibility: 'Publica',
      color: 'bg-indigo-700',
    },
    {
      id: 5,
      title: 'Administracao IFCE',
      institution: 'IFCE',
      course: 'Administracao',
      members: '3,7k',
      visibility: 'Publica',
      color: 'bg-amber-700',
    },
    {
      id: 6,
      title: 'Geral Brasil',
      institution: 'Brasil',
      course: 'Todos',
      members: '18,4k',
      visibility: 'Publica',
      color: 'bg-violet-700',
    },
  ],
  feedPosts: [
    {
      id: 1,
      author: 'joao.backend',
      course: 'Engenharia de Software',
      institution: 'IFCE',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      type: 'sale',
      productId: 1,
      likes: 42,
      comments: 11,
      distance: '2 km',
      publishedAt: 'ha 2 horas',
    },
    {
      id: 2,
      author: 'larissa.dev',
      course: 'Sistemas de Informacao',
      institution: 'IFCE',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      type: 'question',
      text: 'Alguem tem resumo de Banco de Dados para revisar normalizacao?',
      likes: 31,
      comments: 18,
      distance: 'campus',
      publishedAt: 'ha 35 min',
    },
    {
      id: 3,
      author: 'maria.front',
      course: 'Medicina',
      institution: 'UFC',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      type: 'event',
      text: 'Semana da Computacao com oficinas de IA, carreira e projetos open source comeca segunda.',
      likes: 89,
      comments: 24,
      distance: 'online',
      publishedAt: 'hoje',
    },
    {
      id: 4,
      author: 'maria.front',
      course: 'Medicina',
      institution: 'UFC',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      type: 'sale',
      productId: 3,
      likes: 17,
      comments: 6,
      distance: '4 km',
      publishedAt: 'ha 3 horas',
    },
    {
      id: 5,
      author: 'pedro.db',
      course: 'Ciencia da Computacao',
      institution: 'UFC',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      type: 'question',
      text: 'Alguem sabe onde comprar componentes eletronicos baratos para projeto de IoT?',
      likes: 22,
      comments: 15,
      distance: 'campus',
      publishedAt: 'ha 1 hora',
    },
    {
      id: 6,
      author: 'ana.estudos',
      course: 'Administracao',
      institution: 'FGV',
      avatar:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80',
      type: 'internship',
      text: 'Vaga de estagio em produto para alunos de Administracao, Design ou Computacao.',
      likes: 54,
      comments: 13,
      distance: 'remoto',
      publishedAt: 'ontem',
    },
    {
      id: 7,
      author: 'prof.mentor',
      course: 'Mentoria',
      institution: 'Geral Brasil',
      avatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
      type: 'mentoring',
      text: 'Plantão de dúvidas de algoritmos hoje às 20h. Quem quiser pode entrar pelo chat da comunidade.',
      likes: 76,
      comments: 21,
      distance: 'online',
      publishedAt: 'hoje',
    },
  ],
  chats: [
    {
      id: 1,
      title: 'joao.backend',
      lastMessage: 'Esta sim. Posso entregar no campus depois da aula.',
      unread: 1,
      messages: [
        { text: 'Oi! A calculadora ainda esta disponivel?', mine: true },
        {
          text: 'Esta sim. Posso entregar no campus depois da aula.',
          senderName: 'joao.backend',
          senderAvatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
        },
      ],
    },
    {
      id: 2,
      title: 'Engenharia IFCE',
      lastMessage: 'Pedro enviou um resumo de Banco de Dados.',
      unread: 3,
      messages: [
        {
          text: 'Alguem tem resumo de Banco de Dados?',
          senderName: 'larissa.dev',
          senderAvatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
        },
        {
          text: 'Tenho um PDF de normalizacao, vou mandar aqui.',
          senderName: 'pedro.db',
          senderAvatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        },
        {
          text: 'Valeu! Vai salvar minha prova.',
          senderName: 'larissa.dev',
          senderAvatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
        },
      ],
    },
    {
      id: 3,
      title: 'Mentoria de Algoritmos',
      lastMessage: 'Plantao confirmado hoje as 20h.',
      unread: 0,
      messages: [
        {
          text: 'Boa tarde, pessoal.',
          senderName: 'ana.estudos',
          senderAvatar:
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80',
        },
        {
          text: 'Plantao confirmado hoje as 20h.',
          senderName: 'prof.mentor',
          senderAvatar:
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
        },
      ],
    },
  ],
  stats: {
    totalSales: 253,
    activeClients: 18400,
    monthlyGrowth: 32,
    answeredQuestions: 98,
    activeCommunities: 41,
    eventsToday: 12,
  },
})

function loadStoredChats(): ChatPreview[] {
  return loadStoredArray<ChatPreview>(CHAT_STORAGE_KEY)
}

function hydrateStoredChats() {
  const storedChats = loadStoredChats()

  if (!storedChats.length) {
    return
  }

  const chatsByTitle = new Map(store.chats.map((chat) => [chat.title, chat]))

  storedChats.forEach((storedChat) => {
    if (!storedChat?.title || !Array.isArray(storedChat.messages)) {
      return
    }

    const existingChat = chatsByTitle.get(storedChat.title)

    if (existingChat) {
      Object.assign(existingChat, storedChat)
      return
    }

    store.chats.push(storedChat)
  })
}

export function persistChats() {
  persistStoredArray(CHAT_STORAGE_KEY, store.chats)
}

export function isProductSaved(productId: number) {
  return savedProductIds.has(productId)
}

export function toggleSavedProduct(productId: number) {
  if (savedProductIds.has(productId)) {
    savedProductIds.delete(productId)
  } else {
    savedProductIds.add(productId)
  }

  persistStoredArray(SAVED_PRODUCTS_STORAGE_KEY, [...savedProductIds])
}

export function isSellerFollowed(seller: string) {
  return followedSellers.has(seller)
}

export function toggleFollowSeller(seller: string) {
  if (followedSellers.has(seller)) {
    followedSellers.delete(seller)
  } else {
    followedSellers.add(seller)
  }

  persistStoredArray(FOLLOWING_SELLERS_STORAGE_KEY, [...followedSellers])
}

export function startProductChat(product: Product) {
  const message = `Tenho interesse no ${product.name}`
  let chat = store.chats.find((item) => item.title === product.seller)

  if (!chat) {
    chat = {
      id: Date.now(),
      title: product.seller,
      lastMessage: `Você: ${message}`,
      unread: 0,
      messages: [],
    }
    store.chats.unshift(chat)
  }

  const alreadySent = chat.messages.some((chatMessage) => chatMessage.mine && chatMessage.text === message)

  if (!alreadySent) {
    chat.messages.push({ text: message, mine: true })
    product.interested += 1
  }

  chat.lastMessage = `Você: ${message}`
  chat.unread = 0
  persistChats()

  return chat.id
}

hydrateStoredChats()
