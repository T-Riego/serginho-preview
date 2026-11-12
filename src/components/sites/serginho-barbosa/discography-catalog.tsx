import { Search } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import styles from "./discography.module.css";

type AlbumCard = {
  title: string;
  href: string;
  cover: string;
};

function normalizeSearch(text: string) {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("pt-BR");
}

export function DiscographyCatalog({
  albums,
  search = "",
  path,
}: {
  albums: readonly AlbumCard[];
  search?: string;
  path: string;
}) {
  const query = search.trim().slice(0, 256);
  const normalizedQuery = normalizeSearch(query);
  const results = albums.filter(({ title }) => normalizeSearch(title).includes(normalizedQuery));

  return (
    <section className={styles.catalog} aria-label="Catálogo de álbuns">
      <div className="sb-container">
        <Form action={path} scroll={false} role="search" aria-label="Buscar na discografia" className={styles.search}>
          <input
            type="text"
            name="search"
            aria-label="Buscar produto"
            placeholder="Buscar produto"
            defaultValue={query}
            key={query}
            maxLength={256}
          />
          <button type="submit" aria-label="Buscar"><Search size={19} strokeWidth={3} /></button>
        </Form>
        {results.length ? (
          <ul className={styles.albums} role="list">
            {results.map(({ title, href, cover }) => (
              <li key={href}>
                <Link href={href} className={styles.card}>
                  <div className={styles.cardCover} style={{ backgroundImage: `url(${cover})` }} />
                  <div className={styles.cardText}>
                    <h2>{title}</h2>
                    <span className={styles.cardDetails}>Mais detalhes</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>
            <p role="status">Nenhum álbum encontrado.</p>
            <Link className="sb-button" href={path}>Limpar busca</Link>
          </div>
        )}
      </div>
    </section>
  );
}
