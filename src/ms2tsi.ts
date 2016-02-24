import generateInterface from './generate-interface'
import * as program from 'commander'
import * as fs from 'fs'
import * as path from 'path'

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

		let output = ``

		schemaFiles.forEach((schemaFile) => {

			const data = require(path.join( __dirname, `../${schemaFile}`))

			output += generateInterface(data.name, data.schema)

		})

		fs.writeFile( path.join( __dirname, `../${outputDir}/${moduleName}.d.ts`), output, () => {})

	})

program.parse(process.argv)
