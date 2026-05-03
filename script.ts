import fs from 'fs';
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSbwiSRDZBazHncrdypui90i8HejajjOiBVNFuaRWx_qpycU_xFRaTmd8PoMV9B8IpgaE-L6I9KldAs/pub?gid=692796767&single=true&output=csv').then(r=>r.text()).then(t=>fs.writeFileSync('csv.txt', t.split('\n').slice(0,5).join('\n')));
