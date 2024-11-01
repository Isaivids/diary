/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../db/dbconnection";
import NoteModel from "../../schema/note";
import UserModel from "../../schema/user";
import { validateToken } from "../../middlewares/validateToken";

export const config = {
    api: {
        bodyParser: true,
    },
};

export async function POST(req: any) {
    try {
        await connectToDatabase();
        const middlewareResponse = await validateToken(req);
        if (middlewareResponse) return middlewareResponse;
        const body = await req.json();
        const { id, userId, person, dateoftransaction, transactionamount, description, settled, typeoftransaction } = body;
        if (!userId || !person || !dateoftransaction || !transactionamount || !typeoftransaction) {
            return NextResponse.json({ message: 'Missing required fields.', error: true }, { status: 400 });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found.', error: true }, { status: 404 });
        }
        let note;
        if (id) {
            note = await NoteModel.findById(id);
            if (note) {
                note.person = person;
                note.dateoftransaction = dateoftransaction;
                note.transactionamount = transactionamount;
                note.description = description;
                note.settled = settled;
                note.typeoftransaction = typeoftransaction;
                await note.save();
                return NextResponse.json({ data: note, message: 'Note updated successfully.', error: false }, { status: 200 });
            }
        }
        const newNote = new NoteModel({
            person,
            user: userId,
            dateoftransaction,
            transactionamount,
            description,
            settled,
            typeoftransaction
        });

        await newNote.save();
        return NextResponse.json({ data: newNote, message: 'Note created successfully.', error: false }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message, error: true }, { status: 500 });
    }
}
