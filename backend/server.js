import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "your_secret_key";
const users = []; 

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).send({ message: "User created" });
});


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).send({ message: "Invalid credentials" });
});

// Add a dummy endpoint for chats (later you will link this to a database)
app.get('/api/chats', (req, res) => {
  // In a real app, you would find chats where (user == loggedInUser)
  // For now, returning an empty array means a new user sees nothing.
  res.json([]); 
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));