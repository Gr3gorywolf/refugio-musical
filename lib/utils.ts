import { clsx, type ClassValue } from "clsx" 
import { NextFunction } from "express";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function generateUserChatColor(userId: string): string {
  // Hash tipo DJB2
  let hash = 5381;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 33) ^ userId.charCodeAt(i);
  }
  hash = Math.abs(hash);

  // HSL valores vibrantes estilo Twitch
  const hue = hash % 360;
  const saturation = 70 + (hash % 20); // 70–90%
  const lightness = 45 + (hash % 10); // 45–55%

  // Conversión de HSL a RGB (y luego a HEX)
  const s = saturation / 100;
  const l = lightness / 100;
  const k = (n: number) => (n + hue / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1))));
  const toHex = (x: number) => x.toString(16).padStart(2, "0");

  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}