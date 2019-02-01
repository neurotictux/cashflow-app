export const toMoney = (n) => {
  let result = n + ''
  result = Number(result ? result.replace(/[^0-9.]/g, '') : '0')
  const arr = (result + '').split('.')
  if (arr.length === 2) {
    result = Number(`${parseInt(arr[0])}.${parseInt(arr[1].length > 1 ? arr[1].replace('0', '') : arr[1])}`)
  }
  return '$ ' + result.toFixed(2)
}

export const toReal = (val) => {
  return isNaN(val) ? val : `R$ ${Number(val)
    .toFixed(2).replace('.', ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
}

export const fromReal = n => Number(n ? n.replace(/[^0-9,]/g, '').replace(',', '.') : '0')

export const fromMoney = n => Number(n ? n.replace(/[^0-9.]/g, '') : '0')

export const fromMoneyString = n => (n + '').replace(/[^0-9.]/g, '')

export const onlyInteger = n => (n + '').replace(/[^0-9]/g, '')

export const toDate = (d) => {
  let result
  const arr = (d + '').replace('/', '-').replace(/[^0-9-]/).split('-')
  const dateStr = arr.length === 2 ? `${arr[0]}/01/${arr[1]}` : arr.length === 3 ? `${arr[1]}/${arr[0]}/${arr[2]}` : ''
  result = new Date(dateStr)
  return result
}

export const currentMonth = (monthAdded) => {
  const now = new Date()
  let month = now.getMonth() + (monthAdded > 1 && monthAdded < 12 ? monthAdded : 1)
  let year = now.getFullYear()
  if (month > 12) {
    month = month - 12
    year++
  }
  return `${month}/${year}`
}

export const isSameMonth = (x, y) => {
  const date1 = toDate(x)
  const date2 = toDate(y)
  if (date1.toString() === 'Invalid Date' || date2.toString() === 'Invalid Date')
    return false
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth()
}

export const monthYearIsHigher = (bigger, smaller) => {
  const biggerDate = toDate(bigger)
  const smallerDate = toDate(smaller)
  if (biggerDate.toString() === 'Invalid Date' || smallerDate.toString() === 'Invalid Date')
    return false
  const biggerYear = biggerDate.getFullYear()
  const smallerYear = smallerDate.getFullYear()
  const biggerMonth = biggerDate.getMonth()
  const smallerMonth = smallerDate.getMonth()
  return biggerYear > smallerYear || (biggerYear === smallerYear && biggerMonth > smallerMonth)
}

export const distinctMonths = (dates) => {
  let result = []
  if (Array.isArray(dates)) {
    dates.forEach(p => {
      const date = toDate(p)
      if (date.toString() !== 'Invalid Date' && result.filter(x => isSameMonth(x, p)).length === 0)
        result.push(p)
    })
  }
  return result
}

export const monthName = (x) => {
  let month = null
  if (!isNaN(x))
    month = Number(x) - 1
  else
    month = toDate(x).getMonth()
  switch (month) {
    case 0:
      return 'Janeiro'
    case 1:
      return 'Fevereiro'
    case 2:
      return 'Março'
    case 3:
      return 'Abril'
    case 4:
      return 'Maio'
    case 5:
      return 'Junho'
    case 6:
      return 'Julho'
    case 7:
      return 'Agosto'
    case 8:
      return 'Setembro'
    case 9:
      return 'Outubro'
    case 10:
      return 'Novembro'
    case 11:
      return 'Dezembro'
    default:
      return 'Invalid Month'
  }
}

export const generatePickerMonthYear = (monthYear, sumYears) => {
  const currentMonthYear = (monthYear || currentMonth()).split('/')
  const currYear = Number(currentMonthYear[1])
  const result = []
  let j = Number(currentMonthYear[0])
  for (let i = currYear; i <= currYear + (sumYears || 2); i++) {
    for (j; j <= 12; j++) {
      result.push(`${j > 9 ? j : '0' + j}/${i}`)
    }
    j = 1
  }
  return result
}