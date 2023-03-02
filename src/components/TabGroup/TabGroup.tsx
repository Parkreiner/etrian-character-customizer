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
        {options.map((option, index) => {
          const activeClasses =
            option === activeOption
              ? "bg-teal-800"
              : "hover:bg-teal-800 border-teal-800";

          return (
            <li
              key={index}
              className={`flex-grow border-b-2 p-2 font-bold text-white ${activeClasses}`}
            >
              <button
                className="w-full uppercase tracking-wide"
                onClick={() => onTabChange(option)}
              >
                {option}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
