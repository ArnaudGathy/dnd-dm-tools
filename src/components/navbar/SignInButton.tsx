import { signIn as signInFunction, signOut } from "@/../auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import googleLogo from "@/../public/google_logo.png";
import { getSessionData } from "@/lib/utils";
import { AccountMenu } from "@/components/navbar/AccountMenu";

export default async function SignInButton() {
  const { isLoggedIn, userMail, userName } = await getSessionData();

  if (isLoggedIn) {
    const signOutAction = async () => {
      "use server";
      await signOut();
    };

    return <AccountMenu userMail={userMail} userName={userName} signOutAction={signOutAction} />;
  }

  return (
    <form
      action={async () => {
        "use server";
        await signInFunction("google");
      }}
    >
      <Button type="submit" variant={"secondary"} className="flex items-center gap-2" size="sm">
        <Image src={googleLogo} alt="Logo Google" width="18" height="18" />
        Connexion
      </Button>
    </form>
  );
}
