
export type UserRole = 'admin' | 'cliente' | 'oficinista' | 'bodeguero' | 'domiciliario';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  phone?: string;
  address?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  boxQuantity: number;
  unitsPerBox: number;
  totalUnits: number;
  category: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  userId: number;
  customerName: string;
  date: string;
  status: 'pendiente' | 'en preparación' | 'enviado' | 'entregado';
  deliveryAddress: string;
  items: OrderItem[];
  total: number;
}

export interface InventoryMovement {
  id: number;
  productId: number;
  productName: string;
  type: 'entrada' | 'salida';
  quantity: number;
  date: string;
  note?: string;
  userId: number;
  userName: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  pendingOrders: number;
  totalSales: number;
  recentOrders: Order[];
  topProducts: {productId: number, productName: string, soldQuantity: number}[];
}
