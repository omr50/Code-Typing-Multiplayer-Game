import express from 'express'

const router = express.Router();
import User from '../../models/User';
import { login } from '../../services/login/login';
import signup from '../../services/signup/signup';

// get all users? (too much users)
router.get('/', (req, res) => {
    res.send("Hit the users route!")
})

// Create new User.
router.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;
    const { username, token } = await login({ email, password});
    res.json({ username, token });

  } catch (e) {
    res.status(400).send('Authentication Error.');
  }

})

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await signup({username, email, password})
  } catch (error: any) {
    res.status(400).send(error.message);
  }
})

router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Got user with id ${id}`)
})


router.put('/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Updated user with id ${id}`)
})

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Deleted user with id ${id}`)
})



export default router;