import * as Toggle from "@radix-ui/react-toggle";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Link2 as LinkIcon } from "react-feather";
import TooltipTemplate from "@/components/TooltipTemplate";

type Props = {
  active: boolean;
  toggleActive: () => void;
  accessibleLabel: string;
};

export default function LinkToggle({
  active,
  accessibleLabel,
  toggleActive,
}: Props) {
  return (
    <Toggle.Root
      pressed={active}
      onPressedChange={toggleActive}
      className={`block max-h-[26px] max-w-[26px] rounded-full p-1 ${
        active ? "bg-teal-200" : "bg-teal-600"
      }`}
    >
      <VisuallyHidden>{accessibleLabel}</VisuallyHidden>

      <TooltipTemplate labelText={accessibleLabel}>
        <LinkIcon
          className={`h-full w-full stroke-teal-950 ${
            active === false ? "opacity-80" : ""
          }`}
        />
      </TooltipTemplate>
    </Toggle.Root>
  );
}
