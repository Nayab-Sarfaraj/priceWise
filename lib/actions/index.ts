"use server";
import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;
  try {
    connectToDB();
    const scrappedProduct = await scrapeAmazonProduct(productUrl);
    if (!scrappedProduct) return;
    let product = scrappedProduct;

    const existingProduct = await Product.findOne({ url: scrappedProduct.url });
    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrappedProduct.currentPrice },
      ];
      product = {
        ...scrappedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }
    // if the product is not found it will cretate it as we have given upsert equals to true
    const newProduct = await Product.findOneAndUpdate(
      {
        url: scrappedProduct.url,
      },
      product,
      { new: true, upsert: true }
    );
    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Failed to create/update product : ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();
    const product = await Product.findById(productId);
    if (!product) return null;
    return product;
  } catch (error) {
    console.log("error while fetching the single product");
    console.log(error);
  }
}

export async function getAllProduct() {
  try {
    connectToDB();
    const product = await Product.find();
    if (product.length === 0) return null;
    return product;
  } catch (error) {
    console.log("error while fetcing all the product");
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) return null;
    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log("error while fetching the similar product");
    console.log(error);
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    console.log("runnig");
    // console.log(productId);
    // console.log(userEmail);
    connectToDB();
    const product = await Product.findById(productId);
    if (!product) return;
    const isUserExist = product.users.some(
      (user: User) => user.email === userEmail
    );
    console.log(isUserExist);
    console.log("hh");
    if (!isUserExist) {
      product.users.push({
        email: userEmail,
      });
      console.log("endd");
      await product.save();
      // console.log(product);
      const emailContent = await generateEmailBody(product, "WELCOME");
      await sendEmail(emailContent, userEmail);
      console.log("end");
    }
  } catch (error) {
    console.log("error while adding the user  email to the product");
    console.log(error.message);
  }
}
