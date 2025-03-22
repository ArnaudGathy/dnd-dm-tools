import { signIn as signInFunction, signOut, auth } from "@/../auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import googleLogo from "@/../public/google_logo.png";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/16/solid";

export default async function SignInButton() {
  const session = await auth();
  const isLoggedIn = session !== null;

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
      <Button
        type="submit"
        variant={"secondary"}
        className="flex items-center gap-2"
      >
        {!isLoggedIn ? (
          <Image src={googleLogo} alt="Logo Google" width="20" height="20" />
        ) : (
          <ArrowLeftStartOnRectangleIcon />
        )}
        {!isLoggedIn && "Connexion"}
      </Button>
    </form>
  );
}
