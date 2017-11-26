import { indentEachLine, appendNewline } from './utilities';

/**
 * Wrap the given stringified contents in a stringified TypeScript module,
 * using the given module name
 * @public
 */
export default function typescriptModuleGenerator(
  moduleName: string,
  moduleContents: string,
) {
  if (!moduleName) {
    throw new Error('"moduleName" is required to generate a TypeScript module');
  }
  let typescriptModule = appendNewline(`declare module ${moduleName} {`);
  typescriptModule += indentEachLine(moduleContents);
  typescriptModule += appendNewline('}');
  return typescriptModule;
}
