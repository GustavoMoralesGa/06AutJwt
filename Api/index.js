import express from 'express';
import cors from 'cors';
import { usersRouter, loginIndexHandler } from './src/apiSoftJobs.js';
import { logMiddleware, validateJwtMiddleware } from './middleware/validations.js';

const app = express();
const port = 3000;

app.use(logMiddleware);

app.use(express.json())
app.use(cors())

app.use('/usuarios', usersRouter)

app.post('/login', loginIndexHandler)

app.listen(port, console.log(`Servidor iniciado en puerto ${port}`));