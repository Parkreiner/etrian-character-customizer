type Props<OptionValue extends string = string> = {
  options: readonly OptionValue[];
  activeOption: OptionValue;
  onTabChange: (tabOption: OptionValue) => void;
};

export default function TabGroup<Opt extends string = string>({
  options,
  activeOption,
  onTabChange,
}: Props<Opt>) {
  return (
    <nav>
      <ul className="flex w-full flex-row flex-nowrap">
        {options.map((option, index) => (
          <li
            key={index}
            className={`flex-grow border-b-2 p-2 font-bold  ${
              option === activeOption
                ? "bg-teal-800 text-white"
                : "border-teal-800 text-teal-900 hover:bg-teal-800"
            }`}
          >
            <button
              className="w-full uppercase tracking-wide"
              onClick={() => onTabChange(option)}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
