import { ReadResource } from '@knora/api';

export interface Resource {
  id: string;
  ark: string;
  label: string;
  resourceClassLabel: string;
}
