import express from 'express'
import { CONECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'

const START_SERVER = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 8017

  app.get('/', (req, res) => {
    res.end('<h1>Hello World 2!</h1><hr>')
  })

  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello KAM Dev, I am running at http://${hostname}:${port}/`)
  })

  exitHook(() => {
    console.log('Exiting with exitHook')
    CLOSE_DB()
    console.log('Exiting with CLOSE_DB')
  })
}

(async () => {
  try {
    await CONECT_DB()
    console.log('Connected to database successfully')
    START_SERVER()
  } catch (error) {
    console.error('Error connecting to database:', error)
    process.exit(0)
  }
})()

