
import express from 'express';
import httpProxy from 'http-proxy';
import { auth } from './middleware/auth/auth';
import cors from 'cors'
import captureRawBody from './middleware/captureRawBody';
import {Readable} from 'stream'

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}


// takes the rawBody from the req and converts this
// buffer to a readable stream.
function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

const app = express();
const apiProxy = httpProxy.createProxyServer();

// this causes error. Leave the json parsing to
// the user service. Just forward in the api gateway.
// app.use(express.json());
app.use(cors())
const port = process.env.PORT || 2000;

const userServiceUrl = 'http://user-service:6000';
const orderServiceUrl = 'http://order-service:4000';


apiProxy.on('error', (err, req, res) => {
  console.error(`Proxy error: ${err}`);
  (res as any).status(502).json({ error: 'Bad Gateway' });
});

apiProxy.on('proxyReq', (proxyReq, req, res) => {
  console.log(`Proxying request to: ${proxyReq.path}`);
});

apiProxy.on('proxyRes', (proxyRes, req, res) => {
  console.log(`Received response with status: ${proxyRes.statusCode}`);
});

// Middleware to check JWT
app.post('/user/login', (req, res) => {
  console.log('user wants to log in', req.originalUrl)
  apiProxy.web(req, res, {target: `${userServiceUrl}`});
});

app.post('/user/signup', (req, res) => {
  console.log(`API Gateway received request on: ${req.originalUrl}`);
  const targetUrl = `${userServiceUrl}${req.originalUrl}`;
  console.log(`Target URL for proxy: ${targetUrl}`);
  apiProxy.web(req, res, {target: `${userServiceUrl}`});
});

// any kind of post request to the /user path must be authenticated
// except for signup and login. There can be other exceptions, put
// them before this one. Star is required otherwise its just '/user'
app.post('/user/saveGame/:user', auth, (req, res) => {
  console.log(req.originalUrl)
  apiProxy.web(req, res, {target: `${userServiceUrl}`});
});

app.use('/order', (req, res) => {
  console.log(req.originalUrl)
  apiProxy.web(req, res, {target: `${orderServiceUrl}${req.originalUrl}`});
});

app.listen(port, () => {
  console.log(`API Gateway is running on port ${port}`);
});
