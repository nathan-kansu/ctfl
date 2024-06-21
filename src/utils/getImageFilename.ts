import { extname, basename } from "path";

export const getFileImageName = (fileName: string) => {
  const extension = extname(fileName);
  const imageName = basename(fileName, extension);
  return imageName;
};
