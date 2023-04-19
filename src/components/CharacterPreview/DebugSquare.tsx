import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  color: string;
}>;

export default function DebugSquare({ color, children }: Props) {
  return (
    <div
      className="flex min-h-[100px] flex-grow basis-[100px] items-center justify-center rounded-md border-2 border-black"
      style={{ backgroundColor: color }}
    >
      <div className="rounded-md bg-black px-2 py-1 text-sm font-semibold text-white">
        {children}
      </div>
    </div>
  );
}
