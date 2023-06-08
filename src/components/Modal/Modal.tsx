import { PropsWithChildren } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import useModalBackground from "./useModalBackground";

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
 */
function CoreContent({ children, modalTitle, modalDescription }: CoreProps) {
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
        <CoreContent {...delegated} />
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type SubheaderProps = {
  children: string;
};

Modal.Subheader = function ModalSubheader({ children }: SubheaderProps) {
  return <h3>{children}</h3>;
};

type ParagraphProps = PropsWithChildren<{
  italicized?: boolean;
}>;

Modal.Paragraph = function ModalParagraph({
  children,
  italicized = false,
}: ParagraphProps) {
  return <p className={`${italicized ? "italic" : ""}`}>{children}</p>;
};

type ListProps = PropsWithChildren<{
  ordered?: boolean;
}>;

Modal.List = function ModalNumberedList({
  children,
  ordered = false,
}: ListProps) {
  const ListTag = ordered ? "ol" : "ul";
  return <ListTag>{children}</ListTag>;
};

Modal.ListItem = function ModalListItem({ children }: PropsWithChildren) {
  return <li>{children}</li>;
};

type LinkProps = {
  href: string;
  children: string;
};

Modal.Link = function ModalLink({ href, children }: LinkProps) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};

export default Modal;
