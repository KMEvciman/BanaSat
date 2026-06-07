// Backend uç noktalarını saran tip güvenli fonksiyonlar.

import { api } from "./client";
import type {
  AuthResult,
  Category,
  Conversation,
  ConversationDetail,
  Listing,
  ListingDetail,
  Message,
  Offer,
  Order,
  Paginated,
  PublicProfile,
  Review,
  User,
} from "./types";

// --- Auth ---
export const authApi = {
  register: (body: { email: string; name: string; password: string; phone?: string }) =>
    api.post<AuthResult>("/auth/register", body, false),
  login: (body: { email: string; password: string }) =>
    api.post<AuthResult>("/auth/login", body, false),
  logout: () => api.post<{ message: string }>("/auth/logout"),
  me: () => api.get<User>("/auth/me"),
};

// --- Users ---
export const usersApi = {
  updateProfile: (body: Partial<Pick<User, "name" | "email" | "phone" | "bio" | "location">>) =>
    api.patch<User>("/users/me", body),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    api.patch<{ message: string }>("/users/me/password", body),
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append("avatar", file);
    return api.postForm<User>("/users/me/avatar", form);
  },
  publicProfile: (id: string) => api.get<PublicProfile>(`/users/${id}`, false),
};

// --- Categories ---
export const categoriesApi = {
  list: () => api.get<Category[]>("/categories", false),
  bySlug: (slug: string) => api.get<Category>(`/categories/${slug}`, false),
};

// --- Listings ---
export interface ListingQuery {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  status?: string;
  ownerId?: string;
  sort?: string;
}

function buildQuery(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      sp.append(key, String(value));
    }
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const listingsApi = {
  list: (query: ListingQuery = {}) =>
    api.get<Paginated<Listing>>(`/listings${buildQuery({ ...query })}`, false),
  detail: (id: string) => api.get<ListingDetail>(`/listings/${id}`, false),
  create: (body: {
    title: string;
    description: string;
    fullDescription: string;
    categoryId: string;
    budgetLabel: string;
    location?: string;
    coverImageUrl?: string;
    imageUrls?: string[];
    deadline?: string;
  }) => api.post<Listing>("/listings", body),
  update: (id: string, body: Record<string, unknown>) =>
    api.patch<Listing>(`/listings/${id}`, body),
  remove: (id: string) => api.delete<void>(`/listings/${id}`),
};

// --- Offers ---
export interface OfferQuery {
  page?: number;
  limit?: number;
  status?: string;
  categorySlug?: string;
  search?: string;
  sort?: string;
}

export const offersApi = {
  create: (body: {
    listingId: string;
    price: number;
    deliveryTime: string;
    warranty?: string;
    shippingInfo?: string;
    note: string;
  }) => api.post<Offer>("/offers", body),
  mine: (query: OfferQuery = {}) =>
    api.get<Paginated<Offer>>(`/offers/mine${buildQuery({ ...query })}`),
  accept: (id: string) => api.patch<Offer>(`/offers/${id}/accept`),
  reject: (id: string) => api.patch<Offer>(`/offers/${id}/reject`),
  withdraw: (id: string) => api.patch<Offer>(`/offers/${id}/withdraw`),
};

// --- Messages ---
export const messagesApi = {
  createOrGet: (body: { listingId: string; participantId?: string }) =>
    api.post<ConversationDetail>("/conversations", body),
  list: () => api.get<Conversation[]>("/conversations"),
  detail: (id: string) => api.get<ConversationDetail>(`/conversations/${id}`),
  send: (id: string, content: string) =>
    api.post<Message>(`/conversations/${id}/messages`, { content }),
  markRead: (id: string) => api.patch<{ updated: number }>(`/conversations/${id}/read`),
};

// --- Orders ---
export const ordersApi = {
  create: (body: {
    offerId: string;
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingZip?: string;
  }) => api.post<Order>("/orders", body),
  pay: (id: string) => api.post<Order>(`/orders/${id}/pay`),
  myPurchases: () => api.get<Order[]>("/orders/mine"),
  mySales: () => api.get<Order[]>("/orders/sales"),
  detail: (id: string) => api.get<Order>(`/orders/${id}`),
  advanceStatus: (id: string, status: string) =>
    api.patch<Order>(`/orders/${id}/status`, { status }),
  cancel: (id: string) => api.patch<Order>(`/orders/${id}/cancel`),
};

// --- Reviews ---
export const reviewsApi = {
  create: (body: { orderId: string; rating: number; comment?: string }) =>
    api.post<Review>("/reviews", body),
  forUser: (userId: string) => api.get<Review[]>(`/reviews/user/${userId}`, false),
};
