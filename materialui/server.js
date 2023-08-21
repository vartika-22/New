
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const secretkey = "PCP";
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

mongoose.connect("mongodb://127.0.0.1:27017/PCP", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const userSchema = new mongoose.Schema({
  name:String,
  email: String,
  password: String,
  isAdmin: Boolean,
  score:Number,
  phoneNumber: String, // New field
  qualification: String,
  profileImage: String,
  gender: String, // New field
  dob: String,
  street: String,
  city: String,
  state: String, // New field
  country: String,
  totalScore: {
    type: Number,
    default: 0,
  },
  assignedQuizzes: [
    {
      quiz: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Quiz",
      }, completed: {
        type: Boolean,
        default: false,
      },
      answers: [
        {
          questionIndex: Number,
          selectedOption: String,
          isCorrect: Boolean,
        },],
      score: {
        type: Number,
        default: 0,}, },],
});
userSchema.methods.calculateTotalScore = function () {
  this.totalScore = this.assignedQuizzes.reduce((total, quiz) => total + quiz.score, 0);
};
const User = mongoose.model("User", userSchema);
app.post("/submit-quiz", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, secretkey);
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    const user = await User.findById(decodedToken.userId);
    const assignedQuiz = user.assignedQuizzes.find((aq) => aq.quiz.equals(quizId));
    if (assignedQuiz.completed) {
      return res.status(400).json({ error: "Quiz already completed" });
    }
    let score = 0;
    answers.forEach((userAnswer) => {
      const correctOption = quiz.questions[userAnswer.questionIndex].correctOption;
      if (userAnswer.selectedOption === correctOption) {
        score++;
      }
    });
    assignedQuiz.completed = true;
    assignedQuiz.score = score;
    // Calculate the total score based on completed quizzes
    const totalScore = user.assignedQuizzes.reduce((acc, aq) => {
      if (aq.completed) {
        return acc + aq.score;
      }
      return acc;
    }, 0);
    // Update the user's totalScore and save to the database
    user.totalScore = totalScore;
    await user.save();
    res.status(200).json({ message: "Quiz submitted successfully", score, totalScore });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
app.get("/user/total-score", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, secretkey);
    const user = await User.findById(decodedToken.userId);
    res.status(200).json({ totalScore: user.totalScore });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
// Modify the /signup endpoint to assign a quiz to non-admin users
app.post("/signup", async (req, res) => {
  try {
    const {name, email, password } = req.body;
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    });
    const quizzesToAssign = await Quiz.find();
    quizzesToAssign.forEach((quiz) => {
      user.assignedQuizzes.push({ quiz: quiz._id });
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully and quiz assigned" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
// Update the /assign-quizzes-to-existing-users endpoint to assign all quizzes to existing users
app.post("/assign-quizzes-to-existing-users", async (req, res) => {
  try {
    const existingUsers = await User.find();
    const availableQuizzes = await Quiz.find();
    for (const user of existingUsers) {
      user.assignedQuizzes = availableQuizzes.map((quiz) => ({ quiz: quiz._id }));
      await user.save();
    }
    res.status(200).json({ message: "All available quizzes assigned to existing users" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
     return res.status(401).json({ error: "Invalid email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
        secretkey,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, user: { _id: user._id, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/admin/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists. Please use a different email." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      email,
      password: hashedPassword,
      isAdmin: true,
    });
    await admin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

function isAdmin(req, res, next) {
  const token = req.header("Authorization").replace("Bearer ", "");
  const decodedToken = jwt.verify(token, secretkey);
  if (!decodedToken.isAdmin) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
}
const quizSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      correctOption: Number,
    },
  ],
  assignedTo: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
});
const Quiz = mongoose.model("Quiz", quizSchema);
// Add this route to your backend code
// Add this route to your backend code
app.get("/quiz/:quizId", async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
app.get("/user/challanges", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, secretkey);
    const user = await User.findById(decodedToken.userId).populate({
      path: "assignedQuizzes.quiz",
      model: "Quiz",
    });
    res.status(200).json({
      //  user: user,
      assignedQuizzes: user.assignedQuizzes });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
const upload = multer({ dest: "uploads/" });

app.post("/admin/aq", isAdmin, upload.single("file"), async (req, res) => {

  const uploadedFile = req.file;
  const filePath = path.join(__dirname, uploadedFile.path);
  try {
    const quizData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const quiz = new Quiz(quizData);
    await quiz.save();
    res.status(201).json({ message: "Quiz uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while processing the uploaded file" });
  } finally {
    fs.unlinkSync(filePath);
  }
});
// Add this route to fetch the list of users
app.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "email");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
app.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find({}, "email isAdmin totalScore");
    const leaderboardData = users
      .filter((user) => !user.isAdmin) // Exclude admin users
      .map((user) => ({
        email: user.email,
        totalScore: user.totalScore,
      }));
    // Sort leaderboard data by total score (sum of assigned quizzes' scores)
    leaderboardData.sort(
      (a, b) =>b.totalScore - a.totalScore);
    res.status(200).json(leaderboardData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
function calculateTotalScore(assignedQuizzes) {
  return assignedQuizzes.reduce((totalScore, quiz) => totalScore + quiz.score, 0);
}
// Endpoint to fetch admin email
app.get("/admin/email", isAdmin, async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, secretkey);
    const admin = await User.findById(decodedToken.userId);
    if (!admin || !admin.isAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json({ adminEmail: admin.email, adminId: admin._id });

  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Update user information and profile image
app.put("/user/update", upload.single("profileImage"), async (req, res) => {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decodedToken = jwt.verify(token, secretkey);
      const {name, phoneNumber, qualification, gender, dob, street, city, state, country } = req.body;

      const user = await User.findById(decodedToken.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // Update the user's phone number and address
      user.phoneNumber = phoneNumber;
      user.qualification = qualification;
      user.gender = gender;
      user.dob = dob;
      user.street = street;
      user.city = city;
      user.state = state;
      user.country = country;
      if (req.file) {
        const uploadedFile = req.file;
        user.profileImage = uploadedFile.path;

      }
      await user.save();
      res.status(200).json({ message: "User information updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

 app.put("/admin/update", upload.single("profileImage"), async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, secretkey);
    const {
      phoneNumber,
      gender,
      dob,
      street,
      city,
      state,
      country,
    } = req.body;
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.phoneNumber = phoneNumber;
    user.gender = gender;
    user.dob = dob;
    user.street = street;
    user.city = city;
    user.state = state;
    user.country = country;
    if (req.file) {
      const uploadedFile = req.file;
      user.profileImage = uploadedFile.path;
      user.profileImageURL = uploadedFile.path; // Store the image URL in user's data
    }
    await user.save();
    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/admin/profile", isAdmin, async (req, res) => {

  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, secretkey);
    const admin = await User.findById(decodedToken.userId);

    if (!admin || !admin.isAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json({
      phoneNumber: admin.phoneNumber,
      gender: admin.gender,
      dob: admin.dob,
      street: admin.street,
      city: admin.city,
      state: admin.state,
      country: admin.country,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
