"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Community from "../models/community.model";

interface Params {
  text: string,
  author: string, 
  communityId: string | null,
  path: string,

}

export async function createThread({text, author, communityId, path}: Params 
) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author, 
      community: communityIdObject,
      
    });
    // Update user model
  await User.findByIdAndUpdate(author, {
    $push: {
      threads: createdThread._id
    }
  });
  if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }
  
  revalidatePath(path);
  } catch (e: any) {
    throw new Error(`Could not create thread ${e.message}`);
  }
}

export async function fetchThreads (pageNumber = 1, pageSize = 20 ) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize; 

  // fetch all threads that have no parent (top-lavel threads) 
  const threadsQuery = Thread.find({ parentId: {$in: [null, undefined]}})
    .sort({createdAt: 'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate({path: 'author', model: User, select: "id name parentId image"})
    .populate({path: 'children', populate: {
      path: 'author',
      model: User,
      select: "id name parentId image"
    }})
    
    const totalThreadsCount = await Thread.countDocuments({parentId: {$in: [null, undefined]}})
    const threads = await threadsQuery.exec();
    const isNext = totalThreadsCount > skipAmount + threads.length;
    return {threads, isNext}
     
}

export async function getThread(threadId: string) {
  connectToDB();

  try {

    // TODO: populate community 
    const threadQuery = Thread.findById(threadId)
    .populate({
      path: 'author', 
      model: User, 
      select: "id name parentId image"
    })
    .populate({
      path: 'children', 
      populate: [
        {
          path: 'author',
          model: User,
          select: "_id id name parentId image"
        },
        {
          path: 'children',
          model: Thread,
          select: "_id name parentId image",
          populate: {
            path: 'author',
            model: User,
            select: "id name parentId image"
          }
        }
  ]})
    const thread = await threadQuery.exec();
    return thread;
  } catch (e: any) {
    throw new Error(`thread not found: ${e.message}`);
  }
}

export async function addComemntToThread(threadId: string, commentText: string, userId: string, path: string) {
  connectToDB();
 try {
  const mainThread = await Thread.findById(threadId).exec();

  if (!mainThread) {
    throw new Error(`Thread not found`);
  }

  const commentThread = new Thread({
    text: commentText,
    author: userId,
    parentId: threadId,
  })

  const savedCommentThread = await commentThread.save()
  mainThread.children.push(savedCommentThread._id);
  await mainThread.save()

  revalidatePath(path)

 } catch (e: any) {
  throw new Error(`couldn't add the comment: ${e.message}`);

} 
}

export async function fetchThreadsByUserId(userId: string) {
  connectToDB();
  try {
    const userThreads = await User.findOne({id: userId})
      .populate([
        {

          path: 'threads',
          populate: [
            {
              path: 'author',
              model: User,
              select: "_id id name parentId image",
            },
            {
              path: 'children', 
              populate: [
                {
                  path: 'author',
                  model: User,
                  select: "_id id name parentId image"
                },
                {
                  path: 'children',
                  model: Thread,
                  select: "_id name parentId image",
                  populate: {
                    path: 'author',
                    model: User,
                    select: "id name parentId image"
                  }
                }
              ]
            }
          ],
        }
      ])
      .select('threads id name image')
      .exec()
    
      return userThreads;
    

  } catch(e: any) {
    throw new Error(`couldn't fetch threads by user ${userId}: ${e.message}`);
  }
}