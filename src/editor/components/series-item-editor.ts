import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import {
  ChartCardAllSeriesExternalConfig,
  ChartCardExternalConfig,
  ChartCardSeriesExternalConfig,
} from '../../types-config';
import { computeColor } from '../../utils';
import { HaFormSchema } from '../types';
import {
  computeHelper,
  computeLabel,
  fromSelectValue,
  parseStrokeDash,
  serializeStrokeDash,
  toSelectValue,
} from '../helpers';
import {
  SERIES_ADVANCED_BASE_SCHEMA,
  SERIES_APPEARANCE_SCHEMA,
  SERIES_CORE_SCHEMA,
  SERIES_DATA_PROCESSING_SCHEMA,
  SERIES_VISIBILITY_SCHEMA,
} from '../schemas/series';
import './color-threshold-editor';
import './actions-editor';

type Series = ChartCardSeriesExternalConfig | ChartCardAllSeriesExternalConfig;

@customElement('apexcharts-card-series-item-editor')
export class ApexChartsCardSeriesItemEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: ChartCardExternalConfig;
  @property({ attribute: false }) public series?: Series;
  @property({ attribute: false }) public isAllSeriesConfig = false;

  // ── Core helpers ──

  private _fire(updates: Partial<Series>): void {
    const next: Series = { ...(this.series || {}), ...updates };
    // Strip keys whose new value is undefined so the YAML stays clean
    for (const k of Object.keys(updates) as (keyof Series)[]) {
      if (updates[k] === undefined) {
        delete (next as Record<string, unknown>)[k as string];
      }
    }
    this.dispatchEvent(
      new CustomEvent('series-changed', {
        detail: { series: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _swatch(): string {
    const s = this.series;
    if (s?.color) {
      try {
        return computeColor(s.color);
      } catch {
        return 'transparent';
      }
    }
    return 'transparent';
  }

  // ── Field handlers ──

  private _entityChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = ev.detail.value as string | undefined;
    this._fire({ entity: value || '' } as Partial<ChartCardSeriesExternalConfig>);
  };

  private _coreChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as { name?: string; type?: string };
    const updates: Partial<Series> = {};
    if ('name' in data) updates.name = data.name || undefined;
    if ('type' in data) {
      updates.type = (data.type || undefined) as Series['type'];
    }
    this._fire(updates);
  };

  private _colorChanged = (ev: Event): void => {
    const value = (ev.target as HTMLInputElement).value;
    this._fire({ color: value || undefined } as Partial<Series>);
  };

  private _dataProcessingData(): Record<string, unknown> {
    const s = this.series || {};
    return {
      group_by: s.group_by || {},
      statistics: s.statistics || {},
      fill_raw: s.fill_raw,
      transform: s.transform,
      data_generator: s.data_generator,
    };
  }

  private _dataProcessingChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as {
      group_by?: { duration?: string; func?: string; fill?: string; start_with_last?: boolean };
      statistics?: { type?: string; period?: string; align?: string };
      fill_raw?: string;
      transform?: string;
      data_generator?: string;
    };

    const updates: Partial<Series> = {};

    if (data.group_by) {
      const g: NonNullable<Series['group_by']> = {};
      if (data.group_by.duration) g.duration = data.group_by.duration;
      if (data.group_by.func) g.func = data.group_by.func as NonNullable<Series['group_by']>['func'];
      if (data.group_by.fill) g.fill = data.group_by.fill as NonNullable<Series['group_by']>['fill'];
      if (data.group_by.start_with_last) g.start_with_last = true;
      updates.group_by = Object.keys(g).length > 0 ? g : undefined;
    }
    if (data.statistics) {
      const st: NonNullable<Series['statistics']> = {};
      if (data.statistics.type) st.type = data.statistics.type as NonNullable<Series['statistics']>['type'];
      if (data.statistics.period) st.period = data.statistics.period as NonNullable<Series['statistics']>['period'];
      if (data.statistics.align) st.align = data.statistics.align as NonNullable<Series['statistics']>['align'];
      updates.statistics = Object.keys(st).length > 0 ? st : undefined;
    }
    if ('fill_raw' in data) updates.fill_raw = (data.fill_raw || undefined) as Series['fill_raw'];
    if ('transform' in data) updates.transform = data.transform || undefined;
    if ('data_generator' in data) updates.data_generator = data.data_generator || undefined;

    this._fire(updates);
  };

  private _appearanceData(): Record<string, unknown> {
    const s = this.series || {};
    return {
      curve: s.curve || '',
      opacity: s.opacity,
      stroke_width: s.stroke_width,
      stroke_dash: serializeStrokeDash(s.stroke_dash),
      extend_to: toSelectValue(s.extend_to),
      invert: s.invert ?? false,
    };
  }

  private _appearanceChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as Record<string, unknown>;
    const updates: Partial<Series> = {};
    if ('curve' in data) updates.curve = (data.curve as Series['curve']) || undefined;
    if ('opacity' in data) updates.opacity = data.opacity === undefined ? undefined : Number(data.opacity);
    if ('stroke_width' in data)
      updates.stroke_width = data.stroke_width === undefined ? undefined : Number(data.stroke_width);
    if ('stroke_dash' in data) {
      const sd = parseStrokeDash(data.stroke_dash as string);
      updates.stroke_dash = sd;
    }
    if ('extend_to' in data) {
      const v = fromSelectValue(data.extend_to as string);
      if (v === false) updates.extend_to = false;
      else if (v === 'end' || v === 'now') updates.extend_to = v;
      else updates.extend_to = undefined;
    }
    if ('invert' in data) updates.invert = data.invert ? true : undefined;
    this._fire(updates);
  };

  private _visibilityData(): Record<string, unknown> {
    const show = (this.series?.show || {}) as Record<string, unknown>;
    return {
      in_chart: show.in_chart ?? true,
      in_header: toSelectValue(show.in_header as undefined),
      in_legend: show.in_legend ?? true,
      legend_value: show.legend_value ?? true,
      name_in_header: show.name_in_header ?? true,
      offset_in_name: show.offset_in_name ?? true,
      null_in_header: show.null_in_header ?? true,
      zero_in_header: show.zero_in_header ?? true,
      as_duration: toSelectValue(show.as_duration as undefined),
      extremas: toSelectValue(show.extremas as undefined),
      datalabels: toSelectValue(show.datalabels as undefined),
      header_color_threshold: show.header_color_threshold ?? false,
      hidden_by_default: show.hidden_by_default ?? false,
      in_brush: show.in_brush ?? false,
    };
  }

  private _visibilityChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as Record<string, unknown>;
    const show: Record<string, unknown> = { ...(this.series?.show || {}) };

    const setBool = (k: string, defaultVal: boolean): void => {
      if (k in data) {
        const v = data[k] as boolean;
        if (v === defaultVal) delete show[k];
        else show[k] = v;
      }
    };
    const setMulti = (k: string): void => {
      if (k in data) {
        const v = fromSelectValue(data[k] as string);
        if (v === undefined) delete show[k];
        else show[k] = v;
      }
    };
    const setOpt = (k: string): void => {
      if (k in data) {
        if (data[k]) show[k] = data[k];
        else delete show[k];
      }
    };

    setBool('in_chart', true);
    setMulti('in_header');
    setBool('in_legend', true);
    setBool('legend_value', true);
    setBool('name_in_header', true);
    setBool('offset_in_name', true);
    setBool('null_in_header', true);
    setBool('zero_in_header', true);
    setMulti('as_duration');
    setMulti('extremas');
    setMulti('datalabels');
    setOpt('header_color_threshold');
    setOpt('hidden_by_default');
    setOpt('in_brush');

    this._fire({ show: Object.keys(show).length > 0 ? (show as Series['show']) : undefined });
  };

  private _advancedData(): Record<string, unknown> {
    const s = this.series || {};
    return {
      attribute: s.attribute,
      unit: s.unit,
      float_precision: s.float_precision,
      offset: s.offset,
      time_delta: s.time_delta,
      min: s.min,
      max: s.max,
      yaxis_id: s.yaxis_id,
      stack_group: s.stack_group,
    };
  }

  private _advancedSchema(): HaFormSchema[] {
    const schema: HaFormSchema[] = [...SERIES_ADVANCED_BASE_SCHEMA];
    if (this.config?.chart_type === 'radialBar') {
      schema.push({
        type: 'grid',
        name: '',
        schema: [
          { name: 'min', selector: { number: { mode: 'box' } } },
          { name: 'max', selector: { number: { mode: 'box' } } },
        ],
      });
    }
    if (this.config?.yaxis && this.config.yaxis.length > 0) {
      schema.push({ name: 'yaxis_id', selector: { text: {} } });
    }
    if (this.config?.stacked) {
      schema.push({ name: 'stack_group', selector: { text: {} } });
    }
    return schema;
  }

  private _advancedChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as Record<string, unknown>;
    const updates: Partial<Series> = {};
    const stringKeys: (keyof Series)[] = ['attribute', 'unit', 'offset', 'time_delta', 'yaxis_id', 'stack_group'];
    for (const k of stringKeys) {
      if (k in data) (updates as Record<string, unknown>)[k as string] = (data[k as string] as string) || undefined;
    }
    const numKeys: (keyof Series)[] = ['float_precision', 'min', 'max'];
    for (const k of numKeys) {
      if (k in data) {
        const v = data[k as string];
        (updates as Record<string, unknown>)[k as string] = v === undefined || v === '' ? undefined : Number(v);
      }
    }
    this._fire(updates);
  };

  private _thresholdsChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = ev.detail.value as ChartCardSeriesExternalConfig['color_threshold'];
    this._fire({ color_threshold: value && value.length > 0 ? value : undefined } as Partial<Series>);
  };

  private _actionsChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = ev.detail.value as ChartCardSeriesExternalConfig['header_actions'];
    this._fire({ header_actions: value } as Partial<Series>);
  };

  // ── Visibility schema with conditional fields ──

  private _visibilitySchema(): HaFormSchema[] {
    const schema: HaFormSchema[] = [...SERIES_VISIBILITY_SCHEMA];
    const extras: HaFormSchema[] = [];
    if (this.config?.experimental?.color_threshold) {
      extras.push({ name: 'header_color_threshold', selector: { boolean: {} } });
    }
    if (this.config?.experimental?.hidden_by_default) {
      extras.push({ name: 'hidden_by_default', selector: { boolean: {} } });
    }
    if (this.config?.experimental?.brush) {
      extras.push({ name: 'in_brush', selector: { boolean: {} } });
    }
    if (extras.length > 0) {
      schema.push({ type: 'grid', name: '', schema: extras });
    }
    return schema;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.series) return html``;
    const s = this.series as ChartCardSeriesExternalConfig;
    const showColorThreshold = !this.isAllSeriesConfig && this.config?.experimental?.color_threshold;
    const showHeaderActions = !this.isAllSeriesConfig;

    return html`
      <div class="section">
        ${this.isAllSeriesConfig
          ? nothing
          : html`
              <ha-entity-picker
                .hass=${this.hass}
                .value=${s.entity || ''}
                label="Entity"
                allow-custom-entity
                @value-changed=${this._entityChanged}
              ></ha-entity-picker>
              ${!s.entity
                ? html`<div class="validation-error">Entity is required.</div>`
                : nothing}
            `}

        <ha-form
          .hass=${this.hass}
          .data=${{ name: s.name || '', type: s.type || '' }}
          .schema=${SERIES_CORE_SCHEMA}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${this._coreChanged}
        ></ha-form>

        <div class="color-field">
          <span class="color-preview" style="background: ${this._swatch()};"></span>
          <ha-textfield
            label="Color"
            .value=${s.color || ''}
            @change=${this._colorChanged}
          ></ha-textfield>
        </div>

        <ha-form
          .hass=${this.hass}
          .data=${this._dataProcessingData()}
          .schema=${[{ type: 'expandable', name: '', title: 'Data Processing', schema: SERIES_DATA_PROCESSING_SCHEMA }]}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${this._dataProcessingChanged}
        ></ha-form>

        <ha-form
          .hass=${this.hass}
          .data=${this._appearanceData()}
          .schema=${[{ type: 'expandable', name: '', title: 'Appearance', schema: SERIES_APPEARANCE_SCHEMA }]}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${this._appearanceChanged}
        ></ha-form>

        <ha-form
          .hass=${this.hass}
          .data=${this._visibilityData()}
          .schema=${[{ type: 'expandable', name: '', title: 'Visibility', schema: this._visibilitySchema() }]}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${this._visibilityChanged}
        ></ha-form>

        <ha-form
          .hass=${this.hass}
          .data=${this._advancedData()}
          .schema=${[{ type: 'expandable', name: '', title: 'Advanced', schema: this._advancedSchema() }]}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${this._advancedChanged}
        ></ha-form>

        ${showColorThreshold
          ? html`
              <ha-expansion-panel outlined header="Color Thresholds">
                <apexcharts-card-color-threshold-editor
                  .thresholds=${s.color_threshold || []}
                  @value-changed=${this._thresholdsChanged}
                ></apexcharts-card-color-threshold-editor>
              </ha-expansion-panel>
            `
          : nothing}

        ${showHeaderActions
          ? html`
              <ha-expansion-panel outlined header="Header Actions">
                <apexcharts-card-actions-editor
                  .hass=${this.hass}
                  .actions=${s.header_actions}
                  @value-changed=${this._actionsChanged}
                ></apexcharts-card-actions-editor>
              </ha-expansion-panel>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-series-item-editor': ApexChartsCardSeriesItemEditor;
  }
}
