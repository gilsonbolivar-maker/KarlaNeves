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
