# SML Page Builder

The simple page generator based on SML

## Using

Example page definition - *./layouts/**page-layout.sml***
```
Div
    class example-page-layout
    Slot default
End
```

Example page definition - *./pages/**index.sml***
```
Slot
    From ../layouts/page-layout.sml
    Name default
    Section
        class container markdown
        h1
            id title
            Text Hello World
        End
        IncludeGithubMarkdownFile https://raw.githubusercontent.com/ReliableTXT/ReliableTXT/main /ReliableTXT_Specification.md
    End
End
```

Use the SmlPageBuilder to generate html files based on your defined SML files. This example use three other classes `CustomTagText` and `CustomTagIncludeGithubMarkdownFile` to manipulate any attributes or elements with related tag names.
```js
import * as path from "path";
import {
    CustomTagIncludeGithubMarkdownFile,
    CustomTagSlot,
    CustomTagText,
    SmlPageBuilder
} from "@gelight/sml-page-builder";

const PATH = path.resolve(__dirname, "pages");
const OUTPUT_PATH = path.resolve(__dirname, "sites");
const ASSETS_PATH = path.resolve(__dirname, "assets");

new SmlPageBuilder()
    .setAssetsPath(ASSETS_PATH)
    .setPagesPath(PATH)
    .setOutputPath(OUTPUT_PATH)
    .registerCustomTag("Text", CustomTagText)
    .registerCustomTag("Slot", CustomTagSlot)
    .registerCustomTag("IncludeGithubMarkdownFile", CustomTagIncludeGithubMarkdownFile)
    .build();
```
Output:
```html
<div class="example-page-layout">

    <h1 id="title">
        Hello World
    </h1>
    
    ... included Github markdown converted to HTML ...

</div>
```