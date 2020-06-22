export const parseSchema = (schemaId) => {
  try {
    console.log('SchemaId:', schemaId)
    if (schemaId) {
      const schemaIdRegex = /(.*?):([0-9]):([a-zA-Z .-_0-9]+):([a-z0-9._-]+)$/

      const schemaIdParts = schemaId.match(schemaIdRegex)

      console.log('SchemaId parts:', schemaIdParts)

      const prettyName = `${schemaIdParts[3].replace(/_/g, ' ')} V${
        schemaIdParts[4]
      }`

      console.log(`Returning pretty SchemaId: "${prettyName}"`)
      return prettyName
    } else {
      throw new Error('SchemaId is undefined')
    }
  } catch (error) {
    console.warn('Error parsing schema:', error)

    return 'Credential'
  }
}
