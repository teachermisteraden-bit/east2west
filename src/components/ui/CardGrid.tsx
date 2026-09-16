import { Frame } from "./Frame";

/** A grid of name + description cards: benefits, programmes, options, reasons. */
export function CardGrid({
  items,
  columns = 3,
  framed = true,
}: {
  items: { name: string; body?: string; items?: string[] }[];
  columns?: 2 | 3;
  framed?: boolean;
}) {
  return (
    <ul className={`cardgrid cardgrid--${columns}`}>
      {items.map((item, i) => {
        const content = (
          <>
            <h3 className="cardgrid__name">{item.name}</h3>
            {item.body && <p className="cardgrid__body">{item.body}</p>}
            {item.items && (
              <ul className="cardgrid__list">
                {item.items.map((line, j) => (
                  <li key={j}>{line}</li>
                ))}
              </ul>
            )}
          </>
        );
        return framed ? (
          <Frame as="li" key={`${item.name}-${i}`} interactive>
            {content}
          </Frame>
        ) : (
          <li className="cardgrid__plain" key={`${item.name}-${i}`}>
            {content}
          </li>
        );
      })}
    </ul>
  );
}

/** A hairline-separated list of short lines: what we ask, who can join, gains. */
export function PlainList({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={`plainlist plainlist--${columns}`}>
      {items.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );
}
