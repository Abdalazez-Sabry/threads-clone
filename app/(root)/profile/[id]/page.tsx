import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import NotFound from "@/components/NotFound"
import ProfileHeader from '@/components/shared/ProfileHeader';
import  { profileTabs } from "@/constants/index"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Image from 'next/image';
import ThreadsTab from '@/components/shared/ThreadsTab';

export default async function Page({ params }: { params: { id: string }}) {
  const loggedInUser = await currentUser();
  if (!loggedInUser) {
    return null;
  }
  const profilePageInfo= await fetchUser(params.id);

  if (!profilePageInfo?.onboarded) {
    return <NotFound />;
  }

  
  return (
    <section>
      <ProfileHeader
        id={profilePageInfo.id}
        name={profilePageInfo.name}
        username={profilePageInfo.username}
        bio={profilePageInfo.bio}
        image={profilePageInfo.image}
        isMyProfile={profilePageInfo.id === loggedInUser.id} 
        
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {
              profileTabs.map((tab) => (
                <TabsTrigger value={tab.value} key={tab.label} className="tab">
                  <Image 
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <p className="max-sm:hidden">{tab.label}</p>
                  {
                    tab.value === "threads" && (
                      <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-meduim text-light-2">
                        {profilePageInfo?.threads.length} 
                      </p>
                    )
                  }
                </TabsTrigger>
              ))
            }
          </TabsList>
          {
            profileTabs.map((tab) => (
              <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
                <ThreadsTab
                  id={profilePageInfo.id}
                  loggedInId={loggedInUser.id}
                  accountType="User"
                  isMyProfile={profilePageInfo.id === loggedInUser.id}

                />
              </TabsContent>
            ))
          }
        </Tabs>
      </div>
    </section>  
  )
}
