import "dotenv/config";
import { createClient } from "contentful-management";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN, CONTENTFUL_ENV_ID } =
  process.env;

if (
  !CONTENTFUL_SPACE_ID ||
  !CONTENTFUL_MANAGEMENT_TOKEN ||
  !CONTENTFUL_ENV_ID
) {
  throw new Error("Missing Contentful environment variables");
}

const client = createClient({
  accessToken: CONTENTFUL_MANAGEMENT_TOKEN,
});

const getSpace = async () => client.getSpace(CONTENTFUL_SPACE_ID);

export const getContentful = async () => {
  try {
    const space = await getSpace();
    const environment = await space.getEnvironment(CONTENTFUL_ENV_ID);

    return environment;
  } catch (error) {
    console.error(error);
  }
};
