import "dotenv/config";
import { getContentful } from "./utils/getContentful";
import { genDoc } from "./utils/genDoc";

const { DOCS_DIR } = process.env;

const start = async () => {
  const contentful = await getContentful();

  if (!DOCS_DIR) {
    console.log("Missing DOCS_DIR environment variable");
    return;
  }

  try {
    await genDoc({
      contentful: contentful!,
      docDir: DOCS_DIR,
    });

    console.log("Docs generated successfully");
  } catch (error) {
    console.error(error);
  }
};

start();
