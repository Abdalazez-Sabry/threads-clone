import { fetchThreadsByUserId } from "@/lib/actions/thread.actions" 
import ThreadCard from "../cards/ThreadCard";

interface props {
  id: string;
  loggedInId: string;
  accountType: "User" | "Community";
  isMyProfile: boolean;
}

export default async function ThreadsTab({id, loggedInId, accountType, isMyProfile}: props) {
  const userThreads = await fetchThreadsByUserId(id);
  return (
    <section className="mt-9 flex flex-col gap-10">
      {userThreads.threads.map((thread: any) => {return (
        <ThreadCard 
          key={thread._id}
          id={thread._id}
          currentUserId={loggedInId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === 'User' ? 
            {id: userThreads.id, name: userThreads.name, image: userThreads.image}
            :
            {id: thread.author.id, name: thread.author.name, image: thread.author.image}
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={
            thread.children.map((comment: any) => {
              return {
                author: {
                  image: comment.author.image
                }
              }
            })
          }
          />
      )})}
    </section>
  )
}
