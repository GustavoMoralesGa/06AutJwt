import {
  registerUser,
  checkCredentials,
  getUsers,
  hateoas
} from './querys.js'
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { validateJwtMiddleware } from '../middleware/validations.js';

const router = new Router();

const usuariosIndexHandler = async (req, res) => {
  try {
    const user = req.body
    await registerUser(user)
    res.send('Register it Ok')
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

export const loginIndexHandler = async (req, res, next) => {
  try {
    console.log(req.body)
    const { email, password } = req.body
    await checkCredentials(email, password)
    const token = jwt.sign({email}, "az_AZ", {expiresIn: 600 })
    res.json(token)
  } catch (err) {
    console.log(err)
    res.status(err.code || 500).send(err)
  }
}

const getUsuariosIndexHandler = async (req, res) => {
  try {
    const user = await getUsers(req.email)
    console.log(user)
    res.json({
      usuario: user[0],
    })
  } catch (e) {
    res.status(e.code || 500).send(e)
  }
}


router.post('/', usuariosIndexHandler);
router.get('/', validateJwtMiddleware, getUsuariosIndexHandler)

export const usersRouter = router;

export default {};