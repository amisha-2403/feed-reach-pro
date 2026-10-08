-- Cart items table for persisting cart state to Supabase
CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  qty integer NOT NULL DEFAULT 1,
  saved boolean NOT NULL DEFAULT false,
  coupon_code text,
  delivery_type text NOT NULL DEFAULT 'standard',
  added_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Policy: users can manage their own cart items
CREATE POLICY "Users can manage own cart"
  ON public.cart_items FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: admins can manage all cart items
CREATE POLICY "Admins can manage all cart items"
  ON public.cart_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at_cart()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER cart_items_set_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at_cart();