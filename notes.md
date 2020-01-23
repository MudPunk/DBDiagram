## Steps

* Create your git repo to work out of.
* run `npm i @11ty/eleventy -g`
* run `install nunjucks`
* run `npm install chalk --save-dev`
* run `npm init`
  * About `init` - https://stackoverflow.com/questions/9961502/is-there-a-way-to-automatically-build-the-package-json-file-for-node-js-projects
  * Package name - <kbd>enter</kbd>
  * Version - <kbd>enter</kbd>
  * Descirption - `Add some description`
  * Entry Point - <kbd>enter</kbd>
  * Test command - `test`
    * https://stackoverflow.com/questions/44879644/what-is-the-test-command-while-creating-package-json
  * git repository - https://github.com/MudPunk/DBDiagram.git
  * Keywords - DB, SVG, Sequence Diagram, SQL
  * Author - Brian Nowak
  * license - <kbd>enter</kbd>
* Added a `scripts` section to package.json
```json
  "scripts": {
    "build": "npx eleventy",
    "full-build": "set CACHE_BUST=true && npx eleventy",
    "serve": "npx eleventy --serve",
    "clean": "del -rf _site",
    "clear-cache": "del -rf tweets",
    "favicon": "npx real-favicon generate \"./tools/favicon-generator.json\" \"./tools/faviconData.json\" \"./assets/images/icons/fav\"",
    "build-and-run": "npx eleventy && npx eleventy --serve"
  },
```
* run command `npm run build` to build things
  * Changed RM to DEL for windows
  * added `"build-and-run": "npx eleventy && npx eleventy --serve"` to just build and run things in one shot.

* Added `.gitignore` file
```gitignore
node_modules
_site
.env
*.ssms_suo
*.suo
notes.md
```
* added folders
  * `assets`
  * `layouts`
  * `pages`
* added to parent dir
  * `.eleventy.js`
```js
module.exports = function(eleventyConfig) {
    return {
        dir: {
            "data": "data",
            includes: "assets",
            layouts: "layouts"
        },

        // By default markdown files are pre-processing with liquid template engine
        // https://www.11ty.io/docs/config/#default-template-engine-for-markdown-files
        markdownTemplateEngine: "njk",
    };
};
```
* Added `Default.njk` to `layouts` dir.
```njk
<!doctype html>
<html lang="en">
  <head>
    <title>{{ title }}</title>
  </head>
  <body>
    {{ content | safe }}
  </body>
</html>
```
* added `Index.njk` to `pages` dir

```njk
---
layout: default.njk
title: "Home Page"
permalink: "index.html"
summary: "Test site setup"
---


<br><br>
<kbd>Page Info<kbd>
```
* added markdown-it processor
```npm
npm install markdown-it --save
```

* added `Plugins` folder
* Added the following snippet to `.eleventy.js` 

```js
    // configure syntax highlighting
    let md = require("./plugins/customize-markdown.js")()
    eleventyConfig.setLibrary("md", md);

    eleventyConfig.addPairedShortcode("markdown", (content, inline = null) => {
        return inline
          ? md.renderInline(content)
          : md.render(content);
      });
```

* added `posts` folder
  * added `posts.json`
* added `posts.njk` to `layouts`
```njk
{% set page_title = title or (renderData and renderData.title) %}
<h1 class="page-title">{{page_title}}</h1>

  <span class="post-byline">
    <ul class="post-authors">
    {%- for author in authors -%}
      <li class="post-author">

        {% set authorInfo = collections.authors | findByName(author) %}
        {% if authorInfo %}
          <a href="/pages/authors/{{author | lower}}">{{ author }}</a>
        {% else %}
          {{ author }}
        {% endif %}
        
        {% if not loop.last %}<span class="separator">,</span>{%- endif -%}
      </li>
    {%- endfor -%}
    </ul>
  </span>
```

* added `author.njk` to `layouts`

```njk
---
layout: default.njk
---


<h2><a href="/authors/"> {% include "assets/images/icons/fa/arrow-left.svg" %} All Authors</a></h2>

<h1 class="page-title">{{ title }}</h1>

{{ content | safe }}

{% set author = collections.authors | findByName(name) %}
{% set postList = author.posts %}
<!--{ 
    % //include "_partials/postList.njk" %
    }-->
```

* Added `test.md` to `posts` dir


* Tried to rebuild, got the following error

```error
`TemplateWriterWriteError` was thrown
> (layouts/post.njk)
Error: filter not found: findByName
```
* to resolve the error, added the following to `.eleventy.js`

```js
  //add filters
  eleventyConfig.addFilter("findByName", (arr, findValue) => arr.find(a => a.name === findValue));

  // custom collections
  let builder = require("./plugins/builder.js")
  eleventyConfig.addCollection("authors", col => builder(col, "author", "name", "summary", "authors", "./authors/"));
```

* added `builder.js` to folder `plugins`
* Got error on missing NPM `chalk`, fixed with

```npm
npm install chalk --save-dev
```

* after runing build, got a new error


```error
Problem writing Eleventy templates: (more in DEBUG output)
> postTagName is not defined
```

* Turns out this is a bug in `builder.js`. JS won't throw an error unless it is run, so the faulty code can exist since there's no way to precompile it to find said error. In this case, it would appear to be due to a typo, `postTagName` should be one of the values passed into the function `validateCategory`. When valid, custom warning output will look like the following

```npm
  Missing postTagName pages for:
  * Brian

  To fix, create the following files:
  ./authors/Brian.md
```

* Added `.vscode` folder
  * added `extensions.json` file for "recommended extensions"
  * Added `.vscode` to `.elventiyignore`

* installed clean-css `npm install clean-css`
* installed terser for clean-js.js `npm install terser`

* Updated default.njk

```njk
<!doctype html>
<html lang="en">
  <head>
    <title>{{ title }}</title>

    <style type="text/css">
        /* minimal style sheet if something goes wrong */
        img[src$=".svg"], svg {max-width: 10px;}
        {{ collections.bundles.style.templateContent | safe }}
    </style>

  </head>
  <body>

    {# scripts to run asap #}
    {% set js %} {% include "assets/scripts/init.js" %}{% endset %}
    <script type="text/javascript">{{ js | jsmin | safe }}</script>


    <header id="header" class="header">
        <button class="hamburger nav-toggle" type="button" id="navToggleBody" 
                aria-haspopup="true" aria-expanded="false" aria-label="Toggle side navbar">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
        </button>

        <a href="/" aria-label="Home Page" class="brand" >
            {% include "assets/images/volleyball.svg" %}
            <span class="site-title">
                {% set site_title_word = title_word or (renderData and renderData.title_word) %}
                <span class="word">{{site_title_word}}</span> 
                <span class="gmvb">GMVB</span> 
                <span class="vball">Volleyball</span>
            </span>
        </a>


    </header>
      
    {{ content | safe }}
  </body>
</html>
```


Installed the following :
npm install markdown-it-anchor
npm install markdown-it-ins
npm install markdown-it-deflist
npm install markdown-it-anchor
npm install markdown-it-spoiler
npm install he
npm install typeface-noto-serif
npm install typeface-roboto
npm install gumshoejs
npm install firacode
npm install highlightjs

  