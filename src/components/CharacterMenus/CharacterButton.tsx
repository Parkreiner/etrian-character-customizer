import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useId } from "react";

type CharacterButtonProps = {
  selected: boolean;
  displayNumber: number;
  labelText: string;
  onClick: () => void;
};

export default function CharacterButton({
  selected,
  displayNumber,
  labelText,
  onClick,
}: CharacterButtonProps) {
  const hookId = useId();
  const labelId = `${hookId}-label`;

  return (
    <>
      <VisuallyHidden>
        <span id={labelId}>{labelText}</span>
      </VisuallyHidden>

      <button
        type="button"
        onClick={onClick}
        disabled={selected}
        aria-labelledby={labelId}
      >
        {displayNumber}
      </button>
    </>
  );
}
