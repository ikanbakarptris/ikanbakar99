import app from './.output/server/index.mjs';

app.fetch(new Request('http://localhost/'))
  .then(res => console.log('STATUS:', res.status))
  .catch(err => console.error(err));
