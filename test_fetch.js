fetch('http://localhost:3000/kuesioner')
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
