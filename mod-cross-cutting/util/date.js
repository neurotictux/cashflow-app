/**
 * Retorna a string de uma data no formato do parâmetro informado.
 * @example
 *  toDateFormat(new Date(), 'dd/MM/yy')
 * @param {Date} date Data a ser formatada
 * @param {String} format Formato em que a data deve ser retornada
 */
export const toDateFormat = (date, format) => {
  if (!date || !format)
    return date
  date = new Date(date)
  if (date.toString() === 'Invalid Date')
    return date
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  month = (month > 9 ? '' : '0') + month
  day = (day > 9 ? '' : '0') + day
  switch (format) {
    case 'dd/MM/yy':
      return `${day}/${month}/${String(year.substring(2, 4))}`
    case 'dd/MM/yyyy':
      return `${day}/${month}/${year}`
    case 'MM/yyyy':
      return `${month}/${year}`
  }
}