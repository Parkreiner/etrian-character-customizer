import { SkinColorOption } from "../../typesConstants/colors";
import ColorBubble from "../ColorButton";

type Props = {
  defaultColor: SkinColorOption;
  activeColor: SkinColorOption;
  colorOptions: readonly SkinColorOption[];
  onColorChange: (color: SkinColorOption) => void;
};

export default function HairPicker({
  defaultColor,
  activeColor,
  colorOptions,
  onColorChange,
}: Props) {
  return (
    <section className="p-6 pb-12">
      <section>
        <ColorBubble
          color={defaultColor}
          active={defaultColor === activeColor}
          labelText="Default:"
          labelStyle="inline"
          onClick={() => onColorChange(defaultColor)}
        />
      </section>

      <section className="mt-8 border-t-4 border-teal-700 pt-2">
        <h3 className="text-center text-xl font-semibold text-white">
          Color Presets
        </h3>

        <ul className="mt-4 flex flex-wrap gap-y-4">
          {colorOptions.map((option, index) => (
            <li key={index} className="flex basis-1/4 justify-center">
              <ColorBubble
                color={option}
                active={option === activeColor}
                labelText={`Select hair color ${index + 1}`}
                labelStyle="tooltip"
                onClick={() => onColorChange(option)}
              />
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
