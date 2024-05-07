import * as readline from 'readline';

namespace cc {
  enum SyntaxKind {
    NumberToken,
    Whitespace,
    PlusToken,
    MinusToken,
    StarToken,
    SlashToken,
    OpenParenthesisToken,
    CloseParenthesisToken,
    BadToken,
    EndOfFileToken
  }

  class SyntaxToken {
    public readonly Kind: SyntaxKind;
    public readonly Position: number;
    public readonly Text: string;
    public readonly Value: number | null;

    constructor(kind: SyntaxKind, position: number, text: string, value: number | null) {
      this.Kind = kind;
      this.Position = position;
      this.Text = text;
      this.Value = value;
    }
  }

  class Lexer {
    private readonly _text: string;
    private _position: number;

    constructor(text: string) {
      this._text = text;
      this._position = 0;
    }

    private get Current(): string {
      if (this._position >= this._text.length)
        return '\0';

      return this._text[this._position];
    }

    private Next(): void {
      this._position++;
    }

    public NextToken(): SyntaxToken {
      while (this._position < this._text.length)
      {
        if (this._position >= this._text.length)
          return new SyntaxToken(SyntaxKind.EndOfFileToken, this._position, "\0", null);

        if (/\d/.test(this.Current))
        {
          const start = this._position;

          while (/\d/.test(this.Current))
            this.Next();

          const length = this._position - start;
          const text = this._text.substring(start, start + length);
          const value = parseInt(text);

          return new SyntaxToken(SyntaxKind.NumberToken, start, text, value);
        }

        if (/\s/.test(this.Current))
        {
          const start = this._position;

          while (/\s/.test(this.Current))
            this.Next();

          const length = this._position - start;
          const text = this._text.substring(start, start + length);

          return new SyntaxToken(SyntaxKind.Whitespace, start, text, null);
        }

        switch (this.Current)
        {
          case '+':
            return new SyntaxToken(SyntaxKind.PlusToken, this._position++, "+", null);
          case '-':
            return new SyntaxToken(SyntaxKind.MinusToken, this._position++, "-", null);
          case '*':
            return new SyntaxToken(SyntaxKind.StarToken, this._position++, "*", null);
          case '/':
            return new SyntaxToken(SyntaxKind.SlashToken, this._position++, "/", null);
          case '(':
            return new SyntaxToken(SyntaxKind.OpenParenthesisToken, this._position++, "(", null);
          case ')':
            return new SyntaxToken(SyntaxKind.CloseParenthesisToken, this._position++, ")", null);
          default:
            return new SyntaxToken(SyntaxKind.BadToken, this._position++, this._text.substring(this._position - 1, this._position), null);
        }
      }

      return new SyntaxToken(SyntaxKind.EndOfFileToken, this._position, "\0", null);
    }
  }

  class Program {
    public static async Main(): Promise<void> {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      while (true)
      {
        const line = await new Promise<string>((resolve) => {
          rl.question("> ", (input) => resolve(input));
        });

        if (!line.trim())
        {
          rl.close();
          return;
        }

        const lexer = new Lexer(line);

        while (true)
        {
          const token = lexer.NextToken();

          if (token.Kind === SyntaxKind.EndOfFileToken)
            break;

          process.stdout.write(`${SyntaxKind[token.Kind]}: '${token.Text}'`);

          if (token.Value !== null)
            process.stdout.write(` ${token.Value}`);

          process.stdout.write('\n');
        }
      }
    }
  }

  Program.Main();
}
