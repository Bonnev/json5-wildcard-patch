export enum TokenType {
	SLASH = 'SLASH',
	IDENTIFIER = 'IDENTIFIER',
	ANY = 'ANY',
	END = 'END',
}

export class Token {
	constructor(public column: number, public type: TokenType, public value: string | null) { }
}

class Tokenizer {
	private currentIndex: number;
	private errors: string[] = [];

	constructor(private text: string) {
		this.currentIndex = 0;
	}

	tokenize(): Token[] {
		const tokens: Token[] = [];
		this.currentIndex = 0;

		if (this.text[this.currentIndex] !== '/') {
			this.handleError('Expected \'/\' at start');
			return [];
		}
		tokens.push(new Token(this.currentIndex, TokenType.SLASH, null));
		this.currentIndex++;

		while(!this.atEnd()) {
			const character = this.text[this.currentIndex];

			switch(character) {
			case '/':
				tokens.push(new Token(this.currentIndex, TokenType.SLASH, null));
				break;
			case '*':
				tokens.push(new Token(this.currentIndex, TokenType.ANY, null));
				break;
			default:
				if (this.isIdentifier(character)) {
					const id = this.consumeIdentifier();
					tokens.push(new Token(this.currentIndex, TokenType.IDENTIFIER, id));
				}
				break;
			}

			this.currentIndex++;
		}
		tokens.push(new Token(this.currentIndex, TokenType.END, null));

		return tokens;
	}

	isIdentifier(character: string): boolean {
		return /[a-zA-Z0-9_]/g.test(character);
	}

	consumeIdentifier() {
		let id = '';

		while (!this.atEnd() && this.isIdentifier(this.text[this.currentIndex])) {
			id += this.text[this.currentIndex];
			this.currentIndex++;
		}
		this.currentIndex--;

		return id;
	}

	handleError(message: string) {
		this.errors.push(`at column ${this.currentIndex}: ${message}`);
	}

	atEnd() {
		return this.currentIndex === this.text.length;
	}
}

export default function tokenize(text: string): Token[] {
	return new Tokenizer(text).tokenize();
}