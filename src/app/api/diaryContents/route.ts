import { NextRequest, NextResponse } from 'next/server';
import db from '@lib/db';

export async function GET() {
    const diarieContents = db.prepare('SELECT * FROM DiaryContents').all();
    return NextResponse.json(diarieContents);
}

export async function POST(req: NextRequest) {
    const { Content, Mood } = await req.json();
    const stmt = db.prepare('INSERT INTO DiaryContents (Content, Mood) VALUES (?, ?)');
    const info = stmt.run(Content, Mood);
    return NextResponse.json({ id: info.lastInsertRowid });
}

export async function DELETE(req: NextRequest) {
    const { ContentID } = await req.json();
    db.prepare('DELETE FROM DiaryContents WHERE ContentID = ?').run(ContentID);
    return NextResponse.json({ success: true});
}