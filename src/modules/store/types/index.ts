export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    image?: string;
    status: 'active' | 'inactive';
    size?: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    size: string;
    unitPrice: number;
    subtotal: number;
}

export interface Order {
    id: string;
    items: OrderItem[];
    total: number;
    paymentMethod: 'cash' | 'momo' | 'stripe';
    status: 'pending' | 'completed' | 'cancelled';
    timestamp: Date;
}
