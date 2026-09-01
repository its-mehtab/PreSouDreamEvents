import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditProfileForm from "./EditProfileForm";

export default async function EditProfilePage() {
  const session = await getSession();
  
  if (!session?.userId) {
    redirect("/login?callbackUrl=/account/edit");
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container-app max-w-lg py-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Edit Profile</h1>
      <p className="mt-1 text-sm text-ink/50">Update your personal information.</p>
      
      <EditProfileForm 
        initialName={user.name || ""} 
        phone={user.phone}
        initialEmail={user.email || ""}
        initialImage={user.image || ""}
        initialAddress={user.address || ""}
        initialDob={user.dob ? user.dob.toISOString().split('T')[0] : ""}
        initialGender={user.gender || ""}
      />
    </div>
  );
}
