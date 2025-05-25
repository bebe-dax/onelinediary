import { NextRequest, NextResponse } from 'next/server';
import db from '@lib/db';

export async function GET() {
    const users = db.prepare('SELECT * FROM Users').all();
    return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
    const { Name, Email, Password } = await req.json();
    const stmt = db.prepare('INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)');
    const info = stmt.run(Name, Email, Password);
    return NextResponse.json({ id: info.lastInsertRowid });
}

export async function DELETE(req: NextRequest) {
    const { UserID } = await req.json();
    db.prepare('DELETE FROM Users WHERE UserID = ?').run(UserID);
    return NextResponse.json({ success: true});
}