type Props = {
  href: string;
  children: string;
};

export default function ModalLink({ href, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="underline decoration-teal-200 underline-offset-[3px]"
    >
      {children}
    </a>
  );
}
