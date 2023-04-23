type Props = React.ComponentPropsWithoutRef<"button"> & {
  children: string | React.ReactNode;
  primaryHex: string;
  onClick: () => void;

  selected?: boolean;
  secondaryHex?: string;
};

export default function ColorButton({
  primaryHex,
  secondaryHex,
  children,
  ...delegated
}: Props) {
  return (
    <button
      className="relative h-10 basis-[80px] overflow-y-hidden rounded-md border-2 border-black"
      style={{ backgroundColor: primaryHex }}
      {...delegated}
    >
      {secondaryHex && (
        <div
          className="absolute right-0 top-0 h-full w-[50%]"
          style={{ backgroundColor: secondaryHex }}
        />
      )}

      <div className="absolute bottom-[-1px] right-0 max-w-fit rounded-tl-md bg-black pl-2 pr-1.5 pt-0.5 text-xs font-medium uppercase text-white">
        {children}
      </div>
    </button>
  );
}
