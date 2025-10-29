import { axiosInstance } from "@/utils/axios";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
  Category,
  CategoryPayload,
  PaginatedProductResponse,
  Product,
  CartItem,
  AddToCartPayload,
  UpdateCartPayload,
  PaginatedOrderResponse,
  Order,
  CheckoutPayload,
  UpdateOrderStatusPayload,
} from "@/interfaces/api";

// === Auth ===

export const apiLogin = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post("/api/login", payload);
  return data;
};

export const apiRegister = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post("/api/register", payload);
  return data;
};

export const apiLogout = async (): Promise<{ message: string }> => {
  const { data } = await axiosInstance.post("/api/logout");
  return data;
};

export const apiGetMe = async (): Promise<User> => {
  const { data } = await axiosInstance.get("/api/user");
  return data;
};

// === Public (Products & Categories) ===

export const apiGetCategories = async (): Promise<Category[]> => {
  const { data } = await axiosInstance.get("/api/categories");
  return data;
};

export const apiGetCategory = async (id: number): Promise<Category> => {
  const { data } = await axiosInstance.get(`/api/categories/${id}`);
  return data;
};

export const apiGetProducts = async (
  page: number = 1,
  search?: string,
  categoryId?: number
): Promise<PaginatedProductResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  if (search) params.append("search", search);
  if (categoryId) params.append("category_id", categoryId.toString());

  const { data } = await axiosInstance.get(
    `/api/products?${params.toString()}`
  );
  return data;
};

export const apiGetProduct = async (id: number): Promise<Product> => {
  const { data } = await axiosInstance.get(`/api/products/${id}`);
  return data;
};

// === Cart ===

export const apiGetCart = async (): Promise<CartItem[]> => {
  const { data } = await axiosInstance.get("/api/cart");
  return data;
};

export const apiAddToCart = async (
  payload: AddToCartPayload
): Promise<CartItem> => {
  const { data } = await axiosInstance.post("/api/cart", payload);
  return data;
};

export const apiUpdateCartItem = async (
  cartItemId: number,
  payload: UpdateCartPayload
): Promise<CartItem> => {
  const { data } = await axiosInstance.put(
    `/api/cart-items/${cartItemId}`,
    payload
  );
  return data;
};

export const apiRemoveFromCart = async (cartItemId: number): Promise<void> => {
  await axiosInstance.delete(`/api/cart-items/${cartItemId}`);
};

// === Orders ===

export const apiGetOrders = async (
  page: number = 1
): Promise<PaginatedOrderResponse> => {
  const { data } = await axiosInstance.get(`/api/orders?page=${page}`);
  return data;
};

export const apiGetOrder = async (orderId: string): Promise<Order> => {
  const { data } = await axiosInstance.get(`/api/orders/${orderId}`);
  return data;
};

export const apiCheckout = async (payload: CheckoutPayload): Promise<Order> => {
  const { data } = await axiosInstance.post("/api/orders", payload);
  return data;
};

// === Admin: Categories ===

export const apiAdminCreateCategory = async (
  payload: CategoryPayload
): Promise<Category> => {
  const { data } = await axiosInstance.post("/api/admin/categories", payload);
  return data;
};

export const apiAdminUpdateCategory = async (
  id: number,
  payload: CategoryPayload
): Promise<Category> => {
  const { data } = await axiosInstance.put(
    `/api/admin/categories/${id}`,
    payload
  );
  return data;
};

export const apiAdminDeleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/admin/categories/${id}`);
};

// === Admin: Products ===

export const apiAdminCreateProduct = async (
  formData: FormData
): Promise<Product> => {
  const { data } = await axiosInstance.post("/api/admin/products", formData);
  return data;
};

export const apiAdminUpdateProduct = async (
  id: number,
  formData: FormData
): Promise<Product> => {
  // We use POST and add _method: "PUT" for file uploads
  formData.append("_method", "PUT");
  const { data } = await axiosInstance.post(
    `/api/admin/products/${id}`,
    formData
  );
  return data;
};

export const apiAdminDeleteProduct = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/admin/products/${id}`);
};

export const apiAdminForceDeleteProduct = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/admin/products/${id}/force`);
};

// === Admin: Orders ===

export const apiAdminUpdateOrder = async (
  id: string,
  payload: UpdateOrderStatusPayload
): Promise<Order> => {
  const { data } = await axiosInstance.patch(
    `/api/admin/orders/${id}`,
    payload
  );
  return data;
};

export const apiAdminDeleteOrder = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/admin/orders/${id}`);
};
