import { fetchActivities, fetchUser} from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
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

  const activities = await fetchActivities(user.id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <div className="mt-10 flex flex-col gap-5">
        {
          activities.length > 0 ? (
            <>
              {activities.map((activity: any) => (
                <Link key={activity.id} href={`/thread/${activity.parentId}`}>
                  <article className="activity-card">
                    <Image 
                      src={activity.author.image}
                      alt="Profile Photo"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-light-1"><span className="mr-1 text-primary-500">{activity.author.name}</span>{" "}replied to your thread</p>
                  </article>
                </Link>
              ))}
            </>
          ) : (
            <p className="text-gray-1 !text-base-regular">No activites yet</p>
          )
        }
      </div>
    </section>
  )
}
