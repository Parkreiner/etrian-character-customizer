import { Fragment } from "react";
import TooltipTemplate from "@/components/TooltipTemplate";
import * as Tabs from "@/components/Tabs";

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
  value: T;
  onValueChange: (newValue: T) => void;
  ariaLabel: string;
  tabInfo: readonly TabInfo<T>[];
  tabContent: readonly TabContentInfo<T>[];
};

export default function ControlsContainer<T extends string>({
  value,
  onValueChange,
  ariaLabel,
  tabInfo,
  tabContent,
}: Props<T>) {
  const toTabsTrigger = (infoItem: TabInfo<T>, index: number) => {
    const { value, labelText, content, display = true } = infoItem;

    return (
      <Fragment key={index}>
        {display && (
          <Tabs.Trigger<T> value={value}>
            <TooltipTemplate labelText={labelText}>
              <div className="bg-teal-900 text-white">{content}</div>
            </TooltipTemplate>
          </Tabs.Trigger>
        )}
      </Fragment>
    );
  };

  return (
    <Tabs.Root<T> value={value} onValueChange={onValueChange}>
      <Tabs.List<T> className="leading-none" aria-label={ariaLabel}>
        {tabInfo.map(toTabsTrigger)}
      </Tabs.List>

      <div className="border-t-2 border-teal-900">
        {tabContent.map((infoItem, index) => (
          <Tabs.Content<T>
            key={index}
            value={infoItem.value}
            className="bg-teal-600 p-4"
          >
            {infoItem.content}
          </Tabs.Content>
        ))}
      </div>
    </Tabs.Root>
  );
}
