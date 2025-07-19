import { Client } from "@notionhq/client";
import { isPageObjectResponse, mapQuestsFromNotion } from "@/utils/notion";
import { questSchema } from "@/types/schemas";
import { PartyId } from "@prisma/client";

const notion = new Client({ auth: process.env.NOTION_KEY });
const QUESTS_DATABASE_ID = "235d82fe-d61d-80c5-8f86-c86b31a6659d";

export const getAllQuests = async (partyName: PartyId) => {
  if (partyName === PartyId.MIFA) {
    const response = await notion.databases.query({
      database_id: QUESTS_DATABASE_ID,
      archived: false,
      in_trash: false,
      filter: {
        property: "status",
        type: "status",
        status: {
          does_not_equal: "Pas donnée",
        },
      },
      sorts: [{ property: "name", direction: "ascending" }],
    });

    return response.results.map((result) => {
      if (isPageObjectResponse(result)) {
        return questSchema.parse(mapQuestsFromNotion(result.properties));
      }
      throw new Error(
        "Error querying Notion database : Response is not a page object.",
      );
    });
  }

  return [];
};
