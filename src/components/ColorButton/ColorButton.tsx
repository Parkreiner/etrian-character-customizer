import { Children, PropsWithChildren, ReactNode, useId } from "react";
import { ColorOption } from "../../typesConstants/colors";
import VisuallyHidden from "../VisuallyHidden";

type Props = {
  color: ColorOption;
  active: boolean;
  labelText: string;
  onClick: () => void;

  /** Value defaults to false. */
  labelVisible?: boolean;
};

export default function ColorBubble({
  color,
  active,
  labelText,
  onClick,
  labelVisible = false,
}: Props) {
  const [color1, color2] = color;

  return (
    <button onClick={onClick}>
      <div>
        {labelVisible ? (
          labelText
        ) : (
          <VisuallyHidden>{labelText}</VisuallyHidden>
        )}
      </div>

      <div>Actual bubble goes here</div>
    </button>
  );
}
