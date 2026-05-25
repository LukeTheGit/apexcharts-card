import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { ChartCardYAxisExternal } from '../../types-config';
import { HaFormSchema } from '../types';
import { computeHelper, computeLabel, isValidYaxisLimit } from '../helpers';

const SCHEMA: HaFormSchema[] = [
  { name: 'id', selector: { text: {} } },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'show', selector: { boolean: {} } },
      { name: 'opposite', selector: { boolean: {} } },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'min', selector: { text: {} } },
      { name: 'max', selector: { text: {} } },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'decimals', selector: { number: { min: 0, max: 10, step: 1, mode: 'box' } } },
      { name: 'align_to', selector: { number: { mode: 'box' } } },
    ],
  },
];

@customElement('apexcharts-card-yaxis-item-editor')
export class ApexChartsCardYAxisItemEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public yaxis?: ChartCardYAxisExternal;

  private _formData(): Record<string, unknown> {
    const y = this.yaxis || {};
    return {
      id: y.id || '',
      show: y.show ?? true,
      opposite: y.opposite ?? false,
      min: y.min === undefined ? '' : String(y.min),
      max: y.max === undefined ? '' : String(y.max),
      decimals: y.decimals,
      align_to: y.align_to,
    };
  }

  private _onChange = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as Record<string, unknown>;
    const next: ChartCardYAxisExternal = { ...(this.yaxis || {}) };
    if ('id' in data) {
      if (data.id) next.id = data.id as string;
      else delete next.id;
    }
    if ('show' in data) {
      if (data.show === false) next.show = false;
      else delete next.show;
    }
    if ('opposite' in data) {
      if (data.opposite) next.opposite = true;
      else delete next.opposite;
    }
    if ('min' in data) {
      const v = data.min as string;
      if (v === '' || v === undefined || v === null) delete next.min;
      else if (!isNaN(Number(v)) && !v.startsWith('~') && !v.startsWith('|')) next.min = Number(v);
      else next.min = v;
    }
    if ('max' in data) {
      const v = data.max as string;
      if (v === '' || v === undefined || v === null) delete next.max;
      else if (!isNaN(Number(v)) && !v.startsWith('~') && !v.startsWith('|')) next.max = Number(v);
      else next.max = v;
    }
    if ('decimals' in data) {
      if (data.decimals === undefined || data.decimals === '') delete next.decimals;
      else next.decimals = Number(data.decimals);
    }
    if ('align_to' in data) {
      if (data.align_to === undefined || data.align_to === '') delete next.align_to;
      else next.align_to = Number(data.align_to);
    }
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _validation(): TemplateResult | typeof nothing {
    const y = this.yaxis;
    if (!y) return nothing;
    const errors: string[] = [];
    if (y.min !== undefined && !isValidYaxisLimit(String(y.min))) {
      errors.push('Min: use number, "auto", "~N" (soft), or "|N|" (absolute).');
    }
    if (y.max !== undefined && !isValidYaxisLimit(String(y.max))) {
      errors.push('Max: use number, "auto", "~N" (soft), or "|N|" (absolute).');
    }
    if (errors.length === 0) return nothing;
    return html`<div class="validation-error">${errors.map((e) => html`<div>• ${e}</div>`)}</div>`;
  }

  protected render(): TemplateResult {
    if (!this.hass) return html``;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${SCHEMA}
        .computeLabel=${computeLabel}
        .computeHelper=${computeHelper}
        @value-changed=${this._onChange}
      ></ha-form>
      ${this._validation()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-yaxis-item-editor': ApexChartsCardYAxisItemEditor;
  }
}
