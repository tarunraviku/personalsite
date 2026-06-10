# Personal site

A small, dependency-free personal site with a restrained network-terminal aesthetic.

## Run locally

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy

This site can be deployed directly with GitHub Pages:

1. Push the repository to GitHub.
2. Open the repository's **Settings > Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder.

The site and `resume.pdf` will be published from the repository root.

## Add an entry

Entries live in `entries.js`. Add a new object at the top of `window.ENTRIES`:

```js
{
  slug: "my-entry",
  date: "2026-06-10",
  title: "my entry",
  summary: "A short description",
  tags: ["personal"],
  content: [
    { type: "paragraph", text: "First paragraph" },
    { type: "heading", text: "A section title" },
    {
      type: "image",
      src: "./assets/entries/photo.jpg",
      alt: "Description of the photo",
      caption: "Optional caption",
    },
  ],
},
```

Put entry images in `assets/entries/`. After changing `entries.js`, increase the
version number on its script URL in `index.html` so deployed visitors receive
the latest file.
