import { Request, Response, NextFunction } from 'express';

// since express.json() will read the data stream from the request
// we need to capture it as the rawBody so that we can set the stream
// again in the request before it is sent to user service.

function captureRawBody(req: Request, res: Response, next: NextFunction) {
  const data: any[] = [];
  req.on('data', chunk => {
    data.push(chunk);
  });
  req.on('end', () => {
    req.rawBody = Buffer.concat(data);
    next();
  });
}

export default captureRawBody;
