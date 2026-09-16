/**
 * A numbered sequence: the member journey, partnership steps, the six-week
 * challenge. Numerals are set in the display serif, in gold that clears AA on
 * light surfaces (--gold-text), with the final step marked as the destination.
 *
 * Goal-gradient effect (02): the last step is visually the brightest, because
 * people accelerate as a goal feels closer.
 */
export function Steps({
  items,
  lastIsGoal = true,
}: {
  items: { name: string; body?: string }[];
  lastIsGoal?: boolean;
}) {
  return (
    <ol className="steps">
      {items.map((item, i) => (
        <li
          key={`${item.name}-${i}`}
          className="steps__item"
          data-goal={lastIsGoal && i === items.length - 1 ? "true" : undefined}
        >
          <span className="steps__num" aria-hidden="true">
            {i + 1}
          </span>
          <span className="steps__thread" aria-hidden="true" />
          <h3 className="steps__name">{item.name}</h3>
          {item.body && <p className="steps__body">{item.body}</p>}
        </li>
      ))}
    </ol>
  );
}
