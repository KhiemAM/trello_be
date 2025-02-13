import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import { CONECT_DB, CLOSE_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/v1', APIs_V1)

  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Productipn: Hello ${env.AUTHOR}, I am running at PORT: ${process.env.PORT}`)
    })
  } else {
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      // eslint-disable-next-line no-console
      console.log(`Developer: Hello ${env.AUTHOR}, I am running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`)
    })
  }

  exitHook(() => {
    console.log('Server is shutting down...')
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

