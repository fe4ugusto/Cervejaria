import { useEffect } from "react";

// ───────────────────────────────────────────────────────────
//  LandingPage – página inicial da Cervejaria Artesanal
//  Os botões "Login" e "Faça o Login" chamam onGoToLogin()
// ───────────────────────────────────────────────────────────
export function LandingPage({ onGoToLogin }) {
  // Inicializa o carrossel do Bootstrap quando o componente monta
  useEffect(() => {
    // Bootstrap já está carregado via CDN no index.html? Não.
    // Vamos controlar o carrossel manualmente com CSS puro.
  }, []);

  return (
    <>
      {/* ── Estilos inline ── */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Navbar */
        .lp-navbar {
          background: #ffc107;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .lp-brand {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          text-decoration: none;
        }
        .lp-nav-links {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }
        .lp-nav-link {
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: opacity 0.2s;
        }
        .lp-nav-link:hover { opacity: 0.7; }
        .lp-btn-login-nav {
          background: transparent;
          border: 2px solid #1a1a1a;
          color: #1a1a1a;
          padding: 6px 18px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: background 0.2s, color 0.2s;
        }
        .lp-btn-login-nav:hover { background: #1a1a1a; color: #ffc107; }

        /* Carousel */
        .lp-carousel {
          position: relative;
          overflow: hidden;
          width: 100%;
          max-height: 520px;
        }
        .lp-carousel input[type="radio"] { display: none; }
        .lp-slides {
          display: flex;
          transition: transform 0.6s ease;
          width: 300%;
        }
        .lp-slide {
          width: 33.333%;
          flex-shrink: 0;
        }
        .lp-slide img {
          width: 100%;
          height: 520px;
          object-fit: cover;
          display: block;
        }
        /* Radio controles */
        #s1:checked ~ .lp-slides { transform: translateX(0); }
        #s2:checked ~ .lp-slides { transform: translateX(-33.333%); }
        #s3:checked ~ .lp-slides { transform: translateX(-66.666%); }
        .lp-carousel-dots {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }
        .lp-carousel-dots label {
          width: 12px;
          height: 12px;
          background: rgba(255,255,255,0.55);
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s;
        }
        #s1:checked ~ .lp-carousel-dots label[for="s1"],
        #s2:checked ~ .lp-carousel-dots label[for="s2"],
        #s3:checked ~ .lp-carousel-dots label[for="s3"] { background: #fff; }
        /* Setas */
        .lp-carousel-arrows {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 12px;
          pointer-events: none;
        }
        .lp-carousel-arrows label {
          pointer-events: all;
          background: rgba(0,0,0,0.35);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .lp-carousel-arrows label:hover { background: rgba(0,0,0,0.6); }

        /* Seção "quem somos" */
        .lp-about {
          text-align: center;
          padding: 40px 24px 24px;
          max-width: 800px;
          margin: 0 auto;
        }
        .lp-about h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 14px;
          color: #1a1a1a;
        }
        .lp-about p {
          font-size: 1.05rem;
          color: #444;
          line-height: 1.7;
        }

        /* CTA botão */
        .lp-cta {
          text-align: center;
          margin: 22px 0 36px;
        }
        .lp-btn-cta {
          background: #ffc107;
          border: none;
          color: #1a1a1a;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(255,193,7,0.35);
        }
        .lp-btn-cta:hover {
          background: #e6ac00;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255,193,7,0.5);
        }

        /* Cards */
        .lp-cards {
          display: flex;
          gap: 24px;
          justify-content: center;
          flex-wrap: wrap;
          padding: 0 24px 60px;
        }
        .lp-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.10);
          overflow: hidden;
          width: 300px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .lp-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.15);
        }
        .lp-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .lp-card-body {
          padding: 18px;
        }
        .lp-card-body p {
          font-size: 0.93rem;
          color: #555;
          line-height: 1.6;
        }

        /* Footer */
        .lp-footer {
          background: #1a1a1a;
          color: #888;
          text-align: center;
          padding: 20px;
          font-size: 0.85rem;
        }

        body { background: #f8f9fa; font-family: 'Syne', sans-serif; }
      `}</style>

      {/* ── Navbar ── */}
      <nav className="lp-navbar">
        <span className="lp-brand">🍺 Cervejaria Artesanal</span>
        <div className="lp-nav-links">
          <a href="#" className="lp-nav-link">Home</a>
          <a href="#sobre" className="lp-nav-link">Sobre</a>
          <a href="#produtos" className="lp-nav-link">Produtos</a>
          <button className="lp-btn-login-nav" onClick={onGoToLogin}>Login</button>
        </div>
      </nav>

      {/* ── Carrossel CSS puro ── */}
      <div className="lp-carousel">
        <input type="radio" name="slide" id="s1" defaultChecked />
        <input type="radio" name="slide" id="s2" />
        <input type="radio" name="slide" id="s3" />

        <div className="lp-slides">
          <div className="lp-slide">
            <img src="/bohdan-stocek-WR0vloPP47Q-unsplash.jpg" alt="Cerveja artesanal 1" />
          </div>
          <div className="lp-slide">
            <img src="/viarami-beer-8266323_1920.jpg" alt="Cerveja artesanal 2" />
          </div>
          <div className="lp-slide">
            <img src="/aramayuelas-beer-5618349_1920.jpg" alt="Cerveja artesanal 3" />
          </div>
        </div>

        {/* Setas */}
        <div className="lp-carousel-arrows">
          <label htmlFor="s3">‹</label>
          <label htmlFor="s2">›</label>
        </div>

        {/* Dots */}
        <div className="lp-carousel-dots">
          <label htmlFor="s1" />
          <label htmlFor="s2" />
          <label htmlFor="s3" />
        </div>
      </div>

      {/* ── Quem somos ── */}
      <section id="sobre" className="lp-about">
        <h2>Quem somos?</h2>
        <p>
          Bem-vindo à Cervejaria Artesanal! Somos uma cervejaria comprometida com a
          produção de cervejas de qualidade, utilizando ingredientes selecionados e
          processos cuidadosos. Nosso objetivo é oferecer sabores únicos e proporcionar
          a melhor experiência aos apreciadores de cerveja artesanal. 🍺
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
          <img src="/pexels-yankrukov-7793664.jpg" alt="Nossa história" />
          <div className="lp-card-body">
            <p>
              Nossa empresa foi fundada em 2018 com o objetivo de produzir cervejas artesanais
              de alta qualidade, unindo tradição, criatividade e ingredientes selecionados.
            </p>
          </div>
        </div>
        <div className="lp-card">
          <img src="/bohdan-stocek-WR0vloPP47Q-unsplash.jpg" alt="Nossos clientes" />
          <div className="lp-card-body">
            <p>
              Nossas cervejas artesanais conquistaram centenas de clientes ao oferecer
              sabores exclusivos e uma experiência única em cada degustação.
            </p>
          </div>
        </div>
        <div className="lp-card">
          <img src="/viarami-beer-8266323_1920.jpg" alt="Qualidade" />
          <div className="lp-card-body">
            <p>
              O compromisso com a qualidade e a inovação tornou nossa marca uma referência
              para quem busca bebidas artesanais de excelência.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        © {new Date().getFullYear()} Cervejaria Artesanal – Todos os direitos reservados.
      </footer>
    </>
  );
}
