import { ErrorTypes } from './'

export const errorHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    if (typeof (err) === 'string')
      res.status(500).json({ message: err })
    else if (err.type === ErrorTypes.VALIDATION)
      res.status(400).json({ message: err.message })
    else
      res.status(500).json({ message: err.message })
  })
}
