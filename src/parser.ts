import { Token, TokenType } from './tokenizer';

export type ArrayOrObject = { [n: string]: ArrayOrObject } | ArrayOrObject[] | string | number

export class Location {
	constructor(public data: ArrayOrObject, public key: number | string) { }
}

export interface Navigation {
	navigate(previous: Location[]): Location[];
}

export class SimpleNavigation implements Navigation {
	constructor(private value: string) { }

	navigate(previous: Location[]): Location[] {
		const result: Location[] = [];

		/*
			previous := [ { data: </>, key: 'marty' } ]
		*/
		previous.forEach((location: Location) => {
			if (location.data instanceof Array && typeof location.key == 'number') {
				result.push(new Location(location.data[location.key], this.value));
			}

			if (location.data instanceof Object) {
				result.push(new Location(location.data[location.key], this.value));
			}
		});

		return result;
	}
}

export class WildcardNavigation implements Navigation {
	navigate(previous: Location[]): Location[] {
		const result: Location[] = [];

		/*
			previous := [ { data: </>, key: 'marty' } ]
		*/
		previous.forEach((location: Location) => {
			if (location.data instanceof Object && !(location.data[location.key] instanceof Object) ||
					location.data instanceof Array && typeof location.key == 'number' && !(location.data[location.key] instanceof Array) ||
					!(location.data instanceof Object))
				return;

			/*
				location := { data: </>, key: 'marty' }
				location.data := </>
				location.data[location.key] := </marty>
			*/
			if (location.data instanceof Object && location.data[location.key] instanceof Object || location.data instanceof Array && typeof location.key === 'number') {
				Object.keys(location.data[location.key]).forEach((key: string) => {
					if (location.data instanceof Array && typeof location.key === 'number') {
						result.push(new Location(location.data[location.key], key));
					}

					if (location.data instanceof Object) {
						result.push(new Location(location.data[location.key], key));
					}
				});
			}
		});

		return result;
	}
}

class Parser {
	private currentIndex: number;
	private errors: string[] = [];

	constructor(private tokens: Token[]) {
		this.currentIndex = 0;
		this.tokens = tokens;
	}

	parse(): Navigation[] {
		const navigations: Navigation[] = [];

		for (let index = 0; index < this.tokens.length; index++) {
			const token = this.tokens[index];

			switch (token.type) {
			case TokenType.SLASH: {
				if (index + 1 > this.tokens.length - 1) {
					this.handleError(token.column, 'Expected more characters');
					continue;
				}

				const nextToken = this.tokens[index + 1];
				if (nextToken.type !== TokenType.IDENTIFIER && nextToken.type !== TokenType.ANY) {
					this.handleError(nextToken.column, 'Expected an identifier or a wildcard');
					continue;
				}

				if (nextToken.type === TokenType.IDENTIFIER && nextToken.value) {
					navigations.push(new SimpleNavigation(nextToken.value));
				} else if (nextToken.type === TokenType.ANY) {
					navigations.push(new WildcardNavigation());
				}
				index++; // when on a slash, skip next token
				break;
			}
			default:
				break;
			}
		}

		return navigations;
	}

	handleError(column: number, message: string) {
		this.errors.push(`at column ${column}: ${message}`);
	}

	atEnd() {
		return this.tokens[this.currentIndex].type === TokenType.END;
	}
}

export default function parse(tokens: Token[]): Navigation[] {
	return new Parser(tokens).parse();
}