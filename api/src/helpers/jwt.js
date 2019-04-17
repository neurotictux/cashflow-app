import expressJwt from 'express-jwt'

import { SECRET } from '../config'

export default () => expressJwt({ secret: SECRET }).unless({ path: ['/token'] })