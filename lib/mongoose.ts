import mongoose from "mongoose"

let isConnected = false

export const connectToDB = async () => {
  mongoose.set('strictQuery', true)

  if (!process.env.MONGODB_URL) {
    return console.log("MONGO_URL not specified")
  }
  if (isConnected) {
    console.log("Already connected to MongoDB")
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL)
  } catch(e) {
    console.log(e)
  }
}