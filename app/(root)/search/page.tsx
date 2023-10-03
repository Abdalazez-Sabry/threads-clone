

import UserCard from "@/components/cards/UserCard";
import { Input } from "@/components/ui/input";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect('/onboarding');
  }

  const result = await fetchUsers({userId: user.id, searchString: '', pageNumber: 1, pageSize: 25}) 

  return (
  <section>
    <div className="flex justify-between gap-10 items-center mb-10">

      <h1 className="head-text">Search</h1>

      <Input
        type="search"
        placeholder="Enter the name of the user"
        className="rounded-full bg-dark-3 max-w-lg  border-gray-1 text-light-1"
      
      />
    </div>

    <div className="mt-14 flex flex-col gap-9">
      {result.users.length === 0 ? (
         <p className="no-reuslt">No users found</p>
      ) : 
      <>
        {result.users.map((person) => (
          <UserCard 
            key={person.id}
            id={person.id}
            name={person.name}
            username={person.username}
            image={person.image}
            type="User" 
          />
        ))}
      </>
      } 
    </div>

  </section>
  )
}
