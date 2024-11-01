import mongoose, { Document, Model, Schema } from 'mongoose';

export interface User extends Document {
    username: string;
    password: string;
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', userSchema);

export default UserModel;
