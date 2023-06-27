import { PropsWithChildren } from "react";
import styles from "./scrollbar.module.css";

type ContentProps = PropsWithChildren<{
  inputGroup?: boolean;
}>;

function OverflowContainer({ children }: PropsWithChildren) {
  return (
    <section className="flex h-full w-[430px] shrink-0 flex-col flex-nowrap bg-teal-600 pb-1.5">
      {children}
    </section>
  );
}

export function OverflowContainerHeader({ children }: PropsWithChildren) {
  return <div className="h-[50px] shrink-0 bg-teal-600">{children}</div>;
}

export function OverflowContainerContent({
  children,
  inputGroup,
}: ContentProps) {
  const MainContainerElement = inputGroup ? "fieldset" : "div";

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
    <MainContainerElement className="relative flex-grow">
      <div className="absolute h-full w-full overflow-y-hidden pb-0.5 pl-6 pr-4 pt-5">
        <div className={`${styles.scrollbar} h-full overflow-y-scroll pr-4`}>
          {children}
        </div>
      </div>
    </MainContainerElement>
  );
}

OverflowContainer.Root = OverflowContainer;
OverflowContainer.Header = OverflowContainerHeader;
OverflowContainer.FlexContent = OverflowContainerContent;
export default OverflowContainer;
