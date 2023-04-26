import { PropsWithChildren } from "react";
import classNames from "classnames";

type GapSize = "small" | "medium";

type Props = PropsWithChildren<{
  title: string;
  striped?: boolean;
  gapSize?: GapSize;
}>;

export default function Card({
  title,
  children,
  striped = false,
  gapSize = "medium",
}: Props) {
  return (
    <section
      className={classNames(
        "flex flex-col rounded-md bg-teal-900 p-4",
        gapSize === "medium" ? "pb-6" : ""
      )}
    >
      <div
        className={classNames(
          "flex flex-row items-center gap-x-2",
          gapSize === "medium" ? "mb-3" : "mb-2"
        )}
      >
        <h2 className="h-fit text-xs font-semibold uppercase tracking-wider text-teal-50">
          {title}
        </h2>
        {striped && <div className="h-0.5 flex-grow bg-teal-50 opacity-80" />}
      </div>

      <div className="grow">{children}</div>
    </section>
  );
}
