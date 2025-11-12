import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import zod from "zod";
import { UserModel, ContentModel, LinkModel } from "./db";
import { userMiddleware } from "./middleware";
const { JWT_SECRET } = require("../src/config");

// Helper function to generate random hash
function random(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}






const UserRouter = Router();

 


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

UserRouter.post("/content", userMiddleware, async (req: any, res: Response) => {
  const link = req.body.link;
  const type = req.body.type;
  const title = req.body.title;

  try {
    await ContentModel.create({
      link,
      type,
      title,
      userId: req.userId,
      tags: [],
    });
    res.json({
      message: "Content created",
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

//get the user content
UserRouter.get("/show", userMiddleware, async (req: any, res: Response) => {
  const userId = req.userId;

  try {
    const content = await ContentModel.find({ userId: userId }).populate("userId", "userName");
    res.json(content);
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

//delete user content
UserRouter.delete("/delete", userMiddleware, async (req: any, res: Response) => {
  const contentId = req.body.contentId;

  try {
    await ContentModel.deleteOne({ _id: contentId, userId: req.userId });
    res.json({
      message: "Content deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});


//share the content Link
UserRouter.post("/share", userMiddleware, async (req: any, res: Response) => {
  const { share } = req.body;
  try {
    if (share) {
      // Check if a link already exists for the user.
      const existingLink = await LinkModel.findOne({ userId: req.userId });
      if (existingLink) {
        res.json({ hash: existingLink.hash }); // Send existing hash if found.
        return;
      }

      // Generate a new hash for the shareable link.
      const hash = random(10);
      await LinkModel.create({ userId: req.userId, hash });
      res.json({ hash }); // Send new hash in the response.
    } else {
      // Remove the shareable link if share is false.
      await LinkModel.deleteOne({ userId: req.userId });
      res.json({ message: "Removed link" }); // Send success response.
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

//get the shared Link
UserRouter.get("/shared/:shareLink", async (req: Request, res: Response) => {
  const hash = req.params.shareLink;

  try {
    // Find the link using the provided hash.
    const link = await LinkModel.findOne({ hash });
    if (!link) {
      res.status(404).json({ message: "Invalid share link" }); // Send error if not found.
      return;
    }

    // Fetch content and user details for the shareable link.
    const content = await ContentModel.find({ userId: link.userId });
    const user = await UserModel.findOne({ _id: link.userId });

    if (!user) {
      res.status(404).json({ message: "User not found" }); // Handle missing user case.
      return;
    }

    res.json({
      username: user.userName,
      content,
    }); // Send user and content details in response.
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

module.exports = {
  UserRouter,
};
