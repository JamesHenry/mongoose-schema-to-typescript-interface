"use strict";
var program = require('commander');
var fs = require('fs');
var path = require('path');
var utilities_1 = require('./utilities');
program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    $ ms2tsi -h');
    console.log('    $ ms2tsi generate --module-name myModule --output-dir ./interfaces ./**/schema.js');
    console.log('');
});
program
    .command('generate [schemas...]')
    .option('-o, --output-dir <output-dir>', 'Where should the generated .d.ts file be written to?')
    .option('-m, --module-name <module-name>', 'What should the TypeScript module and filename be?')
    .action(function (schemas, cmd) {
    var outputDir = cmd.outputDir, moduleName = cmd.moduleName;
    if (!outputDir) {
        console.error('An output directory is required. Use -o or --output-dir');
        return process.exit(1);
    }
    if (!moduleName) {
        console.error('A module name is required. Use -m or --module-name');
        return process.exit(1);
    }
    if (!schemas || !schemas.length) {
        console.error('No schema files could be found. Please check the required usage by running `ms2tsi -h`');
        return process.exit(1);
    }
    var currentDir = process.env.PWD;
    var resolvedSchemaFiles = schemas.map(function (schemaPath) {
        var schemaFile = require(path.resolve(currentDir, schemaPath));
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
    var output = utilities_1.generateOutput(moduleName, currentDir, resolvedSchemaFiles);
    fs.writeFile(path.resolve(currentDir, outputDir + "/" + moduleName + ".d.ts"), output);
});
program.parse(process.argv);
//# sourceMappingURL=ms2tsi.js.map