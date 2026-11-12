import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { VideosSection } from "./media-sections";

it("opens the selected video and restores focus after Escape", async () => {
  const user = userEvent.setup();
  render(<VideosSection />);

  const trigger = screen.getByRole("button", {
    name: "Assistir vídeo: CIRCO DOS AMORES",
  });
  expect(screen.queryByTitle("CIRCO DOS AMORES")).not.toBeInTheDocument();
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
  expect(screen.queryByTitle("CIRCO DOS AMORES")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

it("scrolls the featured thumbnails automatically, loops, and can be paused", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("IntersectionObserver", class {
    constructor(private readonly callback: IntersectionObserverCallback) {}

    observe() {
      this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
    }

    disconnect() {}
  });

  const { unmount } = render(<VideosSection />);
  try {
    const track = screen.getByRole("group", { name: "Miniaturas de vídeos" });
    const scrollTo = vi.fn(({ left }: ScrollToOptions) => {
      track.scrollLeft = left ?? 0;
    });
    Object.defineProperties(track, {
      clientWidth: { value: 600 },
      scrollWidth: { value: 1000 },
      scrollTo: { value: scrollTo },
    });
    Object.defineProperty(track.children[1], "offsetLeft", { value: 200 });

    await act(() => vi.advanceTimersByTimeAsync(5000));
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 200 });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Pausar rolagem dos vídeos" }));
    await act(() => vi.advanceTimersByTimeAsync(5000));
    expect(scrollTo).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Retomar rolagem dos vídeos" }));
    await act(() => vi.advanceTimersByTimeAsync(10000));
    expect(scrollTo.mock.calls).toEqual([[{ left: 200 }], [{ left: 400 }], [{ left: 0 }]]);
  } finally {
    unmount();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  }
});
