#!/usr/bin/env python3
"""Generate the publication list in index.html from publications.bib.

Usage: python3 build_pubs.py

Content between <!-- PUBS:START --> and <!-- PUBS:END --> in index.html is replaced.
Supported fields: title, author, booktitle, journal, year, abbr (venue badge), note, doi, url, pdf, arxiv, code, slides, poster.
"""
import html
import re
from pathlib import Path

ROOT = Path(__file__).parent
BIB = ROOT / "publications.bib"
INDEX = ROOT / "index.html"
MY_NAME = "Francesco Benocci"  # highlighted in author lists

LINK_FIELDS = [("pdf", "PDF"), ("arxiv", "arXiv"), ("doi", "DOI"), ("url", "Link"),
               ("code", "Code"), ("slides", "Slides"), ("poster", "Poster")]


def read_braced(s, i):
    """s[i] is '{'; return (content, index after the closing brace)."""
    depth, start = 0, i
    while i < len(s):
        if s[i] == "{":
            depth += 1
        elif s[i] == "}":
            depth -= 1
            if depth == 0:
                return s[start + 1:i], i + 1
        i += 1
    raise ValueError("unbalanced braces in bib file")


def parse_bib(text):
    entries = []
    for m in re.finditer(r"@(\w+)\s*\{", text):
        etype = m.group(1).lower()
        if etype in ("comment", "string", "preamble"):
            continue
        body, _ = read_braced(text, m.end() - 1)
        key, _, rest = body.partition(",")
        fields, i = {}, 0
        while True:
            fm = re.compile(r"\s*,?\s*(\w+)\s*=\s*").match(rest, i)
            if not fm or fm.end() >= len(rest):
                break
            name, i = fm.group(1).lower(), fm.end()
            if rest[i] == "{":
                val, i = read_braced(rest, i)
            elif rest[i] == '"':
                j = rest.index('"', i + 1)
                val, i = rest[i + 1:j], j + 1
            else:
                vm = re.compile(r"[^,\s}]+").match(rest, i)
                val, i = vm.group(0), vm.end()
            fields[name] = " ".join(val.split())
        entries.append({"type": etype, "key": key.strip(), **fields, "_raw": m.group(0) + body + "}"})
    return entries


def clean(s):
    s = s.replace("{", "").replace("}", "").replace("\\&", "&").replace("--", "–")
    return html.escape(s)


def fmt_authors(a):
    names = []
    for n in a.split(" and "):
        n = n.strip()
        if "," in n:  # "Last, First" -> "First Last"
            last, first = [p.strip() for p in n.split(",", 1)]
            n = f"{first} {last}"
        n = clean(n)
        if n == "others":
            n = "et al."
        if n == MY_NAME:
            n = f"<strong>{n}</strong>"
        names.append(n)
    if names and names[-1] == "et al.":
        return ", ".join(names[:-1]) + " et al."
    return ", ".join(names)


def link_href(field, value):
    if field == "doi" and not value.startswith("http"):
        return "https://doi.org/" + value
    if field == "arxiv" and not value.startswith("http"):
        return "https://arxiv.org/abs/" + value
    return value


def render(entries):
    entries.sort(key=lambda e: e.get("year", "0"), reverse=True)
    out, year = [], None
    for e in entries:
        if e.get("year") != year:
            if year is not None:
                out.append("</ol>")
            year = e.get("year")
            out.append(f'<h3 class="pub-year">{clean(year or "")}</h3>\n<ol class="pubs">')
        venue = clean(e.get("booktitle") or e.get("journal") or "")
        badges = ""
        if e.get("abbr"):
            badges += f'<span class="badge">{clean(e["abbr"])}</span>'
        if e.get("note"):
            badges += f'<span class="badge soft">{clean(e["note"])}</span>'
        title = clean(e.get("title", ""))
        main_link = next((link_href(f, e[f]) for f in ("url", "doi", "arxiv", "pdf") if e.get(f)), None)
        if main_link:
            title = f'<a href="{html.escape(main_link)}">{title}</a>'
        links = "".join(
            f'<a href="{html.escape(link_href(f, e[f]))}">{label}</a>'
            for f, label in LINK_FIELDS if e.get(f))
        bib = html.escape(re.sub(r"^\s*(pdf|code|slides|poster|arxiv|note|abbr)\s*=.*\n", "", e["_raw"], flags=re.M))
        out.append(
            f'<li class="pub" id="{html.escape(e["key"])}">\n'
            + (f'  <div class="pub-badges">{badges}</div>\n' if badges else "")
            + f'  <div class="pub-title">{title}</div>\n'
            f'  <div class="pub-authors">{fmt_authors(e.get("author", ""))}</div>\n'
            f'  <div class="pub-venue">{venue}</div>\n'
            f'  <div class="pub-links">{links}'
            f'<details><summary>BibTeX</summary><pre>{bib}</pre></details></div>\n'
            f'</li>')
    if entries:
        out.append("</ol>")
    return "\n".join(out)


def main():
    entries = parse_bib(BIB.read_text(encoding="utf-8"))
    page = INDEX.read_text(encoding="utf-8")
    new = re.sub(r"(<!-- PUBS:START -->).*?(<!-- PUBS:END -->)",
                 lambda m: m.group(1) + "\n" + render(entries) + "\n" + m.group(2),
                 page, flags=re.S)
    INDEX.write_text(new, encoding="utf-8")
    print(f"{len(entries)} publications written to index.html")


if __name__ == "__main__":
    main()
