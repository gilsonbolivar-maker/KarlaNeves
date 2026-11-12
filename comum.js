// Configuração e utilidades usadas pelo painel da Karla e pela página da cliente.
window.KN = {
  URL: 'https://yzqacsfmcludsrsyovcw.supabase.co',
  CHAVE: 'sb_publishable_S2pQ2VuJnZpX9TXRZx6AOA_OM2kkFaa'
};
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad = n => String(n).padStart(2, '0');
const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const hojeISO = () => iso(new Date());
const somaDias = (s, n) => { const d = new Date(s + 'T12:00'); d.setDate(d.getDate() + n); return iso(d); };
const difDias = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5);
const dataBR = s => s ? s.slice(0, 10).split('-').reverse().join('/') : '';
function quando(s) { if (!s) return 'sem prazo'; const d = difDias(hojeISO(), s); return d === 0 ? 'hoje' : d === 1 ? 'amanhã' : d === -1 ? 'ontem' : dataBR(s); }
function haQuanto(ts) {
  if (!ts) return 'nunca';
  const m = Math.round((Date.now() - new Date(ts)) / 60000);
  if (m < 2) return 'agora'; if (m < 60) return 'há ' + m + ' min';
  const h = Math.round(m / 60); if (h < 24) return 'há ' + h + ' h';
  const d = Math.round(h / 24); return d === 1 ? 'ontem' : 'há ' + d + ' dias';
}
function telZap(t) { let d = String(t || '').replace(/\D/g, ''); if (!d) return ''; if (d.length <= 11) d = '55' + d; return d; }
function abreZap(tel, texto) { const t = telZap(tel); if (!t) { toast('Sem WhatsApp cadastrado'); return false; }
  window.open('https://wa.me/' + t + (texto ? '?text=' + encodeURIComponent(texto) : ''), '_blank'); return true; }
function toast(t) { let e = $('#toast'); if (!e) { e = document.createElement('div'); e.id = 'toast'; document.body.appendChild(e); }
  e.textContent = t; e.classList.add('on'); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove('on'), 2600); }
const TIPOS = { video: '🎬 Vídeo', post: '📸 Post', tarefa: '✅ Tarefa' };
const ETAPA = { pendente: 'a fazer', gravado: 'gravado', feito: 'feito' };
const atrasada = a => a.status !== 'feito' && a.prazo && a.prazo < hojeISO();
function linkLegendas(a, extra) {
  const q = new URLSearchParams(); q.set('r', a.roteiro || ''); q.set('t', a.titulo || 'vídeo');
  for (const k in (extra || {})) if (extra[k]) q.set(k, extra[k]);
  return new URL('legendas/', location.href).href + '#' + q.toString();
}
function linksHTML(txt) {
  return String(txt || '').split('\n').map(x => x.trim()).filter(x => /^https?:\/\//i.test(x))
    .map(u => `<div class="sub" style="margin:4px 0"><a href="${esc(u)}" target="_blank" rel="noopener">🔗 ${esc(u.replace(/^https?:\/\/(www\.)?/, '').slice(0, 48))}</a></div>`).join('');
}

// Histórico de atividades realizadas, agrupado por mês.
const diaLocal = ts => iso(new Date(ts));
function historicoHTML(lista, limiteMeses) {
  const feitas = lista.filter(a => a.feito_em).sort((x, y) => y.feito_em.localeCompare(x.feito_em));
  if (!feitas.length) return '<div class="vazio">Nenhuma atividade realizada ainda.</div>';
  const noPrazo = feitas.filter(a => !a.prazo || diaLocal(a.feito_em) <= a.prazo).length;
  const mesAtual = hojeISO().slice(0, 7);
  const doMes = feitas.filter(a => diaLocal(a.feito_em).startsWith(mesAtual)).length;
  const porTipo = t => feitas.filter(a => a.tipo === t).length;
  let o = `<div class="resumo"><div class="card"><b>${feitas.length}</b><span class="sub">realizadas</span></div>
    <div class="card"><b>${Math.round(noPrazo / feitas.length * 100)}%</b><span class="sub">no prazo</span></div>
    <div class="card"><b>${doMes}</b><span class="sub">este mês</span></div></div>
    <div class="sub" style="margin:8px 4px">🎬 ${porTipo('video')} vídeo(s) · 📸 ${porTipo('post')} post(s) · ✅ ${porTipo('tarefa')} tarefa(s)</div>`;
  const meses = {};
  feitas.forEach(a => { const m = diaLocal(a.feito_em).slice(0, 7); (meses[m] = meses[m] || []).push(a); });
  const chaves = Object.keys(meses);
  chaves.forEach((m, i) => {
    const nome = new Date(m + '-15T12:00').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const nomeMes = nome.charAt(0).toUpperCase() + nome.slice(1);
    const oculto = limiteMeses && i >= limiteMeses;
    o += `<div class="hist-mes" ${oculto ? 'style="display:none"' : ''}><h2>${nomeMes}<span class="n">${meses[m].length}</span></h2><div class="card" style="padding:4px 12px">` +
      meses[m].map(a => {
        const d = diaLocal(a.feito_em); const atraso = a.prazo && d > a.prazo ? difDias(a.prazo, d) : 0;
        return `<div class="hist" style="display:flex;gap:10px;align-items:center">
          <div style="min-width:44px;text-align:center"><b style="font-size:17px;color:var(--vinho)">${d.slice(8)}</b><div class="sub" style="font-size:11px">${new Date(d + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</div></div>
          <div class="grow"><div style="font-weight:600">${TIPOS[a.tipo].split(' ')[0]} ${esc(a.titulo)}</div>
          <div class="sub">${atraso ? `<span style="color:var(--verm)">${atraso} dia(s) depois do prazo</span>` : '✓ no prazo'}${a.link_post ? ` · <a href="${esc(a.link_post)}" target="_blank">ver post</a>` : ''}</div></div></div>`;
      }).join('') + '</div></div>';
  });
  if (limiteMeses && chaves.length > limiteMeses)
    o += `<div class="acoes"><button class="btn full" onclick="document.querySelectorAll('.hist-mes').forEach(e=>e.style.display='');this.remove()">Ver meses anteriores</button></div>`;
  return o;
}
