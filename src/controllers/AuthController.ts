import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { jwtSign } from "../lib/jwt";

export const signUpController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { name, password, email } = req.body;

    if (!name)
      return res.status(400).json({
        error: "name is required",
      });
    if (!password)
      return res.status(400).json({
        error: "password is required",
      });
    if (!email)
      return res.status(400).json({
        error: "email is required",
      });

    const userAlreadyExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (userAlreadyExists)
      return res.status(400).json({
        error: "user already exists",
      });
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const token = await jwtSign();

    const response = res
      .cookie("token", token)
      .status(200)
      .json({
        ...newUser,
        token,
      });
    return response;
  } catch (e) {
    console.log("Internal server error in Signup controller", e);
    return res.status(500).json({
      error: "Internal server error ",
      e,
    });
  }
};

export const signInController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { password, email } = req.body;

    if (!password)
      return res.status(400).json({
        error: "password is required",
      });
    if (!email)
      return res.status(400).json({
        error: "email is required",
      });

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user)
      return res.status(400).json({
        error: "Invalid username/password",
      });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(400).json({
        error: "Invalid username/password",
      });

    const token = await jwtSign();
    const response = res
      .cookie("token", token)
      .status(200)
      .json({
        ...user,
        token,
      });
    return response;
  } catch (e) {
    console.log(`Internal server error in Sigin Controller`, e);
    return res.status(500).json({ error: `Internal server error` });
  }
};

export const signOutController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ msg: "Signed out success" });
  } catch (e) {
    console.log(`Internal server error in signOutControll`, e);
    return res.status(500).json({
      error: "Internal server error  ",
      e,
    });
  }
};
