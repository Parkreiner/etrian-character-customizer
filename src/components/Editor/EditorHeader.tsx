import EditorModalButton from "./EditorModalButton";

export default function EditorHeader() {
  return (
    <header className="border-b-2 border-teal-900 py-4">
      <div className="mx-auto flex w-full max-w-[1400px] flex-row gap-x-10 align-baseline">
        <h1 className="mr-auto cursor-default text-2xl">
          Etrian Character Editor
        </h1>

        <EditorModalButton
          buttonText="Help"
          modalTitle="Help"
          modalDescription="How to use this application"
        >
          Baba-booey Baba-booey
        </EditorModalButton>

        <EditorModalButton
          buttonText="Credits"
          modalTitle="Credits"
          modalDescription="Credits and colophon"
        >
          Baba-booey Baba-booey
        </EditorModalButton>
      </div>
    </header>
  );
}
