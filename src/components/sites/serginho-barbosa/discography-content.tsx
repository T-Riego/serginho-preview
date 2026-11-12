import Image from "next/image";
import type { ReactNode } from "react";
import type { DiscographyAlbum } from "./discography-data";
import { assetRoot } from "./site-content";
import styles from "./discography.module.css";

function SpotifyAlbum({ title, src, href }: { title: string; src: string; href: string }) {
  return (
    <div className={styles.spotify}>
      <iframe
        title={`Ouça ${title} no Spotify`}
        src={src}
        height={352}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
      <a href={href} target="_blank" rel="noreferrer">Abrir no Spotify</a>
    </div>
  );
}

export const discographyContent: Record<DiscographyAlbum["slug"], ReactNode> = {
  "voz-companheira": (
    <>
      <p className={styles.largeCopy}><strong>{"O CD Voz companheira, do cantor Serginho Barbosa, revela seu lado autoral"}</strong></p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"O cantor Serginho Barbosa lança, no primeiro semestre de 2014, o CD Voz companheira. É o quinto disco da carreira deste cantor e compositor nascido em Itabirito (MG), e traz a direção musical de Warley Machado."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"Voz companheira exibe o lado autoral de Serginho Barbosa. Ele optou por um estilo predominantemente pop, com arranjos que valorizam o seu estilo de cantar, com sonoridades mais agudas e de grande extensão vocal. As letras são mais poéticas e reflexivas, revelando a maturidade e a segurança adquiridas com a experiência artística de mais de 35 anos de carreira."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"O disco apresenta 12 faixas, sendo a maioria de autoria exclusiva de Serginho Barbosa (Voz companheira, em duas versões, Querer imaginário, Trajetória, Quem sou eu?, Amanhecer, Guerreiro Sonhador e Único Blue). O cantor divide a autoria de Muito mais, com Mário Overal. Completando o trabalho, Eu não tenho nada (Zé Claudio), Voo Livre (Ricardo Reis) e Para um mundo novo (Hamilton Mouse). "}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <SpotifyAlbum title="Voz Companheira" src="https://open.spotify.com/embed/album/1C8591vAjLaFjROjj7UCAB?utm_source=generator" href="https://open.spotify.com/album/1C8591vAjLaFjROjj7UCAB" />
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"Serginho Barbosa convidou um time de arranjadores e participações especiais para marcar o CD comemorativo. Dulu Luciano, Warley Machado e Nadilson Assunção dividem os arranjos e a parte instrumental em várias faixas. Vários convidados especiais complementam a ficha técnica. Entre eles, estão os cantores Soninha Gargíulo (que faz duo com Serginho Barbosa na faixa-título e assina o texto de apresentação) e Ubiraney Silva (vocais). Entre os músicos, participam do projeto Delano Macedo (guitarra) e Eder Izidoro (contrabaixo). O projeto foi gravado no estúdio WM Produções, com a técnica de Gleiston Machado. A programação visual é assinada por Rafael Bastos."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"O cantor prepara vários eventos para marcar o lançamento do disco, como shows, participações em eventos musicais e divulgação dos meios de comunicação. Voz companheira contou com o apoio cultural da Lei Municipal de Incentivo à Cultura de Itabirito."}</p>
      <p className={styles.credit}><Image src={`${assetRoot}/discography/voz-companheira-producoes.png`} alt="Voz Companheira Produções" width={262} height={79} unoptimized /></p>
      <div className={styles.copySpacer} aria-hidden="true" />
    </>
  ),
  "verde-rosa-branco-e-alegria": (
    <>
      <p><strong>{"Serginho Barbosa canta Sambas"}</strong><br /><br /><br />{"O projeto show, iniciou-se em 2006, quando selecionado na Mostra de Música de Itabirito/MG. O show resgata a música carnavalesca local, juntamente com os grandes sucessos populares do Carnaval Nacional. O projeto vem sendo realizado desde 2007 em várias cidades. Em 2008, inicia as gravações das músicas que embalaram o Carnaval Itabiritense. As Escolas de Samba é que abrilhantavam o Carnaval de Rua com seus Sambas, Enredos e muita Alegria. Lançamento do EP - \"Verde, Rosa, Branco e Alegria\", \"Serginho Barbosa canta Sambas\"."}</p>
      <p><br /><strong>{"São Eles:"}</strong></p>
      <ol><li>{"Escola de Samba Império da Saudade - Enredo \"Encantado Mundo Infantil\" - Autor: Gilberto Silva Pedrosa - Gilberto Turun"}</li><li>{"Escola de Samba Mocidade Mineira - Enredo \"Passarela da Ilusão\", autores: Fabiano Galo e Zizi Pimenta."}</li><li>{"Escola de Samba Arco Íris - Enredo \"Canto a Natureza\" ? Autor: Antônio Carlos Dias (Telefunken)."}</li></ol>
    </>
  ),
  "uma-historia-de-amor": (
    <>
      <p className={styles.largeCopy}><strong>{" CD, Boleros, Uma História de amor, interpretados pelo Cantor e compositor Serginho Barbosa, é um mergulho profundo na arte musical dos clássicos Internacional."}</strong></p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"O Cantor e Compositor Serginho Barbosa, lança em outubro de 2016 o CD, Boleros, Uma História de Amor. É o Sexto disco do cantor nascido em Itabirito (MG) e traz a direção musical de Nadilson Assunção e Soninha Gargiulo."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"O show de Lançamento do CD foi em Contagem, no Teatro Casa Azul do Centro Cultural de Contagem, foi dia 08 de outubro de 2016, às 20:00 Hs, com entrada franca e no Teatro Santo Agostinho em Belo Horizonte em 03 de setembro de 2017."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"As canções foram gravadas em seu idioma ? O Espanhol, mantendo sua originalidade sem descaracterizar as canções. As canções são de compositores Cubanos e Mexicanos tendo seus direitos autorais recolhidos através das editoras que detém as Obras."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"Os arranjos são de Nadilson Assunção, arranjos que valorizam as Obras que são clássicos internacionais. Os Músicos participantes são: No Sax Alto e Tenor ? Edson Morais, Trompete ? Wellington Damaso, Guitarras, Violões e Programações ? Nadilson Assunção, Vocal e Participação especial em Besame Mucho ? Soninha Gargiulo, Projeto Gráfico e ilustrações ? Diego Gurgel, Fotografia ? Mateus Machado. O projeto foi gravado no Studio Sonarte com a produção da Voz Companheira Produções."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"CD Traz 10 Faixas que são: Tres Palabras(Oswaldo Farres), Aquellos Ojos Verdes(Nilo Menendez, Adolfo Utréra e João de Barros), Perfídia ( Alberto Dominguez), Quizás, Quizás, Quizás (Oswaldo Farres), História de un Amor(Carlos Almaran), Usted ( Gabriel Ruiz, José A. Zorrillo), La Barca(Roberto Cantoral) Besame Mucho (Consuelo Torres), El Reloj(Roberto Cantoral), e Vereda Tropical(Gonzalo Curiel)."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <SpotifyAlbum title="Uma História de Amor" src="https://open.spotify.com/embed/album/3xRzts1bgEt1dTRgNC67ko?utm_source=generator" href="https://open.spotify.com/album/3xRzts1bgEt1dTRgNC67ko" />
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"O cantor prepara vários eventos para marcar o lançamento do disco, como shows, participações em eventos musicais e divulgação dos meios de comunicação. Boleros, Uma História de Amor, contou o apoio cultural do Studio Sonarte, Voz Companheira Produções e do Fundo Municipal de Incentivo à Cultura de Contagem."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"Bolero é um ritmo musical Cubano que mescla raízes espanholas e com influências locais de vários países hispano-americanos. Apesar de nascer em Cuba é bastante conhecido como a Canção Romântica Mexicana. Diante dessa riqueza musical, esse registro em CD traz no repertório releituras de compositores Cubanos e Mexicanos, clássicos da década de 30, em seu idioma ? o espanhol, mantendo sua originalidade, onde as letras contam as Histórias de Amor e o romantismo, onde o despertar maior é a Dança. Um convite para Dançar História de amor e se apaixonar com as realidades vividas pelos compositores"}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"O Projeto ? Bolero, Arte e Dança tem a responsabilidade de envolver os participantes em se manifestar de diversas formas o envolvimento com a dança. A Dança de Salão é socialmente como forma de entretenimento e integração social. As influências desse ritmo com nascimento em Cuba se espalhou pela Europa. A Espanha teve sua adesão juntamente com o México. Chegando ao Brasil na década de 60 formando um público fiel até invadir as academias de dança de salão até os dias de hoje, nos anos 60 o baile tornou-se mais presente de forma social e entretenimento."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.credit}><em><Image src={`${assetRoot}/discography/studio-sonarte.jpg`} alt="Studio Sonarte" width={131} height={75} unoptimized /></em></p>
      <p className={styles.credit}><em><Image src={`${assetRoot}/discography/voz-companheira-producoes.png`} alt="Voz Companheira Produções" width={208} height={63} unoptimized /></em></p>
    </>
  ),
  "trajetoria": (
    <>
      <p className={styles.largeCopy}><strong>{"PRIMEIRO ÁLBUM DO CANTOR E COMPOSITOR SERGINHO BARBOSA, REVELA SEU LADO COMPOSITOR E INTERPRETE, INTITULADO \"TRAJETÓRIA\". REVELOU SEU GRANDE SUCESSO: A MÚSICA \"BOLERO\"."}</strong></p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"Após a separação da Dupla com seu irmão, O cantor e compositor se concentrou na Produção do seu primeiro Álbum, Intitulado \"Trajetória\". O Álbum possui 14 faixas, onde o cantor assina 04 faixas, experimentando seu lado compositor, e as demais faixas são de compositores que fizeram parte de sua Trajetória. Com arranjos criados pelo próprio cantor, a música Asa Branca do compositor Luiz Gonzaga tem a mistura do Forró com elementos árabes, arranjos que não compromete a beleza da canção."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"Também de sua autoria, a Faixa música \"Desbravar\", em sua mensagem os arranjos remetem a dança Flamenca com toda a sua originalidade instrumental. Devido aos vários públicos seguidores do cantor, o álbum contempla vários estilos, tais como MPB, Bolero, Forró, Música Country, Sertaneja e canção Romântica. O CD foi gravado, mixado e masterizado no Studio RR em Belo horizonte. Os arranjos são de Romário Rodrigues."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <SpotifyAlbum title="Trajetória" src="https://open.spotify.com/embed/album/1W3pFTCb8rLW8ehsfZrNnD?utm_source=generator" href="https://open.spotify.com/album/1W3pFTCb8rLW8ehsfZrNnD" />
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"Os compositores que fazem parte desse álbum são: Dupla Adeir e Ademar, Matheus Abreu, Pirulito da Villa, Marco Aurélio, Rapha Vieira, Zé Claudio, Fabiano Galo e Serginho Barbosa. A Canção \"Bolero\" foi o carro chefe do Álbum, e se tornou um grande sucesso do cantor, sendo executado em todos os seus shows e que deu a característica desse projeto e do cantor."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"Este álbum, lançado em 2005, conferiu ao Cantor e Compositor, o Título de \"Talento Itabiritense\" em seção solene na Câmara Municipal de Itabirito ? MG, sua terra Natal, além do Troféu o Grito de Cantor Revelação e Medalha de Honra ao Mérito por incentivar a dança, oferecida pelo Clube da Terceira Idade, \"CLUMI\"."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
    </>
  ),
  "coletanea": (
    <>
      <p>{"Lançado em 2010, "}<strong>{"o álbum comemorativo foi criado para marcar e celebrar o quinto aniversário da trajetória discográfica do cantor."}</strong>{" Esta coletânea especial reúne meticulosamente todas as"}<strong>{" obras e faixas que ele produziu e lançou ao longo desses cinco anos"}</strong>{", servindo não apenas como um resumo da sua carreira até aquele momento, mas também como"}<strong>{" um presente para os fãs"}</strong>{" que o acompanharam desde o início."}<br /><br /><strong>{"É um verdadeiro acervo musical que destaca o talento e a evolução do artista durante esse período."}</strong></p>
    </>
  ),
  "circo-dos-amores": (
    <>
      <p className={styles.largeCopy}><strong>{"O cantor Serginho Barbosa mergulha na tradição musical carnavalesca de Itabirito em novo CD"}</strong></p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"Em 2006, selecionado pela Mostra de Música de Itabirito, o cantor Serginho Barbosa teve a ideia de reunir, em um show, diversas fases da música carnavalesca da sua cidade natal, localizada a aproximadamente 55 km de Belo Horizonte. Ao longo do século XX, diversos compositores locais se dedicaram a criar marchas, sambas-enredo, frevos, ritmos afro-brasileiros e até hinos, que embalaram os clubes tradicionais, as escolas de samba, os blocos caricatos e os salões de baile."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"Mais de uma década depois, nasce o CD "}<strong>{"Circo dos Amores"}</strong>{", que o cantor mineiro registrando 10 destas canções. Seis delas, fizeram parte de dois singles lançados em 2008 e 2009. No primeiro, Serginho gravou, em versões novas e arranjos assinados por Caio Gracco, os hinos dos clubes Itabirense, União e Usina Esperança, todas compostas pelo talentoso Tertuliano Silva, uma espécie de Lamartine Babo local. As canções eram hits dos carnavais locais, além de embalarem as vitórias das suas equipes esportivas. Em 2009, foi a vez da gravação de três sambas-enredo das escolas de samba itabiritenses: Arco-Íris, Império da Saudade e Mocidade Mineira. As escolas não desfilam mais, mas ficou o legado das alas de compositores. Os arranjos são do cavaquinista Warley Henrique. Os dois singles foram produzidos por Thelmo Lins."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <SpotifyAlbum title="Circo dos Amores" src="https://open.spotify.com/embed/album/4brmUjtz7Y69OpUYIq82Pd?utm_source=generator" href="https://open.spotify.com/album/4brmUjtz7Y69OpUYIq82Pd" />
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"Para completar o disco"}<strong>{" Circo dos Amores"}</strong>{", as quatro faixas restantes foram gravadas em 2018. Circo dos Amores (Zizi Pimenta), Frevo Mineiro (Antônio Carlos Dias ? Telefunken), Pedido a São Pedro (Raimunda Salvador) e Triste Carnaval (Francisco Silva) foram compostas em décadas diferentes. Os dois primeiros autores ainda estão atuantes; Raimunda Salvador e Francisco Silva já são falecidos. Esta parte teve a direção musical de Warley Machado. Completam o time, músicos renomados na cena contemporânea mineira como Rogério Delayon, Bill Lucas, Robson Batata, Leonardo Barreto, Geraldo Magela, Wellington Damaso, dentre outros. O trabalho tem a direção executiva do próprio Serginho Barbosa."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"A unidade do trabalho é o respeito à história musical de Minas Gerais, que por vezes deixa muitos artistas relegados ao esquecimento, principalmente aqueles que surgiram numa época em que fazer o registro fonográfico era difícil e extremamente dispendioso. Com essas versões, pelo menos este time de autores ganha um sopro de revitalização e pode ser conhecido pelas novas gerações."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.credit}><Image src={`${assetRoot}/discography/voz-companheira-producoes.webp`} alt="Voz Companheira Produções" width={225} height={68} unoptimized /></p>
      <div className={styles.copySpacer} aria-hidden="true" />
    </>
  ),
  "branco-verde-vermelho-e-preto": (
    <>
      <p><strong>{"Serginho Barbosa canta os Hinos dos Clubes de Itabirito."}</strong></p>
      <p><br />{"O projeto show, iniciou-se em 2006, quando selecionado na Mostra de Música de Itabirito/MG. O show resgata a música carnavalesca local, juntamente com os grandes sucessos populares do Carnaval Nacional. O projeto vem sendo realizado desde 2007 em várias cidades. Em 2007, inicia as gravações das músicas que embalaram o Carnaval Itabiritense. Os Clubes foram os realizadores dos Carnavais de Bailes e Desfiles. Como parte do Projeto, em 2007, lançamento do EP ? \"Branco, Verde, Vermelho e Preto\" ? \"Serginho Barbosa Canta os Hinos dos Clubes de Itabirito\". São eles: Hino do Esperança Futebol Clube, Hino do Itabirense Esporte Clube e do União Sport Clube, compostos na Década de 30, por Tertuliano Silva."}</p>
    </>
  ),
  "brilho-novo": (
    <>
      <blockquote><p className={styles.largeCopy}>{"Quando começares a seguir um caminho, que ele seja o certo, o correto. Quando voltares do caminho percorrido, que não deu certo, que foi incerto! Espero que você reflita, espero que você se mova, para concertar, para perdoar e começar um caminho novamente, nova mente\""}<br /><strong>{"Serginho Barbosa"}</strong></p></blockquote>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"O disco intitulado \"brilho novo\" surge de reflexões durante a pandemia e brinda os mais de 35 anos de carreira do cantor e compositor Serginho Barbosa. \"Queria durante a pandemia tentar fazer algo de novo, fazer algo de brilho novo, algo de novo brilho. O que era o novo? Era a mudança que poderia acontecer neste período de todos nós dentro de casa\", explica Serginho."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"Warley Machado assina a direção musical do disco, que teve diversos compositores, além de músicas de autoria de Serginho Barbosa. \"O disco é uma mistura de estilos latinos, toda a dança, toda a musicalidade, toda a reflexão, através das canções autorais. Algo que pudesse ser um divisor de água na vida das pessoas, que pudesse mexer com as pessoas, com a sua imaginação, mexer com a sua alegria. É um reencantamento da vida, em que a música se manifesta no corpo, quer com a perna, quer com o braço, quer com a cabeça, quer com o corpo por inteiro, mas que o corpo que vai escolher a dança\", explica Serginho."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <SpotifyAlbum title="Brilho Novo" src="https://open.spotify.com/embed/album/0TvjFBf3eP1juK1zfY5BR8?utm_source=generator" href="https://open.spotify.com/album/0TvjFBf3eP1juK1zfY5BR8" />
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"Serginho comenta que finalizando os shows do seu disco \"circo dos amores\" no carnaval de 2020 veio a pandemia. \"A felicidade foi tão grande com festejos, os trabalhos, além dos ensaios aberto, que começou na quarta-feira que antecede o carnaval e se encerrou na terça. Portanto, uma média de seis shows durante o carnaval. Então, a ideia seria de continuar com o teatro, produzindo um musical. Então que surgiu a pandemia. Para a classe artística, o que fazer? Fomos os primeiros a parar. Fecharam-se os teatros e pararam os shows. Os estúdios fechados, os produtores não tiveram como trabalhar. Nós artistas não temos lugar pra cantar. Então, vê que surge uma frustração de uma certa forma do que realmente a música poderia representar na vida das pessoas, na vida do dos músicos\", explica."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
      <p className={styles.largeCopy}>{"Durante o período em casa, sem possibilidade de apresentação artística, Serginho conversou com Warley Machado, que foi o diretor musical de dois discos do Serginho: \"voz companheira\" e \"circo dos amores\". \"Ele é de muita capacidade intelectual com relação à arte de sensibilidade, um multi-instrumentista também parado, de braços cruzados."}</p>
      <div className={styles.copySpacer} aria-hidden="true" />
    </>
  ),
};
