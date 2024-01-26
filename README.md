# Sveltekit-StyleX

This is a project to get Sveltekit working with StyleX.

Due to the experimental nature of the Vite integration, the project is
set up to delete the cache before running each build (dev or prod).

---

## How to use StyleX within Svelte files

You can define your styles in a `<script context="module">` tag and use the
styles within your template. You can choose to define the styles at the top _or_
the bottom of the file. (This example defines them at the bottom of the file.)
The various, StyleX-specific imports can be defined within this same
`<script context="module">` tag.

Any component-specific state must be defined in a separate `<script>` tag,
without `context="module"`.

You can also use `lang="ts"` on either `script` tag if you want typescript.

---

Although the example contains a single route, it shows the usage of
various common StyleX APIs.
