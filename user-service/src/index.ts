import express from 'express';
import { startSender } from './mqSender';
import db from "./models/model_init"
import User from './models/User';
import userRoutes from './Routes/User/users'
import signup from './services/signup/signup';
import { login } from './services/login/login';

const sequelize = db.sequelize;
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;


app.get('/user', async (req, res) => {
  res.send('Hello, user service!');
});


// Create new User.
app.post('/user/login', async (req, res) => {
try {

  const { email, password } = req.body;
  const { username, token } = await login({ email, password});
  res.json({ username, token });

} catch (e) {
  res.status(400).send('Authentication Error.');
}

})

app.post('/user/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await signup({username, email, password})
    res.status(201).send('Successfully created user!')
  } catch (error: any) {
    res.status(400).send(error.message);
  }
})

app.get('/user/:id', (req, res) => {
const id = req.params.id;
res.send(`Got user with id ${id}`)
})


app.put('/user/:id', (req, res) => {
const id = req.params.id;
res.send(`Updated user with id ${id}`)
})

app.delete('/user/:id', (req, res) => {
const id = req.params.id;
res.send(`Deleted user with id ${id}`)
})

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    // start server after connection is established.
    app.listen(port, () => {
        console.log(`Usser service listening at http://localhost:${port}`);
    });
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
    // handle the error here
  });


