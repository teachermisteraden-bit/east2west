"use client";

/**
 * The progress thread.
 *
 * Endowed progress (Nunes and Drèze, 2006): the first node is already filled
 * when the form loads, because the visitor really did complete a step — they
 * chose who they are on /join. The progress shown is never inflated.
 *
 * Goal gradient (Kivetz et al., 2006): the final step is named as the last one,
 * so the end is visible from wherever the visitor is standing.
 */
export function ProgressThread({
  current,
  total,
  progressLabel,
  startedLabel,
  lastStepLabel,
  completedLabel,
  nodeLabel,
  done = false,
}: {
  /** 1-based, counting the mode choice as node 1. */
  current: number;
  total: number;
  progressLabel: string;
  startedLabel: string;
  lastStepLabel: string;
  completedLabel: string;
  /** Names a single node for screen readers, e.g. "Step 2 of 4". */
  nodeLabel: (index: number, total: number) => string;
  done?: boolean;
}) {
  const atLastStep = current === total;
  const note = done ? completedLabel : atLastStep ? lastStepLabel : startedLabel;

  return (
    <div className="thread" data-done={done ? "true" : undefined}>
      <ol className="thread__nodes">
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const state = done || n < current ? "done" : n === current ? "current" : "todo";
          return (
            <li key={n} className="thread__node" data-state={state}>
              <span className="visually-hidden">{nodeLabel(n, total)}</span>
              <span className="thread__dot" aria-hidden="true" />
              {n < total && <span className="thread__line" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
      <p className="thread__label" aria-live="polite">
        <span className="thread__count">{progressLabel}</span>
        <span className="thread__note">{note}</span>
      </p>
    </div>
  );
}
