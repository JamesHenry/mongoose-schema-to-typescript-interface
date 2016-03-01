"use strict";
var program = require('commander');
var fs = require('fs');
var path = require('path');
var generate_module_1 = require('./generate-module');
var generate_interface_1 = require('./generate-interface');
program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    $ ms2tsi -h');
    console.log('    $ ms2tsi ./interfaces myModule ./**/schema.js');
    console.log('');
});
program
    .command('* <output-dir> <module-name> <schemas-glob...>')
    .action(function (outputDir, moduleName, schemaFiles) {
    var output = "";
    schemaFiles.forEach(function (schemaFile) {
        var data = require(path.join(__dirname, "../" + schemaFile));
        output += generate_interface_1.default(data.name, data.schema);
    });
    output = generate_module_1.default(moduleName, output);
    fs.writeFile(path.join(__dirname, "../" + outputDir + "/" + moduleName + ".d.ts"), output);
});
program.parse(process.argv);
//# sourceMappingURL=ms2tsi.js.map