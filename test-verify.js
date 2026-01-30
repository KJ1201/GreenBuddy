const fetch = require('node-fetch');

const SUPABASE_URL = 'https://epfywchxdenudzgfxtkw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwZnl3Y2h4ZGVudWR6Z2Z4dGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTc4ODMsImV4cCI6MjA4NTE5Mzg4M30.ambzb_wBRblwY4n4JHU6ZoIrMs5hpsEOd4TrmVf5qgU';

async function test() {
    console.log('Testing Edge Function...');

    // Very small red pixel as base64
    const fakeImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/verify-component`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify({
                image: fakeImage,
                deviceName: 'HP DeskJet 2700',
                expectedComponentName: 'Mainboard'
            })
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();
