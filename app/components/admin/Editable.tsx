"use client";
import { useRef, useEffect } from "react";

export default function Editable({
  value, onChange, placeholder, multiline, style, as = "div", className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
  as?: "div" | "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const focused = useRef(false);
  const Tag = as as any;

  useEffect(() => {
    if (ref.current && !focused.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value]);

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={`editable-field${className ? ` ${className}` : ""}`}
      onFocus={() => { focused.current = true; }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        focused.current = false;
        onChange(e.currentTarget.textContent || "");
      }}
      onInput={(e: React.FormEvent<HTMLElement>) => onChange(e.currentTarget.textContent || "")}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === "Enter") e.preventDefault();
      }}
      style={{
        outline: "none",
        cursor: "text",
        minWidth: 10,
        minHeight: "1em",
        whiteSpace: multiline ? "pre-wrap" : "normal",
        borderRadius: 4,
        transition: "background 0.15s",
        ...style,
      }}
    />
  );
}
