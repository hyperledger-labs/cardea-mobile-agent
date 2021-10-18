export const isDateAttr = (string) => {
  const dateReg = /date/gi
  return dateReg.test(string)
}