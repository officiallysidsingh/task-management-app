import { Schema, model } from "mongoose";

const authSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    password: {
      type: String,
      required: [true, "Please add the user's password"],
    },
  },
  {
    timestamps: true,
  }
);

export const Auth = model("Auth", authSchema);
