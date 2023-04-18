import { ComponentPropsWithRef } from "react";
import { cva } from "class-variance-authority";

// No need for "danger" intent; the client can't do destructive actions
type ButtonIntent = "primary" | "secondary";
type ButtonSize = "small" | "medium" | "large";
type OmittedBaseProps = "className" | "children";

type Props = Omit<ComponentPropsWithRef<"button">, OmittedBaseProps> & {
  children: string | number | React.ReactFragment;
  onClick: () => void;
  intent: ButtonIntent;
  size?: ButtonSize;
};

const buttonStyles = cva("flex flex-row", {
  variants: {
    intent: {
      primary:
        "text-white bg-teal-900 hover:bg-teal-700 px-7 py-3 rounded-full shadow-md transition-colors",
      secondary: "text-black hover:underline",
    } satisfies Record<ButtonIntent, string>,

    size: {
      small: "gap-x-1 text-xs font-medium opacity-90",
      medium: "gap-x-1.5 text-lg font-base",
      large: "gap-x-3 text-xl font-medium",
    } satisfies Record<ButtonSize, string>,
  },
});

/** Defaults to medium size if size is not specified. */
export default function Button({
  intent,
  children,
  type = "button",
  size = "medium",
  ...delegated
}: Props) {
  return (
    <button
      className={buttonStyles({ intent, size })}
      type={type}
      {...delegated}
    >
      <span>{children}</span>
    </button>
  );
}
