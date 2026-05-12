---
name: report-generation
description: 'Creating structured PDF reports from data, templates, and AI-generated content using professional toolchains'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: pdf-generation
  tags: [report-generation, pdf-report, data-to-pdf, templating, business-reports]
---

# Report Generation

Create structured, data-driven PDF reports that communicate insights effectively. This skill covers the full pipeline — from data sources and templates to polished PDF output with charts, tables, and professional formatting.

---

## Report Structure Fundamentals

A well-structured report follows a consistent pattern that guides the reader from context to conclusions.

### Standard Report Anatomy

```text
┌────────────────────────────────────────┐
│           Cover Page                    │
│   Title, subtitle, author, date,        │
│   organization branding                 │
├────────────────────────────────────────┤
│         Table of Contents              │
│   Auto-generated from headings          │
├────────────────────────────────────────┤
│      Executive Summary                  │
│   Key findings in 1-2 paragraphs        │
├────────────────────────────────────────┤
│      Introduction / Background          │
│   Context, objectives, scope            │
├────────────────────────────────────────┤
│      Methodology                        │
│   How data was collected/analyzed       │
├────────────────────────────────────────┤
│      Findings / Results                 │
│   Data presentation with charts/tables  │
├────────────────────────────────────────┤
│      Discussion                         │
│   Interpretation of results             │
├────────────────────────────────────────┤
│      Conclusions                        │
│   Summary of key takeaways              │
├────────────────────────────────────────┤
│      Recommendations                    │
│   Actionable next steps                 │
├────────────────────────────────────────┤
│      Appendices                         │
│   Raw data, methodology details, refs    │
└────────────────────────────────────────┘
```

### Report Metadata Standards

```python
"""Report metadata schema for consistent document properties."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class ReportMetadata:
    """Standard metadata for all generated reports."""
    title: str
    subtitle: Optional[str] = None
    author: str = "Automated Report System"
    organization: str = "Cosmic Stack Labs"
    department: Optional[str] = None
    version: str = "1.0"
    report_date: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d"))
    period_start: Optional[str] = None
    period_end: Optional[str] = None
    classification: str = "Internal"
    document_id: Optional[str] = None
    keywords: list[str] = field(default_factory=list)
    
    def to_dict(self) -> dict:
        """Convert to dictionary for template rendering."""
        return {
            'title': self.title,
            'subtitle': self.subtitle,
            'author': self.author,
            'organization': self.organization,
            'department': self.department,
            'version': self.version,
            'report_date': self.report_date,
            'period_start': self.period_start,
            'period_end': self.period_end,
            'classification': self.classification,
            'document_id': self.document_id or f"RPT-{self.report_date}-{hash(self.title) % 10000:04d}",
            'keywords': ', '.join(self.keywords) if self.keywords else '',
        }


# Usage
metadata = ReportMetadata(
    title="Q4 2024 Performance Analysis",
    subtitle="Infrastructure & Operations Review",
    author="Data Engineering Team",
    department="Engineering",
    version="2.1",
    period_start="2024-10-01",
    period_end="2024-12-31",
    classification="Confidential",
    keywords=["performance", "infrastructure", "q4-2024", "analytics"],
)
```

---

## 2. Template Engines

### Jinja2 + WeasyPrint Pipeline

This is the most flexible approach for branded, data-rich reports.

#### Report Template (HTML)

```html
<!-- templates/report.html -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{{ metadata.title }}</title>
<style>
@page {
  size: A4;
  margin: 2.5cm 2cm 2.5cm 2cm;
  
  @top-center {
    content: "{{ metadata.organization }}";
    font-size: 8pt;
    color: #666;
    font-family: 'Helvetica', sans-serif;
  }
  
  @bottom-center {
    content: "Page " counter(page) " of " counter(pages);
    font-size: 8pt;
    color: #666;
    font-family: 'Helvetica', sans-serif;
  }
  
  @bottom-left {
    content: "{{ metadata.classification }}";
    font-size: 7pt;
    color: #999;
    font-style: italic;
  }
}

@page:first {
  @top-center { content: none; }
  @bottom-left { content: none; }
}

body {
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-size: 10pt;
  line-height: 1.6;
  color: #333;
}

/* Cover page */
.cover-page {
  page-break-after: always;
  text-align: center;
  padding-top: 8cm;
}

.cover-page .org-name {
  font-size: 11pt;
  color: #666;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 2cm;
}

.cover-page h1 {
  font-size: 28pt;
  color: #1a1a2e;
  margin-bottom: 0.5cm;
  border: none;
}

.cover-page .subtitle {
  font-size: 16pt;
  color: #555;
  margin-bottom: 1.5cm;
}

.cover-page .meta-info {
  font-size: 10pt;
  color: #777;
  line-height: 2;
}

/* Section headings */
h1 {
  font-size: 20pt;
  color: #1a1a2e;
  border-bottom: 2px solid #1a1a2e;
  padding-bottom: 6px;
  page-break-before: always;
  page-break-after: avoid;
}

h1:first-of-type {
  page-break-before: avoid;
}

h2 {
  font-size: 14pt;
  color: #2c3e50;
  margin-top: 1cm;
  page-break-after: avoid;
}

h3 {
  font-size: 12pt;
  color: #555;
  margin-top: 0.7cm;
  page-break-after: avoid;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.8em 0;
  font-size: 9pt;
}

thead {
  display: table-header-group;
}

tr {
  page-break-inside: avoid;
}

th {
  background: {{ accent_color }};
  color: white;
  padding: 8px 10px;
  text-align: left;
  font-weight: bold;
}

td {
  padding: 6px 10px;
  border-bottom: 1px solid #e0e0e0;
}

tr:nth-child(even) td {
  background: #f8f9fa;
}

tr:hover td {
  background: #e8f4f8;
}

/* Executive summary box */
.executive-summary {
  background: #f0f4f8;
  border-left: 4px solid {{ accent_color }};
  padding: 16px 20px;
  margin: 1em 0;
  font-size: 11pt;
  line-height: 1.7;
}

.executive-summary h2 {
  margin-top: 0;
  color: {{ accent_color }};
}

/* Charts and images */
.chart-container {
  text-align: center;
  margin: 1em 0;
  page-break-inside: avoid;
}

.chart-container img {
  max-width: 100%;
  max-height: 12cm;
}

.chart-caption {
  font-size: 9pt;
  color: #666;
  font-style: italic;
  margin-top: 4px;
}

/* Callout boxes */
.callout {
  padding: 12px 16px;
  margin: 0.8em 0;
  border-radius: 4px;
  page-break-inside: avoid;
}

.callout-info {
  background: #e3f2fd;
  border-left: 4px solid #1565c0;
}

.callout-warning {
  background: #fff3e0;
  border-left: 4px solid #ef6c00;
}

.callout-success {
  background: #e8f5e9;
  border-left: 4px solid #2e7d32;
}

/* Page breaks */
.page-break {
  page-break-before: always;
}
</style>
</head>
<body>

<div class="cover-page">
  <div class="org-name">{{ metadata.organization }}</div>
  <h1>{{ metadata.title }}</h1>
  {% if metadata.subtitle %}
  <div class="subtitle">{{ metadata.subtitle }}</div>
  {% endif %}
  <div class="meta-info">
    {% if metadata.department %}<p>{{ metadata.department }}</p>{% endif %}
    <p>Author: {{ metadata.author }}</p>
    <p>Date: {{ metadata.report_date }}</p>
    {% if metadata.period_start and metadata.period_end %}
    <p>Period: {{ metadata.period_start }} — {{ metadata.period_end }}</p>
    {% endif %}
    <p>Version: {{ metadata.version }}</p>
    <p>Document ID: {{ metadata.document_id }}</p>
  </div>
</div>

<!-- Auto-generated TOC placeholder -->
<div class="toc">
  <h1>Table of Contents</h1>
  <ul>
  {% for section in sections %}
    <li class="toc-{{ section.level }}">
      <a href="#{{ section.anchor }}">{{ section.number }} {{ section.title }}</a>
    </li>
  {% endfor %}
  </ul>
</div>

{% for section in sections %}
<div class="section">
  <h{{ section.level }} id="{{ section.anchor }}">
    {{ section.number }} {{ section.title }}
  </h{{ section.level }}>
  
  {% for paragraph in section.content %}
    {% if paragraph.type == 'text' %}
    <p>{{ paragraph.text }}</p>
    
    {% elif paragraph.type == 'table' %}
    <table>
      <thead>
        <tr>
          {% for header in paragraph.headers %}
          <th>{{ header }}</th>
          {% endfor %}
        </tr>
      </thead>
      <tbody>
        {% for row in paragraph.rows %}
        <tr>
          {% for cell in row %}
          <td>{{ cell }}</td>
          {% endfor %}
        </tr>
        {% endfor %}
      </tbody>
    </table>
    {% if paragraph.caption %}
    <div class="chart-caption">Table: {{ paragraph.caption }}</div>
    {% endif %}
    
    {% elif paragraph.type == 'chart' %}
    <div class="chart-container">
      <img src="{{ paragraph.image_path }}" alt="{{ paragraph.caption }}">
      {% if paragraph.caption %}
      <div class="chart-caption">Figure: {{ paragraph.caption }}</div>
      {% endif %}
    </div>
    
    {% elif paragraph.type == 'callout' %}
    <div class="callout callout-{{ paragraph.callout_type }}">
      <strong>{{ paragraph.title }}</strong><br>
      {{ paragraph.text }}
    </div>
    
    {% elif paragraph.type == 'list' %}
    <ul>
      {% for item in paragraph.items %}
      <li>{{ item }}</li>
      {% endfor %}
    </ul>
    {% endif %}
  {% endfor %}
</div>
{% endfor %}

</body>
</html>
```

#### Python Report Generator

```python
"""Complete report generation system using Jinja2 and WeasyPrint."""

import json
import os
from pathlib import Path
from datetime import datetime
from typing import Optional

import jinja2
import matplotlib.pyplot as plt
import pandas as pd
from weasyprint import HTML


class ReportGenerator:
    """Generate professional PDF reports from data and templates."""
    
    def __init__(self, template_dir: str = "templates", output_dir: str = "output"):
        self.template_dir = Path(template_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Set up Jinja2 environment
        self.env = jinja2.Environment(
            loader=jinja2.FileSystemLoader(str(self.template_dir)),
            autoescape=False,
        )
    
    def generate_chart(self, data: pd.DataFrame, chart_type: str,
                       title: str, output_path: str) -> str:
        """Generate a matplotlib chart and save to file."""
        fig, ax = plt.subplots(figsize=(8, 4.5))
        
        if chart_type == 'bar':
            data.plot(kind='bar', ax=ax)
        elif chart_type == 'line':
            data.plot(kind='line', ax=ax, marker='o')
        elif chart_type == 'pie':
            data.plot(kind='pie', ax=ax, autopct='%1.1f%%')
        elif chart_type == 'horizontal_bar':
            data.plot(kind='barh', ax=ax)
        
        ax.set_title(title, fontsize=12, fontweight='bold')
        ax.set_xlabel('')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.grid(axis='y', alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(output_path, dpi=200, bbox_inches='tight')
        plt.close()
        
        return output_path
    
    def load_data(self, data_path: str) -> dict:
        """Load data from multiple formats."""
        path = Path(data_path)
        
        if path.suffix == '.csv':
            return pd.read_csv(path).to_dict(orient='records')
        elif path.suffix == '.json':
            with open(path, 'r') as f:
                return json.load(f)
        elif path.suffix == '.xlsx':
            return pd.read_excel(path).to_dict(orient='records')
        else:
            raise ValueError(f"Unsupported data format: {path.suffix}")
    
    def build_sections_from_data(self, data: dict,
                                 config: dict) -> list[dict]:
        """Build report sections from data and configuration."""
        sections = []
        section_number = 0
        
        for section_config in config.get('sections', []):
            section_number += 1
            section = {
                'level': section_config.get('level', 2),
                'title': section_config['title'],
                'anchor': section_config['title'].lower().replace(' ', '-'),
                'number': str(section_number),
                'content': [],
            }
            
            for block in section_config.get('blocks', []):
                block_type = block.get('type', 'text')
                
                if block_type == 'text':
                    section['content'].append({
                        'type': 'text',
                        'text': block['text'],
                    })
                
                elif block_type == 'table':
                    headers = block.get('headers', [])
                    rows = []
                    for row_data in block.get('data', []):
                        rows.append([row_data.get(h.lower().replace(' ', '_'), '')
                                     for h in headers])
                    
                    section['content'].append({
                        'type': 'table',
                        'headers': headers,
                        'rows': rows,
                        'caption': block.get('caption', ''),
                    })
                
                elif block_type == 'chart':
                    chart_path = os.path.join(
                        self.output_dir,
                        f"chart_{section_number}_{block.get('id', '0')}.png"
                    )
                    
                    df = pd.DataFrame(block.get('data', []))
                    self.generate_chart(
                        df, block.get('chart_type', 'bar'),
                        block.get('title', ''), chart_path
                    )
                    
                    section['content'].append({
                        'type': 'chart',
                        'image_path': chart_path,
                        'caption': block.get('caption', ''),
                    })
                
                elif block_type == 'callout':
                    section['content'].append({
                        'type': 'callout',
                        'title': block.get('title', 'Note'),
                        'text': block.get('text', ''),
                        'callout_type': block.get('callout_type', 'info'),
                    })
            
            sections.append(section)
        
        return sections
    
    def generate(self, data_source: str, config: dict,
                 metadata: dict, accent_color: str = "#2c3e50") -> str:
        """Generate the full report PDF."""
        # Load data
        raw_data = self.load_data(data_source)
        
        # Build sections
        sections = self.build_sections_from_data(raw_data, config)
        
        # Render template
        template = self.env.get_template(config.get('template', 'report.html'))
        html_content = template.render(
            metadata=metadata,
            sections=sections,
            accent_color=accent_color,
        )
        
        # Generate PDF
        output_filename = f"{metadata.get('document_id', 'report')}.pdf"
        output_path = str(self.output_dir / output_filename)
        
        HTML(string=html_content).write_pdf(output_path)
        print(f"Report generated: {output_path}")
        
        return output_path


# Usage
if __name__ == '__main__':
    gen = ReportGenerator()
    
    report_config = {
        'template': 'report.html',
        'sections': [
            {
                'title': 'Executive Summary',
                'level': 1,
                'blocks': [
                    {'type': 'text', 'text': 'This report summarizes...'},
                    {'type': 'callout',
                     'title': 'Key Insight',
                     'text': 'Revenue grew 23% YoY...',
                     'callout_type': 'success'},
                ],
            },
            {
                'title': 'Revenue Analysis',
                'level': 1,
                'blocks': [
                    {'type': 'chart',
                     'id': 'revenue',
                     'chart_type': 'bar',
                     'title': 'Quarterly Revenue by Product Line',
                     'caption': 'Figure 1: Revenue breakdown by product line over four quarters',
                     'data': [
                         {'quarter': 'Q1', 'product_a': 120, 'product_b': 80, 'product_c': 45},
                         {'quarter': 'Q2', 'product_a': 135, 'product_b': 92, 'product_c': 52},
                         {'quarter': 'Q3', 'product_a': 148, 'product_b': 105, 'product_c': 58},
                         {'quarter': 'Q4', 'product_a': 162, 'product_b': 118, 'product_c': 65},
                     ]},
                    {'type': 'table',
                     'headers': ['Metric', 'Q1', 'Q2', 'Q3', 'Q4', 'Change'],
                     'caption': 'Table 1: Key performance indicators',
                     'data': [
                         {'metric': 'Revenue ($K)', 'q1': '120', 'q2': '135',
                          'q3': '148', 'q4': '162', 'change': '+35%'},
                         {'metric': 'Customers', 'q1': '1,240', 'q2': '1,380',
                          'q3': '1,560', 'q4': '1,820', 'change': '+47%'},
                         {'metric': 'ARPU ($)', 'q1': '96.8', 'q2': '97.8',
                          'q3': '94.9', 'q4': '89.0', 'change': '-8%'},
                     ]},
                ],
            },
        ],
    }
    
    gen.generate(
        data_source='data/q4_metrics.csv',
        config=report_config,
        metadata={
            'title': 'Q4 2024 Performance Analysis',
            'subtitle': 'Infrastructure & Operations Review',
            'author': 'Data Engineering Team',
            'organization': 'Cosmic Stack Labs',
            'report_date': '2025-01-15',
            'version': '2.1',
            'classification': 'Confidential',
            'document_id': 'RPT-2025-001',
        },
        accent_color='#1a1a2e',
    )
```

---

## 3. Data Source Integration

### CSV to Report

```python
"""Generate a report directly from CSV data."""

import pandas as pd
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML


def csv_to_report(csv_path: str, template_path: str, output_path: str):
    """Convert a CSV file into a formatted PDF report."""
    df = pd.read_csv(csv_path)
    
    # Compute summary statistics
    summary = {
        'total_rows': len(df),
        'columns': list(df.columns),
        'numeric_summary': {}
    }
    
    for col in df.select_dtypes(include=['number']).columns:
        summary['numeric_summary'][col] = {
            'mean': round(df[col].mean(), 2),
            'median': round(df[col].median(), 2),
            'min': round(df[col].min(), 2),
            'max': round(df[col].max(), 2),
            'std': round(df[col].std(), 2),
        }
    
    # Render
    env = Environment(loader=FileSystemLoader('.'))
    template = env.get_template(template_path)
    html = template.render(
        title=f"Report: {csv_path}",
        data=df.to_dict(orient='records'),
        summary=summary,
        columns=df.columns.tolist(),
    )
    
    HTML(string=html).write_pdf(output_path)


# Usage
csv_to_report('sales_data.csv', 'data_report_template.html', 'sales_report.pdf')
```

### SQL Database → Report

```python
"""Generate a report from SQL database queries."""

import sqlite3
import pandas as pd
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML


def sql_to_report(db_path: str, queries: dict, template_path: str,
                  output_path: str):
    """Generate a PDF report from SQL database queries."""
    conn = sqlite3.connect(db_path)
    results = {}
    
    for name, query in queries.items():
        df = pd.read_sql_query(query, conn)
        results[name] = {
            'headers': df.columns.tolist(),
            'rows': df.values.tolist(),
            'row_count': len(df),
        }
    
    conn.close()
    
    env = Environment(loader=FileSystemLoader('.'))
    template = env.get_template(template_path)
    html = template.render(results=results)
    
    HTML(string=html).write_pdf(output_path)


# Usage
queries = {
    'top_customers': """
        SELECT customer_name, total_spent, order_count, last_order_date
        FROM customers
        ORDER BY total_spent DESC
        LIMIT 20
    """,
    'monthly_revenue': """
        SELECT strftime('%Y-%m', order_date) as month,
               SUM(amount) as revenue,
               COUNT(*) as orders
        FROM orders
        WHERE order_date >= date('now', '-12 months')
        GROUP BY month
        ORDER BY month
    """,
}

sql_to_report('analytics.db', queries, 'sql_report.html', 'analytics_report.pdf')
```

### API Data → Report

```python
"""Generate a report from external API data."""

import requests
import matplotlib.pyplot as plt
import seaborn as sns
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML


def api_to_report(api_endpoint: str, headers: dict, params: dict,
                  template_path: str, output_path: str):
    """Fetch data from an API and generate a PDF report."""
    response = requests.get(api_endpoint, headers=headers, params=params)
    response.raise_for_status()
    data = response.json()
    
    # Create visualizations
    if 'timeline' in data:
        fig, ax = plt.subplots(figsize=(10, 5))
        dates = [item['date'] for item in data['timeline']]
        values = [item['value'] for item in data['timeline']]
        ax.plot(dates, values, marker='o', linewidth=2)
        ax.set_title('Timeline Trend')
        ax.tick_params(axis='x', rotation=45)
        plt.tight_layout()
        plt.savefig('timeline_chart.png', dpi=150)
        plt.close()
    
    env = Environment(loader=FileSystemLoader('.'))
    template = env.get_template(template_path)
    html = template.render(data=data)
    
    HTML(string=html).write_pdf(output_path)
```

---

## 4. Chart Embedding in Reports

### Matplotlib for Report Charts

```python
"""Professional chart styling for reports."""

import matplotlib.pyplot as plt
import matplotlib
import numpy as np
import pandas as pd

# Configure matplotlib for report-quality output
matplotlib.rcParams.update({
    'figure.dpi': 200,
    'font.family': 'sans-serif',
    'font.size': 10,
    'axes.titlesize': 12,
    'axes.labelsize': 10,
    'axes.grid': True,
    'grid.alpha': 0.3,
    'grid.linestyle': '--',
})


def create_bar_chart(data: pd.DataFrame, output_path: str,
                     title: str = "", xlabel: str = "", ylabel: str = ""):
    """Create a professional bar chart for reports."""
    fig, ax = plt.subplots(figsize=(8, 4.5))
    
    colors = ['#1a1a2e', '#16213e', '#0f3460', '#e94560', '#533483']
    bars = data.plot(kind='bar', ax=ax, color=colors[:len(data.columns)], width=0.7)
    
    ax.set_title(title, fontweight='bold', pad=12)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.legend(frameon=False)
    
    # Add value labels on bars
    for container in ax.containers:
        ax.bar_label(container, fmt='%.0f', padding=2, fontsize=8)
    
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()


def create_pie_chart(data: pd.Series, output_path: str,
                     title: str = ""):
    """Create a professional pie chart for reports."""
    fig, ax = plt.subplots(figsize=(6, 6))
    
    colors = ['#1a1a2e', '#16213e', '#0f3460', '#e94560',
              '#533483', '#2d4059', '#ea5455', '#f07b3f']
    
    wedges, texts, autotexts = ax.pie(
        data.values,
        labels=data.index,
        autopct='%1.1f%%',
        startangle=90,
        colors=colors[:len(data)],
        wedgeprops={'edgecolor': 'white', 'linewidth': 1},
    )
    
    for autotext in autotexts:
        autotext.set_color('white')
        autotext.set_fontsize(9)
    
    ax.set_title(title, fontweight='bold', pad=16)
    
    plt.tight_layout()
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()
```

### Programmatic Chart Generation (Plotly to Static Images)

```python
"""Generate charts using Plotly for interactive-capable reports."""

import plotly.express as px
import plotly.graph_objects as go
import pandas as pd


def plotly_to_image(fig, output_path: str, width=800, height=450):
    """Save a Plotly figure as a static image for PDF embedding."""
    fig.write_image(output_path, width=width, height=height, scale=2)


def create_plotly_charts(data_path: str, output_dir: str):
    """Create multiple charts from data for report embedding."""
    df = pd.read_csv(data_path)
    
    # Line chart with confidence bands
    fig = px.line(
        df, x='date', y=['forecast', 'actual'],
        title='Revenue Forecast vs Actual',
        template='plotly_white',
        labels={'value': 'Revenue ($K)', 'date': ''},
    )
    plotly_to_image(fig, f'{output_dir}/revenue_forecast.png')
    
    # Heatmap
    pivot = df.pivot_table(
        values='revenue', index='product', columns='region', aggfunc='sum'
    )
    fig = px.imshow(
        pivot,
        text_auto='.0f',
        color_continuous_scale='Blues',
        title='Revenue Heatmap by Product and Region',
    )
    plotly_to_image(fig, f'{output_dir}/revenue_heatmap.png', height=400)
    
    # Grouped bar chart
    fig = px.bar(
        df, x='quarter', y='revenue', color='product',
        barmode='group',
        title='Quarterly Revenue by Product',
        template='plotly_white',
    )
    plotly_to_image(fig, f'{output_dir}/quarterly_revenue.png')
```

---

## 5. Dynamic Tables

### Complex Table Formatting

```python
"""Advanced table formatting for PDF reports."""

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet


def styled_table_report(data: list[list], headers: list[str],
                        output_path: str, title: str = ""):
    """Generate a report with professionally styled tables."""
    doc = SimpleDocTemplate(output_path, pagesize=A4,
                           leftMargin=2*cm, rightMargin=2*cm,
                           topMargin=2*cm, bottomMargin=2*cm)
    
    styles = getSampleStyleSheet()
    story = []
    
    if title:
        story.append(Paragraph(title, styles['Title']))
    
    # Prepare table data with headers
    table_data = [headers] + data
    
    # Calculate column widths
    col_widths = [max(
        len(str(row[i])) for row in table_data
    ) * 0.12 * cm + 1.5 * cm for i in range(len(headers))]
    
    total_width = sum(col_widths)
    page_width = A4[0] - 4*cm
    if total_width > page_width:
        col_widths = [w * page_width / total_width for w in col_widths]
    
    table = Table(table_data, colWidths=col_widths, repeatRows=1)
    
    # Alternating row colors
    row_colors = [colors.HexColor('#f8f9fa'), colors.white]
    
    style_commands = [
        # Header styling
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a2e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        
        # Body styling
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 8.5),
        ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        
        # Grid lines
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#dee2e6')),
        ('LINEBELOW', (0, 0), (-1, 0), 1.5, colors.HexColor('#1a1a2e')),
        
        # Alternating rows
        *[('BACKGROUND', (0, i), (-1, i), row_colors[i % 2])
          for i in range(1, len(table_data))],
    ]
    
    # Conditional formatting for negative values
    for row_idx in range(1, len(table_data)):
        for col_idx in range(len(headers)):
            try:
                value = float(table_data[row_idx][col_idx])
                if value < 0:
                    style_commands.append(
                        ('TEXTCOLOR', (col_idx, row_idx),
                         (col_idx, row_idx), colors.HexColor('#dc3545'))
                    )
            except (ValueError, TypeError):
                pass
    
    table.setStyle(TableStyle(style_commands))
    story.append(table)
    
    doc.build(story)
    print(f"Styled table report: {output_path}")


# Usage
headers = ['Product', 'Q1 Sales', 'Q2 Sales', 'Q3 Sales', 'Q4 Sales', 'Total', 'Growth']
data = [
    ['Cloud Platform', '245,000', '278,000', '312,000', '358,000', '1,193,000', '46.1%'],
    ['AI Services', '89,000', '112,000', '145,000', '189,000', '535,000', '112.4%'],
    ['Data Analytics', '156,000', '168,000', '172,000', '185,000', '681,000', '18.6%'],
    ['Security Suite', '67,000', '72,000', '78,000', '85,000', '302,000', '26.9%'],
    ['DevTools', '34,000', '38,000', '42,000', '48,000', '162,000', '41.2%'],
    ['Total', '591,000', '668,000', '749,000', '865,000', '2,873,000', '46.4%'],
]

styled_table_report(data, headers, 'product_sales_report.pdf',
                    'Annual Product Sales Report')
```

---

## 6. Cover Pages, Watermarks, and PDF Metadata

### Professional Cover Page

```python
"""Generate a custom cover page for reports."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph


def create_cover_page(output_path: str, title: str, subtitle: str,
                      author: str, date: str, organization: str,
                      classification: str = "Internal"):
    """Generate a professional cover page as a standalone PDF."""
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4
    
    # Background decoration
    c.setFillColor(colors.HexColor('#1a1a2e'))
    c.rect(0, 0, width, height * 0.15, fill=1, stroke=0)
    
    c.setFillColor(colors.HexColor('#0f3460'))
    c.rect(0, height * 0.15, width, 0.3*cm, fill=1, stroke=0)
    
    # Organization name
    c.setFillColor(colors.white)
    c.setFont('Helvetica', 10)
    c.drawString(3*cm, height - 1.5*cm, organization.upper())
    
    # Classification
    c.setFillColor(colors.HexColor('#e94560'))
    c.setFont('Helvetica-Bold', 8)
    c.drawRightString(width - 3*cm, height - 1.5*cm, classification)
    
    # Title
    c.setFillColor(colors.HexColor('#1a1a2e'))
    c.setFont('Helvetica-Bold', 28)
    
    # Handle long titles with word wrap
    words = title.split()
    lines = []
    current_line = []
    for word in words:
        test_line = ' '.join(current_line + [word])
        if c.stringWidth(test_line, 'Helvetica-Bold', 28) < width - 6*cm:
            current_line.append(word)
        else:
            lines.append(' '.join(current_line))
            current_line = [word]
    lines.append(' '.join(current_line))
    
    y_position = height * 0.55
    for line in lines:
        c.drawCentredString(width / 2, y_position, line)
        y_position -= 36
    
    # Subtitle
    if subtitle:
        c.setFont('Helvetica', 16)
        c.setFillColor(colors.HexColor('#555555'))
        c.drawCentredString(width / 2, y_position - 20, subtitle)
    
    # Decorative line
    c.setStrokeColor(colors.HexColor('#e94560'))
    c.setLineWidth(2)
    line_y = y_position - 50
    c.line(width * 0.3, line_y, width * 0.7, line_y)
    
    # Meta information
    meta_y = line_y - 60
    c.setFont('Helvetica', 11)
    c.setFillColor(colors.HexColor('#666666'))
    
    meta_items = [
        f"Author: {author}",
        f"Date: {date}",
        f"Organization: {organization}",
    ]
    
    for item in meta_items:
        c.drawCentredString(width / 2, meta_y, item)
        meta_y -= 18
    
    c.save()
    print(f"Cover page generated: {output_path}")


# Usage
create_cover_page(
    'cover_page.pdf',
    title="Annual Performance Report 2025",
    subtitle="Infrastructure & Operations Division",
    author="Data Engineering Team",
    date="January 15, 2025",
    organization="Cosmic Stack Labs",
    classification="Confidential",
)
```

### Watermark and Confidentiality Markings

```python
"""Add watermarks and confidentiality markings to PDF pages."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.pdfgen import canvas


def add_watermark(input_pdf: str, output_pdf: str,
                  watermark_text: str = "CONFIDENTIAL",
                  opacity: float = 0.15):
    """Add a diagonal watermark to every page of a PDF."""
    from PyPDF2 import PdfReader, PdfWriter
    from reportlab.pdfgen import canvas as pdf_canvas
    import io
    
    reader = PdfReader(input_pdf)
    writer = PdfWriter()
    
    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]
        
        # Create a watermark overlay
        packet = io.BytesIO()
        c = pdf_canvas.Canvas(packet, pagesize=A4)
        
        # Rotated watermark
        c.saveState()
        c.setFillColor(colors.HexColor('#000000'))
        c.setFont('Helvetica-Bold', 60)
        c.setFillAlpha(opacity)
        c.translate(A4[0] / 2, A4[1] / 2)
        c.rotate(45)
        c.drawCentredString(0, 0, watermark_text)
        c.restoreState()
        
        # Footer classification bar
        c.setFillColor(colors.HexColor('#1a1a2e'))
        c.setFillAlpha(0.8)
        c.rect(0, 0, A4[0], 1.2*cm, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont('Helvetica', 8)
        c.setFillAlpha(1.0)
        c.drawCentredString(A4[0] / 2, 0.4*cm,
                           f"{watermark_text} — Do Not Distribute — {watermark_text}")
        
        c.save()
        
        # Merge
        packet.seek(0)
        watermark = PdfReader(packet)
        page.merge_page(watermark.pages[0])
        writer.add_page(page)
    
    with open(output_pdf, 'wb') as f:
        writer.write(f)
    
    print(f"Watermarked PDF: {output_pdf}")
```

### PDF Metadata Injection

```python
"""Set PDF metadata properties for document management."""

from PyPDF2 import PdfReader, PdfWriter
from datetime import datetime


def set_pdf_metadata(input_pdf: str, output_pdf: str,
                     title: str, author: str, subject: str,
                     keywords: list[str], document_id: str = ""):
    """Set standard PDF metadata fields."""
    reader = PdfReader(input_pdf)
    writer = PdfWriter()
    
    # Copy all pages
    for page in reader.pages:
        writer.add_page(page)
    
    # Set metadata
    writer.add_metadata({
        '/Title': title,
        '/Author': author,
        '/Subject': subject,
        '/Keywords': ', '.join(keywords),
        '/Producer': 'Mercury Report Generator v1.0',
        '/Creator': 'Cosmic Stack Labs Report System',
        '/CreationDate': datetime.now().strftime("D:%Y%m%d%H%M%S"),
    })
    
    # Add custom document ID
    if document_id:
        writer.add_metadata({
            '/DocumentID': document_id,
        })
    
    with open(output_pdf, 'wb') as f:
        writer.write(f)
    
    print(f"Metadata applied: {output_pdf}")


# Usage
set_pdf_metadata(
    'report_raw.pdf',
    'report_final.pdf',
    title='Q4 2024 Performance Analysis',
    author='Data Engineering Team',
    subject='Quarterly infrastructure and operations review',
    keywords=['performance', 'infrastructure', 'q4-2024', 'analytics'],
    document_id='RPT-2025-001',
)
```

---

## 7. Automated Report Pipelines

### Scheduled Report Generation

```python
"""Automated report generation pipeline with scheduling."""

import schedule
import time
import json
from datetime import datetime
from pathlib import Path
from report_generator import ReportGenerator


class AutomatedReportPipeline:
    """Scheduled report generation system."""
    
    def __init__(self, config_path: str = "reports_config.json"):
        self.gen = ReportGenerator()
        with open(config_path, 'r') as f:
            self.reports = json.load(f)
    
    def generate_report(self, report_name: str):
        """Generate a specific report by name."""
        config = self.reports.get(report_name)
        if not config:
            print(f"Report '{report_name}' not found in config")
            return
        
        print(f"[{datetime.now()}] Generating report: {report_name}")
        
        metadata = config['metadata']
        metadata['report_date'] = datetime.now().strftime("%Y-%m-%d")
        
        try:
            output = self.gen.generate(
                data_source=config['data_source'],
                config=config['report_config'],
                metadata=metadata,
                accent_color=config.get('accent_color', '#2c3e50'),
            )
            print(f"[{datetime.now()}] ✓ {report_name}: {output}")
            
            # Optional: send notification
            self.notify(report_name, output)
            
        except Exception as e:
            print(f"[{datetime.now()}] ✗ {report_name}: {e}")
    
    def notify(self, report_name: str, path: str):
        """Send a notification that a report was generated."""
        print(f"Notification: {report_name} ready at {path}")
    
    def run_once(self, report_name: str):
        """Generate a report immediately."""
        self.generate_report(report_name)
    
    def schedule_all(self):
        """Schedule reports based on their cron-like config."""
        for name, config in self.reports.items():
            schedule_str = config.get('schedule')
            if schedule_str:
                if schedule_str == 'daily':
                    schedule.every().day.at("06:00").do(
                        self.generate_report, name
                    )
                elif schedule_str == 'weekly':
                    schedule.every().monday.at("06:00").do(
                        self.generate_report, name
                    )
                elif schedule_str == 'monthly':
                    schedule.every().month.at("06:00").do(
                        self.generate_report, name
                    )
                print(f"Scheduled '{name}': {schedule_str}")
    
    def run_loop(self):
        """Run the scheduling loop."""
        self.schedule_all()
        print("Report pipeline running. Press Ctrl+C to stop.")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)
        except KeyboardInterrupt:
            print("Pipeline stopped.")


# reports_config.json
"""
{
    "daily_sales": {
        "data_source": "data/daily_sales.csv",
        "accent_color": "#2c3e50",
        "schedule": "daily",
        "metadata": {
            "title": "Daily Sales Summary",
            "author": "Sales Analytics",
            "organization": "Cosmic Stack Labs",
            "classification": "Internal",
            "version": "1.0"
        },
        "report_config": {
            "template": "report.html",
            "sections": [...]
        }
    },
    "weekly_performance": {
        "data_source": "data/weekly_kpi.json",
        "accent_color": "#e94560",
        "schedule": "weekly",
        "metadata": {
            "title": "Weekly Performance Review",
            "author": "Operations Team",
            "organization": "Cosmic Stack Labs",
            "classification": "Management Only",
            "version": "1.0"
        },
        "report_config": {
            "template": "report.html",
            "sections": [...]
        }
    }
}
"""

# Usage
pipeline = AutomatedReportPipeline('reports_config.json')
pipeline.run_loop()
```

### Event-Triggered Pipeline

```python
"""Event-driven report generation using file system watchers."""

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import json
import time
from pathlib import Path


class DataChangeHandler(FileSystemEventHandler):
    """Trigger report generation when data files change."""
    
    def __init__(self, pipeline):
        self.pipeline = pipeline
        self.cooldown = {}
    
    def on_modified(self, event):
        if event.is_directory:
            return
        
        path = Path(event.src_path)
        if path.suffix in ['.csv', '.json', '.xlsx']:
            # Cooldown to avoid repeated triggers
            now = time.time()
            last = self.cooldown.get(str(path), 0)
            if now - last < 60:
                return
            self.cooldown[str(path)] = now
            
            print(f"Data changed: {path.name}")
            
            # Determine which report to regenerate
            for name, config in self.pipeline.reports.items():
                if config.get('data_source') == str(path):
                    print(f"Triggering report: {name}")
                    self.pipeline.generate_report(name)


def watch_data_directory(watch_path: str, pipeline):
    """Watch a directory for data changes and regenerate reports."""
    event_handler = DataChangeHandler(pipeline)
    observer = Observer()
    observer.schedule(event_handler, watch_path, recursive=False)
    observer.start()
    
    print(f"Watching {watch_path} for changes...")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


# Usage
pipeline = AutomatedReportPipeline('reports_config.json')
watch_data_directory('./data', pipeline)
```

---

## Scoring Rubric

| Criteria | 1 (Basic) | 2 (Functional) | 3 (Proficient) | 4 (Advanced) | 5 (Expert) |
|----------|-----------|----------------|----------------|---------------|------------|
| **Structure** | Single section | Basic sections | Full report anatomy | Modular sections | Dynamic layout |
| **Data Integration** | Manual input | CSV import | CSV + JSON + SQL | Real-time APIs | Multiple sources |
| **Visualizations** | None | Static tables | Basic charts | Interactive charts (static) | Conditionally formatted |
| **Templating** | Hardcoded | Simple template | Jinja2 templates | Modular templates | Composable blocks |
| **Automation** | Manual | Shell script | Scheduled | Event-triggered | Full CI/CD pipeline |
| **Quality** | Plain text | Basic styling | Professional | Branded | Publication-ready |

---

## Common Mistakes

1. **Report too long without summary**: Busy stakeholders need the key insights first. Lead with the executive summary.
2. **Data without context**: Raw numbers are meaningless without comparisons (YoY, budget, target). Always include benchmarks.
3. **Overcomplicating report structure**: Seven sections maximum for business reports. Deeper detail goes in appendices.
4. **Charts without captions**: Every figure and table needs a numbered caption for reference in text.
5. **Ignoring page breaks**: Charts breaking across pages is unprofessional. Use `page-break-inside: avoid`.
6. **No PDF metadata**: Documents without title, author, or subject are hard to find in document management systems.
7. **Missing file size optimization**: Large embedded images bloat PDFs. Resize to screen resolution (150-200 DPI).
8. **Template not tested with real data**: Test templates with edge cases — empty datasets, long text, special characters.
9. **Forgetting the TOC**: Any report over 5 pages needs a table of contents with page numbers.
10. **No version control on reports**: Include a version number and change log in the report footer or metadata.
