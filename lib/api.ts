const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : process.env.NEXT_PUBLIC_API_URL!;

export type PropertyImage = { id: number; image: string };
export type Property = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  garage: number;
  land_size: string;
  status: string;
  featured: boolean;
  property_type: string;
  images: PropertyImage[];
};
export type Service = {
  id: number;
  title: string;
  description: string;
  icon: string;
};
export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
};
export type PropertyInput = Omit<Property, "id" | "images">;
export type PropertySearch = {
  title?: string;
  location?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
};
export type DashboardStats = {
  total_properties: number;
  featured_properties: number;
  messages: any;
  recent_uploads: Property[];
};
export type MessageStats = {
  name: string;
  email: string;
  phone: string;
  message: string;
  id: number;
  created_at: string;
};
export type DashboardData = {
  total_properties: number;
  featured_properties: number;
  messages: any;
  recent_uploads: Property[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok)
    throw new Error(
      (await response.json().catch(() => null))?.detail ??
        "Unable to reach the server.",
    );
  return response.status === 204 ? (undefined as T) : response.json();
}

const authenticated = (token: string, init: RequestInit = {}) => ({
  ...init,
  headers: { Authorization: `Bearer ${token}`, ...init.headers },
});

export const getProperties = (featured?: boolean) =>
  request<Property[]>(
    `/api/properties${featured === undefined ? "" : `?featured=${featured}`}`,
  );
export const getProperty = (slug: string) =>
  request<Property>(`/api/properties/${slug}`);
export const searchProperties = (filters: PropertySearch) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const query = params.toString();
  return request<Property[]>(
    `/api/properties/search${query ? `?${query}` : ""}`,
  );
};
export const getServices = () => request<Service[]>("/api/services");
export const sendContact = (payload: ContactPayload) =>
  request("/api/contact", { method: "POST", body: JSON.stringify(payload) });
export const login = (username: string, password: string) =>
  request<{ access_token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
export const getDashboard = (token: string) =>
  request<DashboardStats>("/api/admin/dashboard", authenticated(token));
export const getAdminMessages = (token: string) =>
  request<MessageStats[]>("/api/admin/messages", authenticated(token));
export const getAdminProperties = (token: string) =>
  request<Property[]>("/api/admin/properties", authenticated(token));
export const createProperty = (token: string, property: PropertyInput) =>
  request<Property>(
    "/api/properties",
    authenticated(token, { method: "POST", body: JSON.stringify(property) }),
  );
export const updateProperty = (
  token: string,
  id: number,
  property: PropertyInput,
) =>
  request<Property>(
    `/api/properties/${id}`,
    authenticated(token, { method: "PUT", body: JSON.stringify(property) }),
  );

export const deleteProperty = (token: string, id: number) =>
  request<Property>(
    `/api/properties/${id}`,
    authenticated(token, { method: "DELETE" }),
  );
export const uploadPropertyImages = async (
  token: string,
  id: number,
  files: File[],
) => {
  const form = new FormData();
  files.forEach((file) => form.append("files", file));
  const response = await fetch(`${API_URL}/api/properties/${id}/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!response.ok)
    throw new Error(
      (await response.json().catch(() => null))?.detail ??
        "Image upload failed.",
    );
  return response.json() as Promise<Property>;
};
export const createService = (token: string, service: Service) =>
  request<Service>(
    "/api/services",
    authenticated(token, { method: "POST", body: JSON.stringify(service) }),
  );
export const updateService = (token: string, id: number, service: Service) =>
  request<Service>(
    `/api/services/${id}`,
    authenticated(token, { method: "PUT", body: JSON.stringify(service) }),
  );

export const propertyImage = (property: Property) => {
  const image = property.images[0]?.image;
  return image
    ? image.startsWith("http")
      ? image
      : `${API_URL}${image}`
    : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85";
};
export const propertySlugImages = (property: Property): string[] => {
  if (!property.images?.length) {
    return [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    ];
  }

  return property.images.map((img) =>
    img.image.startsWith("http") ? img.image : `${API_URL}${img.image}`,
  );
};
export const formatNaira = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
