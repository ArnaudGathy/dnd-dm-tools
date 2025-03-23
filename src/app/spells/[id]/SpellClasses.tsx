import { APISpell } from "@/types/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpellSubClass } from "@/app/spells/[id]/SpellSubClass";

export const SpellClasses = ({ spell }: { spell: APISpell }) => {
  if (!spell.classes?.length && !spell.subclasses?.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sort disponible pour :</CardTitle>
      </CardHeader>
      <CardContent className="flex">
        <ul className="min-w-[125px]">
          {!!spell.classes?.length && (
            <>
              <h4 className="text-muted-foreground">Par défaut :</h4>
              {spell.classes?.map((playerClass) => (
                <li key={playerClass.index}>{playerClass.name}</li>
              ))}
            </>
          )}

          {!!spell.subclasses?.length && (
            <>
              <h4 className="mt-2 text-muted-foreground">Par sous-classes :</h4>
              {spell.subclasses?.map((playerSubClass) => {
                if (!playerSubClass?.index) {
                  return null;
                }
                return (
                  <li key={playerSubClass.index}>
                    <SpellSubClass subclassIndex={playerSubClass.index} />
                  </li>
                );
              })}
            </>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};
