# CTFL

## Description

Utility functions for updating Contentful content via the Contentful API.

## Installation

Clone repo. Duplicate / rename `.env.example` to `.env` and update with your Contentful API keys.

Also, AI alt-text generation is handled via Hugging Face, so you'll need to create an account, generate an API key and add that in there too.

## Usage

Run `npm dev` to run scripts. Default script is set generate docs. Just import the functions you want when you want them.

### Scripts

Here's the scripts and what they do...

| Function Name         | Description                                                                       |
| --------------------- | --------------------------------------------------------------------------------- |
| `genDoc`              | Generates basic markdown docs from Contentful content types.                      |
| `getContentful`       | Connects to Contentful API (update those env vars).                               |
| `getImageFilename`    | Simple utility that returns the file name without a file-type suffix.             |
| `getPageImageData`    | Returns image and alt-tag text all images on a given page.                        |
| `getSitemapUrls`      | Returns an array of urls from a given sitemap url.                                |
| `setExistingAltText`  | Updates Contentful images to use existing alt-text.                               |
| `setGeneratedAltText` | Updates Contentful image alt-text for images an alt-text placeholder text.        |
| `setImages`           | Uploads all images in `images` folder to Contentful with an alt-text placeholder. |

## Contributing

Create a PR with something good I guess. 🤷🏻

## License

MIT or whatever it is.
