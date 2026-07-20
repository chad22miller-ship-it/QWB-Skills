/*
 * QWB v3.0 Dashboard Generator  (linkedin-engine-team)
 * ----------------------------------------------------
 * WHAT: Builds Prospect_Tracker_v3_LIVE.html from the live Prospects tab.
 * WHEN: Final step of every engine run, AFTER the wave import + gviz readback,
 *       so the dashboard reflects the freshly-verified sheet.
 * HOW:  Open a signed-in gviz HTML view of the Prospects tab, then run this
 *       whole script in that tab (Claude-in-Chrome javascript_tool). It parses
 *       the table, buckets every person by Status into the v3.0 action stages,
 *       loads the staged draft from the right column, and downloads the HTML.
 *
 *   URL to open first (cache-buster required):
 *   https://docs.google.com/spreadsheets/d/<YOUR_SHEET_ID>/gviz/tq?tqx=out:html&sheet=Prospects&_cb=<timestamp>
 *
 * STATUS -> STAGE MAP (matches how the skills actually operate):
 *   Identified (+ note in N)   -> Connect      active  (draft = N)
 *   Connection Sent            -> Connect      waiting (awaiting accept)
 *   Connected (+ O)            -> Break ice    active  (draft = O)
 *   Msg 1 Sent, silent >=3d     -> Follow up    active  (draft = O / nudge)
 *   Msg 1 Sent, not yet due     -> Break ice    waiting (awaiting reply)
 *   Msg 2 Sent (+ AD)          -> Book call    active  (draft = AD)
 *   Msg 2 Sent (+ R)           -> Float offer  active  (draft = R)
 *   Slow Lane                  -> Back burner  active
 *   Withdrawn                  -> excluded
 *
 * Column indices in the gviz table: 1=Name 3=URL 4=Headline 8=Status
 *   9=LastTouch 10=NextFollowUp 13=N(ConnNote) 14=O(Msg1) 17=R(Touch3) 29=AD(Stage4)
 *
 * Never auto-sends. Every card is Copy + Message-on-LinkedIn only; Chad sends by hand.
 * The dashboard shows drafts AS STAGED in the sheet. Re-run the engine to refresh.
 */
(function(){
  var TODAY = new Date();
  var tbl = document.querySelector('table');
  var rows = [].map.call(tbl.rows, function(tr){ return [].map.call(tr.cells, function(td){ return td.innerText; }); });
  var g = function(r,i){ return (r[i]||'').trim(); };
  var P = rows.map(function(r){ return {n:g(r,1),u:g(r,3),h:g(r,4).slice(0,72),s:g(r,8),last:g(r,9),next:g(r,10),N:g(r,13),O:g(r,14),R:g(r,17),AD:g(r,29)}; })
              .filter(function(x){ return x.n && x.n!=='Name' && x.s!=='Withdrawn'; });
  var pd = function(s){ if(!s) return null; var p=s.split('/'); return p.length===3 ? new Date(+p[2],+p[0]-1,+p[1]) : null; };
  var od = function(x){ var d=pd(x.next)||pd(x.last); return d ? Math.round((TODAY-d)/86400000) : null; };
  function cls(x){ var s=x.s;
    if(s==='Identified'&&x.N) return ['Connect',1,x.N];
    if(s==='Connection Sent') return ['Connect',0,'Awaiting accept'];
    if(s==='Connected'&&x.O) return ['Break ice',1,x.O];
    if(s==='Connected') return ['Break ice',0,'Ready, draft Step 2'];
    if(s==='Msg 1 Sent'){ var o=od(x); return (o!==null&&o>=3) ? ['Follow up',1,x.O||'(engine will stage nudge)'] : ['Break ice',0,'Awaiting reply']; }
    if(s==='Msg 2 Sent'){ if(x.AD) return ['Book call',1,x.AD]; if(x.R) return ['Float offer',1,x.R]; return ['Float offer',0,'Awaiting reply']; }
    if(s==='Slow Lane') return ['Back burner',1,x.O||x.N||''];
    return ['Back burner',0,x.s];
  }
  var D = P.map(function(x){ var c=cls(x); return {n:x.n,u:x.u,h:x.h,st:c[0],a:c[1],d:c[2],o:od(x)}; });
  var json = JSON.stringify(D);

  var HTML = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Prospect Tracker v3.0 LIVE</title><style>'
  +':root{--bg:#0d1420;--panel:#131d2e;--card:#182437;--card2:#1e2c42;--line:#26344c;--line2:#33455f;--text:#e8eef7;--muted:#9fb0c8;--dim:#6d7f98;--accent:#3b82f6;--abg:#16294a;--atx:#7db0ff;--gold:#f4b740;--red:#ef4444;--rbg:#3a1a1c;--rtx:#ff8a8a;--abg2:#3a2c14;--atx2:#ffcf7a;--gbg:#12301f;--gtx:#7ee2a3;--r:8px}'
  +'*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;padding:22px;line-height:1.5}.wrap{max-width:840px;margin:0 auto}'
  +'.top{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:8px}h1{font-size:23px;font-weight:600;margin:0}h1 span{color:var(--atx)}.sub{font-size:13px;color:var(--muted)}.wel{color:var(--gold);font-weight:600}'
  +'.counts{display:flex;gap:10px}.cnt{background:var(--panel);border-radius:10px;padding:8px 15px;text-align:center;min-width:66px}.cnt .n{font-size:21px;font-weight:600}.cnt .l{font-size:11px;color:var(--muted)}.cnt.red .n{color:var(--rtx)}.cnt.blue .n{color:var(--atx)}'
  +'.lock{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--gtx);background:var(--gbg);padding:5px 12px;border-radius:20px;margin:8px 0 14px}'
  +'.chips{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:6px}.chip{font-size:13px;padding:7px 12px;border-radius:20px;background:var(--panel);border:1px solid var(--line);color:var(--muted);cursor:pointer;display:inline-flex;align-items:center;gap:7px}.chip:hover{border-color:var(--line2);color:var(--text)}.chip.on{background:var(--abg);color:var(--atx);border-color:var(--accent)}.chip.low{opacity:.7}.chip .b{font-size:11px;min-width:18px;text-align:center;padding:1px 7px;border-radius:10px;background:var(--card2);color:var(--muted)}.chip.on .b{background:var(--accent);color:#fff}'
  +'.hint{font-size:11px;color:var(--dim);margin:6px 0 14px}'
  +'.rec{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:15px;margin-bottom:11px}.rec.low{opacity:.85}'
  +'.rh{display:flex;align-items:center;gap:11px;margin-bottom:11px}.av{width:37px;height:37px;border-radius:50%;background:var(--abg);color:var(--atx);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex:none}.who{flex:1;min-width:0}.nm{font-size:15px;font-weight:600}.rl{font-size:12px;color:var(--muted)}'
  +'.pill{font-size:11px;padding:4px 11px;border-radius:20px;background:var(--abg);color:var(--atx)}.pill.red{background:var(--rbg);color:var(--rtx)}.pill.gray{background:var(--card2);color:var(--dim)}'
  +'.dl{font-size:11px;color:var(--dim);margin-bottom:5px}textarea{width:100%;background:var(--card2);color:var(--text);border:1px solid var(--line);border-radius:var(--r);padding:9px 11px;font-size:13px;font-family:inherit;resize:vertical;margin-bottom:10px}textarea:focus{outline:none;border-color:var(--accent)}'
  +'.act{display:flex;gap:8px;flex-wrap:wrap;align-items:center}button.bt{font-size:12px;padding:8px 13px;border-radius:var(--r);background:transparent;color:var(--muted);border:1px solid var(--line2);cursor:pointer;display:inline-flex;align-items:center;gap:6px}button.bt:hover{color:var(--text);border-color:var(--muted)}button.li{border:2px solid var(--accent);color:var(--atx)}button.li:hover{background:var(--abg)}'
  +'.od{font-size:12px;padding:7px 13px;border-radius:var(--r);margin-left:auto;display:inline-flex;align-items:center;gap:6px}.od.t{background:var(--abg);color:var(--atx)}.od.w{background:var(--abg2);color:var(--atx2)}.od.l{background:var(--rbg);color:var(--rtx)}'
  +'.foot{font-size:11px;color:var(--dim);margin-top:16px}'
  +'</style></head><body><div class="wrap">'
  +'<div class="top"><div><h1>Prospect Tracker <span>v3.0</span></h1><div class="sub"><span class="wel">Welcome</span> - LIVE from your Command Center, refreshed __STAMP__</div></div>'
  +'<div class="counts"><div class="cnt red"><div class="n" id="cN">0</div><div class="l">follow-ups due</div></div><div class="cnt blue"><div class="n" id="cW">0</div><div class="l">waiting</div></div></div></div>'
  +'<div class="lock">&#128274; Drafts only. Nothing is ever sent. You send every message by hand.</div>'
  +'<div class="chips" id="chips"></div><div class="hint" id="hint"></div><div id="q"></div>'
  +'<div class="foot">Ranked by importance. Message on LinkedIn opens the profile; you paste and send. Re-run your engine to refresh this dashboard from the sheet.</div>'
  +'</div><script>'
  +'var D=__DATA__;'
  +'var LABELM={"Connect":"Send the connection request","Break ice":"First message after they accept","Float offer":"Reveal the opportunity, ask if open","Book call":"Send context + invite to a 15-min call","Follow up":"Re-engage someone who went silent","Back burner":"Parked contacts, lowest priority"};'
  +'var CHIP=["Connect","Break ice","Float offer","Book call","Follow up","Back burner"];'
  +'var PRIO=["Book call","Float offer","Break ice","Connect","Follow up","Back burner"];'
  +'var sf="Do first";'
  +'function pr(x){var b=PRIO.indexOf(x.st);if(b<0)b=9;return b*10+(x.a?0:1);}'
  +'function esc(t){return (t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\\"/g,"&quot;");}'
  +'function odb(x){if(x.o===null)return"";var c,txt;if(x.o<=0){c="t";txt="due today";}else if(x.o<3){c="w";txt=x.o+"d overdue";}else{c="l";txt=x.o+"d overdue";}return "<span class=\\"od "+c+"\\">&#9200; "+txt+"</span>";}'
  +'function counts(){var nd=D.filter(function(x){return x.st==="Follow up"&&x.a;}).length;var w=D.filter(function(x){return !x.a;}).length;document.getElementById("cN").textContent=nd;document.getElementById("cW").textContent=w;}'
  +'function chips(){var arr=[{k:"Do first",l:"Do first",c:D.filter(function(x){return x.a;}).length,s:1}];CHIP.forEach(function(s){var c=D.filter(function(x){return x.st===s;}).length;if(c)arr.push({k:s,l:s,c:c});});arr.push({k:"All",l:"All",c:D.length});'
  +'document.getElementById("chips").innerHTML=arr.map(function(c){var on=sf===c.k,low=(c.k==="Follow up"||c.k==="Back burner");return "<button class=\\"chip"+(on?" on":"")+(low&&!on?" low":"")+"\\" onclick=\\"setf(\\x27"+c.k+"\\x27)\\">"+(c.s?"&#9889; ":"")+c.l+"<span class=\\"b\\">"+c.c+"</span></button>";}).join("");'
  +'document.getElementById("hint").textContent=sf==="Do first"?"\\u2192 Worked top to bottom by what makes you money fastest.":(sf==="All"?"":("\\u2192 "+(LABELM[sf]||"")));}'
  +'function card(x){var i=D.indexOf(x);var pill=x.st==="Follow up"?"red":(x.st==="Back burner"?"gray":"");var dr=x.a&&x.d;var av=x.n.split(" ").map(function(w){return w[0];}).slice(0,2).join("");'
  +'var send=dr?"<button class=\\"bt li\\" onclick=\\"go("+i+")\\">&#128279; Message on LinkedIn &#8599;</button>":"";'
  +'var copy=dr?"<button class=\\"bt\\" id=\\"c"+i+"\\" onclick=\\"cp("+i+")\\">&#128203; Copy draft</button>":"";'
  +'var body=dr?"<div class=\\"dl\\">&#9998; Draft loaded, edit then copy</div><textarea id=\\"d"+i+"\\" rows=\\""+(x.d.length>120?4:2)+"\\">"+esc(x.d)+"</textarea>":"<div class=\\"dl\\" style=\\"margin-bottom:10px\\">"+esc(x.d)+"</div>";'
  +'return "<div class=\\"rec"+(x.st==="Back burner"?" low":"")+"\\"><div class=\\"rh\\"><div class=\\"av\\">"+av+"</div><div class=\\"who\\"><div class=\\"nm\\">"+x.n+"</div><div class=\\"rl\\">"+esc(x.h)+"</div></div><span class=\\"pill "+pill+"\\">"+x.st+"</span></div>"+body+"<div class=\\"act\\">"+send+copy+odb(x)+"</div></div>";}'
  +'function render(){var L=D.slice();if(sf==="Do first"){L=L.filter(function(x){return x.a;}).sort(function(a,b){return pr(a)-pr(b);});}else if(sf!=="All"){L=L.filter(function(x){return x.st===sf;});L.sort(function(a,b){return (b.a-a.a)||((b.o||0)-(a.o||0));});}else{L.sort(function(a,b){return pr(a)-pr(b);});}'
  +'document.getElementById("q").innerHTML=L.length?L.map(card).join(""):"<div style=\\"color:var(--dim);font-size:13px;padding:10px\\">Nothing here right now.</div>";}'
  +'function go(i){window.open(D[i].u,"_blank");}'
  +'function cp(i){var t=document.getElementById("d"+i).value;navigator.clipboard.writeText(t);var b=document.getElementById("c"+i);var o=b.innerHTML;b.innerHTML="&#10003; Copied";setTimeout(function(){b.innerHTML=o;},1400);}'
  +'function setf(s){sf=s;chips();render();}'
  +'counts();chips();render();'
  +'<\/script></body></html>';

  var stamp = TODAY.toLocaleString();
  var finalHTML = HTML.replace('__DATA__', json).replace('__STAMP__', stamp);
  var blob = new Blob([finalHTML], {type:'text/html'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Prospect_Tracker_v3_LIVE.html';
  document.body.appendChild(a); a.click();
  setTimeout(function(){ a.remove(); }, 2000);
  return 'v3 dashboard built: ' + D.length + ' people, ' + finalHTML.length + ' bytes';
})();
