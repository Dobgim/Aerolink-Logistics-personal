type ClassValue = string | number | bigint | boolean | null | undefined | ClassValue[];

/** Minimal class joiner — keeps the bundle free of an extra dependency. */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (value: ClassValue) => {
    if (!value && value !== 0) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    out.push(String(value));
  };
  inputs.forEach(walk);
  return out.join(" ");
}
