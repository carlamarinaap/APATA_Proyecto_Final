import { Error } from "mongoose";
import CartSchema from "../models/cart.schema.js";
import express from "express";
import cartSchema from "../models/cart.schema.js";
import ticketSchema from "../models/ticket.schema.js";
import { productService } from "../../repositories/index.js";
import moment from "moment";
import userSchema from "../models/user.schema.js";
import { NotFound } from "../../test/customError.js";
import productSchema from "../models/product.schema.js";

const router = express.Router();

class CartsManager {
  getCarts = async () => {
    return await CartSchema.find();
  };

  getCartById = async (cartId) => {
    const cart = await CartSchema.findById(cartId).populate({
      path: "products.product",
      model: "Products",
    });
    if (cart) {
      return cart;
    } else {
      throw new NotFound();
    }
  };

  addCart = async () => {
    return await new CartSchema().save();
  };

  updateCart = async (cartId, productId) => {
    const cart = await CartSchema.findById(cartId);
    if (!cart) {
      throw new NotFound(`No se encontró el carrito`);
    }
    const product = await productSchema.findById(productId);
    if (!product) {
      throw new NotFound(`No se encontró el producto`);
    }
    const update = await CartSchema.findOneAndUpdate(
      { _id: cartId, "products.product": productId },
      { $inc: { "products.$.quantity": 1 } },
      { new: true } // Devuelve el documento actualizado
    );
    if (!update) {
      // Si el producto no está en el carrito, lo agrega
      await CartSchema.findByIdAndUpdate(cartId, {
        $push: { products: { product: productId, quantity: 1 } },
      });
    }
  };

  updateProductsQuantityInCart = async (cartId, productId, amount) => {
    const cart = await CartSchema.findById(cartId);
    if (!cart) {
      throw new NotFound(`No se encontró el carrito`);
    }
    const product = await productSchema.findById(productId);
    if (!product) {
      throw new NotFound(`No se encontró el producto`);
    }
    const { quantity } = amount;
    if (!quantity) {
      throw new NotFound(`No se encontró cantidad a actualizar`);
    }
    await CartSchema.findOneAndUpdate(
      { _id: cartId, "products.product": productId },
      { $set: { "products.$.quantity": amount.quantity } },
      { new: true }
    );
  };

  updateProductsInCart = async (cartId, allProducts) => {
    const cart = await CartSchema.findById(cartId);
    if (!cart) {
      throw new NotFound(`No se encontró el carrito`);
    }
    await CartSchema.findByIdAndUpdate(cartId, {
      $set: { products: allProducts },
    });
  };

  deleteProduct = async (cartId, prodId) => {
    const cart = await CartSchema.findById(cartId);
    const productId = prodId.toString();
    if (!cart) {
      throw new NotFound(`No se encontró el carrito`);
    }
    const product = await productSchema.findById(productId);
    if (!product) {
      throw new NotFound(`No se encontró el producto`);
    }
    const exists = cart.products.find(
      (product) => product.product.toString() === productId
    );
    if (!exists) {
      throw new NotFound(`No se encontró el producto dentro del carrito`);
    }
    cart.products = cart.products.filter(
      (product) => product.product.toString() !== productId
    );
    await cart.save();
  };

  cleanCartById = async (cartId) => {
    const cart = await CartSchema.findById(cartId);
    if (!cart) {
      throw new NotFound(`No se encontró el carrito`);
    }
    await CartSchema.updateOne({ _id: cartId }, { $set: { products: [] } });
  };

  purchase = async (cartId) => {
    const cart = await cartSchema.findById(cartId);
    if (!cart) {
      throw new NotFound(`No se encontró el carrito`);
    }
    const user = await userSchema.findOne({ cart: cartId });
    if (!user) {
      throw new NotFound(`Ningún usuario posee este carrito`);
    }

    // Obtener y filtrar productos disponibles
    const productChecks = await Promise.all(
      cart.products.map(async (prod) => {
        const originalProduct = await productService.getById(prod.product);
        return {
          prod,
          originalProduct,
          isAvailable: prod.quantity <= originalProduct.stock,
        };
      })
    );

    const avaiableCart = productChecks.filter((prod) => prod.isAvailable);
    let amount = 0;
    await Promise.all(
      avaiableCart.map(async (prod) => {
        amount += prod.prod.quantity * prod.originalProduct.price;
      })
    );

    let data = {
      purchase_datetime: moment().format("YYYYMMDDHHmmss"),
      purchaser: user.email,
      amount: amount,
    };

    await Promise.all(
      avaiableCart.map(async (prod) => {
        prod.originalProduct.stock -= prod.quantity;
        await productService.update(prod.prod.product, prod.originalProduct);
        await this.deleteProduct(cartId, prod.originalProduct._id);
      })
    );

    // Generar el ticket:
    const ticket = await new ticketSchema(data).save();
    return ticket;
  };
}

export default CartsManager;
