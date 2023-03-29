/**
 * @todo Figure out how to get the component working with Suspense.
 */
import * as Tooltip from "@radix-ui/react-tooltip";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import useAppState from "./useAppState";
import CharacterPreview from "@/components/CharacterPreview";
import LoadingIndicator from "@/components/LoadingIndicator";
import PortraitMenus from "@/components/CharacterMenus";
import ColorMenus from "@/components/ColorMenus";
import ErrorBoundary from "@/components/ErrorBoundary";

type MainProps = Omit<
  ReturnType<typeof useAppState> & { initialized: true },
  "initialized"
>;

function MainContent({
  colors,
  groupedCharacters,
  stateUpdaters,
  selectedCharacter,
}: MainProps) {
  return (
    <div className="mx-auto flex h-full max-w-[1400px] items-center justify-center">
      <div className="flex max-h-[800px] flex-row items-center justify-center gap-x-10">
        <PortraitMenus
          groupedCharacters={groupedCharacters}
          selectedCharacter={selectedCharacter}
          onCharacterChange={stateUpdaters.changeCharacter}
        />

        <CharacterPreview
          selectedCharacter={selectedCharacter}
          colors={colors}
        />

        <ColorMenus
          colors={colors}
          selectedCharacter={selectedCharacter}
          changeCharacterColors={stateUpdaters.replaceColors}
        />
      </div>
    </div>
  );
}

export default function App() {
  const appState = useAppState();

  return (
    <div className="h-full w-full">
      <ErrorBoundary>
        <Tooltip.Provider delayDuration={500}>
          <VisuallyHidden.Root>
            <h1>Etrian Character Customizer</h1>
          </VisuallyHidden.Root>

          {appState.initialized ? (
            <MainContent
              colors={appState.colors}
              groupedCharacters={appState.groupedCharacters}
              selectedCharacter={appState.selectedCharacter}
              stateUpdaters={appState.stateUpdaters}
            />
          ) : (
            <LoadingIndicator />
          )}
        </Tooltip.Provider>
      </ErrorBoundary>
    </div>
  );
}
