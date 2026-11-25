import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { assetRoot } from "./site-content";
import styles from "./editorial.module.css";

const courses = [
  [2024, "Teatro no Programa Habilidades, no projeto de valorização das pessoas idosas por meio da inclusão digital, da educação financeira e empreendedora, da democratização do acesso à cultura e da promoção da saúde."],
  [2020, "Gestão de Produção — O Avesso da Cena, ministrado por Rômulo Avelar, do Grupo Galpão, e realizado pelo Festival Trama de Teatro de Contagem."],
  [2019, "Curso de Capacitação Profissional em Artes Cênicas, pela Secretaria de Cultura, Esporte e Juventude de Contagem e pelo SATED/MG."],
  [2018, "Fórum de Debate — Método Stanislavski."],
  [2018, "Fórum de Debate e workshop O Teatro Físico de Grotowski."],
  [2018, "Fórum de Debate — Pedagogia do Ator."],
  [2018, "Oficina de Prática Teatral — Teatro Galpão."],
  [2017, "Introdução ao Teatro — FUNDAC Contagem."],
  [2017, "Iniciação Teatral — FUNDAC Contagem."],
  [2016, "Iniciação Teatral — FUNDAC Contagem."],
] as const;

const performances = [
  [2025, "Ator e intérprete no Show Cênico Voz Companheira — 20 anos."],
  [2024, "Participação como ator na gravação do DVD de Vandder Lima."],
  [2024, "Show Cênico Voz Companheira."],
  [2021, "Gravação do vídeo institucional Me Preparando para Quando o Carnaval Chegar, para a Prefeitura de Contagem, com o Circo dos Amores."],
  [2020, "No 2º Trama Festival de Teatro, participou das oficinas on-line. A cena Minha Rua, com o personagem Zé Duêeeeee, foi premiada no Festival de Cenas Curtas."],
  [2019, "Ensaio sobre a Cegueira, de José Saramago, com direção de Kalluh Araújo."],
  [2018, "Yerma, de Federico García Lorca, com direção de Fernando Penido."],
] as const;

type ActorPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

function ActorPhotos({ photos }: { photos: readonly ActorPhoto[] }) {
  return (
    <div className={styles.actorPhotos}>
      {photos.map(({ src, alt, width, height }) => (
        <Image
          key={src}
          className={width < height ? `${styles.actorPhoto} ${styles.actorPortrait}` : styles.actorPhoto}
          src={`${assetRoot}/${src}`}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 650px) 92vw, (max-width: 1100px) 46vw, 510px"
        />
      ))}
    </div>
  );
}

const actorWorks = [
  {
    title: "Show Cênico Voz Companheira — 20 anos",
    description: "O espetáculo de 2025 está disponível na íntegra em todas as plataformas digitais.",
    video: "https://www.youtube.com/watch?v=P8RNoTjF6Kc",
    photos: [
      { src: "editorial/ator/voz-companheira-20-anos.webp", alt: "Serginho Barbosa de braços abertos à frente da banda no Show Cênico Voz Companheira — 20 anos", width: 1200, height: 800 },
      { src: "editorial/ator/voz-companheira-20-anos-palco.webp", alt: "Plateia em primeiro plano e elenco no palco do Show Cênico Voz Companheira — 20 anos", width: 960, height: 640 },
    ],
  },
  {
    title: "Gravação do DVD de Vandder Lima",
    description: "Em 2024, Serginho participou da gravação como ator, caracterizado como mímico.",
    photos: [
      { src: "gallery-albums/full/ator-08.webp", alt: "Serginho Barbosa como mímico ao piano durante a gravação do DVD de Vandder Lima", width: 723, height: 1280 },
      { src: "editorial/ator/dvd-vandder-lima-cena.webp", alt: "Dois artistas caracterizados ao lado do piano ilustrado durante a gravação", width: 548, height: 960 },
    ],
  },
  {
    title: "Show Cênico Voz Companheira — 2024",
    description: "Apresentação na Casa de Cultura Maestro Dungas, em Itabirito (MG).",
    photos: [
      { src: "editorial/ator/voz-companheira-2024.webp", alt: "Serginho Barbosa sentado em cena no Show Cênico Voz Companheira de 2024", width: 960, height: 641 },
      { src: "editorial/ator/voz-companheira-2024-cartaz.webp", alt: "Cartaz do Show Cênico Voz Companheira em Itabirito, especial de Dia das Mães", width: 540, height: 960 },
    ],
  },
  {
    title: "Ensaio sobre a Cegueira",
    description: "Montagem de 2019 da obra de José Saramago, com direção de Kalluh Araújo.",
    photos: [
      { src: "editorial/ator/ensaio-sobre-a-cegueira.webp", alt: "Elenco de Ensaio sobre a Cegueira em cena no palco", width: 960, height: 775 },
      { src: "editorial/ator/ensaio-sobre-a-cegueira-cartaz.webp", alt: "Cartaz de Ensaio sobre a Cegueira, apresentado pela turma de Artes Cênicas de Contagem", width: 580, height: 820 },
    ],
  },
  {
    title: "Yerma",
    description: "Montagem de 2018 da obra de Federico García Lorca, com adaptação de Gabriel Vinícius e direção de Fernando Penido.",
    photos: [
      { src: "editorial/ator/yerma.webp", alt: "Elenco de Yerma reunido no palco ao final da apresentação", width: 847, height: 635 },
      { src: "editorial/ator/yerma-cartaz.webp", alt: "Cartaz da montagem de Yerma no Teatro Casa Azul, em Contagem", width: 960, height: 672 },
    ],
  },
] satisfies readonly {
  title: string;
  description: string;
  video?: string;
  photos: readonly ActorPhoto[];
}[];

export function ActorContent() {
  return (
    <section className={`sb-section ${styles.actor}`}>
      <article className="sb-container">
        <section className={styles.actorBlock} aria-labelledby="actor-courses">
          <h2 className={styles.articleTitle} id="actor-courses">Cursos</h2>
          <ul>
            {courses.map(([year, course]) => (
              <li key={`${year}-${course}`}><strong>{year}</strong> - {course}</li>
            ))}
          </ul>
        </section>

        <section className={styles.actorBlock} aria-labelledby="actor-performances">
          <h2 className={styles.articleTitle} id="actor-performances">Peças e trabalhos</h2>
          <ul>
            {performances.map(([year, performance]) => (
              <li key={performance}><strong>{year}</strong> - {performance}</li>
            ))}
            <li>Ópera do Malandro, de Chico Buarque, com direção de Fátima Silveira.</li>
            <li>Cadê o Boi que Estava Aqui, de Fátima Silveira, com direção da autora.</li>
          </ul>
        </section>

        <section className={styles.actorBlock} aria-labelledby="actor-photos">
          <h2 className={styles.articleTitle} id="actor-photos">Registros de cena</h2>
          {actorWorks.map(({ title, description, video, photos }) => (
            <div key={title} className={styles.actorWork}>
              <h3 className={styles.actorWorkTitle}>{title}</h3>
              <p>{description}</p>
              {video && <p><a href={video}>Assistir no YouTube</a></p>}
              <ActorPhotos photos={photos} />
            </div>
          ))}
          <Link className={`sb-button sb-button-outline ${styles.actorGalleryLink}`} href="/galeria-de-fotos/ator/21">
            Ver galeria de Ator <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
      </article>
    </section>
  );
}
