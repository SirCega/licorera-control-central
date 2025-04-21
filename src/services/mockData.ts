
import { User, Product, Order, InventoryMovement } from "@/types";

// Mock users
export const users: User[] = [
  {
    id: 1,
    name: "Admin Principal",
    email: "admin@licorera.com",
    role: "admin",
    active: true,
    phone: "555-1234",
    address: "Calle Principal 100"
  },
  {
    id: 2,
    name: "Juan Pérez",
    email: "juan@example.com",
    role: "cliente",
    active: true,
    phone: "555-5678",
    address: "Calle Falsa 123, Ciudad Ejemplo"
  },
  {
    id: 3,
    name: "María Gómez",
    email: "maria@licorera.com",
    role: "oficinista",
    active: true,
    phone: "555-8765",
    address: "Avenida Central 456"
  },
  {
    id: 4,
    name: "Carlos Ramírez",
    email: "carlos@licorera.com",
    role: "bodeguero",
    active: true,
    phone: "555-4321",
    address: "Plaza Mayor 789"
  },
  {
    id: 5,
    name: "Luis Rodríguez",
    email: "luis@licorera.com",
    role: "domiciliario",
    active: true,
    phone: "555-2468",
    address: "Carrera 10 #15-20"
  }
];

// Mock products
export const products: Product[] = [
  {
    id: 1,
    name: "Whisky Premium",
    description: "Whisky escocés de alta calidad",
    price: 50.00,
    boxQuantity: 10,
    unitsPerBox: 12,
    totalUnits: 120,
    category: "Whisky"
  },
  {
    id: 2,
    name: "Aguardiente Antioqueño",
    description: "Licor colombiano tradicional",
    price: 20.00,
    boxQuantity: 20,
    unitsPerBox: 24,
    totalUnits: 480,
    category: "Aguardiente"
  },
  {
    id: 3,
    name: "Cerveza Artesanal",
    description: "Cerveza local artesanal",
    price: 3.00,
    boxQuantity: 30,
    unitsPerBox: 24,
    totalUnits: 720,
    category: "Cerveza"
  },
  {
    id: 4,
    name: "Ron Añejo",
    description: "Ron añejado en barricas de roble",
    price: 35.00,
    boxQuantity: 15,
    unitsPerBox: 12,
    totalUnits: 180,
    category: "Ron"
  },
  {
    id: 5,
    name: "Vodka Premium",
    description: "Vodka destilado 5 veces",
    price: 40.00,
    boxQuantity: 12,
    unitsPerBox: 12,
    totalUnits: 144,
    category: "Vodka"
  },
  {
    id: 6,
    name: "Tequila Reposado",
    description: "Tequila reposado 100% agave",
    price: 45.00,
    boxQuantity: 8,
    unitsPerBox: 12,
    totalUnits: 96,
    category: "Tequila"
  },
  {
    id: 7,
    name: "Gin Botánico",
    description: "Gin con extractos botánicos",
    price: 38.00,
    boxQuantity: 10,
    unitsPerBox: 12,
    totalUnits: 120,
    category: "Gin"
  },
  {
    id: 8,
    name: "Vino Tinto Reserva",
    description: "Vino tinto reserva especial",
    price: 25.00,
    boxQuantity: 18,
    unitsPerBox: 12,
    totalUnits: 216,
    category: "Vino"
  }
];

// Mock orders
export const orders: Order[] = [
  {
    id: 1,
    userId: 2,
    customerName: "Juan Pérez",
    date: "2023-04-15T10:30:00",
    status: "entregado",
    deliveryAddress: "Calle Falsa 123, Ciudad Ejemplo",
    items: [
      {
        id: 1,
        productId: 1,
        productName: "Whisky Premium",
        quantity: 2,
        unitPrice: 50.00,
        totalPrice: 100.00
      },
      {
        id: 2,
        productId: 3,
        productName: "Cerveza Artesanal",
        quantity: 12,
        unitPrice: 3.00,
        totalPrice: 36.00
      }
    ],
    total: 136.00
  },
  {
    id: 2,
    userId: 2,
    customerName: "Juan Pérez",
    date: "2023-04-20T14:45:00",
    status: "enviado",
    deliveryAddress: "Calle Falsa 123, Ciudad Ejemplo",
    items: [
      {
        id: 3,
        productId: 2,
        productName: "Aguardiente Antioqueño",
        quantity: 1,
        unitPrice: 20.00,
        totalPrice: 20.00
      }
    ],
    total: 20.00
  },
  {
    id: 3,
    userId: 2,
    customerName: "Juan Pérez",
    date: "2023-04-21T09:15:00",
    status: "pendiente",
    deliveryAddress: "Calle Falsa 123, Ciudad Ejemplo",
    items: [
      {
        id: 4,
        productId: 5,
        productName: "Vodka Premium",
        quantity: 1,
        unitPrice: 40.00,
        totalPrice: 40.00
      },
      {
        id: 5,
        productId: 7,
        productName: "Gin Botánico",
        quantity: 1,
        unitPrice: 38.00,
        totalPrice: 38.00
      }
    ],
    total: 78.00
  }
];

// Mock inventory movements
export const inventoryMovements: InventoryMovement[] = [
  {
    id: 1,
    productId: 1,
    productName: "Whisky Premium",
    type: "entrada",
    quantity: 120,
    date: "2023-03-10T08:00:00",
    note: "Inventario inicial",
    userId: 4,
    userName: "Carlos Ramírez"
  },
  {
    id: 2,
    productId: 2,
    productName: "Aguardiente Antioqueño",
    type: "entrada",
    quantity: 480,
    date: "2023-03-10T08:30:00",
    note: "Inventario inicial",
    userId: 4,
    userName: "Carlos Ramírez"
  },
  {
    id: 3,
    productId: 3,
    productName: "Cerveza Artesanal",
    type: "entrada",
    quantity: 720,
    date: "2023-03-10T09:00:00",
    note: "Inventario inicial",
    userId: 4,
    userName: "Carlos Ramírez"
  },
  {
    id: 4,
    productId: 1,
    productName: "Whisky Premium",
    type: "salida",
    quantity: 2,
    date: "2023-04-15T10:35:00",
    note: "Pedido #1",
    userId: 4,
    userName: "Carlos Ramírez"
  },
  {
    id: 5,
    productId: 3,
    productName: "Cerveza Artesanal",
    type: "salida",
    quantity: 12,
    date: "2023-04-15T10:35:00",
    note: "Pedido #1",
    userId: 4,
    userName: "Carlos Ramírez"
  },
  {
    id: 6,
    productId: 2,
    productName: "Aguardiente Antioqueño",
    type: "salida",
    quantity: 1,
    date: "2023-04-20T14:50:00",
    note: "Pedido #2",
    userId: 4,
    userName: "Carlos Ramírez"
  }
];
