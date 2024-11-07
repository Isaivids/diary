import { NextResponse } from "next/server";
import { connectToDatabase } from "../../db/dbconnection";
import NoteModel from "../../schema/note";
import { validateToken } from "../../middlewares/validateToken";

export async function GET(req: any) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Validate token and extract user ID
        const middlewareResponse = await validateToken(req);
        if (middlewareResponse) return middlewareResponse;

        if (!req.user._id) {
            return NextResponse.json({ message: 'User ID is required.', error: true }, { status: 400 });
        }

        // Aggregation with $facet to separate totals for typeoftransaction 1 and 2, filtered by user ID
        const result = await NoteModel.aggregate([
            {
                $match: {
                    user: req.user._id,  // Filter by logged-in user's ID
                    typeoftransaction: { $in: [1, 2] },
                    settled: false,
                },
            },
            {
                $facet: {
                    type1: [
                        { $match: { typeoftransaction: 1 } },
                        { $group: { _id: null, total: { $sum: "$transactionamount" } } },
                    ],
                    type2: [
                        { $match: { typeoftransaction: 2 } },
                        { $group: { _id: null, total: { $sum: "$transactionamount" } } },
                    ],
                },
            },
        ]);

        // Extract the totals from each facet result or set to 0 if no results
        const totalType1 = result[0].type1[0]?.total || 0;
        const totalType2 = result[0].type2[0]?.total || 0;

        // Return the response with totals for type 1 and type 2
        return NextResponse.json(
            { totalType1, totalType2, error: false },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ message: error.message, error: true }, { status: 500 });
    }
}
