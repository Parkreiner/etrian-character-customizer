import { cva } from "class-variance-authority";
import { toTitleCase } from "@/utils/strings";

import { UiTab } from "./localTypes";
import TabIconWrapper from "./TabIconWrapper";
import * as Tabs from "@/components/Tabs";

type Props = {
  tabValue: UiTab;
  active: boolean;
};

const tabButtonStyles = cva(
  "px-3.5 py-1 rounded-full text-sm flex flex-row flex-nowrap gap-x-1 items-center first:pl-4 last:pr-4 transition-colors",
  {
    variants: {
      active: {
        true: "text-opacity-100 text-teal-950 bg-teal-100 font-medium",
        false:
          "text-opacity-95 text-teal-50 bg-teal-900 hover:bg-teal-100 hover:text-teal-950 hover:font-medium",
      } as const satisfies Record<`${boolean}`, string>,
    },
  }
);

export default function TabButton({ tabValue, active }: Props) {
  return (
    <Tabs.Trigger<UiTab>
      value={tabValue}
      className={tabButtonStyles({ active })}
    >
      <TabIconWrapper tab={tabValue} />
      <span>{toTitleCase(tabValue)}</span>
    </Tabs.Trigger>
  );
}
