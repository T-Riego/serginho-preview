import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { VideosSection } from "./media-sections";

it("opens the selected video and restores focus after Escape", async () => {
  const user = userEvent.setup();
  render(<VideosSection />);

  const trigger = screen.getByRole("button", {
    name: "Assistir vídeo: CIRCO DOS AMORES",
  });
  await user.click(trigger);

  expect(screen.getByRole("dialog", { name: "CIRCO DOS AMORES" })).toBeVisible();
  expect(screen.getByTitle("CIRCO DOS AMORES")).toHaveAttribute(
    "src",
    "https://www.youtube.com/embed/EM-mMv1MDEk",
  );
  expect(screen.getByRole("link", { name: "Assistir no YouTube" })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=EM-mMv1MDEk",
  );

  await user.keyboard("{Escape}");

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
