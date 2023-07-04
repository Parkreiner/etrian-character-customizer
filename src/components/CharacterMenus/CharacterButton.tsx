import { ComponentPropsWithoutRef, forwardRef } from "react";
import { cva } from "class-variance-authority";

type ButtonProps = ComponentPropsWithoutRef<"button">;
type Props = Omit<ButtonProps, "type" | "className" | "tabIndex"> & {
  type?: ButtonProps["type"];
  selected: boolean;
};

const buttonStyles = cva(
  "h-full w-full rounded-md text-center font-bold text-teal-50 text-sm transition-colors duration-150 ease-in-out",
  {
    variants: {
      selected: {
        true: "cursor-default bg-teal-200 text-teal-800",
        false:
          "bg-teal-700 text-teal-100 hover:bg-teal-200 hover:text-teal-800",
      } as const satisfies Record<`${boolean}`, string>,
    },
  }
);

const CharacterButton = forwardRef(function CharacterButton(
  { selected, type = "button", ...delegated }: Props,
  ref?: React.ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonStyles({ selected })}
      tabIndex={selected ? 0 : -1}
      {...delegated}
    />
  );
});

export default CharacterButton;
