import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Chat from "@/components/Chat";
import SignOutButton from "@/components/SignOutButton";

export default async function ChatPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main className="h-[100dvh] bg-white relative">
      <Chat userName={session.user.name || undefined} />
      <div className="absolute top-3 right-3 z-10">
        <SignOutButton />
      </div>
    </main>
  );
}
