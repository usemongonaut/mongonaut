import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function env<T>(key: string, defaultValue: T): T {
	return (process.env[key] as T) ?? defaultValue;
}
