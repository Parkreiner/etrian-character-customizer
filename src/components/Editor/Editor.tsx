import { useState } from "react";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";
import useEditor from "./useEditor";

import CharacterPreview from "@/components/CharacterPreview";
import LoadingIndicator from "@/components/LoadingIndicator";
import CharacterMenus from "@/components/CharacterMenus";
import ColorMenus from "@/components/ColorMenus";

export default function Editor() {
  const [introAnimationFinished, setIntroAnimationFinished] = useState(false);
  const editorController = useEditor();
  const characterId = editorController.selectedCharacter?.id ?? "";

  return (
    <div className="relative h-full">
      <VisuallyHidden>
        <h1>Etrian Odyssey Character Customizer</h1>
      </VisuallyHidden>

      {!introAnimationFinished && (
        <LoadingIndicator
          appLoaded={editorController.initialized}
          onAnimationCompletion={() => setIntroAnimationFinished(true)}
        />
      )}

      {editorController.initialized && (
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-center">
          <div className="flex max-h-[800px] flex-row items-center justify-center gap-x-10">
            <CharacterMenus
              selectedCharacterId={characterId}
              groupedCharacters={editorController.groupedCharacters}
              onCharacterChange={editorController.stateUpdaters.changeCharacter}
              randomizeCharacter={
                editorController.stateUpdaters.selectRandomCharacter
              }
            />

            <CharacterPreview
              selectedCharacter={editorController.selectedCharacter}
              colors={editorController.colors}
            />

            <ColorMenus
              characterKey={characterId}
              colors={editorController.colors}
              onColorChange={editorController.stateUpdaters.replaceColors}
            />
          </div>
        </div>
      )}
    </div>
  );
}
