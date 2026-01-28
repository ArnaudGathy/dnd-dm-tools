import { PageObjectResponse } from "@notionhq/client";

export function isPageObjectResponse(obj: unknown): obj is PageObjectResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "object" in obj &&
    obj.object === "page" &&
    "id" in obj &&
    "created_time" in obj &&
    "properties" in obj
  );
}

type PropertyValue = PageObjectResponse["properties"][string];
function isPropertyOfType<T extends PropertyValue["type"]>(
  prop: PropertyValue,
  type: T,
): prop is Extract<PropertyValue, { type: T }> {
  return prop.type === type;
}

const getRichText = (prop: PropertyValue) => {
  if (isPropertyOfType(prop, "rich_text")) {
    if (prop.rich_text[0]) {
      return prop.rich_text[0].plain_text;
    }
    return undefined;
  }

  throw new Error(`Property ${JSON.stringify(prop)} is not a rich text`);
};

const getTitle = (prop: PropertyValue) => {
  if (isPropertyOfType(prop, "title")) {
    const title = prop.title[0];
    if (title) {
      return title.plain_text;
    }
    return undefined;
  }
  throw new Error(`Property ${JSON.stringify(prop)} is not a number`);
};

const getNumber = (prop: PropertyValue) => {
  if (isPropertyOfType(prop, "number")) {
    if (prop.number) {
      return prop.number;
    }
    return undefined;
  }
  throw new Error(`Property ${JSON.stringify(prop)} is not a number`);
};

const getStatus = (prop: PropertyValue) => {
  if (isPropertyOfType(prop, "status")) {
    if (prop.status) {
      return prop.status?.name;
    }
  }
  throw new Error(`Property ${JSON.stringify(prop)} is not a status`);
};

const getEmoji = (response: PageObjectResponse) => {
  if (response.icon && response.icon.type === "emoji") {
    return response.icon.emoji;
  }
  return undefined;
};

export const mapQuestsFromNotion = (properties: PageObjectResponse["properties"]) => {
  return {
    id: getNumber(properties.id)!,
    name: getTitle(properties.name)!,
    giver: getRichText(properties.giver)!,
    location: getRichText(properties.location)!,
    task: getRichText(properties.task)!,
    providedItem: getRichText(properties.providedItem),
    reward: getRichText(properties.reward),
    status: getStatus(properties.status),
    outcome: getRichText(properties.outcome),
  };
};

export const mapRulesFromNotion = (response: PageObjectResponse) => {
  return {
    name: getTitle(response.properties.name)!,
    url: response.public_url,
    icon: getEmoji(response),
  };
};
