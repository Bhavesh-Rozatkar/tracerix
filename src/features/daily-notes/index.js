import { esc } from '../../core/utils.js';
import { ensureDate } from '../../state/model.js';

export function view(date, state) {
  return `<section class="section notes"><h2>Notes</h2><div class="section-body"><textarea id="notes" placeholder="Anything you want to record today...">${esc(state.records[date]?.notes || '')}</textarea></div></section>`;
}

export function update(value, state, date) {
  ensureDate(state, date);
  state.records[date].notes = value;
}
