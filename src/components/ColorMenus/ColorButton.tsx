import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import classNames from "classnames";
import { forwardRef } from "react";

type Props = React.ComponentPropsWithoutRef<"button"> & {
  primaryHex: string;
  onClick: () => void;

  children?: string | React.ReactNode;
  secondaryHex?: string;
  selected?: boolean;
};

const ColorButton = forwardRef(function ColorButton(
  { primaryHex, secondaryHex, children, selected = false, ...delegated }: Props,
  ref?: React.ForwardedRef<HTMLButtonElement>
) {
  return (
    <div
      className={classNames(
        "w-fit rounded-lg border-2",
        selected ? "border-teal-200" : "border-teal-900"
      )}
    >
      <button
        ref={ref}
        className="relative h-10 min-w-[80px] basis-[80px] overflow-y-hidden rounded-md border-2 border-black"
        style={{ backgroundColor: primaryHex }}
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
          Click to get color{secondaryHex === undefined ? "" : "s"} {primaryHex}{" "}
          {secondaryHex === undefined ? "" : `with ${secondaryHex}`}
        </VisuallyHidden.Root>
      </button>
    </div>
  );
});

export default ColorButton;
