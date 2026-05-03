import React, { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import html2canvas from 'html2canvas';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, ChartDataLabels);

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbwiSRDZBazHncrdypui90i8HejajjOiBVNFuaRWx_qpycU_xFRaTmd8PoMV9B8IpgaE-L6I9KldAs/pub?gid=692796767&single=true&output=csv";

interface TaskData {
  ref: string;
  area: string;
  problem: string;
  stage: string;
  category: string;
  targetDate: string;
  progress: string;
  days: number;
  status: string;
  user: string;
}

export default function AOSDashboard() {
  const [mainData, setMainData] = useState<TaskData[]>([]);
  const [filteredData, setFilteredData] = useState<TaskData[]>([]);
  const [sysStatus, setSysStatus] = useState('[ SYSTEM INTEGRITY: INITIALIZING ]');
  const [zoomLevel, setZoomLevel] = useState(0.95);
  const captureRef = useRef<HTMLDivElement>(null);
  
  const [filters, setFilters] = useState({
    area: 'all',
    stage: 'all',
    category: 'all',
    status: 'all',
    user: 'all'
  });

  const [uniqueValues, setUniqueValues] = useState({
    area: [] as string[],
    stage: [] as string[],
    category: [] as string[],
    status: [] as string[],
    user: [] as string[]
  });

  useEffect(() => {
    start();
    const interval = setInterval(start, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = document.getElementById('matrix-bg') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(1, 1, 1, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0099ff';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, mainData]);

  const start = async () => {
    try {
      const response = await fetch(`${CSV_URL}&cb=${Date.now()}`);
      const text = await response.text();
      const rows = text.split("\n").slice(1);
      const parsedData = rows.map(line => {
        const c = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
        return {
          ref: c[0] || "", area: c[1] || "", problem: c[2] || "",
          stage: c[3]?.trim() || "", category: c[4]?.trim() || "",
          targetDate: c[5] || "", progress: (c[6]?.toString() || "0").replace('%','').trim() || "0",
          days: parseInt(c[7]) || 0, status: c[8]?.trim() || "", user: c[9] || ""
        };
      }).filter(x => x.area);
      
      setMainData(parsedData);
      
      setUniqueValues({
        area: [...new Set(parsedData.map(d => d.area))].filter(v => v).sort(),
        stage: [...new Set(parsedData.map(d => d.stage))].filter(v => v).sort(),
        category: [...new Set(parsedData.map(d => d.category))].filter(v => v).sort(),
        status: [...new Set(parsedData.map(d => d.status))].filter(v => v).sort(),
        user: [...new Set(parsedData.map(d => d.user))].filter(v => v).sort()
      });
      
      setSysStatus(`[ SYSTEM INTEGRITY: OPTIMAL ] - SYNC: ${new Date().toLocaleTimeString()}`);
    } catch(e) { 
      setSysStatus(`[ SYNC ERROR ]`); 
    }
  };

  const applyFilters = () => {
    const filtered = mainData.filter(d => {
      return (filters.area === 'all' || d.area === filters.area) &&
             (filters.stage === 'all' || d.stage === filters.stage) &&
             (filters.category === 'all' || d.category === filters.category) &&
             (filters.status === 'all' || d.status === filters.status) &&
             (filters.user === 'all' || d.user === filters.user);
    });
    setFilteredData(filtered);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetZoom = () => setZoomLevel(1.0);

  const takeScreenshot = async () => {
    if (captureRef.current) {
      const originalTransform = captureRef.current.style.transform;
      captureRef.current.style.transform = 'scale(1)';
      captureRef.current.style.width = '1400px';
      
      try {
        const canvas = await html2canvas(captureRef.current, { backgroundColor: "#010101", scale: 2, useCORS: true });
        const link = document.createElement('a');
        link.download = `APEX_KPI_REPORT_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } finally {
        captureRef.current.style.transform = originalTransform;
        captureRef.current.style.width = '100%';
      }
    }
  };

  const stats = {
    Done: filteredData.filter(x => parseInt(x.progress) === 100).length,
    Safe: filteredData.filter(x => x.status === "Safe" && parseInt(x.progress) < 100).length,
    Monitor: filteredData.filter(x => x.status === "Monitor" && parseInt(x.progress) < 100).length,
    Assistance: filteredData.filter(x => x.status === "Assistance Needed" && parseInt(x.progress) < 100).length,
    Overdue: filteredData.filter(x => x.days <= 0 && x.status !== "Assistance Needed" && parseInt(x.progress) < 100).length
  };
  
  const totalCount = filteredData.length;
  const activeTotal = Object.values(stats).reduce((a, b) => a + b, 0) || 1;
  const labels = ['DONE', 'SAFE', 'MONITOR', 'ASSISTANCE', 'OVERDUE'];
  const vals = [stats.Done, stats.Safe, stats.Monitor, stats.Assistance, stats.Overdue];
  const colors = ['#00e676', '#ff9100', '#ff3333', '#FF2400', '#ff0000'];

  const chartOptions = {
    plugins: { 
      legend: { labels: { color: '#fff', font: { family: 'Orbitron', size: 9 } } },
      datalabels: {
        color: '#fff', font: { weight: 'bold' as const, family: 'Rajdhani', size: 11 },
        formatter: (v: number) => v > 0 ? `${v} (${((v/activeTotal)*100).toFixed(0)}%)` : ''
      }
    }
  };

  return (
    <div className="aos-container" style={{ backgroundColor: '#010101', color: '#fff', minHeight: '100vh', fontFamily: 'Rajdhani, sans-serif', overflowX: 'hidden', position: 'relative' }}>
      <canvas id="matrix-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.15, pointerEvents: 'none' }}></canvas>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700&display=swap');
        
        .aos-container {
          --primary: #0099ff;
          --completed: #00e676;
          --safe: #ff9100;
          --watch-red: #ff3333;
          --assist-scarlet: #FF2400; 
          --overdue: #ff0000;
          --silver: #C0C0C0;
          --glass: rgba(255, 255, 255, 0.05);
          --glass-border: rgba(255, 255, 255, 0.1);
        }

        .aos-container ::-webkit-scrollbar { width: 4px; height: 4px; }
        .aos-container ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }

        .ticker-wrap {
            width: 100%;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.03);
            border-top: 1px solid var(--glass-border);
            border-bottom: 1px solid var(--glass-border);
            white-space: nowrap;
        }
        .ticker-move {
            display: inline-block;
            padding-left: 100%;
            animation: ticker 25s linear infinite;
        }
        .ticker-item {
            display: inline-block;
            padding: 8px 60px;
            font-family: 'Orbitron';
            font-size: 14px;
            font-weight: 900;
            letter-spacing: 4px;
            color: var(--silver);
            text-transform: uppercase;
            border-bottom: 3px solid var(--silver);
            animation: silverLaser 1s infinite alternate;
        }
        @keyframes ticker {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100%, 0); }
        }
        @keyframes silverLaser {
            from { border-bottom-color: var(--silver); text-shadow: 0 0 5px #fff; }
            to { border-bottom-color: #fff; text-shadow: 0 0 20px #fff; }
        }

        .summary-bar {
            display: flex;
            justify-content: space-around;
            align-items: center;
            background: rgba(0, 153, 255, 0.05);
            padding: 12px;
            margin: 10px auto;
            border-radius: 4px;
            border: 1px solid var(--glass-border);
            width: 95%;
        }
        .summary-item { text-align: center; }
        .summary-label { font-family: 'Orbitron'; font-size: 9px; color: var(--primary); margin-bottom: 2px; }
        .summary-val { font-size: 16px; font-weight: 700; font-family: 'Orbitron'; }
        .total-box { border-right: 1px solid var(--glass-border); padding-right: 30px; }

        .controls-hub { position: fixed; right: 15px; top: 15px; display: flex; flex-direction: column; gap: 8px; z-index: 9999; }
        .aos-btn {
            background: rgba(0,0,0,0.9); border: 1px solid var(--glass-border); color: #888;
            padding: 5px 10px; cursor: pointer; font-family: 'Orbitron'; font-size: 9px; 
            border-radius: 3px; transition: 0.2s; text-align: center; min-width: 90px;
        }
        .aos-btn:hover { border-color: var(--primary); color: #fff; box-shadow: 0 0 10px var(--primary); }

        .header { text-align: center; padding: 15px 0; }
        .header h1 { font-family: 'Orbitron'; font-size: 1.8rem; letter-spacing: 12px; margin: 0; text-shadow: 0 0 15px var(--primary); }
        
        .aos-content { width: 98%; margin: 0 auto; padding-bottom: 50px; }
        .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .chart-box { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 8px; padding: 10px; height: 200px; }

        .filter-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-bottom: 20px; }
        .filter-item label { display: block; font-size: 9px; color: var(--primary); font-family: 'Orbitron'; text-align: center; margin-bottom: 4px; }
        .filter-item select { width: 100%; background: #000; color: #fff; border: 1px solid var(--glass-border); padding: 7px; border-radius: 4px; font-size: 11px; text-align-last: center; }

        .table-wrap { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 6px; width: 100%; overflow-x: auto; }
        .aos-table { width: 100%; border-collapse: collapse; table-layout: fixed; min-width: 900px; }
        .aos-table th { background: rgba(0,0,0,0.95); font-family: 'Orbitron'; font-size: 9px; padding: 12px 5px; color: var(--primary); border-bottom: 2px solid var(--primary); }
        .aos-table td { padding: 12px 5px; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 11px; text-align: center; }

        .status-cell { padding: 4px 8px; border-radius: 3px; font-weight: 700; font-size: 9px; text-transform: uppercase; display: inline-block; }
        .st-completed { background: var(--completed); color: #000; }
        .st-monitor { background: var(--watch-red); color: #fff; }
        .st-safe { background: var(--safe); color: #000; }
        .st-overdue { background: var(--overdue); color: #fff; animation: glow-pulse-red 0.8s infinite alternate; box-shadow: 0 0 15px var(--overdue); }
        .st-assistance { background: var(--assist-scarlet); color: #fff; animation: glow-pulse-scarlet 0.8s infinite alternate; box-shadow: 0 0 15px var(--assist-scarlet); }

        .laser-task { display: inline-block; border-bottom: 2px solid currentColor; animation: laserPulse 0.8s infinite alternate; padding-bottom: 2px; font-weight: 700; }
        
        @keyframes laserPulse { from { opacity: 0.7; } to { opacity: 1; box-shadow: 0 2px 20px currentColor; } }
        @keyframes glow-pulse-scarlet { from { box-shadow: 0 0 5px var(--assist-scarlet); } to { box-shadow: 0 0 25px var(--assist-scarlet), 0 0 10px #fff; } }
        @keyframes glow-pulse-red { from { box-shadow: 0 0 5px var(--overdue); } to { box-shadow: 0 0 25px var(--overdue), 0 0 5px #fff; } }

        .prog-bg { width: 80%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin: 4px auto 0; }
        .prog-fill { height: 100%; border-radius: 3px; transition: 0.5s; }
      `}</style>

      <div className="controls-hub" style={{ position: 'relative', zIndex: 10 }}>
          <button className="aos-btn" style={{color: 'var(--completed)'}} onClick={takeScreenshot}>SAVE PNG</button>
          <button className="aos-btn" onClick={start}>SYNC NOW</button>
          <button className="aos-btn" onClick={resetZoom}>RESET</button>
      </div>

      <div ref={captureRef} style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.2s ease', position: 'relative', zIndex: 1, paddingBottom: '50px' }}>
          <header className="header">
              <h1>APEX OPERATING SYSTEM</h1>
              <p style={{fontSize: '9px', color: 'var(--primary)', letterSpacing: '5px'}}>{sysStatus}</p>
          </header>

          <div className="ticker-wrap">
              <div className="ticker-move">
                  <span className="ticker-item">AOS - KPI Dashboard</span>
                  <span className="ticker-item">AOS - KPI Dashboard</span>
                  <span className="ticker-item">AOS - KPI Dashboard</span>
              </div>
          </div>

          <div className="summary-bar">
              <div className="summary-item total-box">
                  <div className="summary-label">TOTAL TASKS</div>
                  <div className="summary-val" style={{color: 'var(--silver)'}}>{totalCount}</div>
              </div>
              {labels.map((l, i) => (
                  <div key={l} className="summary-item">
                      <div className="summary-label">{l}</div>
                      <div className="summary-val" style={{color: colors[i]}}>
                          {vals[i]} <span style={{fontSize: '10px', opacity: 0.6}}>({((vals[i]/activeTotal)*100).toFixed(0)}%)</span>
                      </div>
                  </div>
              ))}
          </div>

          <div className="aos-content" ref={captureRef}>
              <div className="charts-grid">
                  <div className="chart-box">
                      <Pie 
                          data={{ labels, datasets: [{ data: vals, backgroundColor: colors, borderWidth: 0 }] }}
                          options={{ maintainAspectRatio: false, plugins: { ...chartOptions.plugins, legend: { position: 'right', labels: chartOptions.plugins.legend.labels } } }}
                      />
                  </div>
                  <div className="chart-box">
                      <Bar 
                          data={{ labels, datasets: [{ data: vals, backgroundColor: colors, borderRadius: 3 }] }}
                          options={{ 
                              maintainAspectRatio: false, indexAxis: 'y', 
                              plugins: { ...chartOptions.plugins, legend: { display: false }, datalabels: { ...chartOptions.plugins.datalabels, align: 'end', anchor: 'end' } },
                              scales: { x: { grace: '25%', ticks: { color: '#fff' }, grid: { display: false } }, y: { ticks: { color: '#fff', font: { family: 'Orbitron' } } } }
                          }}
                      />
                  </div>
              </div>
              
              <div className="filter-row">
                  {(['area', 'stage', 'category', 'status', 'user'] as const).map(key => (
                      <div key={key} className="filter-item">
                          <label>{key.toUpperCase()}</label>
                          <select value={filters[key]} onChange={(e) => handleFilterChange(key, e.target.value)}>
                              <option value="all">ALL</option>
                              {uniqueValues[key].map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                      </div>
                  ))}
              </div>

              <div className="table-wrap">
                  <table className="aos-table">
                      <thead>
                          <tr>
                              <th style={{width: '45px'}}>REF</th>
                              <th style={{width: '110px'}}>AREA</th>
                              <th>TASK / PROBLEM</th>
                              <th style={{width: '85px'}}>PROG.</th>
                              <th style={{width: '115px'}}>STAGE</th>
                              <th style={{width: '115px'}}>CATEGORY</th>
                              <th style={{width: '50px'}}>DAYS</th>
                              <th style={{width: '120px'}}>STATUS</th>
                              <th style={{width: '100px'}}>USER</th>
                              <th style={{width: '90px'}}>TARGET</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredData.map((d, i) => {
                              let sClass = '', laserClass = '', displayStatus = d.status;
                              const pNum = parseInt(d.progress) || 0;
                              
                              if (pNum === 100) sClass = 'st-completed';
                              else if (d.status === "Assistance Needed") { sClass = 'st-assistance'; laserClass = 'laser-task'; }
                              else if (d.days <= 0) { sClass = 'st-overdue'; displayStatus = 'OVERDUE'; laserClass = 'laser-task'; }
                              else if (d.status === "Monitor") sClass = 'st-monitor';
                              else if (d.status === "Safe") sClass = 'st-safe';

                              const pColor = pNum === 100 ? 'var(--completed)' : (d.status === "Assistance Needed" ? 'var(--assist-scarlet)' : (d.days <= 0 ? 'var(--overdue)' : 'var(--primary)'));

                              return (
                                  <tr key={i}>
                                      <td>{d.ref}</td>
                                      <td style={{color: 'var(--primary)', fontWeight: 'bold'}}>{d.area}</td>
                                      <td style={{textAlign: 'left'}}><span className={laserClass}>{d.problem}</span></td>
                                      <td>
                                          {pNum}%
                                          <div className="prog-bg"><div className="prog-fill" style={{width: `${pNum}%`, background: pColor}}></div></div>
                                      </td>
                                      <td style={{color: 'var(--primary)'}}>{d.stage}</td>
                                      <td style={{opacity: 0.7}}>{d.category}</td>
                                      <td style={{fontWeight: 'bold'}}>{d.days}</td>
                                      <td><span className={`status-cell ${sClass}`}>{displayStatus}</span></td>
                                      <td>{d.user}</td>
                                      <td>{d.targetDate}</td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
  );
}
