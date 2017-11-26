import * as program from 'commander';
import * as fs from 'fs';
import * as path from 'path';

import { generateOutput } from './utilities';

/**
 * Use Babel to transpile schema files
 */
import 'babel-register';

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ ms2tsi -h');
  console.log(
    '    $ ms2tsi generate --module-name myModule --output-dir ./interfaces ./**/schema.js',
  );
  console.log('');
});

program
  .command('generate [schemas...]')
  .option(
    '-o, --output-dir <output-dir>',
    'Where should the generated .d.ts file be written to?',
  )
  .option(
    '-m, --module-name <module-name>',
    'What should the TypeScript module and filename be?',
  )
  .option('-e, --extend-refs', 'Experimental: Should refs be extended?')
  .action((schemas: string[], cmd: any) => {
    const { outputDir, moduleName, extendRefs } = cmd;

    if (!outputDir) {
      console.error('An output directory is required. Use -o or --output-dir');
      return process.exit(1);
    }

    if (!moduleName) {
      console.error('A module name is required. Use -m or --module-name');
      return process.exit(1);
    }

    if (!schemas || !schemas.length) {
      console.error(
        'No schema files could be found. Please check the required usage by running `ms2tsi -h`',
      );
      return process.exit(1);
    }

    const currentDir = process.env.PWD as string;
    const resolvedSchemaFiles = schemas.map((schemaPath: string) => {
      const schemaFile = require(path.resolve(currentDir, schemaPath));
      /**
       * Allow for vanilla objects or full mongoose.Schema instances to
       * have been exported by normalising the exported `schema` property
       */
      if (schemaFile.schema && schemaFile.schema.tree) {
        schemaFile.schema = schemaFile.schema.tree;
        return schemaFile;
      }
      return schemaFile;
    });

    const output = generateOutput(
      moduleName,
      currentDir,
      resolvedSchemaFiles,
      extendRefs,
    );

    fs.writeFileSync(
      path.resolve(currentDir, `${outputDir}/${moduleName}.d.ts`),
      output,
    );
  });

program.parse(process.argv);
