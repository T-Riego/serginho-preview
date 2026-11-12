import { Search } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { AlbumCard } from "./album-card";
import { SiteInput } from "./site-fields";
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
          <Search className={styles.searchIcon} size={19} aria-hidden="true" />
          <SiteInput
            type="text"
            name="search"
            aria-label="Buscar álbum"
            placeholder="Buscar álbum"
            defaultValue={query}
            key={query}
            maxLength={256}
          />
          <button type="submit" className="sb-button">Buscar</button>
        </Form>
        {results.length ? (
          <ul className="sb-albums" role="list">
            {results.map(({ title, href, cover }) => (
              <li key={href}>
                <AlbumCard href={href} title={title} cover={cover} heading="h2" />
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
