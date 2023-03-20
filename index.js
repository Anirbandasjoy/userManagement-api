const express = require("express");
const app = express();
const multer = require('multer');
require('dotenv').config();
const PORT = process.env.PORT;



const upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({extended : true}));
app.use(express.json())


const mongoose = require('mongoose');


//Mongodb atlas connect and schema or model

const dbURL = process.env.DB_URL;

mongoose.connect(dbURL)
.then(() => console.log('MongoDB atlas Connected'))
.catch((err) => console.log(err));


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  pictureUrl: String,
});

const User = mongoose.model('User', userSchema);

// Get all users
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
  });
  
  // Get a user by ID
  app.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  });
  
  // Create a new user

  app.get("/post",(req,res) => {
    res.sendFile(__dirname + "/post.html")
  })
  app.post('/users', upload.single('picture'), async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      pictureUrl: req.file ? req.file.path : null,
    });
    await user.save();
    res.json(user);
  });
  
  // Update an existing user
  app.put('/users/:id', upload.single('picture'), async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.username = req.body.username;
    user.pictureUrl = req.file ? req.file.path : user.pictureUrl;
    await user.save();
    res.json(user);
  });
  
  // Delete a user
  app.delete('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    await user.delete();
    res.send('User deleted');
  });

  
app.get("/",(req,res) => {
    res.sendFile(__dirname + "/index.html")
})

  app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`)
  })
