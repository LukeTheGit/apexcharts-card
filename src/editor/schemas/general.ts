import { HaFormSchema, SEL_FALSE, SEL_TRUE, SEL_UNDEFINED } from '../types';

export const GENERAL_SCHEMA: HaFormSchema[] = [
  {
    name: 'graph_span',
    selector: { text: {} },
  },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'stacked', selector: { boolean: {} } },
      { name: 'section_mode', selector: { boolean: {} } },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'update_interval', selector: { text: {} } },
      { name: 'update_delay', selector: { text: {} } },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      {
        name: 'layout',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: '', label: 'Default' },
              { value: 'minimal', label: 'Minimal' },
            ],
          },
        },
      },
      { name: 'locale', selector: { text: {} } },
    ],
  },
  {
    name: 'hours_12',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: SEL_UNDEFINED, label: 'Auto' },
          { value: SEL_TRUE, label: 'Yes' },
          { value: SEL_FALSE, label: 'No' },
        ],
      },
    },
  },
  {
    name: 'span',
    type: 'expandable',
    title: 'Time Span',
    schema: [
      {
        type: 'grid',
        name: '',
        schema: [
          {
            name: 'start',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: '', label: '(none)' },
                  { value: 'minute', label: 'Minute' },
                  { value: 'hour', label: 'Hour' },
                  { value: 'day', label: 'Day' },
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' },
                  { value: 'year', label: 'Year' },
                  { value: 'isoWeek', label: 'ISO Week' },
                ],
              },
            },
          },
          {
            name: 'end',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: '', label: '(none)' },
                  { value: 'minute', label: 'Minute' },
                  { value: 'hour', label: 'Hour' },
                  { value: 'day', label: 'Day' },
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' },
                  { value: 'year', label: 'Year' },
                  { value: 'isoWeek', label: 'ISO Week' },
                ],
              },
            },
          },
        ],
      },
      {
        name: 'offset',
        selector: { text: {} },
      },
    ],
  },
];
