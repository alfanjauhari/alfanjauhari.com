# @alfanjauhari/solid-prosemirror

A simple SolidJS rich text editor using the current ProseMirror schema and toolbar implementation

```tsx
import { RichTextEditor } from "@alfanjauhari/solid-prosemirror";
import "@alfanjauhari/solid-prosemirror/style.css";

<RichTextEditor defaultValue="<p>Hello</p>" onChange={console.log} />;
```
