import * as Keychain from 'react-native-keychain'

export const storeData = async (key, value) => {
  await Keychain.setGenericPassword(key, JSON.stringify(value), {
    service: key,
  })
}

export const getData = async (key) => {
  const data = await Keychain.getGenericPassword({service: key})

  if (!data) {
    console.warn(`Could not access data via key: ${key}`)

    return null
  }

  console.log('Storage Data:', data.password)
  return JSON.parse(data.password)
}
