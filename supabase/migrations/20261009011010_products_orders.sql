-- Products table - marketplace inventory
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price integer NOT NULL,
  original_price integer,
  brand text,
  seller_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_type public.app_role NOT NULL DEFAULT 'shop',
  category text NOT NULL,
  village text NOT NULL,
  district text NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  rating numeric(3,2) DEFAULT 0,
  reviews integer DEFAULT 0,
  delivery_available boolean NOT NULL DEFAULT true,
  delivery_speed public.delivery_speed NOT NULL DEFAULT 'same-day',
  stock public.stock_status NOT NULL DEFAULT 'in-stock',
  image text NOT NULL,
  gallery text[] DEFAULT '{}',
  specs jsonb DEFAULT '[]'::jsonb,
  tags text[] DEFAULT '{}'::text[],
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "check_price_positive" CHECK (price > 0),
  CONSTRAINT "check_original_price_gt_price" CHECK (original_price IS NULL OR original_price > price)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: sellers can manage their own products
CREATE POLICY "Sellers can manage own products"
  ON public.products FOR ALL TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

-- Policy: anyone can view products
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT TO authenticated
  USING (true);

-- Policy: admins can manage all products
CREATE POLICY "Admins can manage all products"
  ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at_products()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at_products();

-- Delivery speed enum type
CREATE TYPE public.delivery_speed AS ENUM ('same-day', 'next-day', '2-3-days');

-- Stock status enum type
CREATE TYPE public.stock_status AS ENUM ('in-stock', 'low-stock', 'out-of-stock');

-- Orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount integer NOT NULL DEFAULT 0,
  subtotal integer NOT NULL DEFAULT 0,
  discount_amount integer NOT NULL DEFAULT 0,
  delivery_fee integer NOT NULL DEFAULT 0,
  gst numeric(5,2) NOT NULL DEFAULT 0.05,
  status public.order_status NOT NULL DEFAULT 'pending',
  payment_method text,
  delivery_type "standard" | "express" NOT NULL DEFAULT 'standard',
  delivery_address text,
  village text,
  district text,
  contact_name text,
  contact_phone text,
  notes text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "check_total_matches" CHECK (total_amount = subtotal - discount_amount + delivery_fee)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: users can manage their own orders
CREATE POLICY "Users can manage own orders"
  ON public.orders FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: admins can manage all orders
CREATE POLICY "Admins can manage all orders"
  ON public.orders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');

-- Order items table
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  price_at_purchase integer NOT NULL,
  original_price_at_purchase integer NOT NULL,
  discount_at_purchase integer NOT NULL DEFAULT 0,
  CONSTRAINT "check_quantity_positive" CHECK (quantity > 0)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policy: users can manage their own order items
CREATE POLICY "Users can manage own order items"
  ON public.order_items FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Policy: admins can manage all order items
CREATE POLICY "Admins can manage all order items"
  ON public.order_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger for orders
CREATE OR REPLACE FUNCTION public.tg_set_updated_at_orders()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at_orders();

-- Updated_at trigger for order_items (no Op needed, just tracking)