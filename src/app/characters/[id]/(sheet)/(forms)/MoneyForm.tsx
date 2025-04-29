import { MONEY_TYPE_MAP } from "@/constants/maps";
import SheetSingleData from "@/components/ui/SheetSingleData";
import { Money, MoneyType } from "@prisma/client";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { Input } from "@/components/ui/input";
import { PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { updateMoney } from "@/lib/actions/money";

export default function MoneyForm({ money }: { money: Money }) {
  const action = updateMoney.bind(null, money.id);
  const labelColor =
    money.type === MoneyType.SILVER
      ? "text-slate-400"
      : money.type === MoneyType.COPPER
        ? "text-orange-400"
        : "text-amber-400";

  return (
    <SheetSingleData
      label={<span className={labelColor}>{MONEY_TYPE_MAP[money.type]}</span>}
      value={
        <PopoverComponent
          definition={
            <form
              action={action}
              className="flex w-[60px] flex-col items-center gap-4"
            >
              <Input defaultValue={money.quantity} name="quantity" />
              <PopoverClose asChild>
                <Button size="lg" type="submit" className="w-full">
                  <Check />
                </Button>
              </PopoverClose>
            </form>
          }
        >
          {money.quantity}
        </PopoverComponent>
      }
    />
  );
}
