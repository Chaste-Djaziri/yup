import Link from "next/link";

type EmptyStatePanelProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  compact?: boolean;
};

export default function EmptyStatePanel({
  title,
  description,
  actionLabel,
  actionHref,
  compact = false,
}: EmptyStatePanelProps) {
  return (
    <div
      className={[
        "w-full border-2 border-dashed border-primary/35 bg-card/80 text-center",
        compact ? "px-6 py-10" : "px-6 py-12 md:px-10 md:py-16",
      ].join(" ")}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/12 text-2xl text-primary md:h-16 md:w-16">
        !
      </div>
      <h3 className="mt-4 font-heading text-3xl text-primary md:text-4xl">{title}</h3>
      <p className="mx-auto mt-3 max-w-2xl text-base text-foreground/75 md:text-lg">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-block bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
