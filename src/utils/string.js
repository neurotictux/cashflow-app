export const toMoney = (n) => {
  let result = n + ''
  result = Number(result ? result.replace(/[^0-9.]/g, '') : '0')
  const arr = (result + '').split('.')
  if (arr.length === 2) {
    result = Number(`${parseInt(arr[0])}.${parseInt(arr[1].length > 1 ? arr[1].replace('0', '') : arr[1])}`)
  }
  return '$ ' + result.toFixed(2)
}

export const fromMoney = (n) => {
  let result = n + ''
  result = Number(result ? result.replace(/[^0-9.]/g, '') : '0')
  return result
}

export const fromMoneyString = (n) => {
  let result = n + ''
  return result.replace(/[^0-9.]/g, '')
}

export const toDate = (d) => {
  let result
  const arr = (d + '').replace(/[^0-9-]/).split('-')
  if (arr.length === 3)
    result = new Date(`${arr[1]}/${arr[0]}/${arr[2]}`)
  else
    result = new Date('')
  return result
}

export const isSameMonth = (x, y) => {
  const date1 = toDate(x)
  const date2 = toDate(y)
  if (date1.toString() === 'Invalid Date' || date2.toString() === 'Invalid Date')
    return false
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth()
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
  const month = toDate(x).getMonth()
  switch (month) {
    case 0:
      return 'January'
    case 1:
      return 'February'
    case 2:
      return 'March'
    case 3:
      return 'April'
    case 4:
      return 'May'
    case 5:
      return 'June'
    case 6:
      return 'July'
    case 7:
      return 'August'
    case 8:
      return 'September'
    case 9:
      return 'October'
    case 10:
      return 'November'
    case 11:
      return 'December'
  }
}