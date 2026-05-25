import { HaFormSchema } from '../types';

export const HEADER_SCHEMA: HaFormSchema[] = [
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'show', selector: { boolean: {} } },
      { name: 'floating', selector: { boolean: {} } },
    ],
  },
  { name: 'title', selector: { text: {} } },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'show_states', selector: { boolean: {} } },
      { name: 'colorize_states', selector: { boolean: {} } },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'standard_format', selector: { boolean: {} } },
      { name: 'disable_actions', selector: { boolean: {} } },
    ],
  },
];

export const NOW_SCHEMA: HaFormSchema[] = [
  { name: 'show', selector: { boolean: {} } },
  { name: 'color', selector: { text: {} } },
  { name: 'label', selector: { text: {} } },
];

export const SHOW_SCHEMA: HaFormSchema[] = [
  { name: 'loading', selector: { boolean: {} } },
  { name: 'last_updated', selector: { boolean: {} } },
  { name: 'version', selector: { boolean: {} } },
];
