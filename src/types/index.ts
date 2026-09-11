export type Category = "Apparel" | "Drinkware" | "Accessories" | "Home & Gifts";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  description: string;
  icon: string;
  priceFrom: number | null;
  sizeRange: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  product: string;
  quantity: number;
  size: string | null;
  designNote: string | null;
  status:
    | "NEW"
    | "CONFIRMED"
    | "IN_PRODUCTION"
    | "COMPLETED"
    | "CANCELLED";
  createdAt: string;
}

export interface Admin {
  email: string;
  name: string;
  passwordHash: string;
}

export interface Settings {
  [key: string]: string;
}

export interface DBShape {
  products: Product[];
  orders: Order[];
  admins: Admin[];
  settings: Settings;
}

export const ORDER_STATUSES = [
  "NEW",
  "CONFIRMED",
  "IN_PRODUCTION",
  "COMPLETED",
  "CANCELLED",
] as const;