// Backend'den dönen veri tipleri. Prisma modelleriyle uyumludur.

export type ListingStatus = "AKTIF" | "BEKLEMEDE" | "TAMAMLANDI" | "IPTAL";
export type OfferStatus = "BEKLEMEDE" | "KABUL" | "RED" | "GERI_CEKILDI";
export type OrderStatus =
  | "ODEME_BEKLENIYOR"
  | "ODENDI"
  | "HAZIRLANIYOR"
  | "KARGODA"
  | "TESLIM_EDILDI"
  | "IPTAL";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  isVerified: boolean;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: User;
  tokens: Tokens;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  listingCount: number;
}

export interface ListingCategoryRef {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export interface ListingOwnerRef {
  id: string;
  name: string;
  avatarUrl: string | null;
  ratingAvg: number;
  isVerified: boolean;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  budgetLabel: string;
  location: string | null;
  status: ListingStatus;
  coverImageUrl: string | null;
  views: number;
  deadline: string | null;
  createdAt: string;
  category: ListingCategoryRef;
  owner: ListingOwnerRef;
  offerCount: number;
}

export interface OfferSellerRef {
  id: string;
  name: string;
  avatarUrl: string | null;
  ratingAvg: number;
  ratingCount: number;
  isVerified: boolean;
}

export interface ListingOffer {
  id: string;
  price: number;
  deliveryTime: string;
  warranty: string | null;
  shippingInfo: string | null;
  note: string;
  status: OfferStatus;
  createdAt: string;
  seller: OfferSellerRef;
}

export interface ListingDetail extends Listing {
  fullDescription: string;
  updatedAt: string;
  owner: ListingOwnerRef & { ratingCount: number };
  images: { id: string; url: string }[];
  offers: ListingOffer[];
}

export interface Offer {
  id: string;
  price: number;
  deliveryTime: string;
  warranty: string | null;
  shippingInfo: string | null;
  note: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
  listing: {
    id: string;
    title: string;
    description: string;
    budgetLabel: string;
    coverImageUrl: string | null;
    status: ListingStatus;
    views: number;
    category: ListingCategoryRef;
    owner: { id: string; name: string; avatarUrl: string | null };
    offerCount: number;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  counterpart: { id: string; name: string; avatarUrl: string | null };
  listing: { id: string; title: string; coverImageUrl: string | null };
  lastMessage: { content: string; createdAt: string; senderId: string } | null;
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  readAt: string | null;
  createdAt: string;
}

export interface ConversationDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  buyer: { id: string; name: string; avatarUrl: string | null };
  seller: { id: string; name: string; avatarUrl: string | null };
  listing: { id: string; title: string; coverImageUrl: string | null };
  messages: Message[];
}

export interface Order {
  id: string;
  status: OrderStatus;
  amount: number;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  createdAt: string;
  updatedAt: string;
  buyer: { id: string; name: string; avatarUrl: string | null };
  offer: {
    id: string;
    price: number;
    deliveryTime: string;
    seller: { id: string; name: string; avatarUrl: string | null };
    listing: {
      id: string;
      title: string;
      coverImageUrl: string | null;
      category: { name: string; slug: string };
    };
  };
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: { id: string; name: string; avatarUrl: string | null };
  order: { offer: { listing: { id: string; title: string } } };
}
