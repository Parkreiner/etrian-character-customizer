import { PropsWithChildren } from "react";
import { cva } from "class-variance-authority";

type Props = PropsWithChildren<{
  ordered?: boolean;
}>;

const listStyles = cva("list-outside pb-6 pl-7 leading-[1.6] last:pb-0", {
  variants: {
    ordered: {
      true: "list-decimal",
      false: "list-disc",
    },
  },
});

export default function ModalList({ children, ordered = false }: Props) {
  const ListTag = ordered ? "ol" : "ul";
  return <ListTag className={listStyles({ ordered })}>{children}</ListTag>;
}
