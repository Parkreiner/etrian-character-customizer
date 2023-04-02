import { useId } from "react";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cva } from "class-variance-authority";

type Props = {
  selected: boolean;
  displayNumber: number;
  labelText: string;
  onClick: () => void;
};

const buttonStyles = cva(
  "h-full w-full rounded-md text-center font-bold bg-teal-700 text-teal-50 text-sm",
  {
    variants: {
      selected: {
        true: "cursor-not-allowed bg-teal-200 text-teal-800",
        false: "text-teal-100 hover:bg-teal-200 hover:text-teal-800",
      },
    },
  }
);

export default function CharacterButton({
  selected,
  displayNumber,
  labelText,
  onClick,
}: Props) {
  const hookId = useId();
  const labelId = `${hookId}-label`;

  return (
    <>
      <VisuallyHidden>
        <span id={labelId}>{labelText}</span>
      </VisuallyHidden>

      <button
        type="button"
        className={buttonStyles({ selected })}
        onClick={onClick}
        disabled={selected}
        aria-labelledby={labelId}
      >
        {displayNumber}
      </button>
    </>
  );
}
