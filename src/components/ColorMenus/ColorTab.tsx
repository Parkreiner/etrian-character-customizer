import { ColorCategory } from "@/typesConstants/colors";
import { Trigger as TabsTrigger } from "@/components/Tabs";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  tabType: ColorCategory;
}>;

export default function ColorMenuTabs({ tabType, children }: Props) {
  return <TabsTrigger value={tabType}>{children}</TabsTrigger>;
}
