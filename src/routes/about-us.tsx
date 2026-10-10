import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about-us")({
  meta: {
    title: "About GramSetu — Village to Village, Hand to Hand",
    description:
      "Learn about our mission to connect farmers and consumers directly, bringing fresh, verified produce from the field to your doorstep.",
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <nav className="border-b border-black/5 px-4 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link
            to="/"
            className="font-semibold text-ink hover:text-brand"
          >
            GramSetu
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/marketplace" className="text-ink-muted text-sm">
              Marketplace
            </Link>
            <Link to="/cart" className="text-ink-muted text-sm">
              Cart
            </Link>
            <Link to="/about-us" className="text-brand font-medium">
              About Us
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-ink mb-4">
            About GramSetu
          </h1>
          <p className="text-2xl font-medium text-ink-muted mb-8">
            Connecting farmers and consumers directly
          </p>
        </div>

        <section className="py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-ink mb-4">
                Our Mission
              </h2>
              <p className="text-justify text-lg text-ink-muted leading-relaxed">
                GramSetu bridges the gap between local farmers and conscious consumers.
                We believe in fresh, chemical-free produce delivered straight from the
                field to your doorstep, cutting out the middlemen and ensuring fair
                prices for our growers.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-ink mb-4">
                How It Works
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-lg text-ink-muted">
                <li>
                  Browse verified products from sellers around you
                </li>
                <li>
                  Add items to your cart and confirm your order
                </li>
                <li>
                  Sellers accept and prepare your order
                </li>
                <li>
                  Trusted delivery partners pick up and deliver
                </li>
                <li>
                  Fresh, sealed, and on-time delivery to your doorstep
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-ink mb-4">
                Our Sellers
              </h2>
              <p className="text-lg text-ink-muted">
                We work with over 50 verified farmers and village shops across the
                region. Each seller is vetted for quality and authenticity.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-ink mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-ink-muted">
                Have questions? Want to become a seller? We'd love to hear from you.
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Email: contact@gramsetu.example.com
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 pt-12">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <p className="text-center text-sm text-ink-muted">
            © 2026 GramSetu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}