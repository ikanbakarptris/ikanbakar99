const fs = require('fs');

// Fix kuesioner.tsx
let kues = fs.readFileSync('src/routes/kuesioner.tsx', 'utf8');
kues = kues.replace("window.open(https://api.whatsapp.com/send?text= + encodeURIComponent(text), '_blank');", "window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');");
fs.writeFileSync('src/routes/kuesioner.tsx', kues);

// Fix dapur-admin.dashboard.tsx
let dash = fs.readFileSync('src/routes/dapur-admin.dashboard.tsx', 'utf8');

dash = dash.replace(" + (r.nama || '').replace(/"/g, '""') + ",, '"' + (r.nama || '').replace(/"/g, '""') + '",);
dash = dash.replace(" + (r.whatsapp || '').replace(/"/g, '""') + ",, '"' + (r.whatsapp || '').replace(/"/g, '""') + '",);
dash = dash.replace(" + (r.menu_favorit || '').replace(/"/g, '""') + ",, '"' + (r.menu_favorit || '').replace(/"/g, '""') + '",);
dash = dash.replace(" + (r.tingkat_pedas || '').replace(/"/g, '""') + ",, '"' + (r.tingkat_pedas || '').replace(/"/g, '""') + '",);
dash = dash.replace(" + (r.saran || '').replace(/"/g, '""') + ", '"' + (r.saran || '').replace(/"/g, '""') + '"');

fs.writeFileSync('src/routes/dapur-admin.dashboard.tsx', dash);
