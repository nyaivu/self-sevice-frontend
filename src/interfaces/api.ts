// --- Base Models ---

export interface User {
  id: string; // ULID
  name: string;
  email: string;
  email_verified_at: string | null;
  type: "postpaid" | "general";
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  products?: Product[]; // Optional list of products
}

export interface Product {
  id: number;
  category_id: number | null;
  name: string;
  description: string | null;
  price: number; // Stored in cents
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  category: Category | null;
  pivot?: {
    quantity: number;
    price: number; // This is the PRICE AT THE TIME OF SALE
  };
}

export interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product; // Eager loaded product
}

export interface Order {
  id: string; // ULID
  user_id: string | null;
  total_price: number;
  payment_method: "qris" | "postpaid";
  payment_status: "pending" | "paid" | "unpaid";
  created_at: string;
  updated_at: string;
  user?: User;
  products?: Product[];
}

// --- Pagination ---

export interface PaginatedLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginatedMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedProductResponse {
  data: Product[];
  links: PaginatedLinks;
  meta: PaginatedMeta;
}

export interface PaginatedOrderResponse {
  data: Order[];
  links: PaginatedLinks;
  meta: PaginatedMeta;
}

// --- API Payloads (Request Bodies) ---

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  password_confirmation: string;
}

export interface AddToCartPayload {
  product_id: number;
  quantity: number;
}

export interface UpdateCartPayload {
  quantity: number;
}

export interface CheckoutPayload {
  payment_method: "qris" | "postpaid";
}

// For admin forms (create/update)
export interface CategoryPayload {
  name: string;
  slug: string;
  description?: string;
}

// Product payload is FormData, handled in the function
// export type ProductPayload = FormData;

export interface UpdateOrderStatusPayload {
  payment_status: "pending" | "paid" | "unpaid";
}
