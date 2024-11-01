/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken'

export const generateToken = (id: any) => {
    const JWT_SECRET: any = process.env.JWT_SECRET;
    return jwt.sign({id}, JWT_SECRET, { expiresIn: "30d" });
};