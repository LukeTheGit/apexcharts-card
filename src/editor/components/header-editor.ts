import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { ChartCardHeaderExternalConfig, ActionsConfig } from '../../types-config';
import { computeHelper, computeLabel } from '../helpers';
import { HEADER_SCHEMA } from '../schemas/display';
import './actions-editor';

@customElement('apexcharts-card-header-editor')
export class ApexChartsCardHeaderEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public header?: ChartCardHeaderExternalConfig;

  private _fire(value: ChartCardHeaderExternalConfig | undefined): void {
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: value && Object.keys(value).length > 0 ? value : undefined },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _formChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as ChartCardHeaderExternalConfig;
    const next: ChartCardHeaderExternalConfig = { ...(this.header || {}) };
    const fields: (keyof ChartCardHeaderExternalConfig)[] = [
      'show',
      'floating',
      'title',
      'show_states',
      'colorize_states',
      'standard_format',
      'disable_actions',
    ];
    for (const k of fields) {
      const v = (data as Record<string, unknown>)[k as string];
      if (v === undefined || v === '' || v === false) {
        delete (next as Record<string, unknown>)[k as string];
      } else {
        (next as Record<string, unknown>)[k as string] = v;
      }
    }
    this._fire(next);
  };

  private _titleActionsChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = ev.detail.value as ActionsConfig | undefined;
    const next: ChartCardHeaderExternalConfig = { ...(this.header || {}) };
    if (value) next.title_actions = value;
    else delete next.title_actions;
    this._fire(next);
  };

  protected render(): TemplateResult {
    if (!this.hass) return html``;
    const h = this.header || {};
    return html`
      <div class="section">
        <ha-form
          .hass=${this.hass}
          .data=${h}
          .schema=${HEADER_SCHEMA}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${this._formChanged}
        ></ha-form>
        <ha-expansion-panel outlined header="Title Actions">
          <apexcharts-card-actions-editor
            .hass=${this.hass}
            .actions=${h.title_actions}
            @value-changed=${this._titleActionsChanged}
          ></apexcharts-card-actions-editor>
        </ha-expansion-panel>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-header-editor': ApexChartsCardHeaderEditor;
  }
}
