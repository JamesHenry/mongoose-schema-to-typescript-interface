function typescriptInterfaceGenerator(interfaceName: string, rawSchema: any) {

	let mainString = ''

	function generateFieldTypeString(fieldName: string, fieldConfig: any) {

		let interfaceString = ''

		switch (true) {

			case fieldConfig.type === String:
			// case fieldConfig.type === schema.Types.ObjectId:

				interfaceString += 'string'

				break

			case fieldConfig.type === Number:

				interfaceString += 'number'

				break

			case fieldConfig.type === Boolean:

				interfaceString += 'boolean'

				break

			case Array.isArray(fieldConfig.type) === true:

				const arrayOfType = fieldConfig.type[0]

				switch (true) {

					case arrayOfType === String:
					// case arrayOfType === schema.Types.ObjectId:

						interfaceString += 'string'

						break

					case arrayOfType === Number:

						interfaceString += 'number'

						break

					case arrayOfType === Boolean:

						interfaceString += 'boolean'

						break

					default:
						console.warn('Array type not recognised', fieldConfig)

				}

				interfaceString += '[]'

				break

			case !fieldConfig.type && Object.keys(fieldConfig).length > 0:

				const nestedInterface = generateInterface(fieldName, fieldConfig)
				mainString += nestedInterface + '\n\n'

				interfaceString += fieldName

				break

			default:
				console.warn('Field type not recognised', fieldConfig)

		}

		return interfaceString

	}

	function generateInterface(name: string, fromSchema: any) {

		let interfaceString = 'interface ' + name + ' {\n'

		Object.keys(fromSchema).forEach((fieldName) => {

			const fieldConfig = fromSchema[fieldName]

			interfaceString += '\t' + fieldName

			if (!fieldConfig.required) {
				interfaceString += '?'
			}

			interfaceString += ': ' + generateFieldTypeString(fieldName, fieldConfig)

			interfaceString += '\n'

		})

		interfaceString += '}'

		return interfaceString

	}

	const accountInterface = generateInterface(interfaceName, rawSchema)

	mainString += '\n' + accountInterface

	return mainString

}

module.exports = typescriptInterfaceGenerator
