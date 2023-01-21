import db from '../config/database.js'

export async function authValidation(req, res, next) {
  const { authorization } = req.headers
  const token = authorization?.replace("Bearer ", '')

  if (!token) return res.status(422).send("Informe o token!")

  try {
    const sessionExists = await db.collection("sessions").findOne({ token })

    if (!sessionExists) return res.status(401).send("Você não tem autorização para acessar este recurso!")

    res.locals.session = sessionExists

    next()

  } catch (error) {
    res.status(500).send(error)
  }
}