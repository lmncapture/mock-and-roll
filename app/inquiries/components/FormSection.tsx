interface FormSectionProps {
  number: string; // "01", "02", etc.
  heading: string;
  children: React.ReactNode;
}

export default function FormSection({ number, heading, children }: FormSectionProps) {
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="sr-only">{heading}</legend>
      <div className="space-y-6">
        <div>
          <span className="font-body text-sm font-semibold tracking-widest uppercase text-slate/40">
            {number}
          </span>
          <h2 className="font-display text-2xl lg:text-3xl text-slate mt-1">
            {heading}
          </h2>
        </div>
        {children}
      </div>
    </fieldset>
  );
}
