import axios from "axios";
import { SubClass, subClassSchema } from "@/types/schemas";

const baseURL = "https://www.dnd5eapi.co/api/2014";
const ExternalAPIs = axios.create({ baseURL });

export const getSubClass = async (subclassIndex: string) => {
  try {
    const response = await ExternalAPIs.get<SubClass>(
      `/subclasses/${subclassIndex}`,
    );
    const { data } = response;

    subClassSchema.parse(data);

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
