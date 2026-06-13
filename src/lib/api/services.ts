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
  OfferBlockOptions,
  Order,
  Paginated,
  ProvinceOption,
  Address,
  PublicProfile,
  Review,
  User,
} from "./types";

// --- Auth ---
export const authApi = {
  register: (body: { email: string; name: string; password: string; phone?: string; province?: string; district?: string }) =>
    api.post<AuthResult>("/auth/register", body, false),
  login: (body: { email: string; password: string }) =>
    api.post<AuthResult>("/auth/login", body, false),
  logout: () => api.post<{ message: string }>("/auth/logout"),
  me: () => api.get<User>("/auth/me"),
};

// --- Locations (il/ilçe) ---
export const locationsApi = {
  list: () => api.get<ProvinceOption[]>("/locations", false),
};

// --- Uploads (görsel) ---
export const uploadsApi = {
  image: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api.postForm<{ url: string }>("/uploads/image", form);
  },
};

// --- Users ---
export const usersApi = {
  updateProfile: (body: Partial<Pick<User, "name" | "email" | "phone" | "bio" | "location" | "province" | "district">>) =>
    api.patch<User>("/users/me", body),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    api.patch<{ message: string }>("/users/me/password", body),
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append("avatar", file);
    return api.postForm<User>("/users/me/avatar", form);
  },
  publicProfile: (id: string) => api.get<PublicProfile>(`/users/${id}`, false),
  // Adresler
  listAddresses: () => api.get<Address[]>("/users/me/addresses"),
  createAddress: (body: { title: string; province: string; district: string; fullAddress?: string; isDefault?: boolean }) =>
    api.post<Address>("/users/me/addresses", body),
  updateAddress: (id: string, body: Partial<{ title: string; province: string; district: string; fullAddress: string; isDefault: boolean }>) =>
    api.patch<Address>(`/users/me/addresses/${id}`, body),
  removeAddress: (id: string) => api.delete<void>(`/users/me/addresses/${id}`),
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
  province?: string;
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
    province?: string;
    district?: string;
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
  update: (id: string, body: { price?: number; note?: string }) =>
    api.patch<Offer>(`/offers/${id}`, body),
  remove: (id: string) => api.delete<void>(`/offers/${id}`),
};

// --- Messages ---
export const messagesApi = {
  createOrGet: (body: { listingId: string; participantId?: string }) =>
    api.post<ConversationDetail>("/conversations", body),
  list: () => api.get<Conversation[]>("/conversations"),
  detail: (id: string) => api.get<ConversationDetail>(`/conversations/${id}`),
  send: (id: string, content: string) =>
    api.post<Message>(`/conversations/${id}/messages`, { content }),
  sendOffer: (id: string, body: { price: number; deliveryTime?: string; note?: string }) =>
    api.post<Message>(`/conversations/${id}/offer`, body),
  acceptOffer: (id: string) =>
    api.patch<{ ok: boolean }>(`/conversations/${id}/offer/accept`),
  rejectOffer: (id: string) =>
    api.patch<{ ok: boolean }>(`/conversations/${id}/offer/reject`),
  offerBlockOptions: (id: string) =>
    api.get<OfferBlockOptions>(`/conversations/${id}/offer-blocks`),
  setOfferBlocks: (id: string, listingIds: string[]) =>
    api.put<{ blockedListingIds: string[] }>(`/conversations/${id}/offer-blocks`, { listingIds }),
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
