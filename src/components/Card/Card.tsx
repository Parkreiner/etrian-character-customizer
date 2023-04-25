import { cva } from "class-variance-authority";
import { PropsWithChildren } from "react";

type GapSize = "small" | "medium";

type Props = PropsWithChildren<{
  title: string;
  striped?: boolean;
  gapSize?: GapSize;
}>;

const containerStyles = cva("flex flex-col rounded-md bg-teal-900 p-4", {
  variants: {
    gapSize: {
      medium: "pb-6",
      small: "",
    } satisfies Record<GapSize, string>,
  },
});

const headerStyles = cva("flex flex-row items-center gap-x-2", {
  variants: {
    gapSize: {
      medium: "mb-3",
      small: "mb-2",
    } satisfies Record<GapSize, string>,
  },
});

export default function Card({
  title,
  children,
  striped = false,
  gapSize = "medium",
}: Props) {
  return (
    <section className={containerStyles({ gapSize })}>
      <div className={headerStyles({ gapSize })}>
        <h2 className="h-fit text-xs font-semibold uppercase tracking-wider text-teal-50">
          {title}
        </h2>
        {striped && <div className="h-0.5 flex-grow bg-teal-50 opacity-80" />}
      </div>

      <div className="grow">{children}</div>
    </section>
  );
}
