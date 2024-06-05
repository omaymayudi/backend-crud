import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const Users = await User.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json(Users);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error,
      error: "server Error",
    });
  }
};

export const getUserById = async (req, res) => {
  console.log(req.params.id);
  try {
    const Users = await User.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json({
      status: "success",
      Users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      message: error,
      error: "server Error",
    });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confrmPassword, role } = req.body;
  if (password !== confrmPassword) {
    return res.status(400).json({
      status: "fail",
      msg: "Passwords do not match",
    });
  }
  const hashPassword = await argon2.hash(password);

  try {
    await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });
    res.status(201).json({
      status: "success",
      msg: "Register success",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      msg: error,
      error: "server Error",
    });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, password, confrmPassword, role } = req.body;
  const dataUser = await User.findOne(req.body, {
    where: {
      uuid: id,
    },
  });
  if (!dataUser) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = dataUser.password;
  } else {
    hashPassword = await argon2.hash(password);
  }

  if (password !== confrmPassword) {
    return res.status(400).json({
      status: "fail",
      message: "Passwords do not match",
    });
  }

  try {
    await User.update(
      {
        name,
        email,
        password: hashPassword,
        role,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      status: "success",
      message: "User updated",
      data: dataUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error,
      error: "server Error",
    });
  }
};
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const dataUser = await User.findOne({
    where: {
      uuid: id,
    },
  });

  if (!dataUser) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  try {
    await User.destroy({
      where: {
        uuid: id,
      },
    });
    res.status(200).json({
      status: "success",
      message: `User with name ${dataUser.name} deleted`,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error,
      error: "server Error",
    });
  }
};
