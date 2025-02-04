import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let trelloDatabaseInstance = null

const mongoClientInstane = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONECT_DB = async () => {
  await mongoClientInstane.connect()

  trelloDatabaseInstance = mongoClientInstane.db(env.DATABASE_NAME)
}

export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to database first')
  return trelloDatabaseInstance
}

export const CLOSE_DB = async () => {
  await mongoClientInstane.close()
}