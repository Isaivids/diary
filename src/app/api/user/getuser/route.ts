import { NextResponse } from 'next/server';
import userSchema from '../../schema/user';
import { validateToken } from '../../middlewares/validateToken';

export async function GET(req:any){
    try {
        const middlewareResponse = await validateToken(req);
        if (middlewareResponse) return middlewareResponse;
        const user = await userSchema.findById({
            _id: req.user._id,
        }).select("-password");
        return NextResponse.json({data: user, error: false },{status :200});
    } catch (error:any) {
        return NextResponse.json({message: error.message, error: true },{status : 500});
    }
}