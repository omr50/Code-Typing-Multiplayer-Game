import express from 'express';
import { startReceiver } from './mqClient';

const app = express();
const port = process.env.PORT || 4000;


app.get('/', async (req, res) => {
  try {
      await startReceiver();
      res.send('Hello, order service!');
  } catch (err: any ) {
      res.status(500).send('An error occurred: ' + err.toString());
  }
});

app.listen(port, () => {
    console.log(`Usser service listening at http://localhost:${port}`);
});
