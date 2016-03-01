import * as program      from 'commander'
import * as fs           from 'fs'
import * as path         from 'path'

import generateModule    from './generate-module'
import generateInterface from './generate-interface'

program.on('--help', () => {
	console.log('  Examples:')
	console.log('')
	console.log('    $ ms2tsi -h')
	console.log('    $ ms2tsi ./interfaces myModule ./**/schema.js')
	console.log('')
})

program
	.command('* <output-dir> <module-name> <schemas-glob...>')
	.action((outputDir: string, moduleName: string, schemaFiles: string[]) => {

		const currentDir = process.env.PWD
		let output = ``

		schemaFiles.forEach((schemaFile) => {

			const data = require(path.resolve(currentDir, schemaFile))

			output += generateInterface(data.name, data.schema)

		})

		output = generateModule(moduleName, output)

		fs.writeFile(path.resolve(currentDir, `${outputDir}/${moduleName}.d.ts`), output)

	})

program.parse(process.argv)
