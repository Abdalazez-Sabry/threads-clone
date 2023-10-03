import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RightSidebar() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect('/dashboard');
  }

  const result = await fetchUsers({userId: user.id, searchString: '', pageNumber: 1, pageSize: 10}) 

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
        <div className="flex flex-col gap-4 mt-5 w-full ">
          {result.users.map((profile) => (
            <div className="flex gap-4 w-full items-center">
              <Image
                src={profile.image}
                alt="Profile image"
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <p className="text-light-1">{profile.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
