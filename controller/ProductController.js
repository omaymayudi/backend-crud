import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { Op, where } from "sequelize";

export const getProducts = async (req, res) => {
  try {
    let products;
    if (req.role === "admin") {
      products = await Product.findAll({
        include: [
          {
            model: User,
            attributes: ["uuid", "name", "email", "role"],
          },
        ],
      });
    } else {
      products = await Product.findAll({
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["uuid", "name", "email", "role"],
          },
        ],
      });
    }

    res.status(200).json({
      status: "Success",
      msg: "Get data product success",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "Faild",
      msg: "Server error",
      error,
    });
  }
};

export const getProductById = async (req, res) => {
  // console.log(req.params.id);
  try {
    const products = await Product.findOne({
      where: { uuid: req.params.id },
    });

    if (!products) {
      return res.status(404).json({
        status: "fail",
        msg: "data product not found",
      });
    }
    let dataProduct;
    if (req.role === "admin") {
      dataProduct = await Product.findOne({
        where: { id: products.id },
        include: [
          {
            model: User,
            attributes: ["uuid", "name", "email", "role"],
          },
        ],
      });
    } else {
      dataProduct = await Product.findOne({
        where: {
          where: {
            [Op.and]: [{ id: products.id }, { userId: req.userId }],
          },
        },
        include: [
          {
            model: User,
            attributes: ["uuid", "name", "email", "role"],
          },
        ],
      });
    }

    res.status(200).json({
      status: "Success",
      msg: "Get data product success",
      data: dataProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "Faild",
      msg: "Server error",
      error,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const dataProduct = await Product.create({
      name,
      price,
      userId: req.userId,
    });
    res.status(201).json({
      status: "Success",
      message: "Product created",
      data: dataProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "Faild",
      msg: "server Error",
      error,
    });
  }
};

export const updateProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    const products = await Product.findOne({
      where: { uuid: req.params.id },
    });

    if (!products) {
      return res.status(404).json({
        status: "fail",
        msg: "data product not found",
      });
    }

    if (req.role === "admin") {
      await Product.update(
        {
          name,
          price,
        },
        {
          where: {
            uuid: products.uuid,
          },
        }
      );
    } else {
      if (req.userId !== products.userId) {
        res.status(403).json({
          status: "fail",
          msg: "access denail",
        });
      }
      await Product.update(
        { name, price },
        {
          where: {
            [Op.and]: [{ id: products.id }, { userId: req.userId }],
          },
          include: [
            {
              model: User,
              attributes: ["uuid", "name", "email", "role"],
            },
          ],
        }
      );
    }

    res.status(200).json({
      status: "Success",
      msg: `Update data ${products.uuid} success`,
    });
  } catch (error) {
    res.status(500).json({
      status: "Faild",
      msg: "Server error",
      error,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { uuid: req.params.id },
    });
    if (!product) {
      return res.status(404).json({
        status: "fail",
        msg: "data not faoud",
      });
    }
    if (req.role === "admin") {
      await Product.destroy({
        where: {
          uuid: product.uuid,
        },
      });
    } else {
      if (req.userId !== product.userId) {
        return res.status(403).json({
          status: "fail",
          msg: "access denail",
        });
      }
      await Product.destroy({
        where: { [Op.and]: [{ id: product.id }, { userId: req.userId }] },
      });
    }
    res.status(200).json({
      status: "success",
      msg: `delect ${product.uuid} success`,
    });
  } catch (error) {
    res.status(500).json({
      status: "faild",
      msg: "server Error",
    });
  }
};
