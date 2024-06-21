import { ContentFields, ContentType, Environment } from "contentful-management";
import { tsMarkdown, MarkdownEntryOrPrimitive } from "ts-markdown";
import fs from "fs";
import path from "path";

type Props = {
  contentful: Environment;
  docDir: string;
};

const COLUMNS = ["name", "type"] as Partial<keyof ContentFields>[];

export const genDoc = async ({ docDir, contentful }: Props) => {
  const { items } = await contentful.getContentTypes();

  const getContentTypes = (contentTypes: ContentType[]) =>
    contentTypes.filter(({ name }) => !name.startsWith("BR_"));

  const getTableRows = (fields: ContentType["fields"]) =>
    fields.map((field) => COLUMNS.map((column) => field[column]));

  const getMarkdown = ({
    name,
    description,
    fields,
  }: ContentType): MarkdownEntryOrPrimitive[] => [
    {
      h1: name,
    },
    { p: description },
    {
      table: { columns: COLUMNS, rows: getTableRows(fields) },
    },
  ];

  const contentTypes = getContentTypes(items);
  const docs = contentTypes.map((contentType) => ({
    name: contentType.name,
    markdown: tsMarkdown(getMarkdown(contentType)),
  }));

  docs.forEach(({ markdown, name }) => {
    const filePath = path.join(docDir, `${name}.mdx`);
    fs.writeFileSync(filePath, markdown);
  });
};
