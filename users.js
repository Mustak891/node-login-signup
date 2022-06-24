import express from 'express';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { client } from './index.js';


const router = express.Router()

async function getHashPassword(password){
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

router.post('/signup', async (request, response) => {
    const { username, password } = request.body;
    const hash = await getHashPassword(password);
    const isUserExist = await client.db('B33WD').collection('users').findOne({ username: username });
    if(isUserExist){
        response.status(400).send('User already exist');
    }else{
        const result = await client.db('B33WD').collection('users').insertOne({ username: username, password: hash });
        response.status(200).send(result);
    }
})

router.post('/login', async (request, response) => {
    const { email, password } = request.body;
    const user = await client.db('B33WD').collection('users').findOne({ email: email });
    if(!user){
        response.status(400).send('User not found');
    }else{
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
            response.send({message: 'Login success', token: token});
        }else{
            response.status(400).send('invalid credentials');
        }
    }  
})

router.put('/forgot-password', async (request, response) => {
    const { username } = request.body;
    const user = await client.db('B33WD').collection('users').findOne({ username: username });
    if(!user){
        response.status(400).send('User not found');
    }else{
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        response.send({message: 'Password reset link sent to your email', token: token });
    }
})

export const usersRouter = router;
 