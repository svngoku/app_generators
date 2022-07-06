import { NameVariations, Schema } from './types/meta_model';

// PHASE ONE: Basic string manipulation
export const DASH = '-';
export const UNDERSCORE = '_';
export const SPACE = ' ';
export const EMPTY = '';

// casing
export const lowercase = (s) => s.toLowerCase();
export const uppercase = (s) => s.toUpperCase();
export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const decapitalize = (s) => s.charAt(0).toLowerCase() + s.slice(1);
export const capitalizeWords = (s) => s.split(SPACE).map(capitalize).join(SPACE);

// replacing
export const replace = (s, targ, sub) => s.split(targ).join(sub);
export const stripDashes = (s) => replace(s, DASH, SPACE);
export const stripUnderscores = (s) => replace(s, UNDERSCORE, SPACE);
export const stripSpaces = (s) => replace(s, SPACE, EMPTY);
export const addDashes = (s) => replace(s, SPACE, DASH);
export const addUnderscores = (s) => replace(s, SPACE, UNDERSCORE);

// PHASE TWO: Functional programming FTW
const _pipe = (a, b) => (arg) => b(a(arg));
export const transformPipe = (...ops) => ops.reduce(_pipe);

// interlacing
export const strip = transformPipe(stripDashes, stripUnderscores);
export const startCase = transformPipe(strip, capitalizeWords);
export const pascalCase = transformPipe(startCase, stripSpaces);
export const camelCase = transformPipe(pascalCase, decapitalize);
export const kebabCase = transformPipe(strip, addDashes, lowercase);
export const snakeCase = transformPipe(strip, addUnderscores, lowercase);
export const constantCase = transformPipe(strip, addUnderscores, uppercase);

export const buildBase = (schema: Schema): NameVariations => ({
  ref: camelCase(schema.model),
  refs: camelCase(schema.modelPlural),
  model: pascalCase(schema.model),
  models: pascalCase(schema.modelPlural),
  selector: kebabCase(schema.model),
  selectors: kebabCase(schema.modelPlural),
});

export const buildSingleParam = (v: NameVariations) => `${v.ref}: ${v.model}`;
export const buildMultiParam = (v: NameVariations) => `${v.refs}: ${v.model}[]`;

export const addParams = (variations: NameVariations) => ({
  ...variations,
  singleParam: buildSingleParam(variations),
  multiParam: buildMultiParam(variations),
});

export const buildNameVariations = transformPipe(buildBase, addParams);