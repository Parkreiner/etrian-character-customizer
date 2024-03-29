import { useState } from "react";
import useEditorController from "./useEditorController";
import useInitialViewStatus from "./useInitialViewStatus";

import CharacterPreview from "@/components/CharacterPreview";
import LoadingIndicator from "@/components/LoadingIndicator";
import CharacterMenus from "@/components/CharacterMenus";
import ColorMenus from "@/components/ColorMenus";

export default function Editor() {
  const [introAnimationFinished, setIntroAnimationFinished] = useState(false);
  const editorController = useEditorController();
  const initialViewReady = useInitialViewStatus(
    editorController.initialized,
    editorController.derived?.selectedCharacter.imgUrl ?? null
  );

  return (
    <div className="h-full">
      {!introAnimationFinished && (
        <LoadingIndicator
          appLoaded={initialViewReady}
          onAnimationCompletion={() => setIntroAnimationFinished(true)}
        />
      )}

      <main className="flex h-full w-full flex-col flex-nowrap px-8">
        {editorController.initialized && (
          <div className="mx-auto mb-6 flex h-full w-full max-w-[1700px] flex-grow flex-row items-center justify-between gap-x-8">
            <CharacterMenus
              selectedCharacter={editorController.derived.selectedCharacter}
              characters={editorController.server.characters}
              classOrderings={editorController.server.classOrderings}
              onCharacterChange={editorController.editor.changeCharacter}
              randomizeCharacter={editorController.editor.selectRandomCharacter}
            />

            <CharacterPreview
              character={editorController.derived.selectedCharacter}
              colors={editorController.editor.colors}
            />

            <ColorMenus
              characterKey={editorController.editor.selectedId}
              colors={editorController.editor.colors}
              onColorChange={editorController.editor.replaceColors}
              onColorsReset={editorController.editor.resetColorsToDefault}
            />
          </div>
        )}

        <p className="-mx-8 bg-yellow-100 px-4 py-2 text-center text-sm font-medium text-yellow-900">
          Work in progress.{" "}
          <a
            className="underline"
            href="https://github.com/Parkreiner/etrian-character-customizer"
            target="_blank"
            rel="noreferrer"
          >
            Check the GitHub page
          </a>{" "}
          for updates.
        </p>
      </main>
    </div>
  );
}
