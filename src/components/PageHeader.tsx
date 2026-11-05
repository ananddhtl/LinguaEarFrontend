export function PageHeader({ title, text }: { title: string; text?: string }) {
  return (
    <div className="mb-8 border-b border-border pb-5">
      <h1 className="text-3xl">{title}</h1>
      {text && <p className="mt-1.5 max-w-2xl text-sm text-muted">{text}</p>}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="border-t-2 border-text pt-3">
      <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-2 font-serif text-4xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Soon({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-border p-8">
      <p className="font-serif text-lg font-semibold">Not available yet</p>
      <p className="mt-2 max-w-md text-sm text-muted">{text}</p>
    </div>
  );
}
