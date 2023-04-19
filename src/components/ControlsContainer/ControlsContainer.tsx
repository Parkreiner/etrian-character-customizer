import { Fragment } from "react";
import * as Tabs from "@/components/Tabs";
import { cva } from "class-variance-authority";
import TooltipTemplate from "@/components/TooltipTemplate";

/**
 * An object describing one "tab" in the ControlsContainer component.
 *
 * A "tab" in this case refers to both the "button" you click to switch the
 * component to a different view, as well as the content associated with that
 * view.
 */
export type TabInfo<T extends string> = {
  /** If this is not specified, ControlsContainer defaults this to true */
  visible?: boolean;

  value: T;
  tabText: string;
  tabView: React.ReactNode | null;
  tabIcon?: React.ReactNode;
  accessibleTabLabel?: string;
};

export type TabInfoArray<T extends string> = readonly TabInfo<T>[];

const tabTriggerStyles = cva(
  "font-bold p-4 pb-3 rounded-md min-h-[50px] flex items-center gap-x-1.5 text-sm",
  {
    variants: {
      selected: {
        true: "bg-teal-900 text-teal-50",
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
    const { value, tabText, tabIcon, accessibleTabLabel, visible = true } = tab;
    const styles = tabTriggerStyles({ selected: selectedTabValue === value });

    const tabContent = (
      <div className={styles}>
        {tabIcon !== undefined && <div>{tabIcon}</div>}
        <div>{tabText}</div>
      </div>
    );

    const labelUsable =
      accessibleTabLabel !== undefined && accessibleTabLabel.length > 0;

    return (
      <Fragment key={index}>
        {visible && (
          <Tabs.Trigger<T> value={value}>
            {labelUsable ? (
              <TooltipTemplate labelText={accessibleTabLabel}>
                {tabContent}
              </TooltipTemplate>
            ) : (
              tabContent
            )}
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
