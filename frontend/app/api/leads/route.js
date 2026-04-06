import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request) {
  try {
    const body = await request.json();
    // Check if Google Sheets integration is configured
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || !process.env.GOOGLE_SHEET_ID) {
      console.log('Google Sheets integration not configured, skipping lead storage');
      return NextResponse.json({
        success: true,
        message: 'Lead processed but not stored (Google Sheets not configured)'
      });
    }
    const { address, image_url, indicators, confidence, zestimate, yearBuilt, distressed } = body;

    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:H',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          [
            new Date().toISOString(),
            address || '',
            image_url || '',
            indicators?.join(', ') || '',
            confidence || 0,
            zestimate || 'N/A',
            yearBuilt || 'N/A',
            distressed ? 'Yes' : 'No',
          ],
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Google Sheets error:', error);
    return NextResponse.json(
      { error: 'Failed to save lead to database' },
      { status: 500 }
    );
  }
}
