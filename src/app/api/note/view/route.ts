import { NextResponse } from "next/server";
import { connectToDatabase } from "../../db/dbconnection";
import NoteModel from "../../schema/note";
import { validateToken } from "../../middlewares/validateToken";

export const config = {
    api: {
        bodyParser: true,
    },
};

export async function GET(req: any) {
    try {
        await connectToDatabase();
        const middlewareResponse = await validateToken(req);
        if (middlewareResponse) return middlewareResponse;
        // console.log(req.query)
        // const { search = '' } = req.query;
        if (!req.user._id) {
            return NextResponse.json({ message: 'User ID is required.', error: true }, { status: 400 });
        }
        // const searchFilter = search
        //     ? { description: { $regex: search, $options: 'i' } }
        //     : {};
        const notes = await NoteModel.find({
            user: req.user._id,
            // ...searchFilter
        })
        .limit(20)
        .sort({ dateoftransaction: -1 });
        return NextResponse.json({ data: notes, error: false }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message, error: true }, { status: 500 });
    }
}
