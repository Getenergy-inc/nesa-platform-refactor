-- ============================================================================
-- NESA-AFRICA MERCHANDISE STORE SCHEMA
-- ============================================================================

-- Product categories enum
CREATE TYPE public.product_category AS ENUM ('APPAREL', 'ACCESSORIES', 'LIMITED', 'BUNDLES');

-- Order status enum
CREATE TYPE public.order_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'FULFILLED');

-- Impact destination enum
CREATE TYPE public.impact_destination AS ENUM (
  'REBUILD_MY_SCHOOL',
  'EDUAID_AFRICA',
  'SPONSOR_STUDENT',
  'TVET_GRANT'
);

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_usd NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category public.product_category NOT NULL DEFAULT 'ACCESSORIES',
  is_limited BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  impact_default public.impact_destination DEFAULT 'EDUAID_AFRICA',
  stock_qty INTEGER DEFAULT 999,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly viewable" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================================
-- CARTS TABLE
-- ============================================================================
CREATE TABLE public.carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  anon_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart" ON public.carts
  FOR ALL USING (
    (user_id = auth.uid()) OR 
    (user_id IS NULL AND anon_id IS NOT NULL)
  );

-- ============================================================================
-- CART ITEMS TABLE
-- ============================================================================
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_usd NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(cart_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart items" ON public.cart_items
  FOR ALL USING (
    cart_id IN (
      SELECT id FROM public.carts 
      WHERE user_id = auth.uid() OR (user_id IS NULL AND anon_id IS NOT NULL)
    )
  );

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  
  -- Order status
  status public.order_status NOT NULL DEFAULT 'PENDING',
  
  -- Amounts
  subtotal_usd NUMERIC(10,2) NOT NULL,
  shipping_usd NUMERIC(10,2) DEFAULT 0,
  total_usd NUMERIC(10,2) NOT NULL,
  
  -- Payment details
  pay_currency TEXT DEFAULT 'USD',
  pay_amount_total NUMERIC(12,2),
  fx_rate NUMERIC(10,6) DEFAULT 1.0,
  fx_markup_amount NUMERIC(10,2) DEFAULT 0,
  
  -- Provider tracking
  provider TEXT,
  provider_ref TEXT,
  
  -- Impact
  impact_destination public.impact_destination DEFAULT 'EDUAID_AFRICA',
  
  -- Referral tracking
  referral_code TEXT,
  referrer_user_id UUID,
  
  -- Receipt
  receipt_number TEXT UNIQUE,
  receipt_payload_json JSONB DEFAULT '{}'::jsonb,
  
  -- AGC
  agc_bonus_amount INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage orders" ON public.orders
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================================
-- ORDER ITEMS TABLE
-- ============================================================================
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  product_image_url TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_usd NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "System can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- SHIPPING ADDRESSES TABLE
-- ============================================================================
CREATE TABLE public.shipping_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL,
  postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shipping addresses" ON public.shipping_addresses
  FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "System can insert shipping addresses" ON public.shipping_addresses
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- BULK ORDER LEADS TABLE
-- ============================================================================
CREATE TABLE public.bulk_order_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  country TEXT,
  estimated_quantity INTEGER,
  products_interested TEXT[],
  branding_request TEXT,
  notes TEXT,
  status TEXT DEFAULT 'NEW',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.bulk_order_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit bulk order lead" ON public.bulk_order_leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage bulk order leads" ON public.bulk_order_leads
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================================
-- SEED PRODUCTS
-- ============================================================================
INSERT INTO public.products (name, slug, description, price_usd, image_url, category, is_limited, display_order) VALUES
  ('Impact Wristband', 'impact-wristband', 'Show your support with this silicone wristband featuring the NESA-Africa emblem.', 5.00, '/merch/impact-wristband.png', 'ACCESSORIES', false, 1),
  ('Sticker Pack (5 pcs)', 'sticker-pack', 'Premium vinyl stickers featuring NESA-Africa branding and inspirational messages.', 7.00, '/merch/sticker-pack.png', 'ACCESSORIES', false, 2),
  ('NESA Lapel Pin / Badge', 'lapel-pin-badge', 'Elegant metal lapel pin for professionals and supporters.', 10.00, '/merch/lapel-pin-badge.png', 'ACCESSORIES', false, 3),
  ('Branded Cap', 'branded-cap', 'Classic embroidered cap with NESA-Africa logo.', 15.00, '/merch/branded-cap.png', 'APPAREL', false, 4),
  ('Eco Tote Bag', 'eco-tote-bag', 'Reusable organic cotton tote bag with bold NESA-Africa design.', 20.00, '/merch/eco-tote-bag.png', 'ACCESSORIES', false, 5),
  ('Classic T-Shirt', 'classic-tshirt', 'Premium cotton t-shirt with front and back NESA-Africa print.', 25.00, '/merch/classic-tshirt.png', 'APPAREL', false, 6),
  ('Polo Shirt', 'polo-shirt', 'Business casual polo with embroidered NESA-Africa logo.', 35.00, '/merch/polo-shirt.png', 'APPAREL', false, 7),
  ('Desk Flag + Stand (Limited)', 'desk-flag-stand', 'Premium desk flag with wooden stand. Limited edition.', 45.00, '/merch/desk-flag-stand.png', 'LIMITED', true, 8),
  ('Hoodie / Sweatshirt', 'hoodie-sweatshirt', 'Cozy pullover hoodie with embroidered NESA-Africa crest.', 60.00, '/merch/hoodie-sweatshirt.png', 'APPAREL', false, 9),
  ('Legacy Sponsor Jacket (Limited Edition)', 'legacy-sponsor-jacket', 'Premium bomber jacket for legacy sponsors. Numbered limited edition.', 100.00, '/merch/legacy-sponsor-jacket.png', 'LIMITED', true, 10);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_carts_updated_at
  BEFORE UPDATE ON public.carts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_bulk_order_leads_updated_at
  BEFORE UPDATE ON public.bulk_order_leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- RECEIPT NUMBER GENERATOR FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_number TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    v_number := 'NESA-' || TO_CHAR(now(), 'YYMM') || '-' || UPPER(SUBSTRING(md5(random()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM public.orders WHERE receipt_number = v_number) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_number;
END;
$$;