import { NextRequest, NextResponse } from 'next/server';
import db from '@lib/db';

export async function GET() {
    const diaries = db.prepare('SELECT * FROM Diary').all();
    return NextResponse.json(diaries);
}

export async function POST(req: NextRequest) {
    const { userID, isPublic } = await req.json();
    const stmt = db.prepare('INSERT INTO Diary (userID, isPublic) VALUES (?, ?)');
    const info = stmt.run(userID, isPublic);
    return NextResponse.json({ id: info.lastInsertRowid });
}

export async function DELETE(req: NextRequest) {
    const { DiaryID } = await req.json();
    db.prepare('DELETE FROM Diary WHERE DiaryID = ?').run(DiaryID);
    return NextResponse.json({ success: true});
}