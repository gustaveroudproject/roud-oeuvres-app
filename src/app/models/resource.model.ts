import { ReadResource } from '@knora/api';

export class Resource {
  constructor(protected readResource: ReadResource) {}

  get id(): string {
    return this.readResource.id;
  }

  get ark(): string {
    return this.readResource.arkUrl;
  }

  get label(): string {
    return this.readResource.label;
  }

  getFirstValueAsStringOrNullOfProperty(property: string) {
    console.log(this.readResource);
    console.log(property);
    const values: string[] = this.readResource
      ? this.readResource.getValuesAsStringArray(property)
      : null;
    console.log(values);
    return values && values.length >= 1 ? values[0] : null;
  }
}
