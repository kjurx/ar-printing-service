import { getProducts, getSettings } from "@/lib/db/store";
import TopNav from "@/components/TopNav";
import RevealObserver from "@/components/RevealObserver";

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
  const phoneDigits = phone.replace(/[^0-9]/g, "");
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
      <style>{styles}</style>

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

const styles = `
  :root{
    --ink:#0c0c0d;
    --ink-2:#161615;
    --cream:#f2ecdd;
    --body-text:#b6b0a2;
    --gold:#e0a53c;
    --cyan:#2fb6c4;
    --magenta:#dd4a80;
    --line: rgba(242,236,221,0.14);
  }
  *{ margin:0; padding:0; box-sizing:border-box; }
  html{ scroll-behavior:smooth; scroll-padding-top:84px; }
  body{
    background-color:var(--ink);
    background-image:radial-gradient(rgba(242,236,221,0.07) 1px, transparent 1.3px);
    background-size:14px 14px;
    color:var(--body-text);
    font-family:'Work Sans',sans-serif;
    line-height:1.6;
    overflow-x:hidden;
  }
  a{ color:inherit; text-decoration:none; }
  ul{ list-style:none; }
  .mono{ font-family:'IBM Plex Mono',monospace; }

  .wrap{ max-width:1180px; margin:0 auto; padding:0 24px; }
  .eyebrow{
    display:inline-flex; align-items:center; gap:8px;
    font-family:'IBM Plex Mono',monospace; font-size:0.75rem; letter-spacing:0.08em; text-transform:uppercase;
    color:var(--gold); margin-bottom:16px;
  }
  .divider{ display:flex; align-items:center; gap:16px; color:var(--gold); font-size:0.9rem; max-width:1180px; margin:0 auto; padding:0 24px; }
  .divider::before,.divider::after{ content:''; flex:1; height:1px; background:var(--line); }

  .btn{ display:inline-flex; align-items:center; gap:8px; font-family:'Work Sans',sans-serif; font-weight:700; font-size:0.98rem; padding:16px 30px; border-radius:8px; cursor:pointer; transition:transform .15s ease, box-shadow .15s ease; }
  .btn-primary{ background:var(--gold); color:var(--ink); border:2px solid var(--ink); box-shadow:5px 5px 0 rgba(0,0,0,0.55); }
  .btn-primary:hover{ transform:translate(-2px,-2px); box-shadow:7px 7px 0 rgba(0,0,0,0.55); }
  .btn-outline{ background:transparent; color:var(--cream); border:2px solid var(--cream); }
  .btn-outline:hover{ background:var(--cream); color:var(--ink); }

  .ticket-card{ background:var(--ink-2); border:1.5px solid var(--line); border-radius:10px; overflow:hidden; transition:transform .3s ease, border-color .3s ease; }
  .ticket-card:hover{ transform:translateY(-6px); border-color:rgba(242,236,221,0.35); }
  .ticket-tab{ height:6px; width:100%; }
  .tab-gold{ background:var(--gold); } .tab-cyan{ background:var(--cyan); } .tab-magenta{ background:var(--magenta); }
  .ticket-body{ padding:26px 22px; min-height:96px; }
  .ticket-media img{ width:100%; height:200px; object-fit:cover; display:block; }
  .ticket-icon{ font-size:2.1rem; margin-bottom:14px; padding:0 22px 0 22px; box-sizing:border-box; }
  .ticket-body h3{ font-family:'Work Sans',sans-serif; font-weight:700; font-size:1.08rem; color:var(--cream); margin-bottom:6px; }
  .ticket-spec{ font-family:'IBM Plex Mono',monospace; font-size:0.7rem; letter-spacing:0.05em; text-transform:uppercase; color:var(--body-text); }

  .navbar{ position:fixed; top:0; left:0; right:0; z-index:1000; background:rgba(12,12,13,0.75); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border-bottom:1px solid var(--line); }
  .navbar.scrolled{ background:rgba(12,12,13,0.92); }
  .nav-inner{ max-width:1180px; margin:0 auto; padding:14px 24px; display:flex; align-items:center; justify-content:space-between; gap:18px; }
  .logo{ display:flex; align-items:baseline; gap:8px; }
  .logo-mark{ font-family:'Big Shoulders Display',sans-serif; font-weight:800; font-size:1.7rem; color:var(--cream); }
  .logo-cross{ color:var(--gold); font-size:1rem; }
  .logo-sub{ font-family:'IBM Plex Mono',monospace; font-size:0.62rem; letter-spacing:0.1em; color:var(--body-text); text-transform:uppercase; }
  .nav-links{ display:flex; gap:26px; }
  .nav-links a{ font-size:0.92rem; font-weight:500; color:#d9d4c8; transition:color .2s; }
  .nav-links a:hover{ color:var(--gold); }
  .nav-cta{ background:var(--gold); color:var(--ink); font-family:'Work Sans',sans-serif; font-weight:700; font-size:0.85rem; padding:10px 20px; border-radius:6px; white-space:nowrap; border:2px solid var(--ink); box-shadow:3px 3px 0 rgba(0,0,0,0.5); transition:transform .15s ease; }
  .nav-cta:hover{ transform:translate(-2px,-2px); }
  .menu-toggle{ display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:6px; }
  .menu-toggle span{ width:24px; height:2.5px; background:var(--cream); border-radius:2px; transition:.3s; }
  .menu-toggle.active span:nth-child(1){ transform:translateY(7.5px) rotate(45deg); }
  .menu-toggle.active span:nth-child(2){ opacity:0; }
  .menu-toggle.active span:nth-child(3){ transform:translateY(-7.5px) rotate(-45deg); }

  .hero{ position:relative; padding:150px 0 80px; }
  .hero-inner{ max-width:1180px; margin:0 auto; padding:0 24px; display:grid; grid-template-columns:1.05fr 0.95fr; gap:50px; align-items:center; }
  .hero-text h1{ font-family:'Big Shoulders Display',sans-serif; font-weight:900; font-size:clamp(2.6rem,6vw,4.3rem); line-height:0.98; letter-spacing:-0.01em; color:var(--cream); text-transform:uppercase; }
  .hero-text h1 .accent{ color:var(--gold); }
  .tagline-hi{ font-family:'Work Sans',sans-serif; font-weight:600; font-style:italic; font-size:1.25rem; color:var(--gold); margin:16px 0 10px; }
  .byline{ font-family:'IBM Plex Mono',monospace; font-size:0.72rem; letter-spacing:0.08em; text-transform:uppercase; color:var(--body-text); margin-bottom:22px; }
  .hero-desc{ font-size:1.03rem; color:var(--body-text); max-width:480px; margin-bottom:32px; }
  .hero-btns{ display:flex; gap:16px; flex-wrap:wrap; margin-bottom:28px; }
  .trust-strip{ font-family:'IBM Plex Mono',monospace; font-size:0.72rem; letter-spacing:0.06em; text-transform:uppercase; color:var(--body-text); display:flex; gap:14px; flex-wrap:wrap; }
  .trust-strip .sep{ color:var(--gold); }

  .hero-stack{ position:relative; height:400px; perspective:1100px; }
  .stack-card{ position:absolute; width:190px; }
  .stack-1{ top:0; left:8%; z-index:3; animation:floatA 5s ease-in-out infinite; }
  .stack-2{ top:18%; left:40%; z-index:2; animation:floatB 6s ease-in-out infinite .5s; }
  .stack-3{ top:38%; left:6%; z-index:1; animation:floatC 5.5s ease-in-out infinite 1s; }
  .stack-card .ticket-body{ padding:20px 18px; }
  .stack-card .ticket-icon{ font-size:2.4rem; }
  .reg-mark{ position:absolute; top:-14px; right:-10px; font-size:1.4rem; color:var(--gold); z-index:4; }
  @keyframes floatA{ 0%,100%{ transform:translateY(0) rotate(-6deg);} 50%{ transform:translateY(-16px) rotate(-6deg);} }
  @keyframes floatB{ 0%,100%{ transform:translateY(0) rotate(5deg);} 50%{ transform:translateY(-14px) rotate(5deg);} }
  @keyframes floatC{ 0%,100%{ transform:translateY(0) rotate(-3deg);} 50%{ transform:translateY(-12px) rotate(-3deg);} }

  .ticker{ background:var(--ink-2); border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding:14px 0; overflow:hidden; }
  .ticker-track{ display:flex; gap:36px; width:max-content; animation:tick 26s linear infinite; }
  .ticker-track span{ font-family:'IBM Plex Mono',monospace; font-size:0.82rem; letter-spacing:0.05em; text-transform:uppercase; color:var(--gold); white-space:nowrap; }
  .ticker-track .dot{ color:var(--body-text); }
  @keyframes tick{ from{ transform:translateX(0);} to{ transform:translateX(-50%);} }

  .section{ padding:96px 0; position:relative; }
  .section-head{ text-align:center; max-width:640px; margin:0 auto 52px; }
  .section-head h2{ font-family:'Big Shoulders Display',sans-serif; font-weight:800; font-size:clamp(2rem,4.5vw,2.9rem); color:var(--cream); text-transform:uppercase; letter-spacing:-0.01em; margin-bottom:12px; }
  .section-head p{ color:var(--body-text); font-size:1.02rem; }

  .services-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:22px; }
  .why-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:22px; }

  .work-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:20px; }
  .work-panel{ border-radius:14px; padding:34px 26px; min-height:170px; display:flex; flex-direction:column; justify-content:space-between; transition:transform .3s ease; }
  .work-panel:hover{ transform:translateY(-6px); }
  .work-panel h3{ font-family:'Big Shoulders Display',sans-serif; font-weight:800; font-size:1.55rem; text-transform:uppercase; }
  .work-panel .spec{ font-family:'IBM Plex Mono',monospace; font-size:0.75rem; letter-spacing:0.03em; text-transform:uppercase; margin-top:10px; }
  .panel-gold{ background:var(--gold); color:var(--ink); } .panel-gold .spec{ color:rgba(12,12,13,0.65); }
  .panel-cyan{ background:var(--cyan); color:var(--ink); } .panel-cyan .spec{ color:rgba(12,12,13,0.65); }
  .panel-magenta{ background:var(--magenta); color:var(--ink); } .panel-magenta .spec{ color:rgba(12,12,13,0.65); }
  .panel-ink{ background:var(--ink-2); color:var(--cream); border:2px solid var(--cream); } .panel-ink .spec{ color:var(--body-text); }

  .offer-wrap{ max-width:820px; margin:0 auto; padding:0 24px; }
  .offer-box{ position:relative; border:2px dashed rgba(242,236,221,0.35); border-radius:16px; padding:52px 30px; text-align:center; background:var(--ink-2); }
  .stamp{ position:absolute; top:-16px; right:26px; background:var(--magenta); color:var(--ink); font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:0.72rem; letter-spacing:0.08em; padding:8px 14px; border-radius:4px; transform:rotate(7deg); box-shadow:3px 3px 0 rgba(0,0,0,0.45); }
  .offer-box h3{ font-family:'Big Shoulders Display',sans-serif; font-size:clamp(1.7rem,4vw,2.4rem); font-weight:800; color:var(--cream); text-transform:uppercase; margin-bottom:14px; }
  .offer-box p{ max-width:480px; margin:0 auto 28px; }

  .contact-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:18px; }
  .contact-card{ display:flex; flex-direction:column; gap:6px; background:var(--ink-2); border:1.5px solid var(--line); border-radius:10px; padding:26px 22px; transition:transform .25s ease, border-color .25s ease; }
  .contact-card:hover{ transform:translateY(-4px); border-color:rgba(242,236,221,0.35); }
  .contact-card .clabel{ font-family:'IBM Plex Mono',monospace; font-size:0.68rem; letter-spacing:0.08em; text-transform:uppercase; color:var(--gold); }
  .contact-card .cvalue{ font-family:'Work Sans',sans-serif; font-weight:600; font-size:1.05rem; color:var(--cream); }

  footer{ text-align:center; padding:40px 24px; border-top:1px solid var(--line); }
  footer .fname{ font-family:'IBM Plex Mono',monospace; font-size:0.78rem; letter-spacing:0.06em; color:var(--cream); text-transform:uppercase; margin-bottom:8px; }
  footer .fsub{ font-size:0.82rem; color:#6f6a5f; }
  .fsocial{ display:flex; justify-content:center; gap:18px; margin-top:16px; }
  .fsocial a{ font-family:'IBM Plex Mono',monospace; font-size:0.75rem; color:var(--body-text); border:1px solid var(--line); padding:8px 14px; border-radius:20px; transition:.2s; }
  .fsocial a:hover{ color:var(--gold); border-color:var(--gold); }

  .float-wa{ position:fixed; bottom:24px; right:24px; width:58px; height:58px; background:#25D366; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.7rem; box-shadow:4px 4px 0 rgba(0,0,0,0.45); z-index:999; animation:pulseWA 2.6s ease-in-out infinite; border:2px solid var(--ink); }
  @keyframes pulseWA{ 0%,100%{ transform:scale(1);} 50%{ transform:scale(1.08);} }

  @media (max-width:900px){
    .hero-inner{ grid-template-columns:1fr; text-align:center; }
    .hero-desc{ margin-left:auto; margin-right:auto; }
    .hero-btns, .trust-strip{ justify-content:center; }
    .hero-stack{ order:-1; margin:0 auto 20px; max-width:340px; }
    .nav-links{ position:fixed; top:64px; left:0; right:0; background:rgba(12,12,13,0.98); flex-direction:column; padding:22px 24px; gap:18px; transform:translateY(-150%); opacity:0; transition:.3s ease; border-bottom:1px solid var(--line); }
    .nav-links.open{ transform:translateY(0); opacity:1; }
    .menu-toggle{ display:flex; }
  }
  @media (max-width:480px){
    .hero-stack{ height:320px; }
    .stack-card{ width:150px; }
    .stack-card .ticket-icon{ font-size:1.9rem; }
    .logo-sub{ display:none; }
  }
  @media (prefers-reduced-motion:reduce){
    *{ animation-duration:0.01ms !important; animation-iteration-count:1 !important; transition-duration:0.01ms !important; scroll-behavior:auto !important; }
  }
  .reveal{ opacity:0; transform:translateY(26px); transition:opacity .7s ease, transform .7s ease; }
  .reveal.active{ opacity:1; transform:translateY(0); }
  a:focus-visible, button:focus-visible{ outline:2px solid var(--gold); outline-offset:3px; border-radius:4px; }
`;