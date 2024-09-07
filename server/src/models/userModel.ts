import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add the user's first name"],
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      required: [true, "Please add the user's email address"],
      unique: [true, "Email address already exists"],
    },
    password: {
      type: String,
      required: [true, "Please add the user's password"],
    },
  },
  {
    timestamps: true,
  }
)

export const User = model("User", userSchema)