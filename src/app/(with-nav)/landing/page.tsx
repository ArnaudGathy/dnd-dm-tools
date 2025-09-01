import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import googleLogo from "@/../public/google_logo.png";
import { Button } from "@/components/ui/button";
import { signIn as signInFunction } from "@/../auth";
import { getSessionData } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Landing() {
  const { isLoggedIn } = await getSessionData();

  if (isLoggedIn) {
    redirect("/");
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Connectez-vous</CardTitle>
          <CardDescription>
            Pour accéder aux fonctionnalités de l&#39;application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signInFunction("google");
            }}
          >
            <Button type="submit" variant="secondary" size="lg">
              <Image
                src={googleLogo}
                alt="Logo Google"
                width="20"
                height="20"
              />
              Connexion avec Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
