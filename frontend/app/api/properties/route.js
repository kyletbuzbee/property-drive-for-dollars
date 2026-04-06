import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const auth = new (await import('googleapis')).google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || './service-account.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = (await import('googleapis')).google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:H',
    });

    const rows = response.data.values || [];
    const headers = rows.shift() || [];

    const leads = rows.map((row) => ({
      timestamp: row[0] || '',
      address: row[1] || '',
      imageUrl: row[2] || '',
      indicators: row[3] || '',
      confidence: parseFloat(row[4]) || 0,
      zestimate: row[5] || 'N/A',
      yearBuilt: row[6] || 'N/A',
      distressed: row[7] === 'Yes',
    }));

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
