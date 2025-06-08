import { NextRequest, NextResponse } from 'next/server';
import db from '@lib/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const date = searchParams.get('date');
    const word = searchParams.get('word');
    const mood = searchParams.get('mood');
    const favorite = searchParams.get('favorite') === 'true';

    let query = 'SELECT * FROM DiaryContents WHERE 1=1';
    const params: any[] = [];

    if (date) {
        query += ' AND Date = ?'
        params.push(date);
    }
    if (word) {
        query += ' AND Content LIKE ?'
        params.push(`%${word}%`);
    }
    if (mood) {
        query += ' AND Mood = ?'
        params.push(mood);
    }
    if (favorite) {
        query += ' AND Favorite = 1';
    }

    const diaryContents = db.prepare(query).all(...params);
    return NextResponse.json(diaryContents);
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