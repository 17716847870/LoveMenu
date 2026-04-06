import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function asyncSetState<T>(fn:() => void){
  setTimeout(() => {
    fn();
  }, 0)
}