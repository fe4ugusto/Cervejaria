import { useEffect, useState } from "react";

// ───────────────────────────────────────────────────────────
//  LandingPage – página inicial da Cervejaria Artesanal
//  Adaptada para o Dark Theme Premium
// ───────────────────────────────────────────────────────────
export function LandingPage({ onGoToLogin }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    // Scroll handling for sticky nav if needed
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Navbar */
        .lp-navbar {
          background: #0c0d0f;
          border-bottom: 1px solid #1e2010;
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .lp-brand {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f5c842;
          font-family: 'Playfair Display', serif;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lp-nav-links {
          display: flex;
          gap: 24px;
          align-items: center;
          flex-wrap: wrap;
        }
        .lp-nav-link {
          color: #e2e8f0;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .lp-nav-link:hover { color: #f5c842; }
        .lp-btn-login-nav {
          background: transparent;
          border: 1px solid #c8860a;
          color: #f5c842;
          padding: 8px 20px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .lp-btn-login-nav:hover { background: #c8860a; color: #000; }

        /* Carousel */
        .lp-carousel {
          position: relative;
          overflow: hidden;
          width: 100%;
          max-height: 520px;
          border-bottom: 1px solid #1e2010;
        }
        .lp-carousel input[type="radio"] { display: none; }
        .lp-slides {
          display: flex;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          width: 300%;
        }
        .lp-slide {
          width: 33.333%;
          flex-shrink: 0;
          position: relative;
        }
        /* Overlay escuro nas imagens do carrossel para não agredir a vista no dark mode */
        .lp-slide::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(rgba(12,13,15,0.3), rgba(12,13,15,0.7));
          pointer-events: none;
        }
        .lp-slide img {
          width: 100%;
          height: 520px;
          object-fit: cover;
          display: block;
        }
        .lp-carousel-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 10;
        }
        .lp-carousel-dots button {
          width: 12px;
          height: 12px;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        .lp-carousel-dots button.active { 
          background: #f5c842; 
          transform: scale(1.3);
        }
        /* Setas */
        .lp-carousel-arrows {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          pointer-events: none;
          z-index: 10;
        }
        .lp-carousel-arrows button {
          pointer-events: all;
          background: rgba(12, 13, 15, 0.6);
          color: #f5c842;
          border: 1px solid rgba(245, 200, 66, 0.2);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
        }
        .lp-carousel-arrows button:hover { 
          background: #c8860a;
          color: #000;
          border-color: #c8860a;
        }

        /* Seção "quem somos" */
        .lp-about {
          text-align: center;
          padding: 60px 24px 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        .lp-about h2 {
          font-size: 2.5rem;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          margin-bottom: 20px;
          color: #f5c842;
        }
        .lp-about p {
          font-size: 1.1rem;
          color: #aaa;
          line-height: 1.8;
        }

        /* CTA botão */
        .lp-cta {
          text-align: center;
          margin: 10px 0 60px;
        }
        .lp-btn-cta {
          background: #c8860a;
          border: none;
          color: #000;
          padding: 16px 36px;
          border-radius: 30px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(200, 134, 10, 0.2);
        }
        .lp-btn-cta:hover {
          background: #f5c842;
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(245, 200, 66, 0.3);
        }

        /* Cards */
        .lp-cards {
          display: flex;
          gap: 24px;
          justify-content: center;
          flex-wrap: wrap;
          padding: 0 24px 80px;
        }
        .lp-card {
          background: #13150f;
          border: 1px solid #1e2010;
          border-top: 3px solid #f5c842;
          border-radius: 16px;
          overflow: hidden;
          width: 320px;
          transition: all 0.3s;
        }
        .lp-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.5);
          border-color: #c8860a;
        }
        .lp-card img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          opacity: 0.85;
          transition: opacity 0.3s;
        }
        .lp-card:hover img { opacity: 1; }
        
        .lp-card-body {
          padding: 24px;
        }
        .lp-card-body p {
          font-size: 0.95rem;
          color: #888;
          line-height: 1.6;
        }

        /* Footer */
        .lp-footer {
          background: #08090a;
          color: #555;
          text-align: center;
          padding: 30px 20px;
          font-size: 0.85rem;
          border-top: 1px solid #141611;
        }

        body { background: #0c0d0f; font-family: 'Syne', sans-serif; color: #e2e8f0; }
      `}</style>

      {/* ── Navbar ── */}
      <nav className="lp-navbar">
        <span className="lp-brand"><span style={{ fontSize: 28 }}>🍻</span> Cervejaria Artesanal</span>
        <div className="lp-nav-links">
          <a href="#" className="lp-nav-link">Home</a>
          <a href="#sobre" className="lp-nav-link">Sobre</a>
          <a href="#produtos" className="lp-nav-link">Destaques</a>
          <button className="lp-btn-login-nav" onClick={onGoToLogin}>Login</button>
        </div>
      </nav>

      {/* ── Carrossel React ── */}
      <div className="lp-carousel">
        <div className="lp-slides" style={{ transform: `translateX(-${slide * 33.333}%)` }}>
          <div className="lp-slide">
            <img src="/bohdan-stocek-WR0vloPP47Q-unsplash.jpg" alt="Cerveja artesanal 1" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.background = '#1a1c14' }} />
          </div>
          <div className="lp-slide">
            <img src="/viarami-beer-8266323_1920.jpg" alt="Cerveja artesanal 2" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.background = '#1a1c14' }} />
          </div>
          <div className="lp-slide">
            <img src="/aramayuelas-beer-5618349_1920.jpg" alt="Cerveja artesanal 3" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.background = '#1a1c14' }} />
          </div>
        </div>

        {/* Setas */}
        <div className="lp-carousel-arrows">
          <button onClick={() => setSlide(s => (s > 0 ? s - 1 : 2))}>‹</button>
          <button onClick={() => setSlide(s => (s < 2 ? s + 1 : 0))}>›</button>
        </div>

        {/* Dots */}
        <div className="lp-carousel-dots">
          <button className={slide === 0 ? 'active' : ''} onClick={() => setSlide(0)} />
          <button className={slide === 1 ? 'active' : ''} onClick={() => setSlide(1)} />
          <button className={slide === 2 ? 'active' : ''} onClick={() => setSlide(2)} />
        </div>
      </div>

      {/* ── Quem somos ── */}
      <section id="sobre" className="lp-about">
        <h2>A Arte da Cerveja</h2>
        <p>
          Bem-vindo à Cervejaria Artesanal! Somos uma cervejaria comprometida com a
          produção de cervejas de qualidade, utilizando ingredientes selecionados e
          processos cuidadosos. Nosso objetivo é oferecer sabores únicos e proporcionar
          a melhor experiência aos apreciadores de cerveja artesanal premium.
        </p>
      </section>

      {/* ── CTA ── */}
      <div className="lp-cta">
        <button className="lp-btn-cta" onClick={onGoToLogin}>
          Faça o Login e Conheça Nossos Produtos!
        </button>
      </div>

      {/* ── Cards ── */}
      <section id="produtos" className="lp-cards">
        <div className="lp-card">
          <div style={{ width: '100%', height: 200, background: 'linear-gradient(135deg, #1a1c14, #0c0d0f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📜</div>
          <div className="lp-card-body">
            <p>
              <strong style={{ color: '#f5c842', display: 'block', marginBottom: 8, fontSize: '1.1rem' }}>Nossa História</strong>
              Nossa empresa foi fundada com o objetivo de produzir cervejas artesanais
              de alta qualidade, unindo tradição, criatividade e ingredientes rigorosamente selecionados.
            </p>
          </div>
        </div>
        <div className="lp-card">
          <div style={{ width: '100%', height: 200, background: 'linear-gradient(135deg, #1a1c14, #0c0d0f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>👥</div>
          <div className="lp-card-body">
            <p>
              <strong style={{ color: '#f5c842', display: 'block', marginBottom: 8, fontSize: '1.1rem' }}>Nossos Clientes</strong>
              Nossas cervejas conquistaram centenas de clientes ao oferecer
              sabores exclusivos e uma experiência única em cada degustação, entregue direto na sua casa.
            </p>
          </div>
        </div>
        <div className="lp-card">
          <div style={{ width: '100%', height: 200, background: 'linear-gradient(135deg, #1a1c14, #0c0d0f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>⭐</div>
          <div className="lp-card-body">
            <p>
              <strong style={{ color: '#f5c842', display: 'block', marginBottom: 8, fontSize: '1.1rem' }}>Padrão de Excelência</strong>
              O compromisso com a qualidade e a inovação tornou nossa marca uma referência
              para quem busca bebidas artesanais de alta excelência e sofisticação.
            </p>
          </div>
        </div>
      </section>

      {/* ── Aviso Legal ── */}
      <div style={{ textAlign: "center", padding: "20px 24px 0", color: "#666", fontSize: "0.85rem", fontStyle: "italic", marginBottom: "10px" }}>
        ⚠️ Se beber, não dirija. Produto destinado a maiores de 18 anos. Beba com moderação.
      </div>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        © {new Date().getFullYear()} Cervejaria Artesanal – Todos os direitos reservados.
      </footer>
    </>
  );
}
