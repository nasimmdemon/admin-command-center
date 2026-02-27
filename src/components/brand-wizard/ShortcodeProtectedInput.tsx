import { useCallback, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const SHORTCODE_REGEX = /\{[^}]+\}/g;

function getShortcodeRanges(text: string): { start: number; end: number; code: string }[] {
  const ranges: { start: number; end: number; code: string }[] = [];
  let m;
  const re = new RegExp(SHORTCODE_REGEX.source, "g");
  while ((m = re.exec(text)) !== null) {
    ranges.push({ start: m.index, end: m.index + m[0].length, code: m[0] });
  }
  return ranges;
}

function deleteShortcodeAtPosition(
  text: string,
  pos: number,
  isBackspace: boolean
): { newValue: string; newPos: number } | null {
  const ranges = getShortcodeRanges(text);
  const inside = ranges.find((r) => pos > r.start && pos < r.end);
  if (inside) {
    const newValue = text.slice(0, inside.start) + text.slice(inside.end);
    return { newValue, newPos: inside.start };
  }
  if (isBackspace) {
    const after = ranges.find((r) => r.end === pos);
    if (after) {
      const newValue = text.slice(0, after.start) + text.slice(after.end);
      return { newValue, newPos: after.start };
    }
  } else {
    const before = ranges.find((r) => r.start === pos);
    if (before) {
      const newValue = text.slice(0, before.start) + text.slice(before.end);
      return { newValue, newPos: pos };
    }
  }
  return null;
}

function isCursorInsideShortcode(text: string, pos: number): boolean {
  const ranges = getShortcodeRanges(text);
  return ranges.some((r) => pos > r.start && pos < r.end);
}

interface ShortcodeProtectedInputProps extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
}

export const ShortcodeProtectedInput = forwardRef<HTMLInputElement, ShortcodeProtectedInputProps>(
  function ShortcodeProtectedInput({ value, onChange, onKeyDown, ...props }, forwardedRef) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.target as HTMLInputElement;
      if (!input) return;
      const pos = input.selectionStart ?? 0;

      if (e.key === "Backspace" || e.key === "Delete") {
        const isBackspace = e.key === "Backspace";
        const result = deleteShortcodeAtPosition(value, pos, isBackspace);
        if (result !== null) {
          e.preventDefault();
          onChange(result.newValue);
          setTimeout(() => input.setSelectionRange(result.newPos, result.newPos), 0);
          return;
        }
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
        if (isCursorInsideShortcode(value, pos)) {
          e.preventDefault();
          return;
        }
      }
      onKeyDown?.(e);
    },
    [value, onChange, onKeyDown]
  );

  return <Input ref={forwardedRef} value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={handleKeyDown} {...props} />;
});

interface ShortcodeProtectedTextareaProps extends Omit<React.ComponentProps<typeof Textarea>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
}

export const ShortcodeProtectedTextarea = forwardRef<HTMLTextAreaElement, ShortcodeProtectedTextareaProps>(
  function ShortcodeProtectedTextarea({ value, onChange, onKeyDown, className, ...props }, forwardedRef) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const ta = e.target as HTMLTextAreaElement;
      if (!ta) return;
      const pos = ta.selectionStart ?? 0;

      if (e.key === "Backspace" || e.key === "Delete") {
        const isBackspace = e.key === "Backspace";
        const result = deleteShortcodeAtPosition(value, pos, isBackspace);
        if (result !== null) {
          e.preventDefault();
          onChange(result.newValue);
          setTimeout(() => ta.setSelectionRange(result.newPos, result.newPos), 0);
          return;
        }
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
        if (isCursorInsideShortcode(value, pos)) {
          e.preventDefault();
          return;
        }
      }
      onKeyDown?.(e);
    },
    [value, onChange, onKeyDown]
  );

  return (
    <Textarea
      ref={forwardedRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn("font-mono text-sm", className)}
      {...props}
    />
  );
});
