import express from 'express';
import { startSender } from './mqSender';
import db from "./models/model_init"
import User from './models/User';
import userRoutes from './Routes/User/users'

const sequelize = db.sequelize;
const app = express();

app.use('/users', userRoutes)

const port = process.env.PORT || 3000;


app.get('/', async (req, res) => {
  try {
      await startSender();
      const newUser = await User.create({
        name: 'John Doe',
        email: 'john.doe@example.com'
      });
      
      // Find a user by id
      const user = await User.findByPk(1);

      console.log(user)
      res.send('Hello, user service!');

  } catch (err: any ) {
      res.status(500).send('An error occurred: ' + err.toString());
  }
});

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


