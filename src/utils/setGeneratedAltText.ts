import "dotenv/config";

import { Environment } from "contentful-management";

type Props = {
  contentful: Environment;
  locale: string;
};

const { HUGGING_FACE_API_KEY } = process.env;

import { imageToText, ImageToTextArgs } from "@huggingface/inference";

const { ALT_TEXT_PLACEHOLDER } = process.env;

export const setGeneratedAltText = async ({ contentful, locale }: Props) => {
  const generateAltText = async (data: ImageToTextArgs["data"]) => {
    const { generated_text } = await imageToText({
      accessToken: HUGGING_FACE_API_KEY,
      model: "Salesforce/blip-image-captioning-large",
      data,
    });

    return generated_text;
  };

  const imageEntries = await contentful.getEntries({
    content_type: "image",
    locale,
    "fields.altText": ALT_TEXT_PLACEHOLDER,
  });

  for (const imageEntry of imageEntries.items) {
    const assetId = imageEntry.fields.image[locale].sys.id;
    const imageName = imageEntry.fields.title[locale];
    const assetEntry = await contentful.getAsset(assetId);
    const imageUrl = `https:${assetEntry.fields.file[locale].url}`;

    if (!imageUrl) {
      return;
    }

    const imageData = await (await fetch(imageUrl)).blob();

    if (!imageData) {
      return;
    }

    const altText = await generateAltText(imageData);
    imageEntry.fields.altText[locale] = altText;
    const entry = await imageEntry.update();
    entry.publish();

    console.log(`Generated alt-text for "${imageName}"`);
  }
};
