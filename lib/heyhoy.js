/**
 * Hey Hoy Parser
 * @param {string} code the heyhoy code
 * @param {boolean} verbose turn on to see all verbose log
 */
function heyhoy(code, verbose = false)
{
        const CHAR_NUMBER = 0;
        const CHAR_LETTER = 1;
        const CHAR_NEW_LINE = 2;
        const CHAR_SPACE = 3;
        const CHAR_EQ_SIGN = 4;
        const CHAR_ADD_SIGN = 5;
        const CHAR_MUL_SIGN = 6;

        const TOK_IDENTIFIER = 0;
        const TOK_NUMBER = 1;
        const TOK_NEW_LINE = 2;
        const TOK_EQ_SIGN = 11;
        const TOK_MUL_SIGN = 12;
        const TOK_ADD_SIGN = 13;
        const TOK_EOF = 14;

        /**
         * All lexemes from the code
         * @type {Array.<[number, string]>} [<lexem category/token>, <the lexeme>]
         */
        const lexemes = [];

        /**
         * For storing temporary calculation data from the code
         * @type {Array.<any>}
         */
        const STACK = [];

        /**
         * For storing variables from the code
         * @type {Object.<string, any>}
         */
        const VARS = {};

        /**
         * Final return value of HEYHOY
         * @type {any}
         */
        let return_val;

        /**
         * Verbose logger
         */
        const Log = {
                /**
                 * @param {any[]} params log anything
                 */
                v: (...params) =>
                {
                        if (verbose) console.log(...params);
                },
        };

        Log.v('Start HEYHOY!');
        Log.v('Inputted code:');
        Log.v(code);

        /**
         * Get character categorization
         * @param {string} char string with one character length
         */
        function charCat(char)
        {
                if (char.length !== 1) throw new Error(`Wrong length, must be one character -> ${char}`);

                const charCode = char.charCodeAt(0);

                if (charCode >= 48 && charCode <= 57) return CHAR_NUMBER;
                if (charCode >= 97 && charCode <= 122) return CHAR_LETTER;
                if (charCode === 10) return CHAR_NEW_LINE;
                if (charCode === 32) return CHAR_SPACE;
                if (charCode === 61) return CHAR_EQ_SIGN;
                if (charCode === 43) return CHAR_ADD_SIGN;
                if (charCode === 42) return CHAR_MUL_SIGN;

                throw new Error(`Wrong character -> ${char}`);
        }

        /**
         * Get lexemes and tokens of the code
         * @param {string} text the code
         * @returns {void}
         */
        function tokenizer(text)
        {
                let i = 0;

                while (text[i] !== undefined)
                {
                        let tmp_string = '';

                        switch (charCat(text[i]))
                        {
                        case CHAR_NEW_LINE:
                                lexemes.push([TOK_NEW_LINE, text[i]]);
                                i += 1;
                                break;
                        case CHAR_ADD_SIGN:
                                lexemes.push([TOK_ADD_SIGN, text[i]]);
                                i += 1;
                                break;
                        case CHAR_MUL_SIGN:
                                lexemes.push([TOK_MUL_SIGN, text[i]]);
                                i += 1;
                                break;
                        case CHAR_EQ_SIGN:
                                lexemes.push([TOK_EQ_SIGN, text[i]]);
                                i += 1;
                                break;
                        case CHAR_SPACE:
                                i += 1;
                                break;
                        case CHAR_LETTER:
                                tmp_string = '';

                                while (charCat(text[i]) === CHAR_LETTER
                                || charCat(text[i]) === CHAR_NUMBER)
                                {
                                        tmp_string += text[i];
                                        i += 1;
                                }

                                lexemes.push([TOK_IDENTIFIER, tmp_string]);
                                break;
                        case CHAR_NUMBER:
                                tmp_string = '';

                                while (charCat(text[i]) === CHAR_NUMBER)
                                {
                                        tmp_string += text[i];
                                        i += 1;
                                }

                                lexemes.push([TOK_NUMBER, tmp_string]);
                                break;
                        default:
                                throw new Error(`Tokenizer says: Wrong Char! -> ${text[i]}`);
                        }
                }

                lexemes.push([TOK_EOF, '']);
        }

        tokenizer(code);

        Log.v('Tokens & Lexemes');
        Log.v(lexemes);

        let current_tok = lexemes[0][0];
        // eslint-disable-next-line no-unused-vars
        let current_lex = lexemes[0][1];
        let current_lex_i = 0;

        let recursive_depth = 0;

        /**
         * @param {-1 | 0 | 1} stat 1 => will indent, -1 => will dedent, 0 = > keep as it is
         */
        function logIndenter(stat)
        {
                /** @type {string} */
                let indentation;

                const indentError = new Error('Indentation number error, please make sure the logIndenter pair is correct');

                if (stat === 1)
                {
                        if (recursive_depth < 0) throw indentError;
                        indentation = '   '.repeat(recursive_depth);
                        recursive_depth += 1;
                }
                else if (stat === -1)
                {
                        recursive_depth -= 1;
                        if (recursive_depth < 0) throw indentError;
                        indentation = '   '.repeat(recursive_depth);
                }
                else
                {
                        if (recursive_depth < 0) throw indentError;
                        indentation = '   '.repeat(recursive_depth);
                }

                return indentation;
        }

        function lex()
        {
                current_lex_i += 1;
                [current_tok, current_lex] = lexemes[current_lex_i];
                Log.v(logIndenter(0), 'Call lex', lexemes[current_lex_i]);
        }

        Log.v('Parse tree');
        Log.v('Initial Lex ---> ', lexemes[current_lex_i]);

        function program()
        {
                Log.v(logIndenter(1), 'Enter Program');

                if (current_tok === TOK_EOF)
                {
                        Log.v(logIndenter(0), 'Bye!');
                }
                else
                {
                        statement();
                        lex();
                        program();
                }

                Log.v(logIndenter(-1), 'Exit Program');
        }

        function statement()
        {
                Log.v(logIndenter(1), 'Enter Statement');

                if (current_tok === TOK_IDENTIFIER)
                {
                        const prev_lex = current_lex;

                        lex();

                        // @ts-ignore
                        if (current_tok === TOK_EQ_SIGN)
                        {
                                // Assignment

                                lex();
                                expression();

                                // Save the expression result to vars dict
                                VARS[prev_lex] = STACK.pop();
                                Log.v(logIndenter(0), 'Storing variable --> ', prev_lex, '=', VARS[prev_lex]);
                                Log.v(logIndenter(0), 'Current variables --> ', VARS);
                        }
                        else if (current_tok === TOK_IDENTIFIER)
                        {
                                // Function call, currently only accept one argument

                                // The argument
                                // For example:
                                // print x <--
                                const argument = current_lex;

                                switch (prev_lex)
                                {
                                case 'print':
                                        Log.v(logIndenter(0), 'Printing --> ', argument, ':', VARS[argument]);
                                        console.log(VARS[argument]);
                                        break;
                                case 'return':
                                        Log.v(logIndenter(0), 'Return command is received --> ', argument, ':', VARS[argument]);
                                        return_val = VARS[argument];
                                        break;
                                default:
                                        console.log(`Unknown function --> ${prev_lex}`);
                                        break;
                                }

                                lex();
                        }
                        else
                        {
                                throw new Error('Action: first token is wrong');
                        }


                        // Statement Terminator (\n) check

                        // @ts-ignore
                        if (current_tok === TOK_NEW_LINE)
                        {
                                //  Completed
                        }
                        else
                        {
                                throw new Error('Statement: expecting new line');
                        }
                }
                else if (current_tok === TOK_NEW_LINE)
                {
                        // Complete statement
                }
                else
                {
                        throw new Error('Statement: first token is wrong');
                }

                Log.v(logIndenter(-1), 'Exit Statement');
        }

        function expression()
        {
                Log.v(logIndenter(1), 'Enter Expression');

                /** @type {number} */
                let result;

                factor();

                result = STACK.pop();

                while (current_tok === TOK_ADD_SIGN)
                {
                        lex();
                        factor();

                        result += STACK.pop();
                }

                STACK.push(result);

                Log.v(logIndenter(-1), 'Exit Expression');
        }

        function factor()
        {
                Log.v(logIndenter(1), 'Enter Factor');

                // left_num is the part before mul sign
                // right_num is the part after mul sign

                /** @type {number} */
                let result;

                term();

                result = STACK.pop();

                while (current_tok === TOK_MUL_SIGN)
                {
                        lex();
                        term();

                        result *= STACK.pop();
                }

                STACK.push(result);

                Log.v(logIndenter(-1), 'Exit Factor');
        }

        /**
         * Will push one number to stack
         */
        function term()
        {
                Log.v(logIndenter(1), 'Enter Term');

                /** @type {number} */
                let result;

                if (current_tok === TOK_NUMBER)
                {
                        // handle number
                        // For example: x = 2 <--
                        result = Number(current_lex);
                }
                else if (current_tok === TOK_IDENTIFIER)
                {
                        // handle vars in the expression
                        // For example: x = y <--
                        result = Number(VARS[current_lex]);
                }
                else
                {
                        throw new Error('Term: first token is wrong');
                }

                STACK.push(result);

                lex();

                Log.v(logIndenter(-1), 'Exit Term');
        }

        program();

        return return_val;
}
module.exports = heyhoy;
