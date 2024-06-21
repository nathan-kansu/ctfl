import Sitemapper from "sitemapper";

export const getSitemapUrls = async (sitemapUrl?: string) => {
  if (!sitemapUrl) {
    console.log("Please provide a sitemap url");
    return;
  }

  const sitemapper = new Sitemapper({ url: sitemapUrl });
  const { sites } = await sitemapper.fetch();
  return sites;
};
