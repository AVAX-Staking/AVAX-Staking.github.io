'use strict';
const $ = id => document.getElementById(id);
const fmt = (value, digits = 2) => value.toLocaleString('en-US', {minimumFractionDigits: digits, maximumFractionDigits: digits});
let days = 365;
const fields = [$('amt'), $('apr'), $('fee')];
function draw() {
  const valid = fields.every(field => field.value.trim() !== '' && field.validity.valid && Number.isFinite(Number(field.value)));
  fields.forEach(field => field.setAttribute('aria-invalid', String(!field.value.trim() || !field.validity.valid)));
  if (!valid) {
    $('error').textContent = 'Enter 25–3,000,000 AVAX, an APR of 0–100%, and a validator fee of 2–100%.';
    ['rw', 'tt', 'annual', 'gross', 'commission', 'net-apr'].forEach(id => $(id).textContent = '—');
    $('chart-line').setAttribute('d', 'M0 76 H400');
    $('chart-area').setAttribute('d', 'M0 76 H400 V80 H0 Z');
    $('chart-dot').setAttribute('cy', '76');
    $('ch').setAttribute('aria-label', 'Enter valid values to view the AVAX reward calculation.');
    return;
  }
  $('error').textContent = '';
  const amount = Number($('amt').value);
  const apr = Number($('apr').value) / 100;
  const fee = Number($('fee').value) / 100;
  const gross = amount * apr * days / 365;
  const commission = gross * fee;
  const net = gross - commission;
  const annual = amount * apr * (1 - fee);
  $('rw').textContent = '+' + fmt(net);
  $('tt').textContent = fmt(amount + net) + ' AVAX';
  $('annual').textContent = fmt(annual) + ' AVAX';
  $('gross').textContent = fmt(gross, 4) + ' AVAX';
  $('commission').textContent = fmt(commission, 4) + ' AVAX';
  $('net-apr').textContent = fmt(apr * (1 - fee) * 100) + '%';
  $('duration-label').textContent = days === 365 ? '1 year' : days + ' days';
  $('chart-end').textContent = 'Day ' + days;
  $('rng').value = Math.min(10000, amount);
  $('rng').setAttribute('aria-valuetext', fmt(Number($('rng').value), 0) + ' AVAX');
  const end = annual > 0 ? 76 - 66 * days / 365 : 76;
  const line = 'M0 76 L400 ' + end.toFixed(2);
  $('chart-line').setAttribute('d', line);
  $('chart-area').setAttribute('d', line + ' V80 H0 Z');
  $('chart-dot').setAttribute('cy', end.toFixed(2));
  $('ch').setAttribute('aria-label', 'Reward calculation across ' + days + ' days: ' + fmt(net) + ' AVAX. Rewards are paid at the end of the staking term.');
}
fields.forEach(field => field.addEventListener('input', draw));
$('rng').addEventListener('input', () => { $('amt').value = $('rng').value; draw(); });
document.querySelectorAll('.cbf2e84 button').forEach(button => button.addEventListener('click', () => {
  days = Number(button.dataset.days);
  document.querySelectorAll('.cbf2e84 button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  draw();
}));
draw();
