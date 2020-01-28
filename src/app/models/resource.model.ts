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


  // does this really give me the label of the class of the resource?
  // for example: for http%3A%2F%2Frdfh.ch%2F0112%2F-6s31wU0SPqOW7Kb7Clstg the label of the class should be Person
  get resourceClassLabel(): string {
    return this.readResource.resourceClassLabel
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
