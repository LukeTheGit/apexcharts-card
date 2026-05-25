import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { ChartCardExternalConfig, ChartCardHeaderExternalConfig } from '../../types-config';
import { computeHelper, computeLabel } from '../helpers';
import { NOW_SCHEMA, SHOW_SCHEMA } from '../schemas/display';
import '../components/header-editor';
import '../components/color-list-editor';

@customElement('apexcharts-card-editor-display')
export class ApexChartsCardEditorDisplay extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: ChartCardExternalConfig;

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

  private _headerChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = ev.detail.value as ChartCardHeaderExternalConfig | undefined;
    this._fire({ header: value });
  };

  private _nowChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as ChartCardExternalConfig['now'];
    if (!data) return this._fire({ now: undefined });
    const next: NonNullable<ChartCardExternalConfig['now']> = {};
    if (data.show) next.show = true;
    if (data.color) next.color = data.color;
    if (data.label) next.label = data.label;
    this._fire({ now: Object.keys(next).length > 0 ? next : undefined });
  };

  private _showChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as ChartCardExternalConfig['show'];
    if (!data) return this._fire({ show: undefined });
    const next: NonNullable<ChartCardExternalConfig['show']> = {};
    // `loading` defaults to true; only persist explicit `false`
    if (data.loading === false) next.loading = false;
    if (data.last_updated) next.last_updated = true;
    if (data.version) next.version = true;
    this._fire({ show: Object.keys(next).length > 0 ? next : undefined });
  };

  private _colorListChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = ev.detail.value as string[] | undefined;
    this._fire({ color_list: value });
  };

  protected render(): TemplateResult {
    if (!this.hass || !this.config) return html``;
    const cfg = this.config;
    const showData = {
      loading: cfg.show?.loading ?? true,
      last_updated: cfg.show?.last_updated ?? false,
      version: cfg.show?.version ?? false,
    };
    return html`
      <div class="section">
        <ha-expansion-panel outlined header="Header" expanded>
          <apexcharts-card-header-editor
            .hass=${this.hass}
            .header=${cfg.header}
            @value-changed=${this._headerChanged}
          ></apexcharts-card-header-editor>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Now Marker">
          <ha-form
            .hass=${this.hass}
            .data=${cfg.now || {}}
            .schema=${NOW_SCHEMA}
            .computeLabel=${computeLabel}
            .computeHelper=${computeHelper}
            @value-changed=${this._nowChanged}
          ></ha-form>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Show Options">
          <ha-form
            .hass=${this.hass}
            .data=${showData}
            .schema=${SHOW_SCHEMA}
            .computeLabel=${computeLabel}
            .computeHelper=${computeHelper}
            @value-changed=${this._showChanged}
          ></ha-form>
        </ha-expansion-panel>

        <ha-expansion-panel outlined header="Color Palette">
          <apexcharts-card-color-list-editor
            .colors=${cfg.color_list || []}
            @value-changed=${this._colorListChanged}
          ></apexcharts-card-color-list-editor>
        </ha-expansion-panel>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-editor-display': ApexChartsCardEditorDisplay;
  }
}
