import { Client } from "@notionhq/client";
import { isPageObjectResponse, mapRulesFromNotion } from "@/utils/notion";
import { rulesSchema } from "@/types/schemas";

const notion = new Client({ auth: process.env.NOTION_KEY });
const RULES_DATABASE_ID = "2f6d82fed61d80a7bcc5e884073ef7e3";

export const getAllRules = async () => {
  const response = await notion.databases.query({
    database_id: RULES_DATABASE_ID,
    archived: false,
    in_trash: false,
    sorts: [{ property: "name", direction: "ascending" }],
  });

  return response.results.map((result) => {
    if (isPageObjectResponse(result)) {
      return rulesSchema.parse(mapRulesFromNotion(result));
    }
    throw new Error("Error querying Notion database : Response is not a page object.");
  });
};
