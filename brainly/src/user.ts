import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import zod from "zod";
import { UserModel, ContentModel, LinkModel } from "./db";

const UserRouter = Router();

const JWT_SECRET = "MY_SUPER_SECRET_KEY"; 


UserRouter.post("/signup", async (req, res) => {
  const DataObject = zod.object({
    email: zod.string().email(),
    userName: zod.string().min(3).max(10),
    password: zod.string().min(5),
    collegeName: zod.string().min(4),
  });

  const parseData = DataObject.safeParse(req.body);

  if (!parseData.success) {
    return res.status(411).json({
      message: "Invalid Data format",
    });
  }

  const { email, userName, password, collegeName } = parseData.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await UserModel.create({
      email,
      userName,
      password: hashedPassword,
      collegeName,
    });

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
});


UserRouter.post("/signin", async (req, res) => {
  const DataObject = zod.object({
    email: zod.string().email().min(5),
    password: zod.string().min(5),
  });

  const parseData = DataObject.safeParse(req.body);

  if (!parseData.success) {
    return res.status(411).json({
      message: "Invalid email or password format",
    });
  }

  const { email, password } = parseData.data;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Signin successful",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

module.exports = {
  UserRouter,
};
