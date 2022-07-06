export interface BaseEntity {
    id?: string | null;
}
  
export interface Schema extends BaseEntity {
    model: string;
    modelPlural: string;
    description?: string;
    nameVariations?: NameVariations;
    props?: Prop[];
}
  
export interface NameVariations extends BaseEntity {
    ref: string;
    refs: string;
    model: string;
    models: string;
    selector: string;
    selectors: string;
    modelParam?: string;
    modelsParam?: string;
}
  
export interface Prop {
    [key: string]: any;
}
  
export interface Config extends BaseEntity {
    name: string;
    application: string;
    scope: string;
}
  
export interface Generator {
    generate(schema: Schema, config: Config): any;
}
  