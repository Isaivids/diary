/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../db/dbconnection";
import userSchema from "../../schema/user";
import CryptoJs from 'crypto-js';
import { generateToken } from "../../middlewares/jwt";

export const config = {
    api: {
        bodyParser: true,
    },
};

export async function POST(req: Request) {
    await connectToDatabase();
    const SECRET_KEY: string = process.env.SECRET_KEY || '';
    const body = await req.json();
    const { username, password } = body;
    if (!username || !password) {
        return NextResponse.json({ message: "loginMandatory", error: true }, { status: 201 });
    }
    const userExist = await userSchema.findOne({ username });
    if (userExist) {
        return NextResponse.json({ message: "user Exists", error: true }, { status: 201 });
    }
    const encryptedPassword = CryptoJs.AES.encrypt(password, SECRET_KEY).toString();
    const newUser = new userSchema({
        username: username,
        password: encryptedPassword,
    });

    try {
        const response = await newUser.save();
        const token = generateToken(response._id);
        const { password, ...userWithoutPassword } = response.toObject();
        return NextResponse.json({ data: { ...userWithoutPassword, token }, error: false }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message, error: true }, { status: 500 });
    }
}
