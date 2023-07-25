import express from 'express';
import { startSender } from './mqSender';
import { startReceiver } from './mqClient';

const app = express();
const port = process.env.PORT || 3000;


app.get('/', async (req, res) => {
  try {
      await startSender();
      res.send('Hello, user service!');
  } catch (err: any ) {
      res.status(500).send('An error occurred: ' + err.toString());
  }
});

app.listen(port, () => {
    console.log(`Usser service listening at http://localhost:${port}`);
});
