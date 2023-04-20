import { useState } from "react";
import useEditorController from "./useEditorController";

import CharacterPreview from "@/components/CharacterPreview";
import LoadingIndicator from "@/components/LoadingIndicator";
import CharacterMenus from "@/components/CharacterMenus";
import ColorMenus from "@/components/ColorMenus";
import EditorHeader from "./EditorHeader";

export default function Editor() {
  const editorController = useEditorController();
  const [introAnimationFinished, setIntroAnimationFinished] = useState(false);

  return (
    <div className="h-full">
      {!introAnimationFinished && (
        <LoadingIndicator
          appLoaded={editorController.initialized}
          onAnimationCompletion={() => setIntroAnimationFinished(true)}
        />
      )}

      {editorController.initialized && (
        <div className="flex h-full w-full flex-col gap-y-6">
          <EditorHeader />

          <div className="mx-auto flex w-full max-w-[1400px] flex-grow items-center justify-center">
            <div className="flex max-h-[800px] flex-row items-center justify-center gap-x-10">
              <CharacterMenus
                selectedCharacterId={editorController.editor.selectedId}
                groupedCharacters={editorController.characters.groupedByGame}
                onCharacterChange={editorController.editor.changeCharacter}
                randomizeCharacter={
                  editorController.editor.selectRandomCharacter
                }
              />

              <CharacterPreview
                selectedCharacterId={editorController.editor.selectedId}
                characters={editorController.characters.list}
                colors={editorController.editor.colors}
              />

              <ColorMenus
                characterKey={editorController.editor.selectedId}
                colors={editorController.editor.colors}
                onColorChange={editorController.editor.replaceColors}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
