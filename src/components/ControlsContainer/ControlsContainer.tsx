import { Fragment } from "react";
import * as Tabs from "@/components/Tabs";

export type TabItemInfo<T extends string> = {
  /** Defaults to true if not provided */
  display?: boolean;

  value: T;
  labelText: string;
  content: React.ReactNode;
};

export type TabContentInfo<T extends string> = {
  value: T;
  content: React.ReactNode;
};

type Props<T extends string> = {
  value: T;
  onValueChange: (newValue: T) => void;
  ariaLabel: string;
  tabInfo: TabItemInfo<T>[];
  tabContent: TabContentInfo<T>[];
};

export default function ControlsContainer<T extends string>({
  value,
  onValueChange,
  ariaLabel,
  tabInfo,
  tabContent,
}: Props<T>) {
  const toTabsTrigger = (infoItem: TabItemInfo<T>, index: number) => {
    const { value, labelText, content, display = true } = infoItem;

    return (
      <Fragment key={index}>
        {display && (
          <Tabs.Trigger<T> value={value}>
            <div className="bg-teal-900 text-white">{content}</div>
          </Tabs.Trigger>
        )}
      </Fragment>
    );
  };

  const toTabsContent = (info: TabContentInfo<T>, index: number) => {
    const { value, content } = info;

    return (
      <Tabs.Content<T> key={index} value={value} className="bg-teal-600 p-4">
        {content}
      </Tabs.Content>
    );
  };

  return (
    <Tabs.Root<T> value={value} onValueChange={onValueChange}>
      <Tabs.List<T> className="leading-none" aria-label={ariaLabel}>
        {tabInfo.map(toTabsTrigger)}
      </Tabs.List>

      <div className="border-t-2 border-teal-900">
        {tabContent.map(toTabsContent)}
      </div>
    </Tabs.Root>
  );
}
