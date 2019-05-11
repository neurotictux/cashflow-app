import express from 'express'
import bodyParser from 'body-parser'

import { mapRoutes } from './routes'
import auth from './auth/authHandler'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(auth)

mapRoutes(app)

export default app