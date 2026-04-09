import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function asyncSetState(fn: () => void) {
  setTimeout(() => {
    fn();
  }, 0);
}
