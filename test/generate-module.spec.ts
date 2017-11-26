import generateModule from '../src/generate-module';

describe('generateModule', () => {
  it('should return a stringified TypeScript module', () => {
    const input = generateModule('ModuleName', '');
    const output = `declare module ModuleName {
}
`;

    expect(input).toEqual(output);
  });

  it('should name the TypeScript module based on the given name', () => {
    const input = generateModule('GivenModuleName', '');
    const output = `declare module GivenModuleName {
}
`;

    expect(input).toEqual(output);
  });

  it('should wrap the given stringified content in a stringified TypeScript module', () => {
    const input = generateModule(
      'ModuleName',
      `interface IEmptyInterface {}
`,
    );
    const output = `declare module ModuleName {
	interface IEmptyInterface {}
}
`;

    expect(input).toEqual(output);
  });
});
