import { css } from 'lit';

export const editorStyles = css`
  :host {
    display: block;
  }

  mwc-tab-bar {
    border-bottom: 1px solid var(--divider-color);
    --mdc-tab-text-label-color-default: var(--secondary-text-color);
    --mdc-theme-primary: var(--primary-color);
  }

  .tab-content {
    padding: 16px 16px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  ha-form,
  .form-section {
    display: block;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .section-title {
    font-weight: 500;
    font-size: 1em;
    margin: 8px 0 4px;
  }

  /* Generic list editor (series, yaxis, thresholds, colors, templates) */
  .list-editor {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .list-item {
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
    overflow: hidden;
    background: var(--card-background-color, var(--primary-background-color));
  }

  .list-item-header {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    gap: 8px;
    min-height: 48px;
    user-select: none;
  }

  .list-item-header:hover {
    background: var(--secondary-background-color);
  }

  .color-swatch {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    border: 1px solid var(--divider-color);
  }

  .item-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }

  .type-badge {
    font-size: 0.75em;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--secondary-background-color);
    color: var(--secondary-text-color);
    text-transform: capitalize;
  }

  .item-controls {
    display: flex;
    gap: 0;
    align-items: center;
  }

  .item-controls ha-icon-button {
    --mdc-icon-button-size: 36px;
    --mdc-icon-size: 20px;
    color: var(--secondary-text-color);
  }

  .item-controls ha-icon-button[disabled] {
    opacity: 0.4;
    pointer-events: none;
  }

  .list-item-body {
    padding: 0 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Add button */
  .add-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 10px;
    border: 1px dashed var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
    cursor: pointer;
    color: var(--primary-color);
    background: transparent;
    font-size: 0.95em;
    font-family: inherit;
  }
  .add-button:hover {
    background: var(--secondary-background-color);
  }

  /* Color field */
  .color-field {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .color-preview {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid var(--divider-color);
    flex-shrink: 0;
    background: var(--secondary-background-color);
  }
  .color-field ha-textfield {
    flex: 1;
  }

  /* Inline grid */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  /* Templates chip row */
  .chip-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    background: var(--secondary-background-color);
  }
  .chip-row .chip-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .chip-row ha-icon-button {
    --mdc-icon-button-size: 28px;
    --mdc-icon-size: 16px;
  }

  .add-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .add-row ha-textfield {
    flex: 1;
  }

  /* Preview panel */
  .preview-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 12px 16px;
    cursor: pointer;
    color: var(--secondary-text-color);
    font-size: 0.9em;
    border-top: 1px solid var(--divider-color);
    margin-top: 16px;
    user-select: none;
  }
  .preview-container {
    max-height: 220px;
    overflow: hidden;
    pointer-events: none;
    padding: 0 16px 16px;
  }
  .preview-error {
    color: var(--error-color);
    padding: 16px;
    font-size: 0.9em;
    white-space: pre-wrap;
    font-family: var(--code-font-family, monospace);
  }
  .preview-placeholder {
    color: var(--secondary-text-color);
    padding: 16px;
    text-align: center;
    font-style: italic;
  }

  /* Validation */
  .validation-error {
    color: var(--error-color);
    font-size: 0.85em;
    padding: 0 4px;
  }

  /* Chart-type picker grid */
  .chart-type-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
    gap: 8px;
  }
  .chart-type-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
    cursor: pointer;
    text-align: center;
    background: transparent;
    color: var(--primary-text-color);
    font-family: inherit;
    font-size: 0.85em;
    gap: 6px;
  }
  .chart-type-card:hover {
    background: var(--secondary-background-color);
  }
  .chart-type-card[selected] {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
    color: var(--primary-color);
  }
  .chart-type-card .icon {
    --mdc-icon-size: 32px;
    color: inherit;
  }

  /* yaml editor */
  .yaml-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .grid-2,
    .grid-3 {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 450px) {
    .tab-content {
      padding: 8px 8px 0;
    }
  }
`;
