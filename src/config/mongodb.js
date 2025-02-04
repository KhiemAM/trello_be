import { MongoClient, ServerApiVersion } from 'mongodb'

const MONGODB_URI = 'mongodb+srv://khiemam:khiemgold09022003*@cluster0.o6c52.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const DATABASE_NAME = 'trello_db'

let trelloDatabaseInstance = null

const mongoClientInstane = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONECT_DB = async () => {
  await mongoClientInstane.connect()

  trelloDatabaseInstance = mongoClientInstane.db(DATABASE_NAME)
}

export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to database first')
  return trelloDatabaseInstance
}

export const CLOSE_DB = async () => {
  await mongoClientInstane.close()
}