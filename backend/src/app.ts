import express from 'express';
import cors from 'cors'
import bodyParser, { raw } from 'body-parser';
import { MongoClient } from "mongodb";

import { getSpotifyThing } from './spotify';
import config from './config'

const getMongoClient = async () => {
  // TODO - better way to do this?
  const client = new MongoClient(`mongodb://${config.mongo.user}:${config.mongo.password}@${config.mongo.route}/?authMechanism=DEFAULT`);
  const conn = await client.connect();
  return conn.db("playlist_generator");
}

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));

// TODO - Check these CORS Values
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(cors({ origin: ['localhost:3000',] }))

app.get('/', async (req: express.Request, res: express.Response) => {
  res.send(`pong!`)
})

app.get('/test', async (req: express.Request, res: express.Response) => {
  const client = await getMongoClient()
  res.json(`pong!`)
})

app.get('/get_spotify_thing', async (req: express.Request, res: express.Response) => {
  const thing = await getSpotifyThing()
  const client = await getMongoClient()
  const collection = await client.collection('spotifyThings')
  collection.insertOne(thing)

  res.json(thing)
})

// app.get('/temperature', async (req: express.Request, res: express.Response) => {
//   const db = await getMongoClient()
//   let collection = await db.collection("temperature");
//   const data = await collection.insertOne({ foo: 5 })
//   res.json(data)
// })

export default app