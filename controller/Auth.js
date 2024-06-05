import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  const user = await User.findOne({
    where: { email: req.body.email },
  });

  if (!user) {
    return res.status(404).json({
      status: "Fail",
      msg: "USer not found",
    });
  }
  const matchPassword = await argon2.verify(user.password, req.body.password);
  if (!matchPassword) {
    return res.status(400).json({
      status: "Fail",
      msg: "Password faild",
    });
  }
  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const role = user.role;
  res.status(200).json({
    status: "Success",
    msg: "Login success",
    uuid,
    name,
    email,
    role,
  });
};

export const Logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(400).json({
        status: "Faild",
        msg: "Logout denail",
      });
    res.status(200).json({
      status: "Success",
      msg: "Logout success",
    });
  });
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      status: "Fail",
      msg: "You have login egain",
    });
  }

  const user = await User.findOne({
    attributes: ["uuid", "name", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });
  return res.status(200).json(user);

  if (!user) {
    return res.status(404).json({
      status: "Faild",
      msg: "Suer not faound",
    });
  }
};
