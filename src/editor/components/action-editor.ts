import { LitElement, html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { editorStyles } from '../styles';
import { ActionConfig } from '../../types-config';
import { HaFormSchema } from '../types';
import { computeHelper, computeLabel } from '../helpers';

const ACTION_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'more-info', label: 'More Info' },
  { value: 'toggle', label: 'Toggle' },
  { value: 'toggle-menu', label: 'Toggle Menu' },
  { value: 'call-service', label: 'Call Service' },
  { value: 'navigate', label: 'Navigate' },
  { value: 'url', label: 'URL' },
  { value: 'none', label: 'None' },
  { value: 'fire-dom-event', label: 'Fire DOM Event' },
];

const HAPTIC_OPTIONS = [
  { value: '', label: '(none)' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'failure', label: 'Failure' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
  { value: 'selection', label: 'Selection' },
];

interface FormData {
  action?: string;
  service?: string;
  navigation_path?: string;
  url_path?: string;
  entity?: string;
  haptic?: string;
  confirmation_text?: string;
}

@customElement('apexcharts-card-action-editor')
export class ApexChartsCardActionEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public action?: ActionConfig;
  @property({ type: String }) public label = 'Action';

  static get styles(): CSSResultGroup {
    return editorStyles;
  }

  private _formData(): FormData {
    const a = (this.action || {}) as ActionConfig & {
      service?: string;
      navigation_path?: string;
      url_path?: string;
      entity?: string;
      haptic?: string;
    };
    const action = a.action || 'default';
    return {
      action,
      service: a.service,
      navigation_path: a.navigation_path,
      url_path: a.url_path,
      entity: a.entity,
      haptic: a.haptic || '',
      confirmation_text: typeof a.confirmation === 'object' ? a.confirmation?.text || '' : '',
    };
  }

  private _schema(): HaFormSchema[] {
    const data = this._formData();
    const schema: HaFormSchema[] = [
      {
        name: 'action',
        selector: { select: { mode: 'dropdown', options: ACTION_OPTIONS } },
      },
    ];

    if (data.action === 'more-info') {
      schema.push({ name: 'entity', selector: { entity: {} } });
    }
    if (data.action === 'call-service') {
      schema.push({
        name: 'service',
        selector: { text: {} },
        helper: 'e.g. light.turn_on',
      } as HaFormSchema);
    }
    if (data.action === 'navigate') {
      schema.push({
        name: 'navigation_path',
        selector: { text: {} },
        helper: 'e.g. /lovelace/0',
      } as HaFormSchema);
    }
    if (data.action === 'url') {
      schema.push({
        name: 'url_path',
        selector: { text: { type: 'url' } },
      });
    }

    if (data.action && data.action !== 'default' && data.action !== 'none') {
      schema.push({
        name: 'haptic',
        selector: { select: { mode: 'dropdown', options: HAPTIC_OPTIONS } },
      });
      schema.push({
        name: 'confirmation_text',
        selector: { text: {} },
        helper: 'Optional confirmation prompt text',
      } as HaFormSchema);
    }

    return schema;
  }

  private _onValueChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const data = ev.detail.value as FormData;

    let next: ActionConfig | undefined;
    const actionType = data.action;

    if (!actionType || actionType === 'default') {
      next = undefined;
    } else if (actionType === 'call-service') {
      next = {
        action: 'call-service',
        service: data.service || '',
      } as ActionConfig;
    } else if (actionType === 'navigate') {
      next = {
        action: 'navigate',
        navigation_path: data.navigation_path || '',
      } as ActionConfig;
    } else if (actionType === 'url') {
      next = {
        action: 'url',
        url_path: data.url_path || '',
      } as ActionConfig;
    } else if (actionType === 'more-info') {
      const out: { action: 'more-info'; entity?: string } = { action: 'more-info' };
      if (data.entity) out.entity = data.entity;
      next = out as ActionConfig;
    } else {
      next = { action: actionType } as ActionConfig;
    }

    if (next) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const n = next as any;
      if (data.haptic) n.haptic = data.haptic;
      if (data.confirmation_text) n.confirmation = { text: data.confirmation_text };
    }

    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
  };

  protected render(): TemplateResult {
    if (!this.hass) return html``;
    const data = this._formData();
    if (data.action === 'default') {
      // Use a single dropdown form when no action is configured.
      return html`
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${this._schema()}
          .computeLabel=${(s: HaFormSchema) => (s.name === 'action' ? this.label : computeLabel(s))}
          .computeHelper=${computeHelper}
          @value-changed=${this._onValueChanged}
        ></ha-form>
      `;
    }
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${this._schema()}
        .computeLabel=${(s: HaFormSchema) => (s.name === 'action' ? this.label : computeLabel(s))}
        .computeHelper=${computeHelper}
        @value-changed=${this._onValueChanged}
      ></ha-form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'apexcharts-card-action-editor': ApexChartsCardActionEditor;
  }
}
