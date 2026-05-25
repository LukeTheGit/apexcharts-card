import { HaFormSchema, SEL_FALSE, SEL_TRUE, SEL_UNDEFINED } from '../types';

// ── Core fields rendered above the expandables (entity is handled separately). ──
export const SERIES_CORE_SCHEMA: HaFormSchema[] = [
  { name: 'name', selector: { text: {} } },
  {
    type: 'grid',
    name: '',
    schema: [
      {
        name: 'type',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: '', label: 'Default' },
              { value: 'line', label: 'Line' },
              { value: 'column', label: 'Column' },
              { value: 'area', label: 'Area' },
            ],
          },
        },
      },
    ],
  },
];

// ── Data processing ──
export const SERIES_DATA_PROCESSING_SCHEMA: HaFormSchema[] = [
  {
    name: 'group_by',
    type: 'expandable',
    title: 'Group By',
    schema: [
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'duration', selector: { text: {} } },
          {
            name: 'func',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: 'raw', label: 'Raw' },
                  { value: 'avg', label: 'Average' },
                  { value: 'min', label: 'Min' },
                  { value: 'max', label: 'Max' },
                  { value: 'last', label: 'Last' },
                  { value: 'first', label: 'First' },
                  { value: 'sum', label: 'Sum' },
                  { value: 'median', label: 'Median' },
                  { value: 'delta', label: 'Delta' },
                  { value: 'diff', label: 'Diff' },
                ],
              },
            },
          },
        ],
      },
      {
        type: 'grid',
        name: '',
        schema: [
          {
            name: 'fill',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: 'last', label: 'Last' },
                  { value: 'null', label: 'Null' },
                  { value: 'zero', label: 'Zero' },
                ],
              },
            },
          },
          { name: 'start_with_last', selector: { boolean: {} } },
        ],
      },
    ],
  },
  {
    name: 'statistics',
    type: 'expandable',
    title: 'Statistics',
    schema: [
      {
        type: 'grid',
        name: '',
        schema: [
          {
            name: 'type',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: '', label: '(none)' },
                  { value: 'mean', label: 'Mean' },
                  { value: 'max', label: 'Max' },
                  { value: 'min', label: 'Min' },
                  { value: 'sum', label: 'Sum' },
                  { value: 'state', label: 'State' },
                  { value: 'change', label: 'Change' },
                ],
              },
            },
          },
          {
            name: 'period',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: '', label: '(none)' },
                  { value: '5minute', label: '5 minutes' },
                  { value: 'hour', label: 'Hour' },
                  { value: 'day', label: 'Day' },
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' },
                ],
              },
            },
          },
        ],
      },
      {
        name: 'align',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: '', label: '(none)' },
              { value: 'start', label: 'Start' },
              { value: 'middle', label: 'Middle' },
              { value: 'end', label: 'End' },
            ],
          },
        },
      },
    ],
  },
  {
    name: 'fill_raw',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: 'null', label: 'Null' },
          { value: 'last', label: 'Last' },
          { value: 'zero', label: 'Zero' },
        ],
      },
    },
  },
  { name: 'transform', selector: { text: {} } },
  { name: 'data_generator', selector: { text: { multiline: true } } },
];

// ── Appearance ──
export const SERIES_APPEARANCE_SCHEMA: HaFormSchema[] = [
  {
    type: 'grid',
    name: '',
    schema: [
      {
        name: 'curve',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: '', label: 'Default' },
              { value: 'smooth', label: 'Smooth' },
              { value: 'straight', label: 'Straight' },
              { value: 'stepline', label: 'Stepline' },
              { value: 'monotoneCubic', label: 'Monotone Cubic' },
            ],
          },
        },
      },
      {
        name: 'opacity',
        selector: { number: { min: 0, max: 1, step: 0.05, mode: 'box' } },
      },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      {
        name: 'stroke_width',
        selector: { number: { min: 0, max: 20, step: 1, mode: 'box' } },
      },
      { name: 'stroke_dash', selector: { text: {} } },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      {
        name: 'extend_to',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: SEL_UNDEFINED, label: 'Default' },
              { value: 'end', label: 'End' },
              { value: 'now', label: 'Now' },
              { value: SEL_FALSE, label: 'Disabled' },
            ],
          },
        },
      },
      { name: 'invert', selector: { boolean: {} } },
    ],
  },
];

// ── Visibility (show.*) ──
export const SERIES_VISIBILITY_SCHEMA: HaFormSchema[] = [
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'in_chart', selector: { boolean: {} } },
      {
        name: 'in_header',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: SEL_UNDEFINED, label: 'Default' },
              { value: SEL_TRUE, label: 'Yes' },
              { value: SEL_FALSE, label: 'No' },
              { value: 'raw', label: 'Raw' },
              { value: 'before_now', label: 'Before Now' },
              { value: 'after_now', label: 'After Now' },
            ],
          },
        },
      },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'in_legend', selector: { boolean: {} } },
      { name: 'legend_value', selector: { boolean: {} } },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'name_in_header', selector: { boolean: {} } },
      { name: 'offset_in_name', selector: { boolean: {} } },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'null_in_header', selector: { boolean: {} } },
      { name: 'zero_in_header', selector: { boolean: {} } },
    ],
  },
  {
    name: 'as_duration',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: SEL_UNDEFINED, label: '(none)' },
          { value: 'millisecond', label: 'Millisecond' },
          { value: 'second', label: 'Second' },
          { value: 'minute', label: 'Minute' },
          { value: 'hour', label: 'Hour' },
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'year', label: 'Year' },
        ],
      },
    },
  },
  {
    name: 'extremas',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: SEL_UNDEFINED, label: 'Off' },
          { value: SEL_TRUE, label: 'All' },
          { value: 'time', label: 'Time' },
          { value: 'min', label: 'Min' },
          { value: 'max', label: 'Max' },
          { value: 'min+time', label: 'Min + Time' },
          { value: 'max+time', label: 'Max + Time' },
        ],
      },
    },
  },
  {
    name: 'datalabels',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: SEL_UNDEFINED, label: 'Off' },
          { value: SEL_TRUE, label: 'On' },
          { value: 'total', label: 'Total' },
          { value: 'percent', label: 'Percent' },
        ],
      },
    },
  },
];

// ── Advanced ──
export const SERIES_ADVANCED_BASE_SCHEMA: HaFormSchema[] = [
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'attribute', selector: { text: {} } },
      { name: 'unit', selector: { text: {} } },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      {
        name: 'float_precision',
        selector: { number: { min: 0, max: 10, step: 1, mode: 'box' } },
      },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'offset', selector: { text: {} } },
      { name: 'time_delta', selector: { text: {} } },
    ],
  },
];
