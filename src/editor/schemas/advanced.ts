import { HaFormSchema } from '../types';

export const EXPERIMENTAL_SCHEMA: HaFormSchema[] = [
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'color_threshold', selector: { boolean: {} } },
      { name: 'hidden_by_default', selector: { boolean: {} } },
    ],
  },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'brush', selector: { boolean: {} } },
      { name: 'disable_config_validation', selector: { boolean: {} } },
    ],
  },
];

export const BRUSH_SCHEMA: HaFormSchema[] = [
  { name: 'selection_span', selector: { text: {} } },
];
