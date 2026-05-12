---
name: markdown-to-pdf
description: 'Converting Markdown to professional PDFs using Pandoc, WeasyPrint, ReportLab, and related tools'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: pdf-generation
  tags: [markdown, pdf, pandoc, weasyprint, reportlab, conversion]
---

# Markdown to PDF Conversion

Convert Markdown documents into polished, production-ready PDFs. This skill covers the major toolchains — Pandoc, WeasyPrint, ReportLab — plus CSS print styling, template systems, and batch conversion workflows.

---

## Toolchain Overview

| Tool | Approach | Best For | Output Quality |
|------|----------|----------|----------------|
| **Pandoc** | Markdown → PDF via LaTeX/Context/Wkhtmltopdf | Books, papers, reports | High |
| **WeasyPrint** | Markdown → HTML → PDF via CSS print | Web-like documents, branded PDFs | High |
| **ReportLab** | Programmatic PDF generation via Python | Dynamic, data-driven PDFs | Very High |
| **md-to-pdf** | Node.js CLI for quick markdown → PDF | Simple documents, quick output | Medium |
| **Puppeteer/Playwright** | Markdown → HTML → Headless browser → PDF | Pixel-perfect web-to-PDF | Very High |

---

## 1. Pandoc Workflows

Pandoc is the Swiss Army knife of document conversion. It reads Markdown and outputs PDF via an intermediate engine (default: LaTeX).

### Basic Conversion

```bash
# Simple markdown to PDF (uses pdflatex)
pandoc input.md -o output.pdf

# With metadata file
pandoc input.md --metadata-file=metadata.yaml -o output.pdf

# Specify output engine
pandoc input.md --pdf-engine=xelatex -o output.pdf

# Using wkhtmltopdf instead of LaTeX
pandoc input.md --pdf-engine=wkhtmltopdf -o output.pdf
```

### Advanced Pandoc with Templates

```bash
# Custom LaTeX template
pandoc input.md \
  --template=custom-template.tex \
  --pdf-engine=xelatex \
  --toc \
  --number-sections \
  -o output.pdf

# With bibliography
pandoc input.md \
  --bibliography=references.bib \
  --csl=ieee.csl \
  --citeproc \
  -o output.pdf

# Custom font and margins
pandoc input.md \
  -V geometry:"top=2cm, bottom=2cm, left=2.5cm, right=2.5cm" \
  -V mainfont="Times New Roman" \
  -V fontsize=12pt \
  -o output.pdf
```

### Metadata YAML for Pandoc

```yaml
# metadata.yaml
---
title: "Technical Report on Distributed Systems"
author:
  - "Jane Doe"
  - "John Smith"
date: "2025-01-15"
subtitle: "Performance Analysis of Event-Driven Architectures"
abstract: |
  This report analyzes the performance characteristics of event-driven
  architectures in distributed systems, comparing Apache Kafka, RabbitMQ,
  and AWS SQS across latency, throughput, and fault tolerance metrics.
keywords: [distributed-systems, event-driven, kafka, rabbitmq, performance]
lang: en-US
geometry:
  - top=25mm
  - bottom=25mm
  - left=30mm
  - right=25mm
fontsize: 11pt
mainfont: "DejaVu Serif"
monofont: "DejaVu Sans Mono"
toc: true
toc-depth: 3
numbersections: true
linestretch: 1.5
---
```

### Pandoc Filter: Custom Transformations

```python
#!/usr/bin/env python3
"""Pandoc filter to add custom styling to code blocks."""

import pandocfilters as pf

def code_blocks(key, value, format, meta):
    """Wrap code blocks in a styled container."""
    if key == 'CodeBlock':
        [[ident, classes, keyvals], code] = value
        if 'python' in classes:
            # Add a custom div wrapper for Python code
            return pf.Div(
                ([ident, ['python-block'], keyvals],
                 [pf.CodeBlock([ident, classes, keyvals], code)])
            )

if __name__ == '__main__':
    pf.toJSONFilter(code_blocks)
```

```bash
# Use the filter
pandoc input.md --filter=./code_styler.py -o output.pdf
```

---

## 2. WeasyPrint: HTML/CSS to PDF

WeasyPrint renders HTML with CSS print styles into PDFs. It's ideal for documents that need pixel-perfect branding, colors, and web-like layouts.

### Basic WeasyPrint Workflow

```python
"""Convert HTML to PDF using WeasyPrint."""

from weasyprint import HTML

# Basic conversion
HTML('document.html').write_pdf('output.pdf')

# From a URL
HTML('https://example.com/report').write_pdf('webpage.pdf')

# From a string
html_content = """
<html>
<body>
  <h1>Hello World</h1>
  <p>This is a PDF generated from an HTML string.</p>
</body>
</html>
"""
HTML(string=html_content).write_pdf('from_string.pdf')
```

### Markdown → HTML → PDF Pipeline

```python
"""Full pipeline: Markdown to HTML to PDF with CSS styling."""

import markdown
from weasyprint import HTML

def markdown_to_pdf(md_path, css_path, output_path):
    """Convert markdown to PDF through HTML intermediate."""
    with open(md_path, 'r') as f:
        md_content = f.read()
    
    # Convert markdown to HTML
    html_content = markdown.markdown(
        md_content,
        extensions=['tables', 'fenced_code', 'codehilite',
                    'toc', 'sane_lists', 'attr_list']
    )
    
    # Wrap in full HTML document
    full_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="{css_path}">
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    # Generate PDF
    HTML(string=full_html).write_pdf(output_path)
    print(f"PDF generated: {output_path}")

# Usage
markdown_to_pdf('report.md', 'print.css', 'report.pdf')
```

### CSS Print Stylesheet Template

```css
/* print.css — Professional print stylesheet for PDF generation */

/* Page setup */
@page {
  size: A4;
  margin: 2.5cm 2cm 2.5cm 2cm;
  
  @top-center {
    content: element(pageHeader);
    font-size: 9pt;
    color: #666;
  }
  
  @bottom-center {
    content: counter(page) " / " counter(pages);
    font-size: 9pt;
    color: #666;
  }
  
  @bottom-left {
    content: "Confidential";
    font-size: 8pt;
    color: #999;
    font-style: italic;
  }
}

/* First page — no header, different margins */
@page:first {
  margin-top: 4cm;
  
  @top-center {
    content: none;
  }
}

/* Section start — reset page counter */
@page chapter {
  @top-center {
    content: "Chapter " counter(chapter);
  }
}

/* Base typography */
body {
  font-family: "DejaVu Serif", Georgia, "Times New Roman", serif;
  font-size: 11pt;
  line-height: 1.6;
  color: #1a1a1a;
  counter-reset: h2 h3 figure table;
}

/* Heading styles */
h1 {
  font-size: 24pt;
  font-weight: bold;
  color: #1a1a1a;
  page-break-before: always;
  page-break-after: avoid;
  margin-top: 2cm;
  border-bottom: 2px solid #333;
  padding-bottom: 8pt;
}

h1:first-of-type {
  page-break-before: avoid;
}

h2 {
  font-size: 18pt;
  font-weight: bold;
  color: #333;
  page-break-after: avoid;
  margin-top: 1.5cm;
  counter-increment: h2;
}

h2::before {
  content: counter(h2) ". ";
}

h3 {
  font-size: 14pt;
  font-weight: bold;
  color: #555;
  page-break-after: avoid;
  margin-top: 1cm;
  counter-increment: h3;
}

h3::before {
  content: counter(h2) "." counter(h3) " ";
}

/* Paragraphs */
p {
  text-align: justify;
  orphans: 3;
  widows: 3;
}

/* Code blocks */
pre {
  font-family: "DejaVu Sans Mono", "Courier New", monospace;
  font-size: 9pt;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-left: 3px solid #007acc;
  padding: 12px;
  page-break-inside: avoid;
  white-space: pre-wrap;
  word-wrap: break-word;
}

code {
  font-family: "DejaVu Sans Mono", "Courier New", monospace;
  font-size: 9pt;
  background: #f0f0f0;
  padding: 1px 4px;
  border-radius: 2px;
}

pre code {
  background: none;
  padding: 0;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  font-size: 10pt;
  page-break-inside: auto;
}

thead {
  display: table-header-group;
}

tr {
  page-break-inside: avoid;
  page-break-after: auto;
}

th {
  background: #2c3e50;
  color: white;
  font-weight: bold;
  padding: 8px 12px;
  text-align: left;
}

td {
  padding: 6px 12px;
  border-bottom: 1px solid #ddd;
}

tr:nth-child(even) {
  background: #f9f9f9;
}

/* Images */
img {
  max-width: 100%;
  height: auto;
  page-break-inside: avoid;
}

figure {
  margin: 1em 0;
  text-align: center;
  page-break-inside: avoid;
}

figcaption {
  font-size: 10pt;
  font-style: italic;
  color: #666;
  margin-top: 4px;
}

/* Links */
a {
  color: #0066cc;
  text-decoration: none;
}

/* Lists */
ul, ol {
  margin: 0.5em 0;
  padding-left: 2em;
}

li {
  margin: 0.3em 0;
}

/* Blockquotes */
blockquote {
  border-left: 4px solid #2c3e50;
  margin: 1em 0;
  padding: 0.5em 1em;
  background: #f9f9f9;
  font-style: italic;
}

/* Cover page */
.cover-page {
  page-break-after: always;
  text-align: center;
  padding-top: 6cm;
}

.cover-page h1 {
  font-size: 32pt;
  border: none;
  margin-bottom: 0.5cm;
}

.cover-page .subtitle {
  font-size: 18pt;
  color: #666;
  margin-bottom: 2cm;
}

.cover-page .author {
  font-size: 14pt;
  color: #333;
}

.cover-page .date {
  font-size: 12pt;
  color: #999;
  margin-top: 1cm;
}

/* Table of contents */
.toc {
  page-break-after: always;
}

.toc h2 {
  border: none;
  font-size: 20pt;
}

.toc ul {
  list-style: none;
  padding: 0;
}

.toc li {
  padding: 4px 0;
  border-bottom: 1px dotted #ccc;
}

.toc a {
  color: #333;
  text-decoration: none;
}

.toc .toc-h2 {
  font-weight: bold;
  padding-left: 0;
}

.toc .toc-h3 {
  padding-left: 2em;
  font-size: 10pt;
}
```

---

## 3. ReportLab: Programmatic PDF Generation

ReportLab gives you complete control over PDF layout programmatically from Python.

### Basic ReportLab Document

```python
"""Create a basic PDF with ReportLab."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    Image, PageBreak, ListFlowable, ListItem
)
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY


def create_report(output_path):
    """Generate a professional report PDF."""
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm,
        title="Annual Report 2025",
        author="Data Analytics Team",
    )
    
    styles = getSampleStyleSheet()
    story = []
    
    # Title page
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=28,
        leading=34,
        spaceAfter=20,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#1a1a2e'),
    )
    story.append(Spacer(1, 5*cm))
    story.append(Paragraph("Annual Report 2025", title_style))
    story.append(Spacer(1, 1*cm))
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=16,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#666666'),
    )
    story.append(Paragraph("Data Analytics Division", subtitle_style))
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("January 15, 2025", subtitle_style))
    story.append(PageBreak())
    
    # Table of Contents
    toc_heading = ParagraphStyle(
        'TOCHeading',
        parent=styles['Heading1'],
        fontSize=20,
        spaceAfter=20,
    )
    story.append(Paragraph("Table of Contents", toc_heading))
    story.append(Spacer(1, 1*cm))
    
    toc_items = [
        "1. Executive Summary",
        "2. Methodology",
        "3. Key Findings",
        "4. Data Analysis",
        "5. Recommendations",
        "6. Appendices",
    ]
    for item in toc_items:
        story.append(Paragraph(item, styles['Normal']))
        story.append(Spacer(1, 0.3*cm))
    story.append(PageBreak())
    
    # Executive Summary
    story.append(Paragraph("1. Executive Summary", styles['Heading1']))
    story.append(Spacer(1, 0.3*cm))
    
    body_style = ParagraphStyle(
        'BodyJustified',
        parent=styles['Normal'],
        alignment=TA_JUSTIFY,
        spaceAfter=12,
        fontSize=11,
        leading=16,
    )
    
    story.append(Paragraph(
        "This report presents a comprehensive analysis of the organization's "
        "data analytics performance throughout the fiscal year 2025. Key metrics "
        "show a 34% improvement in query response times, a 28% increase in "
        "data processing throughput, and a 42% reduction in infrastructure costs "
        "following the migration to the new distributed data platform.",
        body_style
    ))
    
    # Data table
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("Performance Metrics", styles['Heading2']))
    
    data = [
        ['Metric', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
        ['Query Latency (ms)', '245', '187', '142', '108'],
        ['Throughput (req/s)', '1,200', '1,850', '2,400', '3,100'],
        ['Uptime (%)', '99.2', '99.5', '99.8', '99.9'],
        ['Cost ($/mo)', '12,400', '10,800', '8,900', '7,200'],
    ]
    
    table = Table(data, colWidths=[4*cm, 3*cm, 3*cm, 3*cm, 3*cm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a2e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('TOPPADDING', (0, 0), (-1, 0), 10),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8f9fa')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#f8f9fa'), colors.white]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#dee2e6')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#1a1a2e')),
    ]))
    story.append(table)
    
    # Build the PDF
    doc.build(story)
    print(f"Report generated: {output_path}")


if __name__ == '__main__':
    create_report('annual_report_2025.pdf')
```

### ReportLab with Custom Page Templates

```python
"""ReportLab document with headers, footers, and page templates."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Frame, PageTemplate, BaseDocTemplate
)
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfgen import canvas


class NumberedCanvas(canvas.Canvas):
    """Canvas that adds page numbers and headers."""
    
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []
    
    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        canvas.Canvas.showPage(self)
    
    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)
    
    def draw_header_footer(self, num_pages):
        # Header
        self.setFont('Helvetica', 8)
        self.setFillColor(colors.HexColor('#666666'))
        self.drawString(2*cm, A4[1] - 1.5*cm, "Annual Report 2025")
        self.drawRightString(A4[0] - 2*cm, A4[1] - 1.5*cm, "Confidential")
        self.setStrokeColor(colors.HexColor('#1a1a2e'))
        self.setLineWidth(0.5)
        self.line(2*cm, A4[1] - 1.7*cm, A4[0] - 2*cm, A4[1] - 1.7*cm)
        
        # Footer
        self.setFont('Helvetica', 9)
        self.drawCentredString(
            A4[0] / 2, 1.5*cm,
            f"Page {self._pageNumber} of {num_pages}"
        )
        self.line(2*cm, 2*cm, A4[0] - 2*cm, 2*cm)


def create_paged_report(output_path):
    """Create a report with custom page numbering."""
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=2*cm,
        rightMargin=2*cm,
        topMargin=2.5*cm,
        bottomMargin=2.5*cm,
    )
    
    styles = getSampleStyleSheet()
    story = []
    
    story.append(Paragraph("Chapter 1: Introduction", styles['Heading1']))
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        styles['Normal']
    ))
    story.append(PageBreak())
    
    story.append(Paragraph("Chapter 2: Analysis", styles['Heading1']))
    story.append(Paragraph(
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        styles['Normal']
    ))
    
    doc.build(story, canvasmaker=NumberedCanvas)
```

---

## 4. Syntax Highlighting in PDF

### Pandoc with Syntax Highlighting

```bash
# Pandoc supports highlighting via LaTeX packages
pandoc code_doc.md \
  --highlight-style=pygments \
  --pdf-engine=xelatex \
  -V monofont="DejaVu Sans Mono" \
  -o highlighted.pdf

# List available highlight styles
pandoc --list-highlight-styles

# Available styles: pygments, tango, espresso, zenburn, haddock, breezedark, kate, monochrome, etc.

# Use a custom theme file
pandoc input.md --highlight-style=my.theme -o output.pdf
```

### WeasyPrint with Pygments

```python
"""Add syntax highlighting to HTML before PDF conversion."""

import markdown
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter
from weasyprint import HTML


def markdown_with_highlighting(md_path, output_path):
    """Convert Markdown to PDF with code syntax highlighting."""
    with open(md_path, 'r') as f:
        md_content = f.read()
    
    # Custom extension for code highlighting
    def highlight_code(source, lang, class_name, options, md):
        """Pygments-based code highlighter."""
        if not lang:
            return f'<pre><code>{source}</code></pre>'
        try:
            lexer = get_lexer_by_name(lang, stripall=True)
            formatter = HtmlFormatter(
                style='monokai',
                linenos=True,
                cssclass='codehilite'
            )
            return highlight(source, lexer, formatter)
        except:
            return f'<pre><code class="language-{lang}">{source}</code></pre>'
    
    # Register the extension
    md = markdown.Markdown(
        extensions=['fenced_code', 'codehilite', 'tables', 'toc'],
        extension_configs={
            'codehilite': {
                'css_class': 'highlight',
            }
        }
    )
    
    html_content = md.convert(md_content)
    css = HtmlFormatter(style='monokai').get_style_defs('.highlight')
    
    full_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            {css}
            @page {{ size: A4; margin: 2cm; }}
            body {{ font-family: 'DejaVu Serif', serif; font-size: 11pt; line-height: 1.6; }}
            pre {{ page-break-inside: avoid; font-size: 9pt; }}
            .highlight {{ background: #272822; border-radius: 4px; padding: 12px; }}
        </style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    HTML(string=full_html).write_pdf(output_path)


# Usage
markdown_with_highlighting('code_sample.md', 'highlighted_output.pdf')
```

---

## 5. Table of Contents Generation

### Pandoc TOC

```bash
# Automatic TOC generation
pandoc input.md --toc --toc-depth=3 -o output.pdf

# Custom TOC title
pandoc input.md --toc -V toc-title="Contents" -o output.pdf
```

### WeasyPrint TOC with JavaScript Pre-processing

```python
"""Generate a table of contents using BeautifulSoup."""

from bs4 import BeautifulSoup
import markdown
from weasyprint import HTML


def generate_toc(md_path, output_path):
    """Generate a PDF with an auto-generated table of contents."""
    with open(md_path, 'r') as f:
        md_content = f.read()
    
    # Convert to HTML
    md = markdown.Markdown(extensions=['tables', 'fenced_code', 'toc'])
    html = md.convert(md_content)
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # Extract headings for TOC
    toc_items = []
    for heading in soup.find_all(['h1', 'h2', 'h3']):
        level = int(heading.name[1])
        text = heading.get_text()
        anchor = heading.get('id', text.lower().replace(' ', '-'))
        toc_items.append((level, text, anchor))
    
    # Build TOC HTML
    toc_html = '<div class="toc">\n<h1>Table of Contents</h1>\n<ul>\n'
    for level, text, anchor in toc_items:
        indent = '  ' * (level - 1)
        toc_html += f'{indent}<li class="toc-h{level}"><a href="#{anchor}">{text}</a></li>\n'
    toc_html += '</ul>\n</div>\n'
    
    # Prepend TOC to document
    full_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            @page {{ size: A4; margin: 2.5cm; }}
            body {{ font-family: 'DejaVu Serif', serif; font-size: 11pt; }}
            .toc {{ page-break-after: always; }}
            .toc ul {{ list-style: none; padding-left: 0; }}
            .toc li {{ padding: 4px 0; border-bottom: 1px dotted #ccc; }}
            .toc a {{ color: #333; text-decoration: none; }}
            .toc-h2 {{ padding-left: 1em; }}
            .toc-h3 {{ padding-left: 2em; font-size: 10pt; }}
            h1 {{ page-break-before: always; }}
            h1:first-of-type {{ page-break-before: avoid; }}
        </style>
    </head>
    <body>
        {toc_html}
        {html}
    </body>
    </html>
    """
    
    HTML(string=full_html).write_pdf(output_path)
```

---

## 6. CJK Character Support

### Pandoc with CJK

```bash
# CJK (Chinese, Japanese, Korean) support requires xelatex or lualatex

# Install CJK fonts
pandoc cjk_document.md \
  --pdf-engine=xelatex \
  -V CJKmainfont="Noto Sans CJK SC" \
  -V mainfont="Noto Sans" \
  -o cjk_output.pdf

# With specified font for each script
pandoc mixed_document.md \
  --pdf-engine=xelatex \
  -V mainfont="DejaVu Serif" \
  -V CJKmainfont="Noto Sans CJK SC" \
  -o multilingual.pdf
```

### WeasyPrint with CJK

```python
"""Handle CJK characters in WeasyPrint PDFs."""

from weasyprint import HTML

# WeasyPrint supports any Unicode font installed on the system
cjk_html = """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@page { size: A4; margin: 2cm; }
body {
    font-family: 'Noto Sans CJK SC', 'Noto Sans SC', 'Source Han Sans', 
                 'SimSun', 'Microsoft YaHei', sans-serif;
    font-size: 11pt;
    line-height: 1.8;
}
</style>
</head>
<body>
<h1>多语言文档 Multilingual Document 다국어 문서</h1>

<h2>中文 (Chinese)</h2>
<p>本报告分析了分布式系统在不同负载条件下的性能表现。
结果表明，使用事件驱动架构可以将延迟降低40%。</p>

<h2>日本語 (Japanese)</h2>
<p>本研究では、分散システムの性能を分析し、
イベント駆動アーキテクチャの利点を検証しました。</p>

<h2>한국어 (Korean)</h2>
<p>본 보고서는 분산 시스템의 성능을 다양한 부하 조건에서
분석하였으며, 이벤트 기반 아키텍처의 이점을 확인했습니다.</p>

</body>
</html>
"""

HTML(string=cjk_html).write_pdf('multilingual_report.pdf')
```

---

## 7. Batch Conversion

### Shell Script for Batch Processing

```bash
#!/bin/bash
# batch-convert.sh — Convert all markdown files in a directory to PDF

INPUT_DIR="./markdown_files"
OUTPUT_DIR="./pdf_output"
TEMPLATE="./templates/report.tex"

mkdir -p "$OUTPUT_DIR"

# Process all .md files
for md_file in "$INPUT_DIR"/*.md; do
    filename=$(basename "$md_file" .md)
    echo "Converting: $filename.md → $filename.pdf"
    
    pandoc "$md_file" \
        --template="$TEMPLATE" \
        --pdf-engine=xelatex \
        --toc \
        --number-sections \
        -o "$OUTPUT_DIR/$filename.pdf"
done

echo "Batch conversion complete. Files in: $OUTPUT_DIR"
```

### Python Batch Script with Progress

```python
"""Batch convert markdown files to PDF with progress tracking."""

import os
import glob
from pathlib import Path
import markdown
from weasyprint import HTML
from concurrent.futures import ProcessPoolExecutor, as_completed


def convert_single_file(md_path, output_dir, css_path):
    """Convert a single markdown file to PDF."""
    try:
        filename = Path(md_path).stem
        output_path = os.path.join(output_dir, f"{filename}.pdf")
        
        with open(md_path, 'r') as f:
            md_content = f.read()
        
        html = markdown.markdown(
            md_content,
            extensions=['tables', 'fenced_code', 'codehilite', 'toc']
        )
        
        with open(css_path, 'r') as f:
            css = f.read()
        
        full_html = f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><style>{css}</style></head>
        <body>{html}</body>
        </html>
        """
        
        HTML(string=full_html).write_pdf(output_path)
        return (md_path, True, None)
    except Exception as e:
        return (md_path, False, str(e))


def batch_convert(input_dir, output_dir, css_path, max_workers=4):
    """Convert all markdown files in input_dir to PDFs."""
    os.makedirs(output_dir, exist_ok=True)
    
    md_files = glob.glob(os.path.join(input_dir, "*.md"))
    print(f"Found {len(md_files)} markdown files to convert")
    
    successful = 0
    failed = 0
    
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        futures = {
            executor.submit(convert_single_file, md, output_dir, css_path): md
            for md in md_files
        }
        
        for future in as_completed(futures):
            md_path, success, error = future.result()
            filename = os.path.basename(md_path)
            
            if success:
                successful += 1
                print(f"✓ {filename}")
            else:
                failed += 1
                print(f"✗ {filename}: {error}")
    
    print(f"\nConversion complete: {successful} succeeded, {failed} failed")


# Usage
batch_convert('./docs', './output', './templates/print.css')
```

---

## Scoring Rubric

| Criteria | 1 (Basic) | 2 (Functional) | 3 (Proficient) | 4 (Advanced) | 5 (Expert) |
|----------|-----------|----------------|----------------|---------------|------------|
| **Quality** | Plain output, no styling | Basic formatting, readable | Professional layout, consistent | Branded PDF, polished design | Publication-ready, print-quality |
| **Performance** | Single file only | Small batch (<10) | Batch (10-100) | Large batch (100+) with parallelism | Enterprise pipeline |
| **Features** | Text and headings | Images and tables | TOC, headers, footers | Syntax highlighting, CJK, metadata | Interactive elements, bookmarks |
| **Customization** | Default settings | Font changes | Template usage | Custom templates, CSS themes | Full programmatic control |
| **Reliability** | Manual process | Simple script | Error handling | Parallel processing | CI/CD pipeline, monitoring |

---

## Common Mistakes

1. **Missing CJK fonts**: Pandoc with pdflatex does not support CJK characters. Use xelatex or lualatex with CJK fonts installed.
2. **Overflowing tables**: Tables wider than the page margin get clipped. Use `longtable` in LaTeX or set `table-layout: fixed` in CSS.
3. **Ignoring page breaks**: Content breaks mid-paragraph or mid-code-block. Use `page-break-inside: avoid` in CSS or `\pagebreak` in LaTeX.
4. **Missing CSS for print**: Standard web CSS doesn't handle page margins, headers, footers, or page breaks. Always use `@page` rules.
5. **Forgetting the `--pdf-engine` flag**: Pandoc defaults to pdflatex which doesn't support all features. Switch to xelatex for Unicode/non-Latin scripts.
6. **Embedded fonts not rendered**: Custom fonts must be installed or embedded. WeasyPrint handles `@font-face`; Pandoc requires system fonts.
7. **Not testing the output at different page sizes**: A4 and Letter differ. Always verify your output looks right at the target size.
8. **Inline CSS instead of stylesheet**: Inline styles make maintenance harder and increase PDF size. Use external CSS files.
9. **Code examples without syntax highlighting**: Unformatted code looks unprofessional. Always enable highlighting.
10. **No fallback for missing tools**: If Pandoc or LaTeX is not installed, the build breaks silently. Add dependency checks in your scripts.
