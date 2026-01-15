import jwt from "jsonwebtoken";

export function signToken(payload, secret, expiresIn = "10d") {
  return jwt.sign(payload, secret, { expiresIn });
}
