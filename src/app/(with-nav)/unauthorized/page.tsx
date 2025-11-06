import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldExclamationIcon } from "@heroicons/react/24/solid";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <ShieldExclamationIcon className="size-10 text-primary" />
            <span>Accès refusé</span>
          </CardTitle>
        </CardHeader>
        <CardContent>Vous n&apos;avez pas l&apos;autorisation de vous connecter.</CardContent>
      </Card>
    </div>
  );
}
