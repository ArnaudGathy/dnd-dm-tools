import CampaignsList from "@/components/navbar/CampaignsList";
import { getCampaigns } from "@/lib/api/campaigns";

export const CampaignSelect = async () => {
  const campaigns = await getCampaigns();
  return <CampaignsList campaigns={campaigns} />;
};
