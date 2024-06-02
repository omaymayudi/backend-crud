import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      status: "Fail",
      msg: "you have login again",
    });
  }
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) {
    return res.status(404).json({
      status: "Fail",
      msg: "User not found",
    });
  }
  console.log(user.id);
  req.userId = user.id;
  req.role = user.role;
  next();
};

export const AdminOnly = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) {
    return res.status(404).json({
      status: "Faild",
      msg: "User not found",
    });
  }
  if (user.role !== "admin") {
    return res.status(403).json({
      status: "Faild",
      msg: "not have access",
    });
  }
};
