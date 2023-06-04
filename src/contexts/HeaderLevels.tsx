import { createContext, useContext, PropsWithChildren } from "react";

type HeaderLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeaderTag = `h${HeaderLevel}`;

const HeaderLevelContext = createContext<HeaderLevel | null>(null);

export function useCurrentHeader(): HeaderTag {
  const currentLevel = useContext(HeaderLevelContext);
  if (currentLevel === null) {
    throw new Error(
      "No header context provided via a parent component. Please add HeaderContext to your app."
    );
  }

  return `h${currentLevel}`;
}

export default function HeaderProvider({ children }: PropsWithChildren) {
  const prevLevel = useContext(HeaderLevelContext);
  const newLevel = Math.min(6, (prevLevel ?? 0) + 1) as HeaderLevel;

  return (
    <HeaderLevelContext.Provider value={newLevel}>
      {children}
    </HeaderLevelContext.Provider>
  );
}
