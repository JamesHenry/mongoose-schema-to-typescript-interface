import {
  NEWLINE_CHAR,
  INDENT_CHAR,
  REF_PATH_DELIMITER,
  appendNewline,
  indent,
  indentEachLine,
  extendRefTypes,
} from '../src/utilities';

describe('utilities', () => {
  describe('appendNewline', () => {
    it('should append a newline character to the given string', () => {
      expect(appendNewline('test string')).toEqual(
        'test string' + NEWLINE_CHAR,
      );
    });
  });

  describe('indent', () => {
    it('should prepend an indent character to the given string', () => {
      expect(indent('test string')).toEqual(INDENT_CHAR + 'test string');
    });
  });

  describe('indentEachLine', () => {
    it('should prepend an indent character to each line of the given string', () => {
      expect(
        indentEachLine(`
test1
test2
test3
`),
      ).toEqual(`
${INDENT_CHAR}test1
${INDENT_CHAR}test2
${INDENT_CHAR}test3
`);
    });
  });

  describe('extendRefTypes', () => {
    it('should scan the generated output for matching refs and extend the type annotation', () => {
      const refMapping = {
        [`IMainInterface${REF_PATH_DELIMITER}propWithRef`]: 'OtherThing',
      };

      const generatedOutput = `interface IOtherThing {
	foo: string;
}

interface IMainInterface {
	propWithRef: string;
	bar: number;
}

`;
      const expected = `interface IOtherThing {
	foo: string;
}

interface IMainInterface {
	propWithRef: string | IOtherThing;
	bar: number;
}

`;

      expect(extendRefTypes(generatedOutput, refMapping)).toEqual(expected);
    });
  });
});
