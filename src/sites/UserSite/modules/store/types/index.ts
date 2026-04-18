export type Category = 'Coffee' | 'Tea' | 'Juice' | 'Bakery' | 'Tất cả';

export interface Product {
    id: number;
    store_id: number;
    name: string;
    description?: string;
    category: Category;
    price: number;
    image?: string;
    is_active: boolean;
    size?: string;
}

export interface OrderItem {
    id?: number
    product_id: number;
    name?: string;
    quantity: number;
    size?: string;
    price: number;
    subtotal: number;
}

export interface Order {
    id?: number;
    user_id?: number;
    store_id: number;
    table_number: number;
    total_amount: number;
    payment_method: 'cash' | 'momo' | 'stripe';
    status: 'pending' | 'completed' | 'cancelled';
    notes?: string;
    items: OrderItem[];
    created_at?: string;
}

export interface CreateOrderRequest {
    store_id: number;
    table_number: number;
    payment_method: string;
    notes?: string;
    items: {
        product_id: number;
        quantity: number;
    }[];
}
