import { NextResponse } from "next/server";
import { connectToDatabase } from "../../db/dbconnection";
import NoteModel from "../../schema/note";
import { validateToken } from "../../middlewares/validateToken";

export const config = {
    api: {
        bodyParser: true,
    },
};

// export async function GET(req: any) {
//     try {
//         await connectToDatabase();
//         const middlewareResponse = await validateToken(req);
//         if (middlewareResponse) return middlewareResponse;
//         if (!req.user._id) {
//             return NextResponse.json({ message: 'User ID is required.', error: true }, { status: 400 });
//         }
//         const url = new URL(req.url);
//         const skip = url.searchParams.get('skip');
//         const search = url.searchParams.get('search');
//         const searchFilter = search
//         ? {
//             $or: [
//               { person: { $regex: search, $options: 'i' } },
//               { description: { $regex: search, $options: 'i' } }
//             ]
//           }
//         : {};
//         const notes = await NoteModel.find({
//             user: req.user._id,
//             ...searchFilter
//         })
//             .limit(20)
//             .sort({ createdAt: -1 });
//         return NextResponse.json({ data: notes, error: false }, { status: 200 });
//     } catch (error: any) {
//         return NextResponse.json({ message: error.message, error: true }, { status: 500 });
//     }
// }
export async function GET(req: any) {
    try {
        await connectToDatabase();
        const middlewareResponse = await validateToken(req);
        if (middlewareResponse) return middlewareResponse;
        if (!req.user._id) {
            return NextResponse.json({ message: 'User ID is required.', error: true }, { status: 400 });
        }
        const url:any = new URL(req.url);
        const search = url.searchParams.get('search');
        const dateFrom = url.searchParams.get('dateFrom') ? new Date(url.searchParams.get('dateFrom')) : null;
        const dateTo = url.searchParams.get('dateTo') ? new Date(url.searchParams.get('dateTo')) : null;
        const amountFrom = url.searchParams.get('amountFrom') ? parseFloat(url.searchParams.get('amountFrom')) : null;
        const amountTo = url.searchParams.get('amountTo') ? parseFloat(url.searchParams.get('amountTo')) : null;
        const settled = url.searchParams.get('settled') ? url.searchParams.get('settled') === 'true' : null;
        const transactionType = url.searchParams.get('transactionType') ? parseInt(url.searchParams.get('transactionType'), 10) : null;

        // Build the search filter
        const searchFilter: any = {
            user: req.user._id,
        };

        // Add search for person or description if present
        if (search) {
            searchFilter.$or = [
                { person: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (dateFrom || dateTo) {
            searchFilter.dateoftransaction = {};
            if (dateFrom) searchFilter.dateoftransaction.$gte = dateFrom;
            if (dateTo) searchFilter.dateoftransaction.$lte = dateTo;
        }

        if (amountFrom !== null || amountTo !== null) {
            searchFilter.transactionamount = {};
            if (amountFrom !== null) searchFilter.transactionamount.$gte = amountFrom;
            if (amountTo !== null) searchFilter.transactionamount.$lte = amountTo;
        }

        if (settled !== null) {
            searchFilter.settled = settled;
        }

        if (transactionType !== null) {
            searchFilter.typeoftransaction = transactionType;
        }

        // Execute the query
        const notes = await NoteModel.find(searchFilter)
            .limit(20)
            .sort({ createdAt: -1 });

        return NextResponse.json({ data: notes, error: false }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message, error: true }, { status: 500 });
    }
}
