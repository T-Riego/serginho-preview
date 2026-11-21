import { portfolioPages } from "./portfolio-pages-data";
import { PortfolioViewer } from "./portfolio-viewer";
import styles from "./portfolio.module.css";

export function PortfolioPageContent() {
  return (
    <section className={styles.page} aria-labelledby="portfolio-heading">
      <div className="sb-container">
        <div className={styles.intro}>
          <h2 id="portfolio-heading" className={styles.introTitle}>
            Portfólio artístico
          </h2>
          <p className={styles.introText}>
            Conheça a trajetória artística de Serginho Barbosa como cantor, ator, compositor,
            locutor e produtor. Navegue pelas páginas para acompanhar seus projetos,
            apresentações e realizações.
          </p>
        </div>
        <PortfolioViewer pages={portfolioPages} />
      </div>
    </section>
  );
}
