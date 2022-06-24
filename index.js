import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient } from "mongodb";
import { usersRouter } from './users.js';


const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());

app.use(cors());

const Mongo_url = process.env.Mongo_url;

async function createConnection(){
    const client = new MongoClient(Mongo_url);
    await client.connect();
    console.log('Connected to MongoDB');
    return client;
}

export const client = await createConnection();

app.get('/', (request, response) => {
    response.send('hello world from express');
})

app.use('/users', usersRouter)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

