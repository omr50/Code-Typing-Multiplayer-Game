import express from 'express'

const router = express.Router();
import User from '../../models/User';

// get all users? (too much users)
router.get('/', (req, res) => {
    res.send("Hit the users route!")
})

// Create new User.
router.post('/', async (req, res) => {
  if (!req.body)
   return res.status(400).send(`Enter a valid user`)
  
   const {email, username, password } = req.body;

  const newUser = new User({
    email: email,
    username: username,
    password: password,
  })

  try {

    const existing_Username = await User.findOne({
      where: {
        username: newUser.username
      }
    });

    const existing_Email = await User.findOne({
      where: {
        email: newUser.email
      }
    });
    // if there is no similar username or email on record
    // create the user.
    if (!existing_Username && !existing_Email){
      await newUser.save();
      return res.status(200).send(`Successfully created User: ${newUser}`)
    }

    else if (existing_Username) {
      return res.status(409).send('Username already exists!')
    }

    else if (existing_Email) {
      return res.status(409).send('Email already exists!')
    }
    
    throw new Error();

  } catch (error) {
    return res.status(409).send(`Encountered Error: ${error}`)

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