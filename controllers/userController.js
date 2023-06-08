const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Models Location
const { userModel } = require("../models/userModel");

// Nodemailer
const { sendEmail , token } = require("../nodemailer/sendingEmails");

const usersData = [];


const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  if (email == "" || password == "")
    return res.status(501).json("Enter all fields");

  try {
    const isPresent = await userModel.findOne({ email });
    if (isPresent)
      return res.status(401).send({
        Message: "User already exists",
      });

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err)
        return res.status(500).send({
          Message: "Contact to administrator",
        });

      const data = new userModel({
        name,
        email,
        password: hash,
        isVerified: false,
        verificationToken: token,
      });
      await data.save();

      usersData.push(data);

      sendEmail(data,token)
        .then(() => {
          res
            .status(201)
            .json({
              message:
                "Registration successful. Please check your email for verification.",
            });
        })
        .catch((error) => {
          console.error("Error sending verification email:", error);
          res
            .status(500)
            .json({ message: "Failed to send verification email" });
        });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      Message: error.message,
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    const token = req.params.token;
    const Id = req.params.id;

    // Find the user with the corresponding verification token
    const user = usersData.find((user) => user.verificationToken === token);

    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationToken = null;

    const userDataById = await userModel.findByIdAndUpdate(Id, {
        isVerified:true,
        verificationToken:null,
    });

    await userDataById.save();

    res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      Message: error.message,
    });
  }
};


const loginController = async (req, res) => {


  const { email, password } = req.body;

  const isPresentToken = await userModel.findOne({ email: email });
  if(isPresentToken.isVerified !== true) return res.status(404).json({ message: "Invalid verification token" });
  
  if (email == "" || password == "")
    return res.status(501).json("Enter all fields");

  try {
    const isPresent = await userModel.findOne({ email: email });
    if (!isPresent)
      return res.status(401).send({
        Message: "User not found",
      });

    const hashedPassword = isPresent?.password;

    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (!result)
        return res.status(404).send({
          Message: "login failed",
        });

      const Normal_Token = jwt.sign(
        { userId: isPresent._id },
        process.env.NORMALKEY,
        { expiresIn: "7d" }
      );

      res.status(201).send({
        Message: "Login successful",
        Token: Normal_Token,
        Data: isPresent,
      });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      Message: error.message,
    });
  }
};

module.exports = { registerController, verifyToken ,loginController };
