import { Config, Generator, Schema } from './types/meta_model';
import { buildNameVariations } from './name_variations';

const generate = (schema: Schema, { scope }: Config) => {
  const { ref, refs, model, models, singleParam } = buildNameVariations(schema);

  const template = `
    import { HttpClient } from '@angular/common/http';
    import { Injectable } from '@angular/core';
    import { ${model} } from '@${scope}/api-interfaces';
    import { environment } from '@env/environment';

    @Injectable({
    providedIn: 'root'
    })
    export class ${models}Service {
    model = '${refs}';

    constructor(private http: HttpClient) { }

    all() {
        return this.http.get<${model}[]>(this.getUrl());
    }

    find(id: string) {
        return this.http.get<${model}>(this.getUrlWithId(id));
    }

    create(${singleParam}) {
        return this.http.post(this.getUrl(), ${ref});
    }

    update(${singleParam}) {
        return this.http.put(this.getUrlWithId(${ref}.id), ${ref});
    }

    delete(${singleParam}) {
        return this.http.delete(this.getUrlWithId(${ref}.id));
    }

    private getUrl() {
        return \`\${environment.apiEndpoint}\${this.model}\`;
    }

    private getUrlWithId(id) {
        return \`\${this.getUrl()}/\${id}\`;
    }
    }`;

  return {
    template,
    title: `${models} Service`,
    fileName: `libs/core-data/src/lib/services/${refs}/${refs}.service.ts`,
  };
};

export const ServiceGenerator: Generator = {
  generate,
};