import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { ChartCardExternalConfig } from '../../types-config';
import { computeHelper, computeLabel } from '../helpers';
import { BRUSH_SCHEMA, EXPERIMENTAL_SCHEMA } from '../schemas/advanced';
import { HaFormSchema } from '../types';
import '../components/yaml-editor';

const ICON_DELETE = 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z';
const ICON_ADD = 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z';

const CACHE_SCHEMA: HaFormSchema[] = [{ name: 'cache', selector: { boolean: {} } }];

@customElement('apexcharts-card-editor-advanced')
export class ApexChartsCardEditorAdvanced extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: ChartCardExternalConfig;
  @state() private _templateInput = '';

  private _fire(updates: Partial<ChartCardExternalConfig>): void {
    if (!this.config) return;
    const next: ChartCardExternalConfig = { ...this.config, ...updates };
    for (const k of Object.keys(updates) as (keyof ChartCardExternalConfig)[]) {
      if (updates[k] === undefined) delete (next as unknown as Record<string, unknown>)[k as string];
    }
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _experimentalChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as NonNullable<ChartCardExternalConfig['experimental']>;
    const next: NonNullable<ChartCardExternalConfig['experimental']> = {};
    if (data.color_threshold) next.color_threshold = true;
    if (data.disable_config_validation) next.disable_config_validation = true;
    if (data.hidden_by_default) next.hidden_by_default = true;
    if (data.brush) next.brush = true;
    this._fire({ experimental: Object.keys(next).length > 0 ? next : undefined });
  };

  private _brushChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as NonNullable<ChartCardExternalConfig['brush']>;
    const next: NonNullable<ChartCardExternalConfig['brush']> = { ...(this.config?.brush || {}) };
    if (data.selection_span) next.selection_span = data.selection_span;
    else delete next.selection_span;
    this._fire({ brush: Object.keys(next).length > 0 ? next : undefined });
  };

  private _cacheChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as { cache?: boolean };
    if (data.cache === false) this._fire({ cache: false });
    else this._fire({ cache: undefined });
  };

  private _apexConfigChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = ev.detail.value;
    if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) {
      this._fire({ apex_config: undefined });
    } else {
      this._fire({ apex_config: value });
    }
  };

  private _getTemplates(): string[] {
    const t = this.config?.config_templates;
    if (!t) return [];
    return Array.isArray(t) ? t : [t];
  }

  private _setTemplates(list: string[]): void {
    if (list.length === 0) this._fire({ config_templates: undefined });
    else this._fire({ config_templates: list });
  }

  private _addTemplate(): void {
    const name = this._templateInput.trim();
    if (!name) return;
    const list = [...this._getTemplates(), name];
    this._templateInput = '';
    this._setTemplates(list);
  }

  private _removeTemplate(i: number): void {
    const list = [...this._getTemplates()];
    list.splice(i, 1);
    this._setTemplates(list);
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.config) return html``;
    const cfg = this.config;
    const exp = cfg.experimental || {};
    const cacheData = { cache: cfg.cache !== false };
    const templates = this._getTemplates();

    return html`
      <div class="section">
        <ha-expansion-panel outlined header="Experimental">
          <ha-form
            .hass=${this.hass}
            .data=${exp}
            .schema=${EXPERIMENTAL_SCHEMA}
            .computeLabel=${computeLabel}
            .computeHelper=${computeHelper}
            @value-changed=${this._experimentalChanged}
          ></ha-form>
        </ha-expansion-panel>

        ${exp.brush
          ? html`
              <ha-expansion-panel outlined header="Brush">
                <ha-form
                  .hass=${this.hass}
                  .data=${cfg.brush || {}}
                  .schema=${BRUSH_SCHEMA}
                  .computeLabel=${computeLabel}
                  .computeHelper=${computeHelper}
                  @value-changed=${this._brushChanged}
                ></ha-form>
              </ha-expansion-panel>
            `
          : nothing}

        <ha-form
          .hass=${this.hass}
          .data=${cacheData}
          .schema=${CACHE_SCHEMA}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${this._cacheChanged}
        ></ha-form>

        <ha-expansion-panel outlined header="Config Templates">
          <div class="list-editor">
            ${templates.length === 0
              ? html`<div style="color: var(--secondary-text-color); font-size: 0.9em;">
                  No templates. Templates must be defined in your Lovelace
                  <code>apexcharts_card_templates</code> configuration.
                </div>`
              : nothing}
            ${templates.map(
              (t, i) => html`
                <div class="chip-row">
                  <span class="chip-label">${t}</span>
                  <ha-icon-button
                    .path=${ICON_DELETE}
                    .label=${'Remove template'}
                    @click=${() => this._removeTemplate(i)}
                  ></ha-icon-button>
                </div>
              `,
            )}
            <div class="add-row">
              <ha-textfield
                label="Template name"
                .value=${this._templateInput}
                @input=${(ev: Event) => {
                  this._templateInput = (ev.target as HTMLInputElement).value;
                }}
                @keydown=${(ev: KeyboardEvent) => {
                  if (ev.key === 'Enter') {
                    ev.preventDefault();
                    this._addTemplate();
                  }
                }}
              ></ha-textfield>
              <ha-icon-button
                .path=${ICON_ADD}
                .label=${'Add template'}
                @click=${this._addTemplate}
              ></ha-icon-button>
            </div>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="apex_config (raw ApexCharts options)">
          <apexcharts-card-yaml-editor
            .hass=${this.hass}
            .value=${cfg.apex_config}
            @value-changed=${this._apexConfigChanged}
          ></apexcharts-card-yaml-editor>
          <div style="color: var(--secondary-text-color); font-size: 0.85em; padding: 4px;">
            Raw ApexCharts.js options. See apexcharts.com for available options.
          </div>
        </ha-expansion-panel>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-editor-advanced': ApexChartsCardEditorAdvanced;
  }
}
