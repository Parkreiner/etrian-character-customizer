import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
  striped?: boolean;
}>;

export default function Card({ title, children, striped = false }: Props) {
  return (
    <section className="mb-4 flex flex-col rounded-md bg-teal-900 px-4 pb-6 pt-4">
      <div className="mb-3 flex flex-row items-center gap-x-2">
        <h2 className="h-fit text-xs font-semibold uppercase tracking-wider text-teal-50">
          {title}
        </h2>
        {striped && <div className="h-0.5 flex-grow bg-teal-50 opacity-80" />}
      </div>

      <div className="grow">{children}</div>
    </section>
  );
}
