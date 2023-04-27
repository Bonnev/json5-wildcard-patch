enum TokenType {
	SLASH = 'SLASH',
	IDENTIFIER = 'IDENTIFIER',
	ANY = 'ANY'
}

export class Token {
	type: TokenType;
	value: string | undefined;

	constructor(type: TokenType, value: string | undefined) {
		this.type = type;
		this.value = value;
	}
}

class Tokenizer {
	private currentIndex: number;

	private errors: string[] = [];

	constructor(private text: string) {
		this.currentIndex = 0;
		this.text = text;
	}

	tokenize(): Token[] {
		const tokens: Token[] = [];
		this.currentIndex = 0;

		if (this.text[this.currentIndex] !== '/') {
			this.handleError('Expected \'/\' at start');
			return [];
		}
		this.currentIndex++;

		while(!this.atEnd()) {
			const character = this.text[this.currentIndex];

			switch(character) {
			case '/':
				tokens.push(new Token(TokenType.SLASH, undefined));
				break;
			case '*':
				tokens.push(new Token(TokenType.ANY, undefined));
				break;
			default:
				if (this.isIdentifier(character)) {
					const id = this.consumeIdentifier();
					tokens.push(new Token(TokenType.IDENTIFIER, id));
				}
				break;
			}

			this.currentIndex++;
		}

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
		return this.currentIndex === this.text.length - 1;
	}
}

export default function tokenize(text: string): Token[] {
	return new Tokenizer(text).tokenize();
}