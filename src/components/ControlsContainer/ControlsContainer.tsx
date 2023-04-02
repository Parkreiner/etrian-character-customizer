import { Fragment } from "react";
import TooltipTemplate from "@/components/TooltipTemplate";
import * as Tabs from "@/components/Tabs";
import { cva } from "class-variance-authority";

/**
 * Information for rendering the tabs themselves in the ControlsContainer.
 *
 * Each time you add a TabInfo object, you must also add a corresponding
 * TabContentInfo object, where both objects share the same value for their
 * "value" key.
 */
export type TabInfo<T extends string> = {
  /** Defaults to true if not provided */
  display?: boolean;

  value: T;
  labelText: string;
  content: React.ReactNode | string;
};

/**
 * Information for rendering the content associated with each tab.
 *
 * Each time you add a TabContentInfo object, you must also add a corresponding
 * TabInfo object, where both objects share the same value for their "value"
 * key.
 */
export type TabContentInfo<T extends string> = {
  value: T;
  content: React.ReactNode | null;
};

type Props<T extends string> = {
  selectedValue: T;
  onValueChange: (newValue: T) => void;
  ariaLabel: string;
  tabInfo: readonly TabInfo<T>[];
  tabContent: readonly TabContentInfo<T>[];
};

const tabStyles = cva("font-bold p-4 pb-3 rounded-t-md", {
  variants: {
    selected: {
      true: "bg-teal-900 text-white",
      false: "hover:bg-teal-900 hover:text-white",
    },
  },
});

export default function ControlsContainer<T extends string>({
  selectedValue,
  onValueChange,
  ariaLabel,
  tabInfo,
  tabContent,
}: Props<T>) {
  const toTabsTrigger = (infoItem: TabInfo<T>, index: number) => {
    const { value, labelText, content, display = true } = infoItem;
    const styles = tabStyles({ selected: value === selectedValue });

    const fillContent =
      typeof content === "string" ? (
        <div className="min-h-[24px]">{content}</div>
      ) : (
        content
      );

    return (
      <Fragment key={index}>
        {display && (
          <Tabs.Trigger<T> value={value}>
            <TooltipTemplate labelText={labelText}>
              <div className={styles}>{fillContent}</div>
            </TooltipTemplate>
          </Tabs.Trigger>
        )}
      </Fragment>
    );
  };

  return (
    <Tabs.Root<T>
      value={selectedValue}
      onValueChange={onValueChange}
      className="min-w-[400px]"
    >
      <Tabs.List<T>
        className="flex gap-x-1 leading-none"
        aria-label={ariaLabel}
      >
        {tabInfo.map(toTabsTrigger)}
      </Tabs.List>

      <div className="mt-[-2px] border-t-[3px] border-teal-900 bg-teal-600 p-4 pb-6">
        {tabContent.map((infoItem, index) => (
          <Tabs.Content<T> key={index} value={infoItem.value}>
            {infoItem.content}
          </Tabs.Content>
        ))}
      </div>
    </Tabs.Root>
  );
}
