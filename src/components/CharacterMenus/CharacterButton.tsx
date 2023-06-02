import { PropsWithChildren } from "react";
import { cva } from "class-variance-authority";

type Props = PropsWithChildren<{
  selected: boolean;
  onClick: () => void;
}>;

const buttonStyles = cva(
  "h-full w-full rounded-md text-center font-bold text-teal-50 text-sm",
  {
    variants: {
      selected: {
        true: "cursor-not-allowed bg-teal-200 text-teal-800",
        false:
          "bg-teal-700 text-teal-100 hover:bg-teal-200 hover:text-teal-800",
      },
    },
  }
);

export default function CharacterButton({
  selected,
  onClick,
  children,
}: Props) {
  return (
    <button
      type="button"
      className={buttonStyles({ selected })}
      onClick={onClick}
      disabled={selected}
    >
      {children}
    </button>
  );
}
