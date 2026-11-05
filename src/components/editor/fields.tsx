"use client";

const base = "mt-1.5 w-full border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent";

export function Field({
  label,
  value,
  onChange,
  rows,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {rows ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={`${base} resize-y leading-relaxed`} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      )}
      {hint && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

/** A list of items with add and remove. The caller draws each item. */
export function Repeater<T>({
  title,
  items,
  onChange,
  blank,
  addLabel,
  children,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  blank: T;
  addLabel: string;
  children: (item: T, set: (next: T) => void, index: number) => React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-6">
      <h2 className="text-xl">{title}</h2>
      <div className="mt-4 space-y-4">
        {items.map((item, i) => (
          <div key={i} className="border border-border p-4">
            <div className="space-y-3">
              {children(item, (next) => onChange(items.map((x, j) => (j === i ? next : x))), i)}
            </div>
            <div className="mt-3 flex gap-4 text-xs">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => {
                  const next = [...items];
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  onChange(next);
                }}
                className="text-muted hover:text-text disabled:opacity-30"
              >
                Move up
              </button>
              <button
                type="button"
                disabled={i === items.length - 1}
                onClick={() => {
                  const next = [...items];
                  [next[i + 1], next[i]] = [next[i], next[i + 1]];
                  onChange(next);
                }}
                className="text-muted hover:text-text disabled:opacity-30"
              >
                Move down
              </button>
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-error hover:underline">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, blank])} className="mt-4 text-sm font-medium text-accent hover:underline">
        + {addLabel}
      </button>
    </section>
  );
}
