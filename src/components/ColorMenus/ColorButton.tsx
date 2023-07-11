import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import classNames from "classnames";

type Props = React.ComponentPropsWithoutRef<"button"> & {
  primaryHex: string;
  onClick: () => void;

  // Main reason for making this allow React nodes is to support <abbr> elements
  children?: string | React.ReactNode;
  secondaryHex?: string;
  selected?: boolean;
  type?: React.ButtonHTMLAttributes<"type">;
};

const outlineStyles = cva(
  "w-fit rounded-lg border-2 transition-colors duration-150 hover:border-teal-300/60",
  {
    variants: {
      selected: {
        true: "border-teal-200 hover:border-teal-200/100",
        false: "border-teal-900",
      } as const satisfies Record<`${boolean}`, string>,
    },
  }
);

const ColorButton = forwardRef(function ColorButton(
  {
    primaryHex,
    secondaryHex,
    children,
    className,
    selected = false,
    type = "button",
    ...delegated
  }: Props,
  ref?: React.ForwardedRef<HTMLButtonElement>
) {
  return (
    <div className={outlineStyles({ selected })}>
      <button
        ref={ref}
        type={type}
        style={{ backgroundColor: primaryHex }}
        className={classNames(
          "relative h-10 min-w-[80px] basis-[80px] overflow-y-hidden rounded-md border-2 border-black",
          className
        )}
        {...delegated}
      >
        {secondaryHex !== undefined && (
          <div
            className="absolute right-0 top-0 h-full w-[50%]"
            style={{ backgroundColor: secondaryHex }}
          />
        )}

        {children !== undefined && (
          <div className="absolute bottom-[-1px] right-0 max-w-fit rounded-tl-md bg-black pl-2 pr-1.5 pt-0.5 text-xs font-medium uppercase text-white">
            {children}
          </div>
        )}

        <VisuallyHidden.Root>
          {secondaryHex === undefined
            ? `Click to get color ${primaryHex}`
            : `Click to get colors ${primaryHex} with ${secondaryHex}`}
        </VisuallyHidden.Root>
      </button>
    </div>
  );
});

export default ColorButton;
