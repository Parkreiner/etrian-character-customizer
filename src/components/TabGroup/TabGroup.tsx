/**
 * @todo Add Radix's tab components to make this even more accessible.
 */
import { cva } from "class-variance-authority";

const liStyles = cva("flex-grow border-b-2 p-2 font-bold", {
  variants: {
    selected: {
      true: "bg-teal-800 text-white rounded-t-md border-teal-800",
      false:
        "border-teal-800 text-teal-900 hover:bg-teal-800 hover:text-white hover:rounded-t-md",
    },
  },
});

type Props<OptionValue extends string = string> = {
  options: readonly OptionValue[];
  selected: OptionValue;
  onTabChange: (tabOption: OptionValue) => void;
};

export default function TabGroup<Opt extends string = string>({
  options,
  selected,
  onTabChange,
}: Props<Opt>) {
  return (
    <nav>
      <ul className="flex w-full flex-row flex-nowrap">
        {options.map((option, index) => (
          <li
            key={index}
            className={liStyles({ selected: option === selected })}
          >
            <button
              className="w-full uppercase tracking-wide"
              onClick={() => onTabChange(option)}
            >
              {option.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
