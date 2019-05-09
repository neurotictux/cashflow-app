export const toDateFormat = (p, format) => {
  if (!p || !format)
    return p
  const date = new Date(p)
  if (date.toString() === 'Invalid Date')
    return p
  const year = String(date.getFullYear())
  let month = date.getMonth() + 1
  let day = date.getDate()
  month = (month > 9 ? '' : '0') + month
  day = (day > 9 ? '' : '0') + day
  switch (format) {
    case 'dd/MM/yy':
      return `${day}/${month}/${year.substring(2, 4)}`
    case 'dd/MM/yyyy':
      return `${day}/${month}/${year}`
    case 'MM/yyyy':
      return `${month}/${year}`
  }
}