import NotFound from "@/components/NotFound"
import ThreadCard from "@/components/cards/ThreadCard"
import Comment from "@/components/forms/Comment"
import { getThread } from "@/lib/actions/thread.actions"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function Page({params} : {params: {id: string}}) {
  const thread = await getThread(params.id)
  const user = await currentUser()

  if (!user) {
    return <NotFound />
  }

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) {
    redirect('/onboarding');
  }
  
  return (
    <section className="relative">
      <div>
        <ThreadCard 
          key={thread._id}
          id={thread._id}
          currentUserId={user.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={{id: thread.author.id, name: thread.author.name, image: thread.author.image}}
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

      </div>
      <div className="mt-7">
        <Comment 
          threadId={thread.id}
          currentUserImage={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
      <div className="mt-10">
        {
          thread.children.map((comment: any) => (
            <ThreadCard 
              key={comment._id}
              id={comment._id}
              currentUserId={user.id || ""}
              parentId={comment.parentId}
              content={comment.text}
              author={{id: comment.author.id, name: comment.author.name, image: comment.author.image}}
              community={comment.community}
              createdAt={comment.createdAt}
              isComment={true}
              comments={
                comment.children.map((comment: any) => {
                  return {
                    author: {
                      image: comment.author.image
                    }
                  }
                })
              }
            />
          ))
        }
      </div>
    </section>
 )
}