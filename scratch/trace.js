const potrace = require('potrace');
const fs = require('fs');

const imagePath = 'C:\\Users\\CODECLOUDS-MEHTAB\\.gemini\\antigravity-ide\\brain\\055dffee-6090-479e-879e-5b226ccc3fbf\\.user_uploaded\\media_1788258260840.png';
potrace.trace(imagePath, function(err, svg) {
  if (err) throw err;
  fs.writeFileSync('output.svg', svg);
  console.log('Done tracing!');
});
