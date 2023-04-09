/**
 * @file A set of wrappers over the base Radix UI Tabs components to add type
 * parameter support. Other than that, they work exactly the same.
 *
 * Unfortunately, there isn't a good way to override the type information from
 * Radix's library without adding extra wrapper functions, which does add
 * overhead. Type parameters can only be added at the function, class,
 * interface, or type alias level. You can't import the functions, and then just
 * immediately export them with a type assertion applied, because there'd be
 * nowhere to put the type parameter.
 *
 * The wrapper components make extensive use of React.createElement instead of
 * JSX syntax. Even though the wrappers are needed for TypeScript, they should
 * still be as lightweight as possible. All forms of JSX would require
 * destructuring and cloning the props objects for every single render. But the
 * wrappers can safely reuse the exact same props references without any
 * changes. Sadly, the only way to do that is by wiring things up manually.
 *
 * @todo Still need to see if it's possible to make a type parameter from Root
 * cascade down to any children. From the docs, Root's direct children will
 * either be List or Content, while List's will only ever be Trigger. No other
 * Radix children to worry about.
 */
import { createElement } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import type {
  TabsProps as RadixTabsProps,
  TabsContentProps as RadixContentProps,
  TabsListProps as RadixListProps,
  TabsTriggerProps as RadixTriggerProps,
} from "@radix-ui/react-tabs";

type PatchProps<T extends string, Props extends object> = {
  [key in keyof Props]: key extends "value"
    ? T
    : key extends "defaultValue"
    ? T | undefined
    : key extends "onValueChange"
    ? ((value: T) => void) | undefined
    : Props[key];
};

export type TabsProps<T extends string> = PatchProps<T, RadixTabsProps>;
export type TriggerProps<T extends string> = PatchProps<T, RadixTriggerProps>;
export type ListProps<T extends string> = PatchProps<T, RadixListProps>;
export type ContentProps<T extends string> = PatchProps<T, RadixContentProps>;

export function Content<T extends string>(
  props: ContentProps<T>
): ReturnType<typeof RadixTabs.Content> {
  return createElement(RadixTabs.Content, props);
}

export function List<T extends string>(
  props: ListProps<T>
): ReturnType<typeof RadixTabs.List> {
  return createElement(RadixTabs.List, props);
}

export function Trigger<T extends string>(
  props: TriggerProps<T>
): ReturnType<typeof RadixTabs.Trigger> {
  return createElement(RadixTabs.Trigger, props);
}

export function Root<T extends string>(
  props: TabsProps<T>
): ReturnType<typeof RadixTabs.Root> {
  return createElement(
    RadixTabs.Root,
    props as typeof props & { onValueChange: RadixTabsProps["onValueChange"] }
  );
}
