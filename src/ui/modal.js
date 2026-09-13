import { $, esc } from '../core/utils.js';

let modalItem = null;
let modalType = null;

export function openEditor({ item = null, type = null, onSave }) {
  modalItem = item;
  modalType = item?.type || type;
  const t = modalType;
  let fields = `<div class="field"><label>Name</label><input id="mName" value="${esc(item?.name || '')}"></div>`;
  if (t === 'habit' || t === 'personal') {
    const method = item?.method || (t === 'habit' ? 'check' : 'count');
    fields += `<div class="field"><label>Tracking method</label><select id="mMethod">${t === 'habit' ? '<option value="check">Checkbox</option><option value="select">Dropdown measurement</option>' : '<option value="check">Checkbox</option><option value="count">Count</option><option value="duration">Duration</option><option value="select">Dropdown measurement</option>'}</select></div><div class="field"><label>Unit</label><input id="mUnit" value="${esc(item?.unit || '')}"></div><div class="field" id="optsField"><label>Dropdown options (comma separated)</label><input id="mOpts" value="${esc((item?.options || []).join(', '))}"></div>`;
  }
  if (t === 'goal') fields += `<div class="field"><label>Total amount</label><input id="mTotal" type="number" min="1" value="${item?.total ?? 100}"></div><div class="field"><label>Current completed amount</label><input id="mCurrent" type="number" min="0" value="${item?.current ?? 0}"></div><div class="field"><label>Unit</label><input id="mUnit" value="${esc(item?.unit || 'units')}"></div>`;
  if (t === 'skill') fields += `<div class="field"><label>Track</label><div class="checks"><label><input id="sDone" type="checkbox"> Done</label><label><input id="sTime" type="checkbox"> Time</label><label><input id="sReps" type="checkbox"> Repetitions</label><label><input id="sRounds" type="checkbox"> Rounds</label><label><input id="sNote" type="checkbox"> Note</label></div></div>`;
  document.body.insertAdjacentHTML('beforeend', `<div class="dialog-back" id="editorDialog"><div class="dialog"><h3>${item ? 'Edit' : 'Add'} ${t === 'habit' ? 'Habit' : t === 'goal' ? 'Finite Goal' : t === 'skill' ? 'Infinite Skill' : 'Personal Habit'}</h3><div class="grid">${fields}</div><div class="hint">Removing an item archives it; historical records remain stored.</div><div class="actions"><button class="btn" data-close-editor>Cancel</button><button class="btn primary" data-save-editor>${item ? 'Save' : 'Add'}</button></div></div></div>`);
  if (t === 'habit' || t === 'personal') {
    const method = $('#mMethod');
    method.value = item?.method || (t === 'habit' ? 'check' : 'count');
    const update = () => {
      const select = method.value === 'select';
      $('#optsField').style.display = select ? 'flex' : 'none';
      if (t === 'habit') $('#mUnit').disabled = !select;
    };
    method.addEventListener('change', update);
    update();
  }
  if (t === 'skill') {
    const tracking = item?.tracking || {};
    $('#sDone').checked = tracking.completed !== false;
    $('#sTime').checked = !!tracking.time;
    $('#sReps').checked = !!tracking.repetitions;
    $('#sRounds').checked = !!tracking.rounds;
    $('#sNote').checked = tracking.note !== false;
  }
  $('#mName')?.focus();
  $('#editorDialog').addEventListener('click', e => { if (e.target.id === 'editorDialog') closeEditor(); });
  $('#editorDialog [data-close-editor]').onclick = closeEditor;
  $('#editorDialog [data-save-editor]').onclick = async () => {
    try { await onSave(readEditor()); closeEditor(); } catch (error) { alert(error.message || 'Could not save.'); }
  };
}
function readEditor() {
  const name = $('#mName').value.trim();
  if (!name) throw new Error('Name is required.');
  const data = { item: modalItem, type: modalType, name };
  if (modalType === 'habit' || modalType === 'personal') data.method = $('#mMethod').value, data.unit = $('#mUnit').value.trim(), data.options = data.method === 'select' ? $('#mOpts').value.split(',').map(v => v.trim()).filter(Boolean) : [];
  if (modalType === 'goal') data.total = Math.max(1, Number($('#mTotal').value) || 1), data.current = Math.max(0, Math.min(data.total, Number($('#mCurrent').value) || 0)), data.unit = $('#mUnit').value.trim() || 'units';
  if (modalType === 'skill') data.tracking = { completed: $('#sDone').checked, time: $('#sTime').checked, repetitions: $('#sReps').checked, rounds: $('#sRounds').checked, note: $('#sNote').checked };
  return data;
}
export function closeEditor() { document.getElementById('editorDialog')?.remove(); modalItem = null; modalType = null; }
