/**
 * For the `rawSchema`, generate a TypeScript interface under the given `interfaceName`,
 * and any requisite nested interfaces
 * @public
 */
declare function typescriptInterfaceGenerator(interfaceName: string, rawSchema: any): string;
export default typescriptInterfaceGenerator;
