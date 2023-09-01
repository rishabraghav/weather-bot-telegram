// user.model.ts
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
});

export interface User extends mongoose.Document {
  googleId: string;
  displayName: string;
  email: string;
}

export const UserModel = mongoose.model<User>('User', UserSchema);
