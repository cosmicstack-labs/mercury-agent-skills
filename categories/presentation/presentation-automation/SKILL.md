---
name: presentation-automation
description: 'Presentation Automation: python-pptx, Google Slides API, automated slide generation from data and templates'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: presentation
  tags: [presentation-automation, python-pptx, google-slides-api, slide-generation, automation]
---

# Presentation Automation

Automate slide generation from data sources, build programmatic presentations, and integrate slide creation into CI/CD pipelines.

## Core Principles

### 1. Templates Are the Foundation
Never build slides from scratch in code. Create a well-designed template (.potx or Google Slides master), then populate it programmatically. Templates enforce consistency; code fills in the blanks.

### 2. Separate Data from Presentation
Keep data extraction, transformation, and presentation logic in distinct layers. CSV/JSON/API → Data transformation → Slide population. This makes both testing and maintenance easier.

### 3. Idempotency Matters
The same input data should always produce the same output slides. Use deterministic logic, avoid random placement, and version your templates alongside your code.

### 4. Validate Before Generating
Validate input data, template placeholders, and output formats before generating slides. A broken slide at 11:59 PM before the board meeting is a career-limiting bug.

---

## Presentation Automation Maturity Model

| Level | Approach | Data Integration | Error Handling | Maintainability |
|-------|----------|-----------------|----------------|-----------------|
| **1: Manual** | Copy-paste into PowerPoint | Manual data entry | Human review | Fragile, one-off |
| **2: Scripted** | Basic python-pptx scripts | CSV/Excel import | Try-except blocks | Single-purpose scripts |
| **3: Templated** | Template-based generation | API/DB connections | Validation, logging | Modular functions |
| **4: Automated** | CI/CD pipeline, scheduled runs | Multiple data sources | Automated testing | Parameterized, configurable |
| **5: Intelligent** | Auto-charting, NLP summaries | Streaming data | Self-healing | Framework with plugins |

Target: **Level 3** for recurring reports. **Level 4** for client-facing and board presentations.

---

## python-pptx Fundamentals

### Installation and Setup

```bash
# Install python-pptx
pip install python-pptx

# For working with images
pip install Pillow

# For data processing
pip install pandas numpy openpyxl

# Verify installation
python -c "import pptx; print(pptx.__version__)"
```

### Basic Slide Creation

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

# Create a presentation
prs = Presentation()

# Set dimensions for 16:9 widescreen
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Common aspect ratios
aspect_ratios = {
    "standard_4_3": (Inches(10), Inches(7.5)),
    "widescreen_16_9": (Inches(13.333), Inches(7.5)),
    "widescreen_16_10": (Inches(11.25), Inches(7.03)),
    "a4": (Inches(11.69), Inches(8.27)),
}

# Add a blank slide
slide_layout = prs.slide_layouts[6]  # 6 = blank layout
slide = prs.slides.add_slide(slide_layout)

# Add a title text box
left = Inches(0.5)
top = Inches(0.5)
width = Inches(12)
height = Inches(1)
txBox = slide.shapes.add_textbox(left, top, width, height)
tf = txBox.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "Hello, Automated World!"
p.font.size = Pt(44)
p.font.bold = True
p.font.color.rgb = RGBColor(0x1A, 0x36, 0x5D)
p.alignment = PP_ALIGN.LEFT

# Save
prs.save("automated_presentation.pptx")
print("Presentation created successfully!")
```

### Working with Slide Layouts and Placeholders

```python
from pptx import Presentation

def inspect_template_layouts(template_path):
    """Inspect all layouts and placeholders in a template."""
    prs = Presentation(template_path)
    
    for i, layout in enumerate(prs.slide_layouts):
        print(f"\nLayout {i}: {layout.name}")
        for j, placeholder in enumerate(layout.placeholders):
            print(f"  Placeholder {j}: idx={placeholder.placeholder_format.idx}, "
                  f"name='{placeholder.name}', type={placeholder.placeholder_format.type}")
    
    return prs

# Usage
# inspect_template_layouts("my_template.potx")

def populate_placeholder_slide(template_path, output_path, data):
    """
    Populate placeholders in a template slide.
    
    Args:
        template_path: Path to .pptx template
        output_path: Path for generated file
        data: Dict mapping placeholder_idx -> text
    """
    prs = Presentation(template_path)
    
    # Use the first layout (index 0 — typically title slide)
    layout = prs.slide_layouts[0]
    slide = prs.slides.add_slide(layout)
    
    for placeholder in slide.placeholders:
        idx = placeholder.placeholder_format.idx
        if idx in data:
            placeholder.text = data[idx]
    
    prs.save(output_path)
    print(f"Generated: {output_path}")

# Example
# populate_placeholder_slide(
#     "template.pptx", 
#     "output.pptx",
#     {0: "Q4 2024 Board Report", 1: "Prepared by Analytics Team"}
# )
```

---

## Chart Generation

### Creating Bar Charts

```python
from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

def add_bar_chart(slide, categories, values, title="", 
                  chart_type=XL_CHART_TYPE.COLUMN_CLUSTERED):
    """
    Add a bar/column chart to a slide.
    
    Args:
        slide: pptx Slide object
        categories: List of category labels
        values: List of numeric values
        title: Chart title string
        chart_type: XL_CHART_TYPE constant
    """
    chart_data = CategoryChartData()
    chart_data.categories = categories
    chart_data.add_series("Revenue", values)
    
    # Add chart to slide
    left = Inches(0.5)
    top = Inches(1.5)
    width = Inches(12)
    height = Inches(5.5)
    
    chart_frame = slide.shapes.add_chart(
        chart_type, left, top, width, height, chart_data
    )
    chart = chart_frame.chart
    
    # Style the chart
    chart.has_legend = True
    chart.legend.include_in_layout = False
    
    # Style the plot
    plot = chart.plots[0]
    plot.gap_width = 80  # Gap between bars
    
    # Set colors for each series point
    series = plot.series[0]
    series.format.fill.solid()
    series.format.fill.fore_color.rgb = RGBColor(0x2B, 0x6C, 0xB0)
    
    # Title
    chart.has_title = True
    chart.chart_title.text_frame.paragraphs[0].text = title
    chart.chart_title.text_frame.paragraphs[0].font.size = Pt(16)
    chart.chart_title.text_frame.paragraphs[0].font.bold = True
    
    return chart


def add_line_chart(slide, categories, series_data, title=""):
    """
    Add a line chart with multiple series.
    
    Args:
        slide: Slide object
        categories: List of category labels (x-axis)
        series_data: List of (name, values) tuples
        title: Chart title
    """
    chart_data = CategoryChartData()
    chart_data.categories = categories
    
    colors = [
        RGBColor(0x2B, 0x6C, 0xB0),  # Blue
        RGBColor(0xE5, 0x3E, 0x3E),  # Red
        RGBColor(0x38, 0xA1, 0x69),  # Green
        RGBColor(0xD6, 0x9E, 0x2E),  # Amber
    ]
    
    for i, (name, values) in enumerate(series_data):
        chart_data.add_series(name, values)
    
    chart_frame = slide.shapes.add_chart(
        XL_CHART_TYPE.LINE_MARKERS, 
        Inches(0.5), Inches(1.5), 
        Inches(12), Inches(5.5), 
        chart_data
    )
    chart = chart_frame.chart
    
    # Style series
    for i, series in enumerate(chart.series):
        series.format.line.color.rgb = colors[i % len(colors)]
        series.format.line.width = Pt(2.5)
    
    chart.has_title = True
    chart.chart_title.text_frame.paragraphs[0].text = title
    chart.chart_title.text_frame.paragraphs[0].font.size = Pt(16)
    chart.chart_title.text_frame.paragraphs[0].font.bold = True
    
    return chart
```

### Creating Pie Charts

```python
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LABEL_POSITION

def add_pie_chart(slide, categories, values, title=""):
    """Add a styled pie chart (max 5 slices recommended)."""
    chart_data = CategoryChartData()
    chart_data.categories = categories
    chart_data.add_series("Distribution", values)
    
    chart_frame = slide.shapes.add_chart(
        XL_CHART_TYPE.PIE, 
        Inches(2), Inches(1.5), 
        Inches(9), Inches(5.5), 
        chart_data
    )
    chart = chart_frame.chart
    
    # Add data labels with percentages
    plot = chart.plots[0]
    data_labels = plot.data_labels
    data_labels.show_percentage = True
    data_labels.show_category_name = True
    data_labels.font.size = Pt(12)
    data_labels.label_position = XL_LABEL_POSITION.OUTSIDE_END
    
    # Colors for slices
    colors = [
        RGBColor(0x2B, 0x6C, 0xB0),
        RGBColor(0x38, 0xA1, 0x69),
        RGBColor(0xD6, 0x9E, 0x2E),
        RGBColor(0xE5, 0x3E, 0x3E),
        RGBColor(0x9B, 0x2C, 0x2C),
    ]
    
    series = plot.series[0]
    for i, point in enumerate(series.points):
        point.format.fill.solid()
        point.format.fill.fore_color.rgb = colors[i % len(colors)]
    
    chart.has_title = True
    chart.chart_title.text_frame.paragraphs[0].text = title
    
    return chart
```

---

## Table Population from Data

### Creating Tables from DataFrames

```python
import pandas as pd
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def dataframe_to_slide(prs, df, title="", 
                       header_color=RGBColor(0x1A, 0x36, 0x5D),
                       header_text_color=RGBColor(0xFF, 0xFF, 0xFF),
                       alt_row_color=RGBColor(0xF7, 0xFA, 0xFC)):
    """
    Convert a pandas DataFrame to a PowerPoint table on a new slide.
    
    Args:
        prs: Presentation object
        df: pandas DataFrame
        title: Slide title text
        header_color: Background color for header row
        header_text_color: Text color for header row
        alt_row_color: Alternating row background color
    """
    slide_layout = prs.slide_layouts[6]  # Blank layout
    slide = prs.slides.add_slide(slide_layout)
    
    # Add title
    if title:
        txBox = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), 
                                         Inches(12), Inches(0.8))
        tf = txBox.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = RGBColor(0x1A, 0x36, 0x5D)
    
    # Table dimensions
    rows, cols = len(df) + 1, len(df.columns)  # +1 for header
    left = Inches(0.5)
    top = Inches(1.3)
    width = Inches(12.3)
    row_height = Inches(0.45)
    height = row_height * rows
    
    # Create table
    table_shape = slide.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table
    
    # Set column widths proportionally
    col_width = width / cols
    for i in range(cols):
        table.columns[i].width = col_width
    
    # Header row
    for j, col_name in enumerate(df.columns):
        cell = table.cell(0, j)
        cell.text = str(col_name)
        
        # Format header
        for paragraph in cell.text_frame.paragraphs:
            paragraph.font.size = Pt(12)
            paragraph.font.bold = True
            paragraph.font.color.rgb = header_text_color
            paragraph.alignment = PP_ALIGN.LEFT
        
        # Header background color
        cell.fill.solid()
        cell.fill.fore_color.rgb = header_color
    
    # Data rows
    for i, (_, row) in enumerate(df.iterrows()):
        for j, value in enumerate(row):
            cell = table.cell(i + 1, j)
            cell.text = str(value) if not pd.isna(value) else ""
            
            for paragraph in cell.text_frame.paragraphs:
                paragraph.font.size = Pt(11)
                paragraph.font.color.rgb = RGBColor(0x2D, 0x37, 0x48)
                paragraph.alignment = PP_ALIGN.LEFT
            
            # Alternating row colors
            if i % 2 == 1:
                cell.fill.solid()
                cell.fill.fore_color.rgb = alt_row_color
            else:
                cell.fill.solid()
                cell.fill.fore_color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    
    return slide, table


# Usage example
# data = pd.DataFrame({
#     "Metric": ["ARR", "MRR", "Users", "Churn"],
#     "Value": ["$1.2M", "$100K", "45,000", "3.2%"],
#     "Change": ["+40%", "+35%", "+22%", "-0.5%"],
#     "Status": ["On Track", "On Track", "Ahead", "Watch"]
# })
# prs = Presentation()
# dataframe_to_slide(prs, data, title="Q4 2024 Key Metrics")
# prs.save("report.pptx")
```

### CSV to Presentation Pipeline

```python
import pandas as pd
from pptx import Presentation
from pathlib import Path

def csv_to_presentation(csv_path, template_path, output_path, 
                        title_column=None, data_start_row=0):
    """
    Generate a presentation from CSV data using a template.
    
    Args:
        csv_path: Path to input CSV
        template_path: Path to .pptx template
        output_path: Path for generated file
        title_column: Column to use for slide titles (optional)
        data_start_row: Row index to start data from
    """
    df = pd.read_csv(csv_path)
    prs = Presentation(template_path)
    
    for idx, row in df.iterrows():
        if idx < data_start_row:
            continue
        
        # Add a slide for each row
        slide_layout = prs.slide_layouts[1]  # Title and content
        slide = prs.slides.add_slide(slide_layout)
        
        # Set title
        if title_column and title_column in row:
            slide.shapes.title.text = str(row[title_column])
        else:
            slide.shapes.title.text = f"Record {idx + 1}"
        
        # Add content from other columns
        content_lines = []
        for col in df.columns:
            if col != title_column and not pd.isna(row[col]):
                content_lines.append(f"**{col}**: {row[col]}")
        
        # Add to content placeholder
        if slide.placeholders:
            content_placeholder = slide.placeholders[1]
            content_placeholder.text = "\n".join(content_lines)
    
    prs.save(output_path)
    print(f"Generated {len(df)} slides from CSV → {output_path}")
    return output_path

# Example
# csv_to_presentation(
#     "sales_data.csv",
#     "company_template.pptx",
#     "sales_report.pptx",
#     title_column="Account Name"
# )
```

---

## Image Insertion

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.enum.shapes import MSO_SHAPE

def insert_image(slide, image_path, left, top, width=None, height=None):
    """
    Insert an image with proper positioning and sizing.
    
    Args:
        slide: Slide object
        image_path: Path to image file
        left: Left position in Inches
        top: Top position in Inches
        width: Width in Inches (None = auto)
        height: Height in Inches (None = auto)
    """
    left_emu = Inches(left) if isinstance(left, (int, float)) else left
    top_emu = Inches(top) if isinstance(top, (int, float)) else top
    width_emu = Inches(width) if isinstance(width, (int, float)) else width
    height_emu = Inches(height) if isinstance(height, (int, float)) else height
    
    pic = slide.shapes.add_picture(
        image_path, left_emu, top_emu, width_emu, height_emu
    )
    return pic


def add_image_with_caption(slide, image_path, caption, 
                            img_left=1, img_top=1.5, 
                            img_width=10, img_height=5):
    """
    Add an image with a caption below it.
    """
    # Add image
    pic = insert_image(slide, image_path, img_left, img_top, img_width, img_height)
    
    # Add caption text box below image
    caption_top = img_top + img_height + Inches(0.2)
    txBox = slide.shapes.add_textbox(
        Inches(img_left), Inches(caption_top), 
        Inches(img_width), Inches(0.5)
    )
    tf = txBox.text_frame
    p = tf.paragraphs[0]
    p.text = caption
    p.font.size = Pt(12)
    p.font.italic = True
    p.font.color.rgb = RGBColor(0x71, 0x80, 0x96)
    p.alignment = PP_ALIGN.CENTER
    
    return pic


def add_logo_to_all_slides(prs, logo_path, 
                            position="top-left", 
                            width=Inches(1.5)):
    """
    Add a logo to every slide in the presentation.
    """
    positions = {
        "top-left": (Inches(0.3), Inches(0.3)),
        "top-right": (prs.slide_width - width - Inches(0.3), Inches(0.3)),
        "bottom-left": (Inches(0.3), prs.slide_height - Inches(0.8)),
        "bottom-right": (prs.slide_width - width - Inches(0.3), 
                         prs.slide_height - Inches(0.8)),
    }
    
    left, top = positions.get(position, positions["top-left"])
    
    for slide in prs.slides:
        slide.shapes.add_picture(logo_path, left, top, width=width)
    
    return prs
```

---

## Google Slides API

### Setup and Authentication

```bash
# Install the Google API client
pip install google-auth google-auth-oauthlib google-auth-httplib2
pip install google-api-python-client

# Set up service account credentials
# 1. Go to console.cloud.google.com
# 2. Enable the Google Slides API
# 3. Create a service account
# 4. Download the service account key JSON
# 5. Share your Google Slides presentation with the service account email
```

### Reading and Writing Google Slides

```python
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Service account credentials
SCOPES = ["https://www.googleapis.com/auth/presentations"]

def get_slides_service(credentials_path="service_account.json"):
    """Authenticate and return Google Slides service."""
    creds = service_account.Credentials.from_service_account_file(
        credentials_path, scopes=SCOPES
    )
    service = build("slides", "v1", credentials=creds)
    return service


def read_presentation_slides(presentation_id):
    """
    Read slide content from a Google Slides presentation.
    
    Args:
        presentation_id: The ID from the presentation URL
                        (e.g., "1ABCxyz..." from docs.google.com/presentation/d/1ABCxyz...)
    """
    service = get_slides_service()
    presentation = service.presentations().get(
        presentationId=presentation_id
    ).execute()
    
    slides = presentation.get("slides", [])
    print(f"Title: {presentation.get('title', 'Untitled')}")
    print(f"Slides: {len(slides)}")
    
    for i, slide in enumerate(slides):
        print(f"\nSlide {i + 1}:")
        for element in slide.get("pageElements", []):
            if "shape" in element and "text" in element["shape"]:
                text = element["shape"]["text"]["textElements"]
                full_text = "".join([
                    t.get("textRun", {}).get("content", "") 
                    for t in text if "textRun" in t
                ])
                if full_text.strip():
                    print(f"  {full_text.strip()[:100]}")
    
    return presentation


def replace_text_in_slide(presentation_id, replacements):
    """
    Replace placeholder text in a Google Slides presentation.
    
    Args:
        presentation_id: Google Slides presentation ID
        replacements: Dict of {placeholder_text: replacement_value}
                      e.g., {"{{COMPANY_NAME}}": "Acme Corp"}
    """
    service = get_slides_service()
    
    requests = []
    for placeholder, value in replacements.items():
        requests.append({
            "replaceAllText": {
                "containsText": {
                    "text": placeholder,
                    "matchCase": True,
                },
                "replaceText": value,
            }
        })
    
    if requests:
        body = {"requests": requests}
        response = service.presentations().batchUpdate(
            presentationId=presentation_id, body=body
        ).execute()
        print(f"Replaced {len(requests)} placeholders")
        return response
    
    return None


def create_slide_from_template(presentation_id, template_slide_id):
    """
    Duplicate a slide from the presentation.
    
    Args:
        presentation_id: Google Slides presentation ID
        template_slide_id: The objectId of the slide to duplicate
    """
    service = get_slides_service()
    
    requests = [
        {
            "duplicateObject": {
                "objectId": template_slide_id,
            }
        }
    ]
    
    body = {"requests": requests}
    response = service.presentations().batchUpdate(
        presentationId=presentation_id, body=body
    ).execute()
    
    new_slide_id = response["replies"][0]["duplicateObject"]["objectId"]
    print(f"Created new slide with ID: {new_slide_id}")
    return new_slide_id
```

---

## Batch Slide Creation from Templates

```python
import json
from pptx import Presentation
from pathlib import Path

class BatchSlideGenerator:
    """Generate multiple presentations from a template and data source."""
    
    def __init__(self, template_path, output_dir):
        self.template_path = Path(template_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def generate_from_json(self, data_path):
        """
        Generate presentations from a JSON data file.
        
        Expected JSON format:
        [
            {
                "filename": "report_acme.pptx",
                "title": "Acme Corp Report",
                "metrics": {"ARR": "$500K", "Growth": "45%"},
                "charts": {...}
            },
            ...
        ]
        """
        with open(data_path) as f:
            items = json.load(f)
        
        for item in items:
            prs = Presentation(str(self.template_path))
            
            # Populate first slide
            slide = prs.slides[0]
            if slide.shapes.title:
                slide.shapes.title.text = item.get("title", "Report")
            
            # Add metrics
            if "metrics" in item:
                self._add_metrics_slide(prs, item["metrics"])
            
            # Save
            output_path = self.output_dir / item["filename"]
            prs.save(str(output_path))
            print(f"Generated: {output_path}")
        
        return len(items)
    
    def _add_metrics_slide(self, prs, metrics):
        """Add a metrics summary slide."""
        slide_layout = prs.slide_layouts[6]
        slide = prs.slides.add_slide(slide_layout)
        
        # Add metrics as a table
        from pptx.util import Inches
        rows = len(metrics) + 1
        cols = 2
        table_shape = slide.shapes.add_table(
            rows, cols, Inches(1), Inches(2), Inches(5), Inches(0.4 * rows)
        )
        table = table_shape.table
        
        # Header
        table.cell(0, 0).text = "Metric"
        table.cell(0, 1).text = "Value"
        
        # Data
        for i, (key, value) in enumerate(metrics.items()):
            table.cell(i + 1, 0).text = str(key)
            table.cell(i + 1, 1).text = str(value)
    
    def generate_for_clients(self, client_data):
        """
        Generate personalized presentations for multiple clients.
        
        Args:
            client_data: List of dicts with client info
        """
        for client in client_data:
            prs = Presentation(str(self.template_path))
            
            # Replace placeholders
            for slide in prs.slides:
                for shape in slide.shapes:
                    if shape.has_text_frame:
                        for paragraph in shape.text_frame.paragraphs:
                            for key, value in client.items():
                                placeholder = f"{{{{{key}}}}}"
                                if placeholder in paragraph.text:
                                    paragraph.text = paragraph.text.replace(
                                        placeholder, str(value)
                                    )
            
            filename = f"{client.get('name', 'client').replace(' ', '_')}_report.pptx"
            output_path = self.output_dir / filename
            prs.save(str(output_path))
            print(f"Generated: {output_path}")


# Usage
# generator = BatchSlideGenerator("template.pptx", "output/")
# generator.generate_from_json("reports.json")
# generator.generate_for_clients([
#     {"name": "Acme Corp", "contact": "john@acme.com", "revenue": "$1.2M"},
#     {"name": "Beta Inc", "contact": "jane@beta.com", "revenue": "$850K"},
# ])
```

---

## CI/CD for Presentation Generation

### GitHub Actions Workflow

```yaml
# .github/workflows/generate-report.yml
name: Generate Weekly Report
on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM
  workflow_dispatch:       # Allow manual trigger

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install python-pptx pandas numpy
          pip install google-auth google-api-python-client
      
      - name: Generate presentation
        run: |
          python scripts/generate_weekly_report.py
        env:
          API_KEY: ${{ secrets.API_KEY }}
          DB_URL: ${{ secrets.DB_URL }}
      
      - name: Upload presentation artifact
        uses: actions/upload-artifact@v3
        with:
          name: weekly-report
          path: output/*.pptx
      
      - name: Send to stakeholders
        run: |
          python scripts/send_report.py
        env:
          SLACK_TOKEN: ${{ secrets.SLACK_TOKEN }}
          EMAIL_API_KEY: ${{ secrets.EMAIL_API_KEY }}
```

### Makefile for Presentation Generation

```makefile
# Makefile for automating presentation generation

SHELL := /bin/bash
PYTHON := python3
TEMPLATE := templates/board_template.pptx
OUTPUT_DIR := output

.PHONY: all clean monthly weekly quarterly

all: weekly

setup:
	@mkdir -p $(OUTPUT_DIR)
	@pip install -r requirements.txt

weekly: setup
	@echo "Generating weekly report..."
	$(PYTHON) scripts/generate_from_crm.py \
		--template $(TEMPLATE) \
		--output $(OUTPUT_DIR)/weekly_report_$(shell date +%Y-%m-%d).pptx \
		--period weekly

monthly: setup
	@echo "Generating monthly report..."
	$(PYTHON) scripts/generate_from_crm.py \
		--template $(TEMPLATE) \
		--output $(OUTPUT_DIR)/monthly_report_$(shell date +%Y-%m).pptx \
		--period monthly

quarterly: setup
	@echo "Generating quarterly board deck..."
	$(PYTHON) scripts/generate_board_deck.py \
		--template $(TEMPLATE) \
		--output $(OUTPUT_DIR)/board_deck_Q$(shell date +%m | awk '{print int(($$1+2)/3)}')_$(shell date +%Y).pptx

clean:
	@echo "Cleaning output directory..."
	@rm -rf $(OUTPUT_DIR)/*.pptx
```

---

## Exporting Slides as PDF/Images

```python
import subprocess
import os
from pathlib import Path

def pptx_to_pdf_libreoffice(pptx_path, output_dir=None):
    """
    Convert PPTX to PDF using LibreOffice (cross-platform).
    
    Requires: LibreOffice installed (brew install libreoffice on macOS)
    """
    pptx_path = Path(pptx_path)
    output_dir = Path(output_dir) if output_dir else pptx_path.parent
    
    cmd = [
        "libreoffice", "--headless", "--convert-to", "pdf",
        "--outdir", str(output_dir),
        str(pptx_path)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        pdf_path = output_dir / f"{pptx_path.stem}.pdf"
        print(f"Converted: {pptx_path.name} → {pdf_path}")
        return pdf_path
    else:
        print(f"Error: {result.stderr}")
        return None


def pptx_to_images(pptx_path, output_dir=None, dpi=150):
    """
    Convert each slide to PNG images using LibreOffice + ImageMagick.
    
    Args:
        pptx_path: Path to .pptx file
        output_dir: Output directory for images
        dpi: Image resolution (default 150)
    """
    pptx_path = Path(pptx_path)
    output_dir = Path(output_dir) if output_dir else pptx_path.parent / f"{pptx_path.stem}_slides"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Step 1: Convert to PDF first
    pdf_path = pptx_to_pdf_libreoffice(pptx_path)
    if not pdf_path:
        return []
    
    # Step 2: Convert PDF pages to PNG
    cmd = [
        "convert", "-density", str(dpi),
        str(pdf_path),
        "-quality", "90",
        "-background", "white",
        "-alpha", "remove",
        str(output_dir / "slide_%02d.png")
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        images = sorted(output_dir.glob("*.png"))
        print(f"Generated {len(images)} slide images in {output_dir}")
        return images
    else:
        print(f"Error: {result.stderr}")
        return []


def batch_export_all(pptx_dir="output/"):
    """Export all PPTX files in a directory to both PDF and images."""
    pptx_dir = Path(pptx_dir)
    results = []
    
    for pptx_file in pptx_dir.glob("*.pptx"):
        pdf = pptx_to_pdf_libreoffice(pptx_file)
        images = pptx_to_images(pptx_file)
        results.append({
            "file": pptx_file.name,
            "pdf": str(pdf) if pdf else None,
            "images": len(images),
        })
    
    return results
```

---

## Common Mistakes

1. **Hardcoding values instead of using templates**: Writing slide text directly in code makes updates painful. Always use template placeholders.
2. **No error handling for missing data**: A missing column in your CSV crashes the entire generation. Validate data before processing.
3. **Ignoring slide dimensions**: Generating slides in 4:3 when the presentation is shown on 16:9 screens. Always match the output aspect ratio.
4. **Tight coupling of data and presentation code**: Data transformation logic mixed with slide creation code makes debugging and reuse difficult.
5. **Forgetting to close the Presentation object**: Not saving with `prs.save()` after making changes. Always call save before exiting.
6. **Oversized images**: Inserting 20MB images that bloat the file. Compress images to under 500KB before insertion.
7. **No validation of template placeholders**: If a template has `{{NAME}}` but code replaces `{{name}}`, it silently fails. Validate all placeholders.
8. **Creating slides one by one in loops**: Using nested loops for every shape and element. Build reusable functions for common patterns.
9. **Not version-controlling templates**: Templates change over time. Store them in Git with the code that populates them.
10. **No logging or monitoring**: When automated generation fails at 3 AM, you need logs to diagnose. Always log generation steps.
