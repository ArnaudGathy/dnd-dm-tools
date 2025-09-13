import { CampaignId, CharacterStatus, PartyId } from "@prisma/client";
import PlayerCharacterList from "@/app/(with-nav)/characters/PlayerCharacterList";
import { getSessionData } from "@/lib/utils";
import AdminCharacterList from "@/app/(with-nav)/characters/AdminCharacterList";

export type CharacterListSearchParams = {
  campaign?: CampaignId;
  party?: PartyId;
  status?: CharacterStatus;
  search?: string;
};

export default async function Characters({
  searchParams,
}: {
  searchParams: Promise<CharacterListSearchParams>;
}) {
  const params = await searchParams;
  const { isSuperAdmin } = await getSessionData();

  if (isSuperAdmin) {
    return <AdminCharacterList searchParams={params} />;
  }

  return <PlayerCharacterList searchParams={params} />;
}
