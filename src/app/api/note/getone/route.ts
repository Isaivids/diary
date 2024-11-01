import { NextResponse } from "next/server";
import { connectToDatabase } from "../../db/dbconnection";
import NoteModel from "../../schema/note";
import { validateToken } from "../../middlewares/validateToken";

export async function POST(req: any) {
    try {
        await connectToDatabase();
        const middlewareResponse = await validateToken(req);
        if (middlewareResponse) return middlewareResponse;
        const body = await req.json();
        const { noteId } = body;
        if (!noteId) {
            return NextResponse.json({ message: 'Note ID is required.', error: true }, { status: 201 });
        }
        const note = await NoteModel.findOne({ _id: noteId, user: req.user._id });
        if (!note) {
            return NextResponse.json({ message: 'Note not found.', error: true }, { status: 201 });
        }
        return NextResponse.json({ data: note, error: false }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message, error: true }, { status: 500 });
    }
}