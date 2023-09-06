import express from 'express';
import { startSender } from './mqSender';
import db from "./sequelize-config/models/model_init"
import signup from './services/signup/signup';
import { login } from './services/login/login';
import cors from 'cors'

const sequelize = db.sequelize;
const app = express();
app.use(express.json());
app.use(cors())

const port = process.env.PORT || 6000;


app.get('/user', async (req, res) => {
  res.send('Hello, user service!');
});


// Create new User.
app.post('/user/login', async (req, res) => {
  console.log("LOGGING IN!")
try {
  console.log('request body', req.body)
  let { username, password } = req.body;
  const { name, token } = await login({ username, password});
  username = name;
  res.json({ username, token });

} catch (e) {
  console.log("error during login", e)
  res.status(400).send('Authentication Error.');
}

})

app.post('/user/signup', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('function running')
  try {
    await signup({username, email, password})
    // if there is no error return 201 created.
    res.status(201).send("User Created.");
  } catch (error: any) {
    console.log("WE GOT THE ERROR", error)
    // send 409 conflict if there is user or email confglict.
    if (['Email already exists!', 'Username already exists!'].includes(error.message)) {
      res.status(409).send(error.message);
    }
    else {
      res.status(500).send('Internal Server Error.')
    }
  }
})

app.post('/user/saveGame/:user', async(req, res) => {
  // save the data you get in the database.
  console.log('saving for user', req.params.user)
  const {username, wpm, accuracy} = req.body
  console.log("hit saveGame ENDPOINT", username, wpm, accuracy)
  res.status(200).send('working')
})

// app.post('/user/signup', async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     await signup({username, email, password})
//     res.status(201).send('Successfully created user!')
//   } catch (error: any) {
//     res.status(400).send(error.message);
//   }
// })

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


