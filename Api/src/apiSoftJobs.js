import {
  registerUser,
  checkCredentials,
  getUsers,
  hateoas
} from './querys.js'
import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = new Router();

const usuariosIndexHandler = async (req, res) => {
  try {
    const user = req.body;
    await registerUser(user)
    res.send('Register it Ok')
  } catch (err) {
    res.status(500).send(err)
  }
}

export const loginIndexHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body
    await checkCredentials(email, password)
    const token = jwt.sign({email}, "az_AZ", {expiresIn: 600 })
    res.json({
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(err.code || 500).send(err)
  }
}

const getUsuariosIndexHandler = async (req, res, next) => {
  const Authorization = req.header("Authorization");
  const token = Authorization.split("Bearer ")[1]
  jwt.verify(token, "az_AZ")
  const { email } = jwt.decode(token)
  const user = await getUsers(email)
  const reshateoas = await hateoas(user)
  res.json(reshateoas)
}


router.post('/', usuariosIndexHandler);
router.get('/', getUsuariosIndexHandler)

export const usersRouter = router;

export default {};