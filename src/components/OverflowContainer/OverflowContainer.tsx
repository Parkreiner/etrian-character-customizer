import { PropsWithChildren } from "react";

export default function OverflowContainer({ children }: PropsWithChildren) {
  return (
    <div
      className="max-h-96 overflow-y-auto bg-teal-600 text-white"
      style={{ scrollbarColor: "blue" }}
    >
      {children}
    </div>
  );
}
