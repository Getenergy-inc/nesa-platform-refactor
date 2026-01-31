import { supabase } from "@/integrations/supabase/client";
import type { Product, Cart, CartItem, Order, BulkOrderLead, ImpactDestination } from "@/types/shop";

// ============================================================================
// PRODUCTS
// ============================================================================

export async function getProducts(category?: string) {
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (category && category !== "all") {
    const upperCategory = category.toUpperCase() as "APPAREL" | "ACCESSORIES" | "LIMITED" | "BUNDLES";
    query = query.eq("category", upperCategory);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching products:", error);
    return { data: null, error: error.message };
  }
  
  return { data: data as Product[], error: null };
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return { data: null, error: error.message };
  }

  return { data: data as Product, error: null };
}

// ============================================================================
// CART (using localStorage for anonymous users)
// ============================================================================

const CART_STORAGE_KEY = "nesa_cart";

export interface LocalCartItem {
  product_id: string;
  quantity: number;
  product?: Product;
}

export function getLocalCart(): LocalCartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveLocalCart(items: LocalCartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function addToLocalCart(productId: string, quantity: number = 1) {
  const cart = getLocalCart();
  const existingIndex = cart.findIndex(item => item.product_id === productId);
  
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ product_id: productId, quantity });
  }
  
  saveLocalCart(cart);
  return cart;
}

export function updateLocalCartItem(productId: string, quantity: number) {
  const cart = getLocalCart();
  const existingIndex = cart.findIndex(item => item.product_id === productId);
  
  if (existingIndex >= 0) {
    if (quantity <= 0) {
      cart.splice(existingIndex, 1);
    } else {
      cart[existingIndex].quantity = quantity;
    }
  }
  
  saveLocalCart(cart);
  return cart;
}

export function removeFromLocalCart(productId: string) {
  const cart = getLocalCart().filter(item => item.product_id !== productId);
  saveLocalCart(cart);
  return cart;
}

export function clearLocalCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
}

export async function getCartWithProducts(): Promise<{ items: LocalCartItem[]; total: number }> {
  const cartItems = getLocalCart();
  
  if (cartItems.length === 0) {
    return { items: [], total: 0 };
  }
  
  const productIds = cartItems.map(item => item.product_id);
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds);
  
  const itemsWithProducts = cartItems.map(item => ({
    ...item,
    product: products?.find(p => p.id === item.product_id) as Product | undefined,
  }));
  
  const total = itemsWithProducts.reduce((sum, item) => {
    return sum + (item.product?.price_usd || 0) * item.quantity;
  }, 0);
  
  return { items: itemsWithProducts, total };
}

// ============================================================================
// ORDERS
// ============================================================================

export async function createOrder(data: {
  email: string;
  full_name: string;
  phone?: string;
  impact_destination: ImpactDestination;
  referral_code?: string;
  items: { product_id: string; quantity: number; unit_price_usd: number; product_name: string; product_image_url?: string }[];
}) {
  const subtotal = data.items.reduce((sum, item) => sum + item.unit_price_usd * item.quantity, 0);
  const total = subtotal; // No shipping for now
  
  // Get current user if logged in
  const { data: { user } } = await supabase.auth.getUser();
  
  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id || null,
      email: data.email,
      full_name: data.full_name,
      phone: data.phone || null,
      subtotal_usd: subtotal,
      shipping_usd: 0,
      total_usd: total,
      impact_destination: data.impact_destination,
      referral_code: data.referral_code || null,
      status: "PENDING",
    })
    .select()
    .single();
  
  if (orderError || !order) {
    console.error("Error creating order:", orderError);
    return { data: null, error: orderError?.message || "Failed to create order" };
  }
  
  // Create order items
  const orderItems = data.items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    product_image_url: item.product_image_url || null,
    quantity: item.quantity,
    unit_price_usd: item.unit_price_usd,
  }));
  
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);
  
  if (itemsError) {
    console.error("Error creating order items:", itemsError);
    return { data: null, error: itemsError.message };
  }
  
  return { data: order as Order, error: null };
}

export async function getOrderById(orderId: string) {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();
  
  if (orderError || !order) {
    return { data: null, error: orderError?.message || "Order not found" };
  }
  
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);
  
  return { 
    data: { ...order, items: items || [] } as Order, 
    error: null 
  };
}

// ============================================================================
// BULK ORDERS
// ============================================================================

export async function submitBulkOrderLead(data: {
  organization_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  country?: string;
  estimated_quantity?: number;
  products_interested?: string[];
  branding_request?: string;
  notes?: string;
}) {
  const { data: lead, error } = await supabase
    .from("bulk_order_leads")
    .insert({
      ...data,
      products_interested: data.products_interested || [],
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error submitting bulk order lead:", error);
    return { data: null, error: error.message };
  }
  
  return { data: lead as BulkOrderLead, error: null };
}
