import { ColorOption } from "../../typesConstants/colors";
import ColorBubble from "../ColorButton";

type Props = {
  defaultColor: ColorOption;
  activeColor: ColorOption;
  colorOptions: ColorOption[];
  setColor: (color: ColorOption) => void;
};

export default function HairPicker({
  defaultColor,
  activeColor,
  colorOptions,
  setColor,
}: Props) {
  return (
    <section>
      <section>
        <ColorBubble
          color={defaultColor}
          active={defaultColor === activeColor}
          labelText="Default: "
          labelVisible={true}
          onClick={() => setColor(defaultColor)}
        />
      </section>

      <section>
        {colorOptions.map((option, index) => (
          <ColorBubble
            key={index}
            color={option}
            active={option === activeColor}
            labelText={`Select hair color ${index + 1}`}
            labelVisible={false}
            onClick={() => setColor(option)}
          />
        ))}
      </section>
    </section>
  );
}
