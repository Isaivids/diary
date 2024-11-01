/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../db/dbconnection";
import { generateToken } from "../../middlewares/jwt";
import userSchema from "../../schema/user";
import CryptoJs from 'crypto-js';

export const config = {
    api: {
        bodyParser: true,
    },
};
export async function POST(req:any) {
    try {
        await connectToDatabase();
        const SECRET_KEY: string = process.env.SECRET_KEY || '';
        const body = await req.json();
        const { username, password } = body;
        if (!username || !password) {
            return NextResponse.json({ message: 'Email and password are required.', error: true },{status : 201});
        }
        const user = await userSchema.findOne({ username });
        if (!user) {
            return NextResponse.json({ message: 'User not found.', error: true },{status : 201});
        }
        const decryptedPassword = CryptoJs.AES.decrypt(user.password, SECRET_KEY).toString(CryptoJs.enc.Utf8);
        if (decryptedPassword !== password) {
            return NextResponse.json({ message: 'Incorrect password.', error: true },{status : 201});
        }
        const token = generateToken(user._id);
        console.log(token)
        const { password: _, ...userWithoutPassword } = user.toObject(); 
        return NextResponse.json({ data: { ...userWithoutPassword, token }, error: false },{status : 200});
    } catch (error: any) {
        return NextResponse.json({ message: error.message, error: true },{status : 500});
    }
};
