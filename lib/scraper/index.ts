import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";
export async function scrapeAmazonProduct(url: any) {
  if (!url) return;
  // bright data proxy configuration
  //  curl -i --proxy brd.superproxy.io:33335 --proxy-user brd-customer-hl_c8eac2e6-zone-pricewise:473qo3r6vtyl -k "https://geo.brdtest.com/welcome.txt?product=unlocker&method=native"

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 33335;
  const sessionId = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${sessionId}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };
  try {
    // fetch product page
    const res = await axios.get(url, options);
    // console.log(res.data);
    const $ = cheerio.load(res.data);
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $(".a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );
    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );
    const outOfStock =
      $(`#availability span`).text().trim().toLocaleLowerCase() ===
      `currently available`;
    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";
    const imageUrl = Object.keys(JSON.parse(images));
    const currency = extractCurrency($(".a-price-symbol"));
    const discount = $(`.savingsPercentage`).text().replace(/[-%]/g, "");
    const description = extractDescription($);

    // console.log({
    //   title,
    //   currentPrice,
    //   originalPrice,
    //   outOfStock,
    //   imageUrl,
    //   discount,
    //   currency,
    //   description,
    // });
    const data = {
      url,
      image: imageUrl[0],
      title,
      currency: currency || "$",
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      discount: Number(discount),
      priceHistory: [],
      category: "category",
      stars: 4.5,
      isOutStock: outOfStock,
      reviewsCount: 100,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
    };
    console.log(data);
    return data;
  } catch (error: any) {
    throw new Error(`failed to scrap the product ${error.message}`);
  }
}
