import { getProducts, getSettings } from "@/lib/db/store";
import { whatsappDigits } from "@/lib/constants/site";
import TopNav from "@/components/TopNav";
import RevealObserver from "@/components/RevealObserver";
import "./home.css";

export const dynamic = "force-dynamic";

/**
 * AR. Printing Service & Gift Gallery — Homepage
 * ===============================================
 * Default exports this page in Next.js App Router (src/app/page.tsx).
 * Design ported from reference/AR_Printing_Service.html
 *
 * Products aur Settings ab DB (data/db.json) se aate hain — admin panel se
 * change karo to Home par turant dikhte hain.
 */

const BUSINESS = {
  name: "AR. Printing Service & Gift Gallery",
  short: "AR.",
  sub: "✛ Print & Gift Studio",
  phone: "+917999865547",
  phoneDisplay: "7999865547",
  instagram: "https://instagram.com/ar_printing_service",
  instagramHandle: "@ar_printing_service",
  location: "Bagicha, Jashpur",
};

function displayPhone(n: string): string {
  const d = n.replace(/[^0-9]/g, "");
  if (d.length === 12) return `+${d.slice(0, 2)} ${d.slice(2, 8)} ${d.slice(8)}`;
  if (d.length === 10) return `${d.slice(0, 5)} ${d.slice(5)}`;
  return n;
}

const CATEGORY_TAB: Record<string, "gold" | "cyan" | "magenta"> = {
  Apparel: "gold",
  Drinkware: "cyan",
  Accessories: "magenta",
  "Home & Gifts": "gold",
};

const TICKER = [
  "Custom Design",
  "Fast Delivery",
  "Made To Order",
  "Bulk Pricing",
  "High Quality Print",
];

const CATEGORIES = [
  { name: "Apparel", spec: "Tees · Hoodies · Jerseys", tone: "gold" as const },
  { name: "Drinkware", spec: "Mugs · Cups · Bottles", tone: "cyan" as const },
  { name: "Accessories", spec: "Phone Covers · Bags · KeyRings", tone: "magenta" as const },
  { name: "Home & Gifts", spec: "Cushions · Frames · Custom Gifts", tone: "ink" as const },
];

export default function HomePage() {
  const services = getProducts();

  const settings = getSettings();
  const phone = settings.phone || BUSINESS.phone;
  const phoneDigits = whatsappDigits(settings);
  const waBase = `https://wa.me/${phoneDigits}`;
  const waGeneral = `${waBase}?text=${encodeURIComponent("Hi! I am interested in your printing services.")}`;
  const waOrder = `${waBase}?text=${encodeURIComponent("Hi! I want to order a custom print.")}`;
  const waBulk = `${waBase}?text=${encodeURIComponent("Hi! I want bulk order pricing.")}`;
  const instaHandle = settings.instagram ? `@${settings.instagram.replace("@", "")}` : BUSINESS.instagramHandle;
  const instaLink = settings.instagram
    ? `https://instagram.com/${settings.instagram.replace("@", "")}`
    : BUSINESS.instagram;
  const address = settings.address || BUSINESS.location;
  const offerBadge = settings.offerBadge || "Special Offer";
  const offerTitle = settings.offerTitle || "Ordering For A Group?";

  return (
    <>
      <header className="navbar">
        <div className="nav-inner">
          <a href="#home" className="logo">
            <span className="logo-mark">
              AR<span className="logo-cross">.</span>
            </span>
            <span className="logo-sub">{BUSINESS.sub}</span>
          </a>
          <TopNav waHref={waGeneral} />
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-inner">
          <div className="hero-text reveal">
            <span className="eyebrow">✛ Custom Print & Gift Studio · Jashpur</span>
            <h1>
              EVERY PRINT.
              <br />
              <span className="accent">YOUR STYLE.</span>
            </h1>
            <p className="tagline-hi">Har Print, Aapke Style Mein!</p>
            <p className="byline">{BUSINESS.name}</p>
            <p className="hero-desc">
              T-Shirts, Hoodies, Jerseys, Mugs, Bottles, Mobile Covers &amp; more
              — send your design, we print it on anything you like.
            </p>
            <div className="hero-btns">
              <a
                className="btn btn-primary"
                href={waOrder}
                target="_blank"
                rel="noopener"
              >
                Order on WhatsApp
              </a>
              <a className="btn btn-outline" href="/products">
                See The Print Menu
              </a>
            </div>
            <div className="trust-strip">
              <span>Custom Design</span>
              <span className="sep">×</span>
              <span>Fast Delivery</span>
              <span className="sep">×</span>
              <span>Made To Order</span>
            </div>
          </div>

          <div className="hero-stack">
            <div className="stack-card stack-1">
              <div className="reg-mark" aria-hidden="true">✛</div>
              <div className="ticket-card">
                <div className="ticket-tab tab-gold"></div>
                <div className="ticket-body">
                  <div className="ticket-icon" aria-hidden="true">👕</div>
                  <h3>T-Shirt</h3>
                  <p className="ticket-spec">Custom Design</p>
                </div>
              </div>
            </div>
            <div className="stack-card stack-2">
              <div className="ticket-card">
                <div className="ticket-tab tab-cyan"></div>
                <div className="ticket-body">
                  <div className="ticket-icon" aria-hidden="true">☕</div>
                  <h3>Mug</h3>
                  <p className="ticket-spec">Made To Order</p>
                </div>
              </div>
            </div>
            <div className="stack-card stack-3">
              <div className="ticket-card">
                <div className="ticket-tab tab-magenta"></div>
                <div className="ticket-body">
                  <div className="ticket-icon" aria-hidden="true">📱</div>
                  <h3>Phone Cover</h3>
                  <p className="ticket-spec">Any Model</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker">
        <div className="ticker-track">
          {[0, 1].map((dup) =>
            TICKER.map((item, i) => (
              <span key={`${dup}-${i}`}>
                {item}
                <span className="dot"> × </span>
              </span>
            ))
          )}
        </div>
      </div>

      <section className="section" id="services">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">✛ What We Print</span>
            <h2>The Print Menu</h2>
            <p>Pick a product, send your design — we'll handle the rest.</p>
          </div>
          <div className="services-grid">
            {services.length === 0 && (
              <p className="ticket-spec">Menu abhi add nahi hua hai.</p>
            )}
            {services.map((s) => (
              <div className="ticket-card reveal" key={s.id}>
                <div className={`ticket-tab tab-${CATEGORY_TAB[s.category] ?? "gold"}`}></div>
                {s.image ? (
                  <div className="ticket-media">
                    <img src={s.image} alt={s.name} loading="lazy" />
                  </div>
                ) : (
                  <div className="ticket-icon" aria-hidden="true">{s.icon}</div>
                )}
                <div className="ticket-body">
                  <h3>{s.name}</h3>
                  <p className="ticket-spec">
                    {s.description}
                    {s.priceFrom ? `\u00A0· from ₹${s.priceFrom}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" aria-hidden="true">✛</div>

      <section className="section" id="why">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">✛ The AR. Difference</span>
            <h2>Why People Come Back</h2>
          </div>
          <div className="why-grid">
            {[
              { icon: "🏆", title: "High Quality Print", spec: "Careful printing, good materials, every order", tab: "gold" as const },
              { icon: "⚡", title: "Fast Delivery", spec: "Quick turnaround, on time", tab: "cyan" as const },
              { icon: "🎨", title: "Custom Design", spec: "Send your idea, we bring it to life", tab: "magenta" as const },
              { icon: "💰", title: "Best Price", spec: "Fair pricing, more savings in bulk", tab: "gold" as const },
            ].map((w) => (
              <div className="ticket-card reveal" key={w.title}>
                <div className={`ticket-tab tab-${w.tab}`}></div>
                <div className="ticket-body">
                  <div className="ticket-icon" aria-hidden="true">{w.icon}</div>
                  <h3>{w.title}</h3>
                  <p className="ticket-spec">{w.spec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="work">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">✛ Four Ways To Customise</span>
            <h2>Pick Your Canvas</h2>
          </div>
          <div className="work-grid">
            {CATEGORIES.map((c) => (
              <div className={`work-panel panel-${c.tone} reveal`} key={c.name}>
                <h3>{c.name}</h3>
                <p className="spec">{c.spec}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="offer-wrap">
        <div className="offer-box reveal">
          <div className="stamp">{offerBadge}</div>
          <h3>{offerTitle}</h3>
          <p>
            Colleges, teams, offices, weddings — get custom pricing for bulk
            orders on WhatsApp.
          </p>
          <a className="btn btn-primary" href={waBulk} target="_blank" rel="noopener">
            Get Bulk Pricing
          </a>
        </div>
      </div>

      <section className="section" id="contact">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">✛ Let's Talk Prints</span>
            <h2>Get In Touch</h2>
          </div>
          <div className="contact-grid">
            <a className="contact-card reveal" href={`tel:${phone}`}>
              <span className="clabel">Call</span>
              <span className="cvalue">{displayPhone(phone)}</span>
            </a>
            <a className="contact-card reveal" href={waGeneral} target="_blank" rel="noopener">
              <span className="clabel">WhatsApp</span>
              <span className="cvalue">Chat Now</span>
            </a>
            <a className="contact-card reveal" href={instaLink} target="_blank" rel="noopener">
              <span className="clabel">Instagram</span>
              <span className="cvalue">{instaHandle}</span>
            </a>
            <div className="contact-card reveal">
              <span className="clabel">Location</span>
              <span className="cvalue">{address}</span>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <p className="fname">{BUSINESS.name}</p>
        <p className="fsub">© 2026 · Made with k.jurx/chandan/kujur</p>
      </footer>

      <a
        className="float-wa"
        href={waGeneral}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
      >
        💬
      </a>

      <RevealObserver />
    </>
  );
}
