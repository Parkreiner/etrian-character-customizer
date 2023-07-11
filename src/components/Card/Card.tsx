import { PropsWithChildren } from "react";
import classNames from "classnames";
import HeaderProvider, { useCurrentHeader } from "@/contexts/HeaderLevels";

type GapSize = "small" | "medium";

type Props = PropsWithChildren<{
  title: string;
  striped?: boolean;
  gapSize?: GapSize;

  /**
   * Makes it easier to implement full-bleed layouts for elements that need them
   */
  disableContentPaddingX?: boolean;
}>;

export default function Card({
  title,
  children,
  striped = false,
  disableContentPaddingX = false,
  gapSize = "medium",
}: Props) {
  const HeaderTag = useCurrentHeader();

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
        <HeaderTag className="h-fit text-xs font-semibold uppercase tracking-wider text-teal-50">
          {title}
        </HeaderTag>
        {striped && <div className="h-0.5 flex-grow bg-teal-50 opacity-80" />}
      </div>

      <HeaderProvider>
        <div className={classNames("grow", disableContentPaddingX && "-mx-4")}>
          {children}
        </div>
      </HeaderProvider>
    </section>
  );
}
