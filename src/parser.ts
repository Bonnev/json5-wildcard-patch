import { Token, TokenType } from './tokenizer';

interface Navigation {
	navigate(input: object): string
}

class SingleNavigation implements Navigation {
	constructor(public next: Navigation) { }

	navigate(input: object): string {
		return 
	}
}

class Parser {
	private currentIndex: number;
	private errors: string[] = [];

	constructor(private tokens: Token[]) {
		this.currentIndex = 0;
		this.tokens = tokens;
	}

	parse(): Navigation {
		return this.parseRecursive(0);
	}

	parseRecursive(index: number): Navigation {
		switch (this.tokens[index].type) {
		case TokenType.SLASH:
			if (this.tokens[index + 1].type !== TokenType.SLASH && this.tokens[index + 1].type !== TokenType.ANY) {
				this.errors.push()
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
		return this.currentIndex === this.tokens.length - 1;
	}
}

export default function parse(tokens: Token[]): Navigation {
	return new Parser(tokens).parse();
}