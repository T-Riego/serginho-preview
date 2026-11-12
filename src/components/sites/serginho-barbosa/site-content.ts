export const officialSite = "https://www.serginhobarbosa.com.br";
export const assetRoot = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/sites/serginho-barbosa`;
export const spotify = "https://open.spotify.com/intl-pt/artist/6S9S2gRYbH7vGCA57CJgjw";
export const telephone = "tel:+5531993789787";
export const contactEmail = "contato@serginhobarbosa.com.br";
export const whatsapp = "https://api.whatsapp.com/send?phone=5531993789787&text=Ol%C3%A1%21+Vim+do+site+e+gostaria+de+mais+informa%C3%A7%C3%B5es";

const discographies = [
  ["Brilho Novo", "brilho-novo/10/c"],
  ["Carnaval", "carnaval/4/c"],
  ["Boleros", "boleros/5/c"],
  ["MPB", "mpb/6/c"],
  ["Estilos Variados", "estilos-variados/9/c"],
  ["Samba Enredo", "samba-enredo/7/c"],
  ["Hinos", "hinos/8/c"],
];

const galleries = [
  ["Banda Circo dos Amores - Carnaval", "banda-circo-dos-amores-carnaval/12"],
  ["Semi Final Concurso Marchinhas Mestre Jonas 2019", "semi-final-concurso-marchinhas-mestre-jonas-2019/11"],
  ["Bloquinho ESMUKids - Contagem", "bloquinho-esmukids-contagem/10"],
  ["Lançamento CD Circo dos Amores 2019", "lancamento-cd-circo-dos-amores-2019/5"],
  ["Ensaio Fotográfico - Palhaço dos Amores.", "ensaio-fotografico-palhaco-dos-amores/7"],
  ["Carnaval", "carnaval/4"],
  ["Circuito VDL - Lançamento Voz Companheira", "circuito-vdl-lancamento-voz-companheira/9"],
  ["Julifest 2018", "julifest-2018/8"],
];

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Biografia", href: "/biografia" },
  { label: "Carnaval", href: "/carnaval" },
  { label: "Discografias", href: "/discografias", children: discographies },
  { label: "Vídeos", href: "/videos" },
  { label: "Galeria de Fotos", href: "/galeria-de-fotos", children: galleries },
  { label: "Contatos", href: "/contatos" },
];

export function currentNavigation(pathname: string | null, href: string) {
  const current = pathname?.replace(/\/$/, "") || pathname;
  if (current === href) return "page";
  if (href !== "/" && current?.startsWith(`${href}/`)) return "location";
}

export const albums = [
  { title: "Branco, Verde, Vermelho e Preto", image: "album-hinos.webp", path: "branco-verde-vermelho-e-preto/9" },
  { title: "Brilho Novo", image: "album-brilho-novo.png", path: "brilho-novo/11" },
  { title: "Circo dos Amores", image: "album-circo.webp", path: "circo-dos-amores/4" },
  { title: "Coletânea", image: "album-coletanea.webp", path: "coletanea/7" },
];
