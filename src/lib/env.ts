export function env(key: string, defaultValue: string): string {
	return process.env[key] ?? defaultValue;
}

export function envBool(key: string, defaultValue: boolean): boolean {
	return process.env[key] ? process.env[key] === 'true' : defaultValue;
}

export function envInt(key: string, defaultValue: number): number {
	return process.env[key] ? parseInt(process.env[key], 10) : defaultValue;
}
