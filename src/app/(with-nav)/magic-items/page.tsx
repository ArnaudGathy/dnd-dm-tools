import { restrictToAdmins } from "@/lib/utils";
import { getUnassignedMagicItems } from "@/lib/api/magicItems";
import MagicItemsPool from "@/app/(with-nav)/magic-items/MagicItemsPool";

const MagicItemsPage = async () => {
  await restrictToAdmins();

  const items = await getUnassignedMagicItems();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <MagicItemsPool items={items} />
    </div>
  );
};

export default MagicItemsPage;
