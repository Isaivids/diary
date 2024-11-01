import jwt from 'jsonwebtoken';
import userSchema from '../schema/user';
import { NextResponse } from 'next/server';

export const validateToken = async (req: any) => {
    if (!req.headers.get('authorization')) {
        return NextResponse.json({ message: 'Access denied. No token provided.', error: true }, { status: 401 });
    }
    
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const JWT_SECRET: any = process.env.JWT_SECRET;
    try {
        const decodedUser: any = await new Promise((resolve, reject) => {
            jwt.verify(token, JWT_SECRET, (err:any, user:any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });
        req.user = await userSchema.findById(decodedUser.id).select("-password");
        return null;
    } catch (error: any) {
        return NextResponse.json({ error: true, message: error.message }, { status: error.name === 'TokenExpiredError' ? 403 : 500 });
    }
};
