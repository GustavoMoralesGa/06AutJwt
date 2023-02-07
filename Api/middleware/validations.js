import jwt from 'jsonwebtoken'

export const logMiddleware = async (req, _res, next) => {
  console.log(req.method, req.path);
  next();
}

export const validateJwtMiddleware = async (req, res, next) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1]
    jwt.verify(token, "az_AZ")
    req.email = jwt.decode(token).email
    next()
  } catch(e) {
    res.status(e.code || 503).send(e)
  }
};
