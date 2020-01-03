# DBDiagram
WYSIWYG (what you see is what you get) DB Diagram tool, based on JS Sequence Diagrams and Mermaid, to be used in conjuction with some sort of SQL generator script to create simple and clean DB diagrams.

## Powered By/Using
* [**Eleventy**](https://www.11ty.io) - static site generation
* [**Nunjucks**](https://mozilla.github.io/nunjucks/) - Templating engine for JavaScript
* [markdown-it](https://github.com/markdown-it/markdown-it) - markdown processor
* 
## Want to add
* [**Netlify**](https://www.netlify.com/) - static site hosting

## Project Setup

1. Install [Node.js & NPM](https://nodejs.org/en/download/)
2. Run `npm install` in the project directory to install local dependencies
3. Install eleventy globally

    ```bash
    npm i @11ty/eleventy -g
    ```
4. Install Nunjucks

    ```bash
    npm install nunjucks
    ```
5. Run `npm run build-and-serve` to run a local dev environment
6. Access dev copy of the site at [localhost:8080](http://localhost:8080)
