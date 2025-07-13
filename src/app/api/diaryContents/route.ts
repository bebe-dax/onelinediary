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
    try {
        const body = await req.json();
        const { content, mood } = body;

        // 必須パラメータのチェック
        if (!content) {
            return NextResponse.json(
                { error: 'content is required' },
                { status: 400 }
            );
        }

        // 挿入クエリの構築
        const insertFields: string[] = ['Content'];
        const placeholders: string[] = ['?'];
        const insertParams: any[] = [content];

        // オプショナルフィールドの追加
        if (mood !== undefined) {
            insertFields.push('Mood');
            placeholders.push('?');
            insertParams.push(mood);
        }

        // クエリの組み立て
        const insertQuery = `INSERT INTO DiaryContents(${insertFields.join(', ')}) VALUES (${placeholders.join(', ')})`;

        // データベース挿入の実行
        const insertStatement = db.prepare(insertQuery);
        const result = insertStatement.run(...insertParams);

        // 挿入された内容を取得して返す
        const selectQuery = 'SELECT * FROM DiaryContents WHERE ContentID = ?';
        const insertedEntry = db.prepare(selectQuery).get(result.lastInsertRowid);

        return NextResponse.json({
            message: 'Diary entry created successfully',
            data: insertedEntry,
            id: result.lastInsertRowid
        });

    } catch (error) {
        console.error('Database insert error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { contentId, content, mood, favorite } = body;

        // 必須パラメータのチェック
        if (!contentId) {
            return NextResponse.json(
                { error: 'contentId is required' },
                { status: 400 }
            );
        }

        // 更新クエリの構築
        let updateQuery = 'UPDATE DiaryContents SET';
        const updateParams: any[] = [];
        const updateFields: string[] = [];

        if (content !== undefined) {
            updateFields.push(' Content = ?');
            updateParams.push(content);
        }
        if (mood !== undefined) {
            updateFields.push(' Mood = ?');
            updateParams.push(mood);
        }
        if (favorite !== undefined) {
            updateFields.push(' Favorite = ?');
            updateParams.push(favorite);
        }

        // 更新するフィールドが存在しない場合
        if (updateFields.length === 0) {
            return NextResponse.json(
                { error: 'No fields to update' },
                { status: 400 }
            );
        }

        updateQuery += updateFields.join(',') + ' WHERE ContentID = ?';
        updateParams.push(contentId);

        // データベース更新の実行
        const updateStatement = db.prepare(updateQuery);
        const result = updateStatement.run(...updateParams);

        // 更新対象が存在しない場合
        if (result.changes === 0) {
            return NextResponse.json(
                { error: 'Diary entry not found' },
                { status: 404 }
            );
        }

        // 更新された内容を取得して返す
        const selectQuery = 'SELECT * FROM DiaryContents WHERE ContentID = ?';
        const updatedEntry = db.prepare(selectQuery).get(contentId);

        return NextResponse.json({
            message: 'Diary entry updated successfully',
            data: updatedEntry,
            changes: result.changes
        });

    } catch (error) {
        console.error('Database update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { contentIds } = await req.json();

        // contentIdsが配列でない場合や空の場合のバリデーション
        if (!Array.isArray(contentIds) || contentIds.length === 0) {
            return NextResponse.json(
                { sucess: false, error: 'contentIds配列が必要です' },
                { status: 400 }
            );
        }

        // プレースホルダーを動的に生成(?, ?, ?, ...)
        const placeholders = contentIds.map(() => '?').join(', ');
        const query = `DELETE FROM DiaryContents WHERE ContentID IN (${placeholders})`;

        // 削除実行
        const stmt = db.prepare(query);
        const result = stmt.run(...contentIds);

        return NextResponse.json({
            sucess: true,
            deletedCount: result.changes,
            message: `${result.changes}件のデータを削除しました`
        });
    } catch (error) {
        console.error('削除処理エラー：', error);
        return NextResponse.json(
            { sucess: false, error: '削除処理中にエラーが発生しました' },
            { status: 500 }
        );
    }
}