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

const go_server_generator = (schema: Schema, { scope}): Config => {
    const { ref, refs, model, models, singleParam } = buildNameVariations(schema);
    const go_template = `
        package main

        import (
        	"fmt"
        	"html/template"
        	"log"
        	"net/http"
        )

        func ${model}(w http.ResponseWriter, r *http.Request) {
        	fmt.Println("${model}!")
        }

        type ${model} struct {
            //
        }

        //PageVariables are variables sent to the html template
       

        var todos []Todo

        func getTodos(w http.ResponseWriter, r *http.Request) {
        	pageVariables := PageVariables{
        		PageTitle: "Get Todos",
        		PageTodos: todos,
        	}
        	t, err := template.ParseFiles("todos.html")

        	if err != nil {
        		http.Error(w, err.Error(), http.StatusBadRequest)
        		log.Print("Template parsing error:", err)
        	}

        	err = t.Execute(w, pageVariables)
        }

        func add${model}(w http.ResponseWriter, r *http.Request) {
        	err := r.ParseForm()
        	if err != nil {
        		http.Error(w, err.Error(), http.StatusBadRequest)
        		log.Print("Request parsing error: ", err)
        	}

        	todo := Todo{
        		Title:   r.FormValue("title"),
        		Content: r.FormValue("content"),
        	}

        	todos = append(todos, todo)
        	log.Print(todos)
        	http.Redirect(w, r, "/todos/", http.StatusSeeOther)
        }

        func main() {
        	http.HandleFunc("/", home)
        	http.HandleFunc("/todos/", getTodos)
        	http.HandleFunc("/add-todo/", addTodo)
        	fmt.Println("Server is running on port :8080")
        	log.Fatal(http.ListenAndServe(":8080", nil))

        }
    `;

    return {
        go_template,
        title: `${models} Server`,
        fileName: `${refs}/${refs}.server.go`,
      };
};

export const ServiceGenerator: Generator = {
  generate
};