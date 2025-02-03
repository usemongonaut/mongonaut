import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from 'next-themes';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

function getSystemTheme() {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function usePreferredTheme() {
	const { theme: selectedTheme } = useTheme();
	const systemTheme = getSystemTheme();

	if (!selectedTheme || selectedTheme === 'system') {
		return systemTheme;
	}
	return selectedTheme;
}
