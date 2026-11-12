import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { GalleryAlbum } from "./gallery-album";

const photos = [
  { src: "full/first.webp", thumbnail: "thumbs/first.webp", caption: "Banda", width: 800, height: 533 },
  { src: "full/second.webp", thumbnail: "thumbs/second.webp", caption: "Apoiadores", width: 800, height: 533 },
  { src: "full/third.webp", thumbnail: "thumbs/third.webp", width: 800, height: 533 },
];

it("navega pelo álbum com teclado e miniaturas e devolve o foco ao fechar", async () => {
  const user = userEvent.setup();
  render(<GalleryAlbum title="Circo dos Amores" photos={photos} />);

  const trigger = screen.getByRole("button", { name: "Abrir foto 1: Banda" });
  await user.click(trigger);

  const dialog = within(screen.getByRole("dialog", { name: "Circo dos Amores" }));
  expect(dialog.getByRole("img", { name: "Banda" })).toBeVisible();
  expect(dialog.getByRole("button", { name: "Foto anterior" })).toBeDisabled();

  await user.keyboard("{ArrowRight}");
  expect(dialog.getByRole("img", { name: "Apoiadores" })).toBeVisible();

  await user.click(dialog.getByRole("button", { name: "Selecionar foto 3" }));
  expect(dialog.getByRole("img", { name: "Foto 3" })).toBeVisible();
  expect(dialog.getByRole("button", { name: "Próxima foto" })).toBeDisabled();

  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
