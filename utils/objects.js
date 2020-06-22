export const trimObjectStrings = (object) => {
  for (const property in object) {
    if (typeof object[property] === typeof '') {
      object[property] = object[property].trim()
    } else if (typeof object[property] === typeof {}) {
      object[property] = trimObjectStrings(object[property])
    }
  }
  return object
}
