CREATE TYPE public.app_role AS ENUM ('customer','farmer','shopkeeper','delivery','admin');
CREATE TYPE public.seller_kind AS ENUM ('Shop','Farmer','Cooperative');
CREATE TYPE public.delivery_speed AS ENUM ('same-day','next-day','2-3-days');
CREATE TYPE public.stock_status AS ENUM ('in-stock','low-stock','out-of-stock');
CREATE TYPE public.order_status AS ENUM ('pending','confirmed','processing','shipped','delivered','cancelled');
GRANT USAGE ON TYPE public.app_role, public.seller_kind, public.delivery_speed, public.stock_status, public.order_status TO anon, authenticated, service_role;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text, full_name text, phone text,
  farm_name text, village text, district text, state text,
  shop_name text, shop_address text, gst_number text,
  vehicle_type text, license_number text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
GRANT SELECT, UPDATE (full_name,phone,farm_name,village,district,state,shop_name,shop_address,gst_number,vehicle_type,license_number) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
CREATE POLICY profiles_select_own ON public.profiles FOR SELECT TO authenticated USING (id = (SELECT auth.uid()));
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated USING (id = (SELECT auth.uid())) WITH CHECK (id = (SELECT auth.uid()));

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id,role)
);
CREATE INDEX user_roles_user_id_idx ON public.user_roles(user_id);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
CREATE POLICY user_roles_select_own ON public.user_roles FOR SELECT TO authenticated USING (user_id=(SELECT auth.uid()));

CREATE FUNCTION public.has_role(_user_id uuid,_role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id=_user_id AND role=_role AND _user_id=(SELECT auth.uid())
  );
$$;
REVOKE ALL ON FUNCTION public.has_role(uuid,public.app_role) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid,public.app_role) TO authenticated,service_role;
CREATE POLICY user_roles_admin_manage ON public.user_roles FOR ALL TO authenticated
  USING ((SELECT public.has_role((SELECT auth.uid()),'admin'::public.app_role)))
  WITH CHECK ((SELECT public.has_role((SELECT auth.uid()),'admin'::public.app_role)));

CREATE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path=''
AS $$ BEGIN NEW.updated_at:=now(); RETURN NEW; END; $$;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC,anon,authenticated;

CREATE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $$
DECLARE
  meta jsonb:=COALESCE(NEW.raw_user_meta_data,'{}'::jsonb);
  chosen_role public.app_role;
BEGIN
  chosen_role:=CASE meta->>'role'
    WHEN 'farmer' THEN 'farmer'::public.app_role
    WHEN 'shopkeeper' THEN 'shopkeeper'::public.app_role
    WHEN 'delivery' THEN 'delivery'::public.app_role
    ELSE 'customer'::public.app_role END;
  INSERT INTO public.profiles(id,email,full_name,phone,farm_name,village,district,state,shop_name,shop_address,gst_number,vehicle_type,license_number)
  VALUES(NEW.id,NEW.email,NULLIF(meta->>'full_name',''),NULLIF(meta->>'phone',''),NULLIF(meta->>'farm_name',''),NULLIF(meta->>'village',''),NULLIF(meta->>'district',''),NULLIF(meta->>'state',''),NULLIF(meta->>'shop_name',''),NULLIF(meta->>'shop_address',''),NULLIF(meta->>'gst_number',''),NULLIF(meta->>'vehicle_type',''),NULLIF(meta->>'license_number',''));
  INSERT INTO public.user_roles(user_id,role) VALUES(NEW.id,chosen_role) ON CONFLICT(user_id,role) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, description text, price integer NOT NULL CHECK(price>0),
  original_price integer CHECK(original_price IS NULL OR original_price>price), brand text,
  seller_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller text NOT NULL, seller_type public.seller_kind NOT NULL, category text NOT NULL,
  village text NOT NULL, district text NOT NULL, verified boolean NOT NULL DEFAULT false,
  rating numeric(3,2) NOT NULL DEFAULT 0 CHECK(rating BETWEEN 0 AND 5),
  reviews integer NOT NULL DEFAULT 0 CHECK(reviews>=0),
  delivery_available boolean NOT NULL DEFAULT true,
  delivery_speed public.delivery_speed NOT NULL DEFAULT 'same-day',
  stock public.stock_status NOT NULL DEFAULT 'in-stock',
  image text NOT NULL, gallery text[] NOT NULL DEFAULT '{}',
  specs jsonb NOT NULL DEFAULT '[]'::jsonb, tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_seller_id_idx ON public.products(seller_id);
CREATE INDEX products_category_idx ON public.products(category);
CREATE INDEX products_district_idx ON public.products(district);
CREATE INDEX products_village_idx ON public.products(village);
CREATE INDEX products_created_at_idx ON public.products(created_at DESC);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.products TO anon,authenticated;
GRANT DELETE ON public.products TO authenticated;
GRANT INSERT(name,description,price,original_price,brand,seller_id,seller,seller_type,category,village,district,rating,reviews,delivery_available,delivery_speed,stock,image,gallery,specs,tags) ON public.products TO authenticated;
GRANT UPDATE(name,description,price,original_price,brand,seller,seller_type,category,village,district,rating,reviews,delivery_available,delivery_speed,stock,image,gallery,specs,tags) ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
CREATE POLICY products_public_read ON public.products FOR SELECT TO anon,authenticated USING(true);
CREATE POLICY products_seller_insert ON public.products FOR INSERT TO authenticated WITH CHECK(
  seller_id=(SELECT auth.uid()) AND EXISTS(SELECT 1 FROM public.user_roles r WHERE r.user_id=(SELECT auth.uid()) AND r.role IN('farmer'::public.app_role,'shopkeeper'::public.app_role))
);
CREATE POLICY products_seller_update ON public.products FOR UPDATE TO authenticated
  USING(seller_id=(SELECT auth.uid()) AND EXISTS(SELECT 1 FROM public.user_roles r WHERE r.user_id=(SELECT auth.uid()) AND r.role IN('farmer'::public.app_role,'shopkeeper'::public.app_role)))
  WITH CHECK(seller_id=(SELECT auth.uid()) AND EXISTS(SELECT 1 FROM public.user_roles r WHERE r.user_id=(SELECT auth.uid()) AND r.role IN('farmer'::public.app_role,'shopkeeper'::public.app_role)));
CREATE POLICY products_seller_delete ON public.products FOR DELETE TO authenticated USING(
  seller_id=(SELECT auth.uid()) AND EXISTS(SELECT 1 FROM public.user_roles r WHERE r.user_id=(SELECT auth.uid()) AND r.role IN('farmer'::public.app_role,'shopkeeper'::public.app_role))
);
CREATE POLICY products_admin_manage ON public.products FOR ALL TO authenticated
  USING((SELECT public.has_role((SELECT auth.uid()),'admin'::public.app_role)))
  WITH CHECK((SELECT public.has_role((SELECT auth.uid()),'admin'::public.app_role)));
CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount integer NOT NULL CHECK(total_amount>=0),
  subtotal integer NOT NULL CHECK(subtotal>=0),
  discount_amount integer NOT NULL DEFAULT 0 CHECK(discount_amount>=0),
  delivery_fee integer NOT NULL DEFAULT 0 CHECK(delivery_fee>=0),
  gst numeric(5,2) NOT NULL DEFAULT 0.05 CHECK(gst>=0),
  status public.order_status NOT NULL DEFAULT 'pending',
  payment_method text CHECK(payment_method IS NULL OR payment_method IN('upi','cash','wallet')),
  delivery_type text NOT NULL DEFAULT 'standard' CHECK(delivery_type IN('standard','express')),
  delivery_address text, village text, district text, contact_name text, contact_phone text, notes text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT orders_total_matches CHECK(total_amount=subtotal-discount_amount+delivery_fee),
  CONSTRAINT orders_discount_within_subtotal CHECK(discount_amount<=subtotal)
);
CREATE INDEX orders_user_id_idx ON public.orders(user_id);
CREATE INDEX orders_status_idx ON public.orders(status);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
GRANT SELECT,UPDATE,DELETE ON public.orders TO authenticated;
GRANT INSERT(user_id,total_amount,subtotal,discount_amount,delivery_fee,gst,payment_method,delivery_type,delivery_address,village,district,contact_name,contact_phone,notes) ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
CREATE POLICY orders_select_own ON public.orders FOR SELECT TO authenticated USING(user_id=(SELECT auth.uid()));
CREATE POLICY orders_insert_own ON public.orders FOR INSERT TO authenticated WITH CHECK(user_id=(SELECT auth.uid()) AND status='pending'::public.order_status);
CREATE POLICY orders_admin_manage ON public.orders FOR ALL TO authenticated
  USING((SELECT public.has_role((SELECT auth.uid()),'admin'::public.app_role)))
  WITH CHECK((SELECT public.has_role((SELECT auth.uid()),'admin'::public.app_role)));
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK(quantity>0),
  price_at_purchase integer NOT NULL CHECK(price_at_purchase>=0),
  original_price_at_purchase integer NOT NULL CHECK(original_price_at_purchase>=0),
  discount_at_purchase integer NOT NULL DEFAULT 0 CHECK(discount_at_purchase>=0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX order_items_order_id_idx ON public.order_items(order_id);
CREATE INDEX order_items_product_id_idx ON public.order_items(product_id);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
CREATE POLICY order_items_select_own ON public.order_items FOR SELECT TO authenticated USING(
  EXISTS(SELECT 1 FROM public.orders o WHERE o.id=order_id AND o.user_id=(SELECT auth.uid()))
);
CREATE POLICY order_items_insert_own ON public.order_items FOR INSERT TO authenticated WITH CHECK(
  EXISTS(SELECT 1 FROM public.orders o WHERE o.id=order_id AND o.user_id=(SELECT auth.uid()) AND o.status='pending'::public.order_status)
);
CREATE POLICY order_items_admin_manage ON public.order_items FOR ALL TO authenticated
  USING((SELECT public.has_role((SELECT auth.uid()),'admin'::public.app_role)))
  WITH CHECK((SELECT public.has_role((SELECT auth.uid()),'admin'::public.app_role)));

CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  qty integer NOT NULL DEFAULT 1 CHECK(qty>0),
  saved boolean NOT NULL DEFAULT false, coupon_code text,
  delivery_type text NOT NULL DEFAULT 'standard' CHECK(delivery_type IN('standard','express')),
  added_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id,product_id)
);
CREATE INDEX cart_items_user_id_idx ON public.cart_items(user_id);
CREATE INDEX cart_items_product_id_idx ON public.cart_items(product_id);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;
CREATE POLICY cart_items_manage_own ON public.cart_items FOR ALL TO authenticated USING(user_id=(SELECT auth.uid())) WITH CHECK(user_id=(SELECT auth.uid()));
CREATE POLICY cart_items_admin_manage ON public.cart_items FOR ALL TO authenticated
  USING((SELECT public.has_role((SELECT auth.uid()),'admin'::public.app_role)))
  WITH CHECK((SELECT public.has_role((SELECT auth.uid()),'admin'::public.app_role)));
CREATE TRIGGER cart_items_set_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
