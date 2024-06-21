import "dotenv/config";
import { Asset, Environment } from "contentful-management";
import { extname, basename, join } from "path";
import { createReadStream, readdirSync } from "fs";
import mime from "mime";
import { nanoid } from "nanoid";

const {
  ALT_TEXT_PLACEHOLDER,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_MANAGEMENT_TOKEN,
  CONTENTFUL_DEFAULT_LOCALE,
  CONTENTFUL_ENV_ID,
} = process.env;

type Props = {
  contentful: Environment;
};

export const setImages = async ({ contentful }: Props) => {
  if (
    !CONTENTFUL_DEFAULT_LOCALE ||
    !CONTENTFUL_SPACE_ID ||
    !CONTENTFUL_MANAGEMENT_TOKEN ||
    !CONTENTFUL_ENV_ID
  ) {
    console.log("Missing Contentful environment variables");
    return;
  }
  const publishAsset = async (id: string) => {
    const asset = await contentful.getAsset(id);
    await asset.publish();
  };

  const createImageEntry = async (asset: Asset) => {
    const title = asset.fields.title[CONTENTFUL_DEFAULT_LOCALE];
    const id = nanoid(10).toString();

    try {
      const entry = await contentful.createEntryWithId("image", id, {
        fields: {
          title: { [CONTENTFUL_DEFAULT_LOCALE]: title },
          altText: { [CONTENTFUL_DEFAULT_LOCALE]: ALT_TEXT_PLACEHOLDER },
          image: {
            [CONTENTFUL_DEFAULT_LOCALE]: {
              sys: {
                type: "Link",
                linkType: "Asset",
                id: asset.sys.id,
              },
            },
          },
        },
      });

      await entry.publish();
      console.log(`Image entry created and published.`);
    } catch (error) {
      console.error(`Error: Could not create entry for asset: ${title}`, error);
    }
  };

  const createMediaEntry = async () => {
    try {
      const imageFiles = readdirSync("images");

      for (const imageFile of imageFiles) {
        const imgPath = join("images", imageFile);
        const extension = extname(imageFile);
        const fileName = basename(imageFile, extension);

        if (imageFile === ".DS_Store") {
          return;
        }

        console.log(`Uploading: "${imageFile}"`);

        const asset = await contentful.createAssetFromFiles({
          fields: {
            description: {
              [CONTENTFUL_DEFAULT_LOCALE]: fileName,
            },
            title: {
              [CONTENTFUL_DEFAULT_LOCALE]: fileName,
            },
            file: {
              [CONTENTFUL_DEFAULT_LOCALE]: {
                contentType: mime.getType(imgPath) ?? "",
                fileName: imageFile,
                file: createReadStream(imgPath),
              },
            },
          },
        });

        await asset.processForAllLocales();
        await publishAsset(asset.sys.id);

        console.log(`Created media entry for:"${imageFile}"`);

        createImageEntry(asset);
      }
    } catch (error) {
      console.error(`Error: Cound not upload file`, error);
    }
  };

  await createMediaEntry();
};
