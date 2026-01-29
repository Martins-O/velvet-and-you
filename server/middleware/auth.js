import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_production'

export function verifyToken(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Unauthorised' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = { userId: decoded.userId }
    next()
  } catch {
    return res.status(401).json({ message: 'Unauthorised' })
  }
}
