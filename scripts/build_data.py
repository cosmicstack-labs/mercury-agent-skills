#!/usr/bin/env python3
import os, re, json

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(BASE, 'docs')
CATEGORIES = os.path.join(BASE, 'categories')

def extract(path):
    with open(path) as f:
        c = f.read()
    m = re.match(r'^---\s*\n(.*?)\n---', c, re.DOTALL)
    if not m:
        return None
    y = m.group(1)
    d = {}
    k = None
    for line in y.split('\n'):
        line = line.rstrip()
        if not line or line.startswith('#'):
            continue
        kv = re.match(r'^(\w+):\s*(.*)', line)
        if kv:
            k = kv.group(1)
            v = kv.group(2).strip()
            d[k] = '' if v in ('', '|') else v
        elif k and line.startswith('  '):
            v = line.strip()
            if v and k in d:
                d[k] = (d[k] + ' ' + v) if d[k] else v
    body = c[m.end():].strip()
    first_line = body.split('\n')[0].strip().lstrip('#').strip() if body else ''
    return {
        'name': d.get('name', 'Untitled'),
        'category': d.get('category', 'Uncategorized'),
        'description': d.get('description', first_line),
        'tags': [t.strip() for t in d.get('tags', '').split(',') if t.strip()],
        'icon': d.get('icon', '\U0001F527'),
        'body': body[:2000] if body else ''
    }

results = []
for root, dirs, files in os.walk(CATEGORIES):
    if 'SKILL.md' in files:
        p = os.path.join(root, 'SKILL.md')
        meta = extract(p)
        if meta:
            rel = os.path.relpath(root, CATEGORIES)
            meta['slug'] = rel
            parts = rel.split(os.sep)
            meta['category'] = parts[0].replace('-', ' ').title()
            meta['github_url'] = f'https://github.com/cosmicstack-labs/mercury-agent-skills/tree/main/categories/{rel}'
            results.append(meta)

results.sort(key=lambda x: (x['category'], x['name']))
os.makedirs(os.path.join(DOCS, 'data'), exist_ok=True)
with open(os.path.join(DOCS, 'data', 'skills.json'), 'w') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
print(f"Generated skills.json with {len(results)} skills")

cats = {}
for r in results:
    cats[r['category']] = cats.get(r['category'], 0) + 1
for c, n in sorted(cats.items()):
    print(f"  {c}: {n}")
