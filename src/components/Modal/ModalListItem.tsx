import { PropsWithChildren } from "react";

export default function ModalListItem({ children }: PropsWithChildren) {
  return <li className="pb-2 pl-2.5 last:pb-0">{children}</li>;
}
