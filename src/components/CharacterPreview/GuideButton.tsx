import { PropsWithChildren } from "react";
import * as Dialog from "@radix-ui/react-dialog";

type Props = PropsWithChildren<{
  buttonText: string;
  modalTitle: string;
  modalDescription: string;
}>;

export default function GuideButton({
  children,
  buttonText,
  modalTitle,
  modalDescription,
}: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="w-24 rounded-full border-[1px] border-teal-900/70 px-4 py-1 text-sm font-medium text-teal-950 transition-colors hover:bg-teal-200">
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
