import { load } from "cheerio";
import { TypeImageData } from "../types";
import { getFileImageName } from "./getImageFilename";
import { chromium } from "playwright";

export const getPageImageData = async (url: string): Promise<TypeImageData> => {
  const parseSrc = (src: string) => {
    const regex = /[^/]*$/;
    return RegExp(regex).exec(src)?.[0] ?? "";
  };

  const getPageHtml = async (url: string): Promise<string> => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url);

    const html = await page.content();
    await browser.close();

    return html;
  };

  const html = await getPageHtml(url);
  const $ = load(html);
  const imageData: TypeImageData = {};

  $("img").each((_index, { attribs }) => {
    const { alt, src } = attribs;
    const fileName = parseSrc(src);
    const imageName = getFileImageName(fileName);

    if (alt && src) {
      imageData[imageName] = alt;
    }
  });

  return imageData;
};
