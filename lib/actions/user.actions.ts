"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose"
import { FilterQuery, SortOrder } from "mongoose";

interface IUser {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string
}

export async function updateUser({userId, username, name, bio, image, path}: IUser) : Promise<void> {
  try {
    connectToDB();
 
  await User.findOneAndUpdate(
    { id: userId },
    { 
      username: username.toLowerCase(),
      name,
      bio,
      image,
      onboarded: true,
    },
    { upsert: true}
    );

    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (e: any) {
    throw new Error(`Failed to create/update user ${e.message}`)
  }
}

export async function fetchUser(userId: string) {
  try {

    connectToDB();
    
    return await User.findOne({id: userId})
    // .populate({
      //   path: 'communities',
      //   model: 'community'
      // })
      ;
  } catch (e: any) {
    throw new Error(`Failed to fetch user ${e.message}`)
  }
}

interface params {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
  searchString?: string;
  sortBy?: SortOrder;
}

export async function fetchUsers({ userId, pageNumber = 1, pageSize = 20, searchString = "", sortBy = "desc"}: params) {
  connectToDB()
  try {
    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: {$ne: userId},
    }

    if (searchString.trim().length > 0) {
      query.$or = [
        { username: {$regex: regex }},
        {name: { $reegex: regex}}
      ]
    }

    const sortOptions = { createdAt: sortBy };
    const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize)
    const totalUsersCount = await User.countDocuments(query)

    const users = await usersQuery.exec()
    const isNext = totalUsersCount > skipAmount + users.length
    return {users, isNext};


  } catch (e: any) {
    throw new Error(`Failed to fetch users ${e.message}`)
  }
}

export async function fetchActivities (userId: string) {
  connectToDB();
  let userThreads = await User.findOne({ id: userId })
    .populate({ path: 'threads', model: Thread })
    .select("threads").exec();
   userThreads = userThreads.threads

  const childThreadsIds = userThreads.reduce((acc: any, userThread: any) => {
    return acc.concat(userThread.children)
  }, [])

  let replies = await Thread.find({
    _id: { $in: childThreadsIds },
  }).populate({ path: 'author', model: User, select: 'name image id'})

  replies = replies.filter((reply) => {
    return reply.author.id !== userId;
  })

  return replies;
}