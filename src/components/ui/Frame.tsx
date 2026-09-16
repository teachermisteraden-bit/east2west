import type { ReactNode } from "react";

/**
 * A hairline frame with an inner offset line — the fine-stationery detail from
 * 01 §2. Used for invitation cards, sponsorship options and the four doors.
 */
export function Frame({
  children,
  as: Tag = "div",
  interactive = false,
  className = "",
}: {
  children: ReactNode;
  as?: "div" | "li" | "article";
  interactive?: boolean;
  className?: string;
}) {
  return (
    <Tag className={`frame${interactive ? " frame--interactive" : ""} ${className}`}>
      <span className="frame__inner" aria-hidden="true" />
      <div className="frame__body">{children}</div>
    </Tag>
  );
}
