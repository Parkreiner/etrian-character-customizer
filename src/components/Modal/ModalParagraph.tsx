import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  italicized?: boolean;
}>;

export default function ModalParagraph({
  children,
  italicized = false,
}: Props) {
  return (
    <p className={`${italicized ? "italic" : ""} pb-2 leading-[1.7]`}>
      {children}
    </p>
  );
}
