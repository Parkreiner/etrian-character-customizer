import { Fragment } from "react";
import TooltipTemplate from "@/components/TooltipTemplate";
import * as Tabs from "@/components/Tabs";

/**
 * Information for rendering the tabs themselves in the ControlsContainer. Each
 * TabInfo object must have a corresponding TabContentInfo object, where they
 * both share a "value" key with the same value.
 */
export type TabInfo<T extends string> = {
  /** Defaults to true if not provided */
  display?: boolean;

  value: T;
  labelText: string;
  content: React.ReactNode;
};

/**
 * Information for rendering the content associated with each tab. Each
 * TabContentInfo object must have a corresponding TabInfo object, where they
 * both share a "value" key with the same value.
 */
export type TabContentInfo<T extends string> = {
  value: T;
  content: React.ReactNode;
};

type Props<T extends string> = {
  value: T;
  onValueChange: (newValue: T) => void;
  ariaLabel: string;
  tabInfo: TabInfo<T>[];
  tabContent: TabContentInfo<T>[];
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
