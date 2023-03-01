import { ComponentProps, useEffect, useState } from "react";

const hiddenStyles = {
  display: "inline-block",
  position: "absolute",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  height: 1,
  width: 1,
  margin: -1,
  padding: 0,
  border: 0,
} as const;

type Props = ComponentProps<"span">;

export default function VisuallyHidden({ children, ...delegated }: Props) {
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        setForceShow(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        setForceShow(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return forceShow ? (
    <>children</>
  ) : (
    <span style={hiddenStyles} {...delegated}>
      {children}
    </span>
  );
}
