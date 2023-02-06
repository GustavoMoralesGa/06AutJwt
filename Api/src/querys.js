import pg from 'pg';
import bcrypt from 'bcryptjs'
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgres",
  database: "softjobs",
  port: 5432,
  allowExitOnIdle: true
})

const registerUser = async (user) => {
  const { email, password } = user
  const encryptedPassword = bcrypt.hashSync(password);
  const consulta = 'INSERT INTO usuarios VALUES (DEFAULT, $1, $2)'
  await pool.query(consulta, [email, encryptedPassword])
}

const checkCredentials = async (email, password) => {
  const values = [email];
  const consulta = 'SELECT * FROM usuarios WHERE email = $1';
  const { rows: [usuario], rowCount }  = await pool.query(consulta, values);
  const { password: encryptedPassword } = usuario;
  const isCorrectPassword = bcrypt.compareSync(password, encryptedPassword);
  if (!isCorrectPassword || !rowCount)
    throw { code: 401, message: "Validación incorrecta"}
}

const getUsers = async (email) => {
  const values = [email]
  const consulta = 'SELECT * FROM usuarios WHERE email = $1'
  const { rows: user} = await pool.query(consulta, values)
  return user
}

const hateoas = (user) => {
  const results = {
    email: user[0]["email"],
    rol: user[0]["rol"],
    lenguage: user[0]["lenguage"]
  }
  const total = user.length
  const result = {
    total,
    results
  }
  return result
}


export {
  registerUser,
  checkCredentials,
  getUsers,
  hateoas
}