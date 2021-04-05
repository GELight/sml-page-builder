# SML Page Builder

The simple page generator based on SML

## Using

Example page definition - *pages/**index.sml***
```
Page
    Children
        h1
            id title
            Text Hello World
        End
        Include https://raw.githubusercontent.com/....../README.md
    End
End
```

Use the SmlPageBuilder to generate html files based on your defined SML files. This example use two other classes `CustomTagText` and `CustomTagIncludeGithubMarkdownFile` to manipulate any attributes or elements with related tag names.
```js
import * as path from "path";
import { CustomTagIncludeGithubMarkdownFile, CustomTagText, SmlPageBuilder } from "@gelight/sml-page-builder";

const PATH = path.resolve(__dirname, "pages");
const OUTPUT_PATH = path.resolve(__dirname, "sites");

new SmlPageBuilder()
    .setChildrenElementName("Children")
    .setPagesPath(PATH)
    .setOutputPath(OUTPUT_PATH)
    .registerCustomTag("Text", CustomTagText)
    .registerCustomTag("Include", CustomTagIncludeGithubMarkdownFile)
    .build();
```
Output:
```html
<h1 id="title">
    Hello World
</h1>
... included Github markdown converted to HTML ...
```