import { SkinColorOption } from "../../typesConstants/colors";
import VisuallyHidden from "../VisuallyHidden";

type Props = {
  color: SkinColorOption;
  active: boolean;
  labelText: string;
  labelStyle: "tooltip" | "inline";
  onClick: () => void;
};

export default function ColorBubble({
  color,
  active,
  labelText,
  labelStyle,
  onClick,
}: Props) {
  const [color1, color2] = color;
  const rgbString1 = `rgb(${color1.red}, ${color1.green}, ${color1.blue})`;
  const rgbString2 = `rgb(${color2.red}, ${color2.green}, ${color2.blue})`;
  const borderStyle = active ? "border-yellow-400" : "border-teal-800";

  return (
    <button onClick={onClick}>
      <div>
        {labelStyle === "inline" ? (
          labelText
        ) : (
          <VisuallyHidden>{labelText}</VisuallyHidden>
        )}
      </div>

      {/* Start of bubble */}
      <div>
        <div
          className={`relative h-16 w-16 overflow-hidden rounded-full border-4 ${borderStyle}`}
          style={{ backgroundColor: rgbString1 }}
        >
          <div
            className="absolute right-[-1.95rem] bottom-0 h-8 w-24 rotate-[-45deg]"
            style={{ backgroundColor: rgbString2 }}
          ></div>
        </div>
      </div>
    </button>
  );
}
