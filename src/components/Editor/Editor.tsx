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

      <main className="h-full w-full">
        {editorController.initialized && (
          <div className="flex h-full w-full flex-grow flex-row items-center justify-between gap-x-10">
            <CharacterMenus
              selectedCharacterId={editorController.editor.selectedId}
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
      </main>
    </div>
  );
}
