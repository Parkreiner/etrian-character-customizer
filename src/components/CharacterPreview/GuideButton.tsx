import { PropsWithChildren, useLayoutEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";

type Props = PropsWithChildren<{
  buttonText: string;
  modalTitle: string;
  modalDescription: string;
}>;

function useModalBackground() {
  const contentRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (content === null) return;

    const syncBgWithContent: ResizeObserverCallback = (observedEntries) => {
      const content = contentRef.current;
      const background = backgroundRef.current;
      if (content === null || background === null) return;

      const sizeInfo = observedEntries[0]?.borderBoxSize[0];
      if (sizeInfo === undefined) return;

      const containerWidth = sizeInfo.inlineSize;
      const viewportWidth = window.innerWidth;
      const height = window.innerHeight;

      const heightSq = height ** 2;
      const bgWidth = Math.round(Math.sqrt(containerWidth ** 2 + heightSq));
      const bgHeight = Math.round(Math.sqrt(viewportWidth ** 2 + heightSq));

      // Need to figure out actual formula
      const bgRotation = -35;

      background.style.width = `${bgWidth}px`;
      background.style.height = `${bgHeight}px`;
      background.style.transform = `rotate(${bgRotation}deg)`;
    };

    const observer = new ResizeObserver(syncBgWithContent);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return { contentRef, backgroundRef } as const;
}

/**
 * Have to split the content up as a separate component, because the mounting
 * hooks need to run fresh every single time Radix conditionally renders this
 * to the portal.
 *
 * The effect hook only ever runs once on mount, but if it were called in the
 * parent, it would be called for HTML elements that the parent wouldn't be
 * rendering yet. And so, there would be no ref values for the effect to read
 */
function CoreContent({
  children,
  modalTitle,
  modalDescription,
}: Omit<Props, "buttonText">) {
  const { contentRef, backgroundRef } = useModalBackground();

  return (
    <div className="fixed left-0 top-0 flex h-full w-full flex-col items-center justify-center text-teal-50">
      <div ref={backgroundRef} className="fixed z-10 bg-teal-950" />

      <Dialog.Content
        ref={contentRef}
        className="z-20 h-full w-full max-w-prose overflow-y-auto bg-teal-950 p-10 shadow-md"
      >
        <Dialog.Title className="mb-1 text-4xl font-extralight italic opacity-80">
          {modalTitle}
        </Dialog.Title>

        <Dialog.Description className="mb-4 pb-1 italic opacity-80">
          {modalDescription}
        </Dialog.Description>

        <div className="overflow-y-auto">{children}</div>

        <Dialog.Close asChild>
          <button
            className="absolute right-12 top-10 block rounded-full border-2 border-teal-100 bg-teal-900 p-4 outline outline-4 outline-teal-900"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="rgb(204 251 241)"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </div>
  );
}

export default function GuideButton({ buttonText, ...delegated }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="w-24 rounded-full border-[1px] border-teal-900/70 px-4 py-1 text-sm font-medium text-teal-950 transition-colors hover:bg-teal-200">
          {buttonText}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed left-0 top-0 h-full w-full backdrop-blur-md" />
        <CoreContent {...delegated} />
      </Dialog.Portal>
    </Dialog.Root>
  );
}
