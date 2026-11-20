import Image from "next/image";
import { assetRoot } from "./site-content";
import styles from "./editorial.module.css";

const editorialImages = {
  bioShow: { file: "biografia-show.webp", alt: "Serginho Barbosa cantando no palco", width: 3448, height: 2299 },
  bioCarnaval: { file: "biografia-carnaval.webp", alt: "Serginho Barbosa no Carnaval", width: 4369, height: 2913 },
  bioPortrait: { file: "biografia-retrato.webp", alt: "Retrato de Serginho Barbosa", width: 2738, height: 1825 },
  bioFinal: { file: "biografia-evento.webp", alt: "Serginho Barbosa em apresentação musical", width: 4703, height: 3135 },
  carnavalStage: { file: "carnaval-circo.webp", alt: "Apresentação do Circo dos Amores", width: 1600, height: 1067 },
  carnavalBand: { file: "carnaval-banda.webp", alt: "Serginho Barbosa em apresentação de Carnaval", width: 1200, height: 799 },
  carnavalFinal: { file: "carnaval-final.webp", alt: "Projeto Carnaval é Aqui", width: 1513, height: 685 },
};

function EditorialPhoto({ name }: { name: keyof typeof editorialImages }) {
  const { file, alt, width, height } = editorialImages[name];

  return <Image className={styles[name]} src={`${assetRoot}/editorial/${file}`} alt={alt} width={width} height={height} sizes="(max-width: 650px) 92vw, 50vw" />;
}

export function BiographyContent() {
  return (
    <section className={`sb-section ${styles.biography}`}>
      <article className="sb-container">
        <p><EditorialPhoto name="bioShow" />Serginho Barbosa, <strong>Cantor, Ator, Compositor, Empreendedor Cultural, Apresentador de Programa de Rádio,</strong> nasceu em Itabirito (MG) e reside em Contagem-MG desde 1993. Desde adolescente, envolve-se com a música. Inicialmente, em corais, como o Canarinhos de Itabirito, do qual participou nos períodos de 1973 a 1976 e de 1993 a 1999.</p>
        <p>A partir de 1982, participou de vários Festivais da Canção, onde <strong>ganhou prêmios de Melhor Intérprete, Melhor Arranjo e dois primeiros lugares.</strong> Nos anos seguintes, atuou nos grupos Cenários do Sol, Imagem do Som e como cantor solista. <strong>Foi puxador de samba de várias escolas de samba do carnaval itabiritense, nos anos de 1980 a 1990.</strong> Hoje, é puxador de samba oficial da Escola de Samba Unidos de Cachoeira do Campo - URCA, em Ouro Preto.</p>
        <p>Em 1997, criou com o irmão Daniel Barbosa a dupla Serginho Barbosa&amp;Daniel, extinta em 2003. Durante o período, a dupla realizou dezenas de apresentações no formato voz e violão e banda. Fez shows em várias cidades do interior de Minas Gerais, como Ouro Preto, Urucânia, Paraopeba, Rio Acima e Contagem, além de Itabirito e Belo Horizonte.</p>
        <p>A partir de agosto de 2003 assumiu a carreira solo, concentrando-se no planejamento e <strong>produção do seu primeiro CD solo</strong>.</p>
        <p>Em 2005 lançou seu primeiro CD solo - &quot;Trajetória&quot;, que vem divulgando e fazendo shows.</p>
        <p><EditorialPhoto name="bioCarnaval" /><span className={styles.bioLabel}><strong>Teatro:</strong></span></p>
        <ul>
          <li><strong>2024</strong> - Teatro no projeto: Valorização das Pessoas Idosas por meio da Inclusão Digital, Educação Financeira e Empreendedora, democratização do acesso à cultura e promoção da saúde - Programa Habilidades.</li>
          <li><strong>2020</strong> - Gestão de Produção - &quot;O Avesso da Cena&quot;, ministrado por Rômulo Avelar, do Grupo Galpão, e realizado pelo Festival Trama de Teatro de Contagem.</li>
          <li><strong>2019</strong> - Curso de Capacitação Profissional em Artes Cênicas - Secretaria de Cultura, Esporte e Juventude de Contagem e SATED/MG.</li>
          <li><strong>2018</strong> - Fórum de Debate - Método Stanislavski.</li>
          <li><strong>2018</strong> - Fórum de Debate e Workshop - &quot;O Teatro físico de Grotowski&quot;.</li>
          <li><strong>2018</strong> - Participação no Fórum de Debate - Pedagogia do ator.</li>
          <li><strong>2018</strong> - Prática Teatral - Oficina - Teatro Galpão.</li>
          <li><strong>2017</strong> - Introdução ao Teatro - FUNDAC Contagem.</li>
          <li><strong>2017</strong> - Iniciação Teatral - FUNDAC Contagem.</li>
          <li><strong>2016</strong> - Iniciação Teatral - FUNDAC Contagem.</li>
        </ul>
        <p><EditorialPhoto name="bioPortrait" /><span className={styles.bioLabel}><strong>Discografia e Produção:</strong></span></p>
        <ul>
          <li><strong>2005</strong> - CD Trajetória</li>
          <li><strong>2008</strong> - Branco, verde, vermelho e preto - Serginho Barbosa canta hinos dos clubes</li>
          <li><strong>2009</strong> - Verde Rosa branco e alegria - Serginho Barbosa canta sambas</li>
          <li><strong>2010</strong> - Lançamento do CD Coletâneas - Disco comemorativo</li>
          <li><strong>2011</strong> - Música Voz Companheira, inserção do CD - &quot;Feminino em Canto&quot;.</li>
          <li><strong>2012</strong> - CD &quot;Voz Companheira&quot; - CD autoral.</li>
          <li><strong>2013</strong> - Inserção da música &quot;Querer Imaginário&quot; na Coletânea Cata Branca.</li>
          <li><strong>2017</strong> - Lançamento do CD &quot;Uma História de Amor&quot; - Boleros em Espanhol.</li>
          <li><strong>2019</strong> - Lançamento do CD &quot;Circo dos Amores&quot; - Carnaval.</li>
          <li><strong>2022</strong> - Lançamento do disco &quot;Brilho Novo&quot;.</li>
          <li><strong>2022</strong> - Lançamento do DVD &quot;Caminhos Brilho Novo&quot; - YouTube.</li>
          <li><strong>2022</strong> - Lançamento de quatro clipes - Prêmio Serginho Barbosa Brilho Novo - YouTube.</li>
          <li><strong>2023</strong> - Lançamento do single &quot;Itabirito em seu Centenário&quot; em todas as plataformas digitais.</li>
          <li><strong>2024</strong> - Ator convidado no projeto As 10 Mais - DVD de Vander Lima.</li>
          <li><strong>2024</strong> - Figurante e ator no filme Banzo.</li>
          <li><strong>2025</strong> - Show Cênico - Voz Companheira 20 anos.</li>
          <li><strong>2025</strong> - Lançamento do single &quot;Por um Bolero&quot; em todas as plataformas digitais, feat. com o cantor Richard Saooco, da Venezuela.</li>
          <li><strong>2026</strong> - Lançamento de &quot;Show Cênico - Voz Companheira 20 anos&quot; em todas as plataformas digitais e no YouTube.</li>
        </ul>
        <figure className={styles.bioFigure}><EditorialPhoto name="bioFinal" /></figure>
        <p><span className={styles.bioLabel}><strong>Contatos:</strong></span><br />(31) 99378 9787<br />E-mail: <a href="mailto:barbosavozcompanheira@gmail.com">barbosavozcompanheira@gmail.com</a></p>
      </article>
    </section>
  );
}

export function CarnivalContent() {
  return (
    <section className={`sb-section ${styles.carnival}`}>
      <article className="sb-container">
        <h2 className={styles.articleTitle}>Carnaval é Aqui — Circo dos Amores</h2>
        <p><EditorialPhoto name="carnavalStage" /></p>
        <p>O projeto show, iniciou-se em 2006, quando selecionado na Mostra de Música de Itabirito/MG. O show resgata a música carnavalesca local, juntamente com os grandes sucessos populares do Carnaval Nacional. O projeto vem sendo realizado desde 2007 em várias cidades.</p>
        <p>Em 2019, completando 13 anos, o CD Carnaval é Aqui no circo dos Amores, torna-se realidade.</p>
        <ul>
          <li>O Disco traz 10 faixas.</li>
          <li>Sendo 03 Hinos dos Clubes que fizeram o carnaval do passado desde os anos 60 até ano 2000.</li>
          <li>03 Sambas Enredo das escolas de sambas que fizeram o carnaval de rua nos anos 80.</li>
          <li>01 Frevo - Frevo Mineiro com sua alegria e metais.</li>
          <li>03 Marchinhas que são cantadas nos shows - Carnaval é aqui.</li>
          <li>Os arranjos são assinados por Caio Glaco (hinos), Warley Henrique(Sambas) e Warley Machado (Frevo e Marchinhas). Os arranjos vêm numa linguagem moderna e comercial.</li>
        </ul>
        <p>O CD como ilustração iremos explorar o Circo, pois uma das Marchinhas tem o Nome Circo dos amores, onde ocorreu a inspiração do artista em seu figurino ser o Palhaço Cantor.</p>
        <p>Levar para o Circo com seus elementos circenses o Carnaval das marchinhas.</p>
        <iframe className={styles.spotify} src="https://open.spotify.com/embed/album/4brmUjtz7Y69OpUYIq82Pd?utm_source=generator" title="Carnaval é Aqui — Circo dos Amores no Spotify" width="100%" height="352" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
        <p><strong>OBJETIVO</strong></p>
        <p>O objetivo principal deste projeto é o resgate do Carnaval das marchinhas, hoje pouco executado.</p>
        <p>Tem como proposta, a integração dos jovens músicos na orquestra em conhecerem o verdadeiro Carnaval das Marchinhas, Frevos, Sambas e Marcha Rancho, e para que os foliões jovens, possam também conhecer o verdadeiro Carnaval, e aos que já conhecem, é uma forma de relembrar os velhos bailes carnavalescos. Carnaval Família.</p>
        <p><strong>REGISTRO HISTÓRICO</strong></p>
        <p>Este projeto, através da Lei Municipal de Incentivo a Cultura de Itabirito, desdobrou-se em 02 CD Singles:</p>
        <p>Serginho Barbosa canta os Hinos dos Clubes de Itabirito (2008). Compositor: (Tertuliano Silva, escrito em 1930, e Serginho Barbosa canta sambas (2009), sambas enredos que foram compostos para as escolas de sambas locais.</p>
        <p>Em 2019 será concluído o projeto tendo todas a faixas inclusas.</p>
        <p><EditorialPhoto name="carnavalBand" /><strong>EXECUÇÃO DO PROJETO</strong></p>
        <p>O projeto Show Baile é realizado no carnaval no formato Baile com direito a confetes e serpentinas ao som de orquestra com a seguinte formação:</p>
        <p>1 Cantor<br />1 Cantora<br />1 Maestro e arranjador<br />2 Trombonista<br />2 Trompetista<br />1 Saxofonista<br />1 Baixista<br />1 Baterista<br />1 Cavaquinista/Violonista/Guitarra<br />1 Percussionista<br />1 Produtor</p>
        <p><strong>SHOW BAILE</strong></p>
        <p>O Show Baile é divido em 04 partes:</p>
        <p>1º - Marchinhas<br />2º - Frevo<br />3º - Sambas<br />4º - Marcha rancho e marchinhas</p>
        <p>Realizado no Formato Palco, Salão e Trio Elétrico</p>
        <p><strong>Projeto:</strong> Serginho Barbosa</p>
        <p><strong>Arranjos:</strong> Wellington Damaso e Thiago Viana</p>
        <p><strong>Regência:</strong> Welligton Damaso e Jair Antônio Mingal.</p>
        <p><strong>Duração:</strong> Aproximadamente 01:40Horas.</p>
        <p><strong>EXPECTATIVAS</strong></p>
        <p>Fazer parte da Folia do carnaval das cidades, levando nossa, música, alegria e energia aos foliões.</p>
        <figure className={styles.carnavalFigure}><EditorialPhoto name="carnavalFinal" /></figure>
      </article>
    </section>
  );
}
