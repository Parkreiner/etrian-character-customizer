import { cva } from "class-variance-authority";

type Props = React.ComponentPropsWithoutRef<"button"> & {
  primaryHex: string;
  onClick: () => void;

  children?: string | React.ReactNode;
  secondaryHex?: string;
  selected?: boolean;
};

const divStyles = cva("rounded-lg border-2 w-fit", {
  variants: {
    selected: {
      true: "border-teal-200",
      false: "border-teal-900",
    },
  },
});

export default function ColorButton({
  primaryHex,
  secondaryHex,
  children,
  selected = false,
  ...delegated
}: Props) {
  return (
    <div className={divStyles({ selected })}>
      <button
        className="relative h-10 min-w-[80px] basis-[80px] overflow-y-hidden rounded-md border-2 border-black"
        style={{ backgroundColor: primaryHex }}
        {...delegated}
      >
        {secondaryHex && (
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
      </button>
    </div>
  );
}
