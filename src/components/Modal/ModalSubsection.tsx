import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
}>;

export default function ModalSubsection({ title, children }: Props) {
  return (
    <section className="pb-6">
      <h3 className="pb-1 text-2xl font-normal italic">{title}</h3>
      {children}
    </section>
  );
}
