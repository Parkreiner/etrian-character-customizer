import { PropsWithChildren } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "@/components/Button";

type Props = PropsWithChildren<{
  buttonText: string;
  modalTitle: string;
  modalDescription: string;
}>;

export default function EditorModalButton({
  children,
  buttonText,
  modalTitle,
  modalDescription,
}: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button intent="secondary" size="medium">
          {buttonText}
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed top-0 left-0 h-full w-full backdrop-blur-sm" />

        <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center">
          <Dialog.Content className="relative min-h-[400px] w-full max-w-prose rounded-md bg-white p-10 shadow-md">
            <Dialog.Title className="text-2xl font-bold">
              {modalTitle}
            </Dialog.Title>

            <Dialog.Description className="mb-4 border-b-2 border-black pb-1 italic opacity-80">
              {modalDescription}
            </Dialog.Description>

            <div>{children}</div>

            <Dialog.Close className="absolute right-10 top-10">
              <button type="button" aria-label="Close modal">
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
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
