import { signIn as signInFunction, signOut } from "@/../auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import googleLogo from "@/../public/google_logo.png";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/16/solid";
import { getSessionData } from "@/lib/utils";

export default async function SignInButton() {
  const { isLoggedIn, userMail } = await getSessionData();

  return (
    <form
      action={async () => {
        "use server";
        if (isLoggedIn) {
          await signOut();
        } else {
          await signInFunction("google");
        }
      }}
    >
      <div className="flex items-center gap-2">
        {isLoggedIn && (
          <span className="text-xs text-muted-foreground">{userMail}</span>
        )}
        <Button
          type="submit"
          variant={"secondary"}
          className="flex items-center gap-2"
          size="xs"
        >
          {!isLoggedIn ? (
            <Image src={googleLogo} alt="Logo Google" width="20" height="20" />
          ) : (
            <ArrowLeftStartOnRectangleIcon />
          )}
          {!isLoggedIn && "Connexion"}
        </Button>
      </div>
    </form>
  );
}
