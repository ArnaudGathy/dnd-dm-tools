import { NextResponse } from "next/server";
import { getCharactersFromCampaignId } from "@/lib/api/characters";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const characters = await getCharactersFromCampaignId(parseInt(id, 10));
  return NextResponse.json(characters);
}
