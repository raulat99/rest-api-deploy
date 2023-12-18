import express, { json } from 'express' // require --> CommonJS
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
import 'dotenv/config'

export const createApp = ({ movieModel }) => {
  const app = express()
  app.disable('x-powered-by') // desabilitando el header x-powered-by: express
  app.use(json())
  app.use(corsMiddleware())

  app.use('/movies', createMovieRouter({ movieModel }))

  app.get('/', (req, res) => {
    res.json({ message: 'hola mundo' })
  })

  const PORT = process.env.PORT ?? 3000

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
  })
}

// app.options('/movies/:id', (req, res) => {
//  const origin = req.header('origin')
//  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//    res.header('Access-Control-Allow-Origin', origin)
//    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//  }
//  res.sendStatus(200)
// })
