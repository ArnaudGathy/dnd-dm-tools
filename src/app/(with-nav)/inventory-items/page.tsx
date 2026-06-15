import { restrictToAdmins } from "@/lib/utils";
import { getUnassignedInventoryItems } from "@/lib/api/inventoryItems";
import InventoryItemsPool from "@/app/(with-nav)/inventory-items/InventoryItemsPool";

const InventoryItemsPage = async () => {
  await restrictToAdmins();

  const items = await getUnassignedInventoryItems();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <InventoryItemsPool items={items} />
    </div>
  );
};

export default InventoryItemsPage;
