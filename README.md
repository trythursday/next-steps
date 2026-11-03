# Next Steps

An experiment in using generative AI in a non-chat form. You write a goal and
your thoughts, press a button, and get one read-only answer. There is no
back-and-forth: every response stands alone.

Part of [Thursday](https://github.com/trythursday/thursday).

## Run it

No build step. Any static server over the repo root works:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. It needs to be served over HTTP — the page
uses ES modules, which will not load from `file://`.

The first visit asks you to pick an AI provider. A free key from
[AI for All](https://ai-for-all.trythursday.org) is enough to try it.

## Layout

- `index.html` — the page
- `lib/` — the OpenAI client, provider setup, and page script
- `static/` — CSS, examples, and the system prompt the model runs under

## License

MIT. Feel free to copy and share.
