import express from 'express';
import httpProxy from 'http-proxy';
import { auth } from './middleware/auth/auth';

const app = express();
const apiProxy = httpProxy.createProxyServer();

const port = process.env.PORT || 2000;

const userServiceUrl = 'http://user-service:3000';
const orderServiceUrl = 'http://order-service:4000';


// Middleware to check JWT
app.post('/user/login', (req, res) => {
  apiProxy.web(req, res, {target: `${userServiceUrl}`});
});

app.post('/user/signup', (req, res) => {
  console.log(`API Gateway received request on: ${req.originalUrl}`);
  const targetUrl = `${userServiceUrl}${req.originalUrl}`;
  console.log(`Target URL for proxy: ${targetUrl}`);
  apiProxy.web(req, res, {target: `${userServiceUrl}`});
});

app.use('/user', auth, (req, res) => {
  console.log(req.originalUrl)
  apiProxy.web(req, res, {target: `${userServiceUrl}${req.originalUrl}`});
});

app.use('/order', (req, res) => {
  console.log(req.originalUrl)
  apiProxy.web(req, res, {target: `${orderServiceUrl}${req.originalUrl}`});
});

app.listen(port, () => {
  console.log(`API Gateway is running on port ${port}`);
});
