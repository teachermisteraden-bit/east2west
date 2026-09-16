/**
 * Honest FAQ. A native <details> disclosure list — keyboard accessible with no
 * JavaScript, and it prints and deep-links correctly.
 *
 * The questions are the ones people actually hesitate over (02 §1: "Is this real?
 * Is it for me? What does it take?"), answered plainly, including "not yet" about
 * registration and "no" about guaranteeing jobs.
 */
export function Faq({ items, title }: { items: { q: string; a: string }[]; title?: string }) {
  return (
    <div className="faq">
      {title && <h2 className="section__title faq__title">{title}</h2>}
      <ul className="faq__list">
        {items.map((item, i) => (
          <li key={i}>
            <details className="faq__item">
              <summary>
                <span className="faq__q">{item.q}</span>
                <span className="faq__marker" aria-hidden="true" />
              </summary>
              <div className="faq__a">
                <p>{item.a}</p>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
