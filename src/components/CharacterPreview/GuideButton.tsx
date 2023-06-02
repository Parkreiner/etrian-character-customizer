import { PropsWithChildren } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";

type TextJustification = "left" | "center" | "right";

type Props = PropsWithChildren<{
  buttonText: string;
  buttonTextJustify?: TextJustification;
  modalTitle: string;
  modalDescription: string;
}>;

const dialogButtonStyles = cva(
  "w-24 text-lg font-medium underline underline-offset-2",
  {
    variants: {
      buttonTextJustify: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      } satisfies Record<TextJustification, string>,
    },
  }
);

export default function GuideButton({
  children,
  buttonText,
  modalTitle,
  modalDescription,
  buttonTextJustify = "center",
}: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className={dialogButtonStyles({ buttonTextJustify })}>
          {buttonText}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed left-0 top-0 h-full w-full backdrop-blur-sm" />

        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
          <Dialog.Content className="relative min-h-[400px] w-full max-w-prose rounded-md bg-white p-10 shadow-md">
            <Dialog.Title className="text-2xl font-bold">
              {modalTitle}
            </Dialog.Title>

            <Dialog.Description className="mb-4 border-b-2 border-black pb-1 italic opacity-80">
              {modalDescription}
            </Dialog.Description>

            <div>{children}</div>

            <Dialog.Close
              className="absolute right-10 top-10"
              type="button"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Dialog.Close>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
