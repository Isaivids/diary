import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface Note extends Document {
    person: string;
    user: Types.ObjectId;
    dateoftransaction: Date;
    dateofsettlement: Date;
    transactionamount: number;
    description: string;
    settled: boolean;
    typeoftransaction: number;
}

const noteSchema: Schema = new Schema({
    person: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    dateoftransaction: { type: Date, required: true, default: Date.now },
    dateofsettlement: { type: Date },
    transactionamount: { type: Number, required: true, default: 0 },
    description: { type: String, required: true, default: '' },
    settled: { type: Boolean, default: false },
    typeoftransaction: { type: Number, required: true }
},{timestamps : true});

const NoteModel: Model<Note> = mongoose.models.Note || mongoose.model<Note>('Note', noteSchema);

export default NoteModel;
