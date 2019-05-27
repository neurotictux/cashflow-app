/**
 * Retorna a string de uma data no formato do parâmetro informado.
 * @example
 *  toDateFormat(new Date(), 'dd/MM/yy')
 * @param {Date} date Data a ser formatada
 * @param {String} format Formato em que a data deve ser retornada
 * @returns {String} Data formatada
 */
export const toDateFormat = (date: Date | null, format: string): string => {
  if (!date || !format || date.toString() === 'Invalid Date')
    return 'Invalid Date'
  const year = String(date.getFullYear())
  let month = (date.getMonth() + 1) + ''
  const day = date.getDate()
  month = (Number(month) > 9 ? '' : '0') + month
  switch (format) {
    case 'dd/MM/yy':
      return `${(day > 9 ? '' : '0') + day}/${month}/${year.substring(2, 4)}`
    case 'MM/yyyy':
      return `${month}/${year}`
    default:
      return `${(day > 9 ? '' : '0') + day}/${month}/${year}`
  }
}