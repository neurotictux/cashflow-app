import express from 'express'

import { mapRoutes } from './routes'

const app = express()

mapRoutes(app)

export default app