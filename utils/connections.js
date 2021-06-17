import connectionConfigs from '@configs/connectionConfigs.js'
export const getConnectionData = (connectionRecord) => {
  try {
    let label = connectionRecord.theirLabel
    console.log('label:', label)
    if (label) {
      if (connectionConfigs[label]) {
        return connectionConfigs[label]
      } else {
        return {name: label, data: false}
      }
    } else {
      throw new Error('Label is undefined')
    }
  } catch (error) {
    console.warn('Error retrieving connection data:', error)

    return {name: 'Contact', data: false}
  }
}
