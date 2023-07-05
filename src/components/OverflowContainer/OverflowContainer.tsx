import { PropsWithChildren, forwardRef } from "react";
import styles from "./scrollbar.module.css";

function OverflowContainer({ children }: PropsWithChildren) {
  return (
    <div className="flex h-full w-[430px] shrink-0 flex-col flex-nowrap">
      {children}
    </div>
  );
}

export function OverflowContainerHeader({ children }: PropsWithChildren) {
  return (
    <div className="flex h-[70px] w-full shrink-0 flex-col flex-nowrap justify-center">
      {children}
    </div>
  );
}

export const OverflowContainerFlexContent = forwardRef(
  function OverflowContainerFlexContent(
    { children }: PropsWithChildren,
    ref?: React.ForwardedRef<HTMLDivElement>
  ) {
    /*
     * 2023-06-09 - This is a really weird trick to avoid a strange CSS bug
     * specific to Chrome. (Firefox did not have this issue.)
     *
     * You would hope that the relative/absolute positioning, along with the
     * overflows, wouldn't be necessary, but alas.
     *
     * Basically, Chrome would freak out whenever you would try to have
     * overflow on a container with interactive elements (like the buttons).
     * The content would be *visually* clipped wherever it should be, but
     * Chrome would still act as if though it were taking up space in the
     * layout and would cause weird element stretching.
     *
     * The weird thing is, it would behave normally as long as you were only
     * hiding non-interactive elements (like plain text).
     *
     * The most surefire way to fix this was by removing the container from
     * the flow altogether.
     */
    return (
      <div ref={ref} className="relative flex-grow rounded-lg bg-teal-600">
        <div className="absolute h-full w-full overflow-y-hidden p-3">
          <div className={`${styles.scrollbar} h-full overflow-y-scroll pr-3`}>
            {children}
          </div>
        </div>
      </div>
    );
  }
);

type FooterButtonProps = {
  children: string;
  onClick: () => void;
};

export function OverflowContainerFooterButton({
  children,
  onClick,
}: FooterButtonProps) {
  return (
    <div className="w-full pb-1 pt-1.5">
      <button
        className="mx-auto block w-fit text-sm font-medium text-teal-900 underline underline-offset-2 hover:no-underline"
        onClick={onClick}
      >
        <span className="outline-4 outline-red-400">{children}</span>
      </button>
    </div>
  );
}

OverflowContainer.Root = OverflowContainer;
OverflowContainer.Header = OverflowContainerHeader;
OverflowContainer.FlexContent = OverflowContainerFlexContent;
OverflowContainer.FooterButton = OverflowContainerFooterButton;
export default OverflowContainer;
