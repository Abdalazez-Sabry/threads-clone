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
    redirect('/dashboard');
  }

  const result = await fetchUsers({userId: user.id, searchString: '', pageNumber: 1, pageSize: 25}) 

  return (
  <section>
    <h1 className="head-text mb-10">Search</h1>

    {/* TODO: searchbar */}


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
