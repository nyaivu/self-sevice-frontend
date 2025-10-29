import { axiosInstance } from "@/utils/axios";

// 1. Define the Category Interface (from your 'with' relationship)
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// 2. Define the updated Product Interface
export interface Product {
  id: number;
  name: string;
  description: string | null; // Can be null
  price: number; // API sends an integer (cents)
  stock: number;
  image_url: string | null; // Can be null
  category_id: number | null; // Can be null
  created_at: string;
  updated_at: string;
  category: Category | null; // The eager-loaded object
}

// 3. Define the Laravel Pagination Interfaces
export interface PaginatedMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

// 4. This is the main response type from GET /api/products
export interface PaginatedProductResponse {
  data: Product[];
  links: PaginatedLinks;
  meta: PaginatedMeta;
}

// 5. The updated fetch function
export const fetchProducts = async (
  page: number = 1
): Promise<PaginatedProductResponse> => {
  const response = await axiosInstance.get<PaginatedProductResponse>(
    `/api/products?page=${page}`
  );

  console.log(response.data);

  // Return the entire paginated object
  // Your component can now use response.data, response.links, response.meta
  return response.data;
};

// 5b. (Alternative) If you ONLY want the products array:
export const fetchJustProductList = async (
  page: number = 1
): Promise<Product[]> => {
  const response = await axiosInstance.get<PaginatedProductResponse>(
    `/api/products?page=${page}`
  );

  // Return just the data array
  return response.data.data;
};
