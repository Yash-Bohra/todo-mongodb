const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { userModel, todoModel } = require("./db");
const {auth, JWT_SECRET} = require("./auth.js")

const app = express();
app.use(express.json());
mongoose.connect(
  "mongodb+srv://yashbohra:captinamerica12@cluster0.blwck.mongodb.net/todo",
);

app.post("/signup", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  await userModel.create({
    email: email,
    password: password,
    name: name,
  });
  res.json({
    message: "Thank you for Signing up !",
  });
});

app.post("/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const user = await userModel.findOne({
    email: email,
    password: password,
  });
  console.log(user);
  if (user) {
    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      JWT_SECRET,
    );
    res.json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: "please enter correct username or password",
    });
  }
});

app.post("/todo", auth, async function (req, res) {
const userId = req.userId;
const title = req.body.title;
const isDone = req.body.title;
await todoModel.create({
  title,
  isDone,
  userId,
})
res.json({
  msg:"New Todo created"
})
});

app.get("/todos", auth, async function (req, res) {
const userId = req.userId;
const userTodo = await todoModel.find({
  userId:userId
})
res.json({
  userTodo
})
});

app.listen(3000);
