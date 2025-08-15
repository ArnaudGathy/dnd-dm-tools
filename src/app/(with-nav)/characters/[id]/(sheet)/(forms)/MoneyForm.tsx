"use client";

import { MONEY_TYPE_MAP } from "@/constants/maps";
import SheetSingleData from "@/components/ui/SheetSingleData";
import { Money, MoneyType } from "@prisma/client";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, LoaderCircle } from "lucide-react";
import { updateMoney } from "@/lib/actions/money";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function MoneyForm({ money }: { money: Money }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [moneyValue, setMoneyValue] = useState(money.quantity);

  const labelColor =
    money.type === MoneyType.SILVER
      ? "text-slate-400"
      : money.type === MoneyType.COPPER
        ? "text-orange-400"
        : "text-amber-400";

  const handleUpdateMoney = async () => {
    setIsLoading(true);
    try {
      await updateMoney(money.id, moneyValue);
      setIsLoading(false);
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SheetSingleData
      label={<span className={labelColor}>{MONEY_TYPE_MAP[money.type]}</span>}
      value={
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger onClick={() => setIsOpen(true)}>
            {money.quantity}
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <div className="flex w-[60px] flex-col items-center gap-4">
              <Input
                type="number"
                value={moneyValue}
                name="quantity"
                onChange={(e) => setMoneyValue(Number(e.target.value))}
              />
              <Button
                size="lg"
                type="button"
                className="w-full"
                onClick={handleUpdateMoney}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoaderCircle className="size-6 animate-spin" />
                ) : (
                  <Check />
                )}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      }
    />
  );
}
