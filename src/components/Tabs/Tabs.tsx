/**
 * @file A set of wrappers over the base Radix UI Tabs components to add type
 * parameter support. Other than that, they work exactly the same.
 *
 * @todo Still need to figure out how to pass a type parameter from a parent
 * Tabs component to a child Tabs component. From the docs, Root leads to either
 * List or Content, and List leads to Trigger
 */
import * as RadixTabs from "@radix-ui/react-tabs";
import type {
  TabsProps as RadixTabsProps,
  TabsContentProps as RadixContentProps,
  TabsListProps as RadixListProps,
  TabsTriggerProps as RadixTriggerProps,
} from "@radix-ui/react-tabs";

type PatchProps<T extends string, Props extends {}> = {
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

export function Content<T extends string>(props: ContentProps<T>) {
  return <RadixTabs.Content {...props} />;
}

export function List<T extends string>(props: ListProps<T>) {
  return <RadixTabs.List {...props} />;
}

export function Trigger<T extends string>({ ...props }: TriggerProps<T>) {
  return <RadixTabs.Trigger {...props} />;
}

type RootReturn<T extends string> = ReturnType<
  React.ForwardRefExoticComponent<
    TabsProps<T> & React.RefAttributes<HTMLDivElement>
  >
>;

export const Root = <T extends string>({
  onValueChange,
  ...delegated
}: TabsProps<T>): RootReturn<T> => {
  type RadixOnValueChange = RadixTabsProps["onValueChange"];

  return (
    <RadixTabs.Root
      {...delegated}
      onValueChange={onValueChange as RadixOnValueChange}
    />
  );
};