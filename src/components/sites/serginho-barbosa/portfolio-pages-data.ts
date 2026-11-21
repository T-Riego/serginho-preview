import { assetRoot } from "./site-content";

export type PortfolioPageAsset = Readonly<{
  number: number;
  compactSrc: string;
  desktopSrc: string;
  alt: string;
}>;

const portfolioPageAlts = [
  "Capa do portfólio de Serginho Barbosa",
  "Sumário com as áreas de atuação de Serginho Barbosa",
  "Abertura da seção Quem sou",
  "Biografia e trajetória artística de Serginho Barbosa",
  "Missão artística de Serginho Barbosa",
  "Abertura da seção Ator",
  "Cursos e formação teatral",
  "Peças, filmes e trabalhos como ator",
  "Show Cênico Voz Companheira 20 anos",
  "Registro fotográfico do Show Cênico Voz Companheira 20 anos",
  "Gravação do DVD de Vander Lima",
  "Show Cênico Voz Companheira de 2024",
  "Ensaio sobre a Cegueira",
  "Espetáculo Yerma",
  "Abertura da seção Locutor",
  "Rádio web Voz Companheira",
  "Programa Voz Companheira na Rádio Cidade FM",
  "Abertura da seção Músico",
  "Lançamentos musicais de 2025 e 2026",
  "Discografia de 2005 a 2022",
  "Single Por um Bolero, parceria entre Brasil e Venezuela",
  "Single No Necesito, parceria entre Brasil e Cuba",
  "Single Caminos, parceria entre Brasil e Argentina",
  "Álbum Brilho Novo",
  "Álbum Circo dos Amores",
  "Álbum Boleros: Uma História de Amor",
  "Álbum Voz Companheira",
  "Álbum Trajetória",
  "Shows e apresentações de 2024 a 2026",
  "Shows e apresentações de 2005 a 2023",
  "Carnaval é Aqui no Circo dos Amores em Itabirito em 2026",
  "Carnaval é Aqui no Circo dos Amores em Ouro Preto em 2026",
  "Gravação do hino do Itabirito Futebol Clube",
  "Carnaval é Aqui no Circo dos Amores em Itabirito",
  "Carnaval em Itabirito",
  "Carnaval é Aqui no Circo dos Amores em Contagem",
  "Show em evento gastronômico",
  "Gravação da marchinha Itabirito em seu Centenário",
  "Show no Julifest 2023",
  "Lançamento do show Caminhos - Brilho Novo",
  "Show Serginho Barbosa convida Violeiro Chico Lobo",
  "Palco Iluminado com Thelmo Lins e Serginho Barbosa",
  "Abertura da seção Produtor",
  "Produções realizadas entre 2022 e 2025",
  "Produções realizadas entre 2018 e 2019",
  "Produções realizadas entre 2016 e 2017",
  "Produções realizadas entre 2006 e 2014",
  "Abertura da seção Deu na Mídia",
  "Participação no MGTV Primeira Edição",
  "Publicações no Antenados e na Rádio Barreiro",
  "Publicações no Cenário Minas e no jornal O Liberal",
  "Publicações no Boas Vindas BH e no jornal O Tempo",
  "Publicações no BH Eventos e no Portal UAI",
  "Publicações no Agenda BH e no Santa Tereza Tem",
  "Publicações no Culturaliza BH e no portal Belo Horizonte",
  "Notícia no jornal Super Notícia",
  "Notícia no jornal O Tempo",
  "Notícia no jornal Estado de Minas",
  "Entrevistas nas rádios América e Inconfidência",
  "Entrevista no programa Revista da Tarde da Rádio Inconfidência",
  "Participações de Serginho Barbosa na televisão",
  "Vídeo de participação de Serginho Barbosa",
  "Abertura da seção Certificados",
  "Registro profissional de ator de Serginho Barbosa no SATED Minas",
  "Certificados de teatro do Programa Hábil Idade e da oficina Produção e Gestão: O Caminho do Coletivo",
  "Certificados do Curso de Capacitação Profissional em Artes Cênicas e do fórum Pedagogia do Ator",
  "Certificados dos fóruns Método Stanislavski e O Teatro Físico de Grotowski",
  "Certificados de prática teatral com Lydia Del Picchia e do curso Introdução ao Teatro",
  "Certificados do curso de Iniciação Teatral ministrado por Maria de Fátima Silveira",
  "Página de contato de Serginho Barbosa",
] as const;

export const portfolioPages: readonly PortfolioPageAsset[] = portfolioPageAlts.map(
  (alt, index) => {
    const number = index + 1;
    const padded = String(number).padStart(3, "0");

    return {
      number,
      compactSrc: `${assetRoot}/portfolio/pages/page-${padded}-960.webp`,
      desktopSrc: `${assetRoot}/portfolio/pages/page-${padded}-1600.webp`,
      alt,
    };
  },
);
