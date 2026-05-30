const https = require('https');

https.get('https://vanigan-app-automation-5il0.onrender.com/api/public/businesses', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('COUNT:', Array.isArray(json) ? json.length : 'NOT_ARRAY');
        } catch (e) {
            console.log('ERROR Parsing JSON');
        }
    });
}).on('error', (err) => {
    console.log('ERROR:', err.message);
});
