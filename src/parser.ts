import { Token, TokenType } from './tokenizer';

export enum OperationType {
	SimpleNavigation = 'SimpleNavigation',
	WildcardNavigation = 'WildcardNavigation',
	END = 'END',
}

export class Operation {
	constructor(public type: OperationType, public value: string | null) { }
}

class Parser {
	private currentIndex: number;
	private errors: string[] = [];

	constructor(private tokens: Token[]) {
		this.currentIndex = 0;
		this.tokens = tokens;
	}

	parse(): Navigation {
		for (let index = 0; index < this.tokens.length; index++) {
			const token = this.tokens[index];
			const nextToken = this.tokens[index + 1];

			switch (token.type) {
			case TokenType.SLASH:
				if (nextToken.type !== TokenType.IDENTIFIER && nextToken.type !== TokenType.ANY) {
					this.handleError(nextToken.column, 'Expected an identifier or a wildcard');
				}

				if (token.type === TokenType.IDENTIFIER) {
					return new Operation(OperationType.SimpleNavigation, null);
				} else {
					return new Operation(OperationType.WildcardNavigation, null);
				}
			}
		}

		return this.parseRecursive(0);
	}

	parseRecursive(index: number): Navigation {
		if (this.tokens[index].type === TokenType.END) { }

		if (this.tokens[index].type == TokenType.SLASH) {
			switch (this.tokens[index].type) {
			case TokenType.IDENTIFIER:
				return new SingleNavigation(this.parseRecursive(index + 2));
			}
		}

		switch (this.tokens[index].type) {
		case TokenType.SLASH:
			if (this.tokens[index + 1].type !== TokenType.SLASH && this.tokens[index + 1].type !== TokenType.ANY) {
				this.handleError(this.tokens[index + 1].column, 'Expected an identifier or a wildcard');
			}

			return new SingleNavigation(this.parseRecursive(index + 2));
		default:
			throw new Error('Invalid token type: ' + this.tokens[index].type);
		}
	}

	handleError(column: number, message: string) {
		this.errors.push(`at column ${column}: ${message}`);
	}

	atEnd() {
		return this.tokens[this.currentIndex].type === TokenType.END;
	}
}

export default function parse(tokens: Token[]): Navigation {
	return new Parser(tokens).parse();
}