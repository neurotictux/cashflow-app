import app from './app'
const port = process.env.NODE_PORT || process.env.PORT || 3000
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening in port ${port}`))