// SWITCHED TO INDEX.TS


// import express from 'express'

// const router = express.Router();
// import User from '../../sequelize-config/models/User'
// import { login } from '../../services/login/login';
// import signup from '../../services/signup/signup';

// // get all users? (too much users)
// router.get('/', (req, res) => {
//     res.send("Hit the users route!")
// })

// // Create new User.
// router.post('/login', async (req, res) => {
//   try {

//     const { email, password } = req.body;
//     const { username, token } = await login({ email, password});
//     res.status(200).json({ username, token });

//   } catch (e) {
//     res.status(400).send('Authentication Error.');
//   }

// })

// router.post('/signup', async (req, res) => {
//   const { username, email, password } = req.body;
//   console.log('function running')
//   try {
//     await signup({username, email, password})
//     // if there is no error return 201 created.
//     res.status(201).send("User Created.");
//   } catch (error: any) {
//     console.log("WE GOT THE ERROR", error)
//     // send 409 conflict if there is user or email confglict.
//     if (['Email already exists!', 'Username already exists!'].includes(error.message)) {
//       res.status(409).send(error.message);
//     }
//     else {
//       res.status(500).send('Internal Server Error.')
//     }
//   }
// })

// router.get('/:id', (req, res) => {
//   const id = req.params.id;
//   res.send(`Got user with id ${id}`)
// })


// router.put('/:id', (req, res) => {
//   const id = req.params.id;
//   res.send(`Updated user with id ${id}`)
// })

// router.delete('/:id', (req, res) => {
//   const id = req.params.id;
//   res.send(`Deleted user with id ${id}`)
// })



// export default router;