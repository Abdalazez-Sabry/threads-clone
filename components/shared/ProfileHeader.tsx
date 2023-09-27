import Image from "next/image";

interface props {
  id: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  isMyProfile: boolean;
}

export default function ProfileHeader({ id, name, username, image, bio, isMyProfile}: props) {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 object-cover">
            <Image 
              src={image}
              alt="Profile picture"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-light-1 text-left text-heading-3-bold">{name}</h1>
            <p className="text-gray-1 text-left text-base-medium">@{username}</p>
          </div>
        </div>
      </div>

        {/* TODO: community */}

        <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
        <div className="mt-12 h-0.5 w-full bg-dark-3 " />
    </div>
  )
}
