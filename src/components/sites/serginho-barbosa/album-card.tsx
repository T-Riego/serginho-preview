import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AlbumCard({ title, href, cover, heading: Heading = "h3" }: {
  title: string;
  href: string;
  cover: string;
  heading?: "h2" | "h3";
}) {
  return (
    <Link className="sb-album" href={href}>
      <div className="sb-album-image">
        <Image src={cover} alt="" fill sizes="(max-width: 650px) 45vw, (max-width: 1150px) 25vw, 290px" />
      </div>
      <div className="sb-album-text">
        <Heading>{title}</Heading>
        <span className="sb-album-arrow"><ArrowUpRight size={17} aria-hidden="true" /></span>
        <span className="sr-only">Mais detalhes</span>
      </div>
    </Link>
  );
}
