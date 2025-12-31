import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const KEYCLOAK_JWKS_URI="http://localhost:8080/realms/React-poc/protocol/openid-connect/certs"
const KEYCLOAK_ISSUER="http://localhost:8080/realms/React-poc"

const client = jwksClient({
  jwksUri: "http://localhost:8080/realms/React-poc/protocol/openid-connect/certs",
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 24 * 60 * 60 * 1000, // 1 day
  rateLimit: true,
  jwksRequestsPerMinute: 10,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key.getPublicKey());
  });
}

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, getKey, {
    algorithms: ['RS256'],
    issuer: "http://localhost:8080/realms/React-poc",
    audience: "account"
  }, (err, decoded) => {
    console.log(">>>>decoded",decoded)
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

export default authenticate;