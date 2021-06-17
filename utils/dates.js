const dateISO = new RegExp(
  '^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9]).[0-9]{3}Z$',
)
export const formatDate = (string) => {
  let input = string
  if (input.match(dateISO)) {
    date = new Date(input)
    let month = date.getMonth() + 1
    if (month < 10) {
      month = `0${month}`
    }
    input = `${date.getFullYear()}-${month}-${date.getDate()}`
  }
  return input
}
