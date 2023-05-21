import { createInterface } from 'node:readline';

const rl = createInterface({
	input: process.stdin,
	output: process.stdout
});

export function readLine(callback: (line: string) => void): void {
	rl.on('line', callback);
}