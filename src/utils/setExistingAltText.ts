import { TypeExistingImageData } from "../types";
import { Environment } from "contentful-management";
import { ALT_TEXT_MIN_LENGTH } from "../constants/constants";
import { getFileImageName } from "./getImageFilename";

type Props = {
  existingImageData: TypeExistingImageData[];
  contentful: Environment;
  locale: string;
};

export const setExistingAltText = async ({
  existingImageData,
  contentful,
  locale,
}: Props) => {
  const images = existingImageData.filter(
    ({ altText }) => altText.length > ALT_TEXT_MIN_LENGTH
  );

  for (const { filename, altText } of images) {
    const imageName = getFileImageName(filename);

    const { items } = await contentful.getEntries({
      content_type: "image",
      locale,
      "fields.title": imageName,
      limit: 1,
    });

    const [imageEntry] = items;

    if (imageEntry.fields.altText[locale] !== altText) {
      imageEntry.fields.altText[locale] = altText;
      const entry = await imageEntry.update();
      entry.publish();

      console.log(`Updated alt-text for "${imageName}"`);
    }
  }
};
