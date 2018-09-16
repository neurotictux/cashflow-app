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