/**
 * @file Defines core modal component functionality, and handles imports for
 * all other sub-components.
 *
 * Originally had them all in one file, but the dot syntax for Modal was
 * causing hot-module reloading to break. The syntax is still here, but because
 * the source components are each in their own module, things shouldn't break.
 */
import { PropsWithChildren, forwardRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import useModalBackground from "./useModalBackground";
import ModalLink from "./ModalLink";
import ModalListItem from "./ModalListItem";
import ModalList from "./ModalList";
import ModalParagraph from "./ModalParagraph";
import ModalSubsection from "./ModalSubsection";

type ModalProps = PropsWithChildren<{
  buttonText: string;
  modalTitle: string;
  modalDescription: string;
}>;

type CoreProps = Omit<ModalProps, "buttonText">;

/**
 * Have to split the content up as a separate component, because the mounting
 * hooks need to run fresh every single time Radix conditionally renders this
 * to the portal.
 *
 * Can't put the effect in the parent, because Radix will default to not
 * rendering the content when it mounts. Because of that, there won't be any DOM
 * nodes that the refs will be attached to at first, so the effects will have no
 * values to read from.
 *
 * ---
 *
 * 2023-06-09: Had to turn this component into a forwarded-ref version because
 * it looks like Radix expects you to pass Dialog.Title and Dialog.Paragraph as
 * direct children of Dialog.Content. It looks like Dialog.Content passes a ref
 * to every single child it receives, and without this being a forward-ref
 * component, you keep getting errors in the console.
 *
 * Had to wire up the Radix ref manually because I couldn't find a good way to
 * restructure the HTML without losing all the necessary containers for my
 * needlessly fancy styling
 */
const CoreContent = forwardRef(function CoreContent(
  { children, modalTitle, modalDescription }: CoreProps,
  radixRef?: React.ForwardedRef<HTMLHeadingElement | HTMLParagraphElement>
) {
  const { contentRef, topBgRef, bottomBgRef } = useModalBackground();

  return (
    <div className="fixed left-0 top-0 flex h-full w-full flex-col items-center justify-center text-teal-50">
      <div ref={bottomBgRef} className="fixed z-10 bg-teal-200" />
      <div ref={topBgRef} className="fixed z-10 bg-teal-950" />

      <article
        ref={contentRef}
        className="z-20 h-full w-full max-w-prose overflow-y-auto bg-teal-950 p-10 pb-2 shadow-md"
      >
        {/*
         * Container makes sures that the close button goes from being fixed to
         * part of the content container (without covering up any text) when
         * the window gets small enough
         */}
        <div className="relative mb-6 flex flex-row gap-x-3 border-b-2 pb-3 lg:static">
          <section className="flex-grow">
            <Dialog.Title
              className="mb-0.5 text-4xl font-extralight italic leading-snug text-teal-100 opacity-[85%]"
              ref={radixRef}
            >
              {modalTitle}
            </Dialog.Title>

            <Dialog.Description
              className="border-teal-200 italic text-teal-100"
              ref={radixRef}
            >
              {modalDescription}
            </Dialog.Description>
          </section>

          <Dialog.Close asChild>
            <button
              className="block flex-shrink-0 self-start rounded-full border-2 border-teal-100 bg-teal-900 stroke-teal-100 p-4 outline outline-4 outline-teal-900 transition-colors duration-150 hover:bg-teal-800 hover:outline-teal-800 lg:absolute lg:right-12 lg:top-10"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
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
        </div>

        <section className="overflow-y-auto">{children}</section>
      </article>
    </div>
  );
});

function Modal({ buttonText, ...delegated }: ModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="w-24 rounded-full border-[1px] border-teal-900/70 px-4 py-1 text-sm font-medium text-teal-950 transition-colors hover:bg-teal-200">
          {buttonText}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed left-0 top-0 h-full w-full backdrop-blur-md" />
        <Dialog.Content>
          <CoreContent {...delegated} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Really wanted to have these function components all in the same file,
// because none of them are that big, but when I did that, I broke Vite's hot-
// module reloading for the dev environment. I don't think it would ever cause a
// problem in production, but better to be safe than sorry
Modal.Subsection = ModalSubsection;
Modal.Paragraph = ModalParagraph;
Modal.List = ModalList;
Modal.ListItem = ModalListItem;
Modal.Link = ModalLink;

export default Modal;
