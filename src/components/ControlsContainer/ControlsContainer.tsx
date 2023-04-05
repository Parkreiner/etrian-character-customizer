import { Fragment } from "react";
import * as Tabs from "@/components/Tabs";
import { cva } from "class-variance-authority";

/**
 * An object describing one "tab" in the ControlsContainer component.
 *
 * A "tab" in this case refers to both the "button" you click to switch the
 * component to a different view, as well as the content associated with that
 * view.
 */
export type TabInfo<T extends string> = {
  /** Defaults to true if not specified */
  visible?: boolean;

  value: T;
  tabText: string;
  tabView: React.ReactNode | null;
  tabIcon?: React.ReactNode;
  accessibleTabLabel?: string;
};

export type TabInfoArray<T extends string> = readonly TabInfo<T>[];

const tabTriggerStyles = cva(
  "font-bold p-4 pb-3 rounded-md min-h-[50px] flex items-center gap-x-1.5",
  {
    variants: {
      selected: {
        true: "bg-teal-900 text-white",
        false: "text-teal-900 hover:bg-teal-900 hover:text-white",
      },
    },
  }
);

type Props<T extends string> = {
  tabs: TabInfoArray<T>;
  selectedTabValue: T;
  onTabChange: (newTabValue: T) => void;
  tabGroupLabel: string;
};

export default function ControlsContainer<T extends string>({
  tabs,
  selectedTabValue,
  onTabChange,
  tabGroupLabel,
}: Props<T>) {
  const toTabsTrigger = (tab: TabInfo<T>, index: number) => {
    const { value, tabText, tabIcon, visible = true } = tab;
    const styles = tabTriggerStyles({ selected: selectedTabValue === value });

    return (
      <Fragment key={index}>
        {visible && (
          <Tabs.Trigger<T> value={value} className={styles}>
            {tabIcon !== undefined && <div>{tabIcon}</div>}
            <div>{tabText}</div>
          </Tabs.Trigger>
        )}
      </Fragment>
    );
  };

  return (
    <Tabs.Root<T>
      value={selectedTabValue}
      onValueChange={onTabChange}
      className="min-w-[400px] self-stretch"
    >
      <Tabs.List<T>
        className="flex gap-x-1 px-4 leading-none"
        aria-label={tabGroupLabel}
      >
        {tabs.map(toTabsTrigger)}
      </Tabs.List>

      <div className="mt-2 h-full rounded-md bg-teal-600 p-4">
        {tabs.map((tab, index) => (
          <Tabs.Content<T> key={index} value={tab.value}>
            {tab.tabView}
          </Tabs.Content>
        ))}
      </div>
    </Tabs.Root>
  );
}
