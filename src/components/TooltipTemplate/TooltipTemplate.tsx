import * as Tooltip from "@radix-ui/react-tooltip";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  labelText: string;
}>;

export default function TooltipTemplate({ labelText, children }: Props) {
  return (
    <Tooltip.Root defaultOpen={false}>
      <Tooltip.Content>
        <p className="rounded-md bg-black px-4 py-2 font-normal text-white">
          {labelText}
        </p>
        <Tooltip.Arrow className="fill-black" />
      </Tooltip.Content>

      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
    </Tooltip.Root>
  );
}
