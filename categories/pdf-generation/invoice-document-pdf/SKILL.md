---
name: invoice-document-pdf
description: 'Generating invoices, contracts, forms, receipts, and business documents as professional PDFs'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: pdf-generation
  tags: [invoice, pdf-generation, business-documents, contracts, forms]
---

# Invoice & Document PDF Generation

Generate professional business documents — invoices, contracts, receipts, forms — as polished PDFs. This skill covers templates, data-driven generation, batch processing, digital signatures, and workflow automation.

---

## Invoice PDF Structure

A professional invoice follows a standard layout that makes it easy to process, pay, and reconcile.

### Standard Invoice Anatomy

```text
┌───────────────────────────────────────────┐
│  [LOGO]           INVOICE                  │
│  Your Company     #INV-2025-0042          │
│  123 Business Rd                           │
│  City, State ZIP                           │
├─────────────────┬─────────────────────────┤
│  Bill To:       │  Invoice Details:        │
│  Client Name    │  Date: 2025-01-15       │
│  Client Address │  Due: 2025-02-14        │
│  City, State    │  Terms: Net 30          │
│                 │  PO #: PO-2025-001      │
├─────────────────┴─────────────────────────┤
│  # │ Description        │ Qty │ Rate│ Amt │
│  ───┼───────────────────┼─────┼─────┼─────┤
│  1 │ Web Development   │  40 │ 150 │$6,000│
│  2 │ UI/UX Design      │  20 │ 125 │$2,500│
│  3 │ DevOps Setup      │   8 │ 175 │$1,400│
├────────────────────────┴─────┴─────┴─────┤
│  Subtotal:                          $9,900 │
│  Tax (8%):                            $792 │
│  Discount (5%):                      -$495 │
│  Total:                            $10,197 │
├───────────────────────────────────────────┤
│  Payment Information:                      │
│  Bank: First National Bank                 │
│  Account: XXXX-XXXX-1234                   │
│  Routing: 021000021                        │
│  PayPal: pay@company.com                   │
├───────────────────────────────────────────┤
│  Terms & Notes:                            │
│  Payment due within 30 days.               │
│  Late payment subject to 1.5%/mo fee.      │
└───────────────────────────────────────────┘
```

### Invoice Data Model

```python
"""Invoice data model with validation."""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Optional, list
import uuid


@dataclass
class LineItem:
    """A single line item on an invoice."""
    description: str
    quantity: Decimal
    unit_price: Decimal
    sku: Optional[str] = None
    
    @property
    def amount(self) -> Decimal:
        return self.quantity * self.unit_price


@dataclass
class InvoiceData:
    """Complete invoice data structure."""
    # Invoice identifiers
    invoice_number: str
    po_number: Optional[str] = None
    
    # Dates
    issue_date: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d"))
    due_date: Optional[str] = None
    payment_terms: str = "Net 30"
    
    # Seller (Your company)
    seller_name: str = ""
    seller_address: str = ""
    seller_city: str = ""
    seller_state: str = ""
    seller_zip: str = ""
    seller_phone: str = ""
    seller_email: str = ""
    seller_logo_path: Optional[str] = None
    tax_id: Optional[str] = None
    
    # Buyer (Client)
    client_name: str = ""
    client_address: str = ""
    client_city: str = ""
    client_state: str = ""
    client_zip: str = ""
    client_email: Optional[str] = None
    
    # Line items
    line_items: list[LineItem] = field(default_factory=list)
    
    # Financial
    tax_rate: Decimal = Decimal("0")
    discount_rate: Decimal = Decimal("0")
    discount_description: str = "Discount"
    currency_symbol: str = "$"
    
    # Payment
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None
    bank_routing: Optional[str] = None
    payment_instructions: Optional[str] = None
    
    # Notes
    notes: Optional[str] = None
    terms: Optional[str] = None
    
    def __post_init__(self):
        if not self.due_date:
            due = datetime.now() + timedelta(days=30)
            self.due_date = due.strftime("%Y-%m-%d")
        if not self.invoice_number:
            self.invoice_number = f"INV-{datetime.now().strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"
    
    @property
    def subtotal(self) -> Decimal:
        return sum(item.amount for item in self.line_items)
    
    @property
    def tax_amount(self) -> Decimal:
        return self.subtotal * self.tax_rate
    
    @property
    def discount_amount(self) -> Decimal:
        return self.subtotal * self.discount_rate
    
    @property
    def total(self) -> Decimal:
        return self.subtotal + self.tax_amount - self.discount_amount
```

---

## 2. HTML/CSS Print Templates for Invoices

### Invoice Print Template

```html
<!-- templates/invoice.html -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Invoice {{ invoice.invoice_number }}</title>
<style>
/* Page setup */
@page {
  size: A4;
  margin: 1.5cm 2cm 2cm 2cm;
  
  @bottom-center {
    content: "Invoice {{ invoice.invoice_number }} — Page " counter(page);
    font-size: 8pt;
    color: #999;
    font-family: 'Helvetica', 'Arial', sans-serif;
  }
}

body {
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-size: 9.5pt;
  color: #333;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

/* Header section */
.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2cm;
  border-bottom: 3px solid #1a1a2e;
  padding-bottom: 0.5cm;
}

.invoice-header .seller-info {
  flex: 1;
}

.invoice-header .seller-info h1 {
  font-size: 11pt;
  color: #1a1a2e;
  margin: 0 0 4px 0;
  font-weight: bold;
}

.invoice-header .seller-info p {
  margin: 1px 0;
  font-size: 9pt;
  color: #666;
}

.invoice-header .invoice-title {
  text-align: right;
}

.invoice-header .invoice-title h2 {
  font-size: 24pt;
  color: #1a1a2e;
  margin: 0;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.invoice-header .invoice-title .invoice-number {
  font-size: 12pt;
  color: #e94560;
  font-weight: bold;
  margin-top: 4px;
}

.invoice-header .invoice-title .invoice-number span {
  color: #333;
  font-weight: normal;
}

/* Billing section */
.billing-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5cm;
}

.bill-to, .invoice-details {
  width: 45%;
}

.bill-to h3, .invoice-details h3 {
  font-size: 9pt;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 6px 0;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
}

.bill-to p, .invoice-details p {
  margin: 2px 0;
  font-size: 9pt;
}

.invoice-details table {
  width: 100%;
  border-collapse: collapse;
}

.invoice-details td {
  padding: 2px 0;
  font-size: 9pt;
}

.invoice-details td:first-child {
  color: #999;
  width: 40%;
}

.invoice-details td:last-child {
  text-align: right;
  font-weight: bold;
}

/* Line items table */
.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1cm;
}

.items-table thead th {
  background: #1a1a2e;
  color: white;
  padding: 8px 10px;
  font-size: 8.5pt;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: left;
}

.items-table thead th:last-child {
  text-align: right;
}

.items-table thead th:nth-child(3),
.items-table thead th:nth-child(4) {
  text-align: right;
}

.items-table tbody td {
  padding: 8px 10px;
  border-bottom: 1px solid #eee;
  font-size: 9pt;
}

.items-table tbody td:last-child {
  text-align: right;
  font-weight: bold;
}

.items-table tbody td:nth-child(3),
.items-table tbody td:nth-child(4) {
  text-align: right;
}

.items-table tbody tr:nth-child(even) {
  background: #f8f9fa;
}

.items-table tbody tr:last-child td {
  border-bottom: 2px solid #1a1a2e;
}

/* Totals section */
.totals-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5cm;
}

.totals-table {
  width: 40%;
  border-collapse: collapse;
}

.totals-table td {
  padding: 4px 10px;
  font-size: 9pt;
}

.totals-table td:first-child {
  text-align: right;
  color: #666;
  width: 50%;
}

.totals-table td:last-child {
  text-align: right;
  font-weight: bold;
  width: 50%;
}

.totals-table .total-row td {
  border-top: 2px solid #1a1a2e;
  font-size: 11pt;
  font-weight: bold;
  padding-top: 8px;
  color: #1a1a2e;
}

.totals-table .discount-row td {
  color: #e94560;
}

/* Payment section */
.payment-section {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 12px 16px;
  margin-bottom: 1cm;
  page-break-inside: avoid;
}

.payment-section h3 {
  font-size: 9pt;
  color: #1a1a2e;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 8px 0;
}

.payment-section p {
  margin: 2px 0;
  font-size: 8.5pt;
}

/* Notes section */
.notes-section {
  font-size: 8.5pt;
  color: #666;
  margin-top: 1cm;
  border-top: 1px solid #ddd;
  padding-top: 0.5cm;
}

.notes-section h3 {
  font-size: 8pt;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
  margin: 0 0 4px 0;
}

/* Logo */
.logo {
  max-height: 1.5cm;
  max-width: 4cm;
}

/* QR Code placement */
.qr-code {
  position: absolute;
  top: 1cm;
  right: 2cm;
  width: 2cm;
  height: 2cm;
}
</style>
</head>
<body>

<div class="invoice-header">
  <div class="seller-info">
    {% if invoice.seller_logo_path %}
    <img src="{{ invoice.seller_logo_path }}" class="logo" alt="Logo">
    {% endif %}
    <h1>{{ invoice.seller_name }}</h1>
    <p>{{ invoice.seller_address }}</p>
    <p>{{ invoice.seller_city }}, {{ invoice.seller_state }} {{ invoice.seller_zip }}</p>
    {% if invoice.seller_phone %}<p>Phone: {{ invoice.seller_phone }}</p>{% endif %}
    {% if invoice.seller_email %}<p>Email: {{ invoice.seller_email }}</p>{% endif %}
    {% if invoice.tax_id %}<p>Tax ID: {{ invoice.tax_id }}</p>{% endif %}
  </div>
  <div class="invoice-title">
    <h2>Invoice</h2>
    <div class="invoice-number">#<span>{{ invoice.invoice_number }}</span></div>
  </div>
</div>

<div class="billing-section">
  <div class="bill-to">
    <h3>Bill To</h3>
    <p><strong>{{ invoice.client_name }}</strong></p>
    <p>{{ invoice.client_address }}</p>
    <p>{{ invoice.client_city }}, {{ invoice.client_state }} {{ invoice.client_zip }}</p>
    {% if invoice.client_email %}<p>{{ invoice.client_email }}</p>{% endif %}
  </div>
  <div class="invoice-details">
    <h3>Invoice Details</h3>
    <table>
      <tr><td>Invoice Date</td><td>{{ invoice.issue_date }}</td></tr>
      <tr><td>Due Date</td><td>{{ invoice.due_date }}</td></tr>
      <tr><td>Payment Terms</td><td>{{ invoice.payment_terms }}</td></tr>
      {% if invoice.po_number %}
      <tr><td>PO Number</td><td>{{ invoice.po_number }}</td></tr>
      {% endif %}
    </table>
  </div>
</div>

<table class="items-table">
  <thead>
    <tr>
      <th style="width: 5%;">#</th>
      <th style="width: 45%;">Description</th>
      <th style="width: 10%;">Qty</th>
      <th style="width: 15%;">Rate</th>
      <th style="width: 15%;">Amount</th>
    </tr>
  </thead>
  <tbody>
    {% for item in invoice.line_items %}
    <tr>
      <td>{{ loop.index }}</td>
      <td>{{ item.description }}{% if item.sku %}<br><small>SKU: {{ item.sku }}</small>{% endif %}</td>
      <td>{{ item.quantity }}</td>
      <td>{{ invoice.currency_symbol }}{{ "{:,.2f}".format(item.unit_price) }}</td>
      <td>{{ invoice.currency_symbol }}{{ "{:,.2f}".format(item.amount) }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>

<div class="totals-section">
  <table class="totals-table">
    <tr><td>Subtotal</td><td>{{ invoice.currency_symbol }}{{ "{:,.2f}".format(invoice.subtotal) }}</td></tr>
    {% if invoice.discount_rate > 0 %}
    <tr class="discount-row">
      <td>{{ invoice.discount_description }} ({{ "{:.0%}".format(invoice.discount_rate) }})</td>
      <td>-{{ invoice.currency_symbol }}{{ "{:,.2f}".format(invoice.discount_amount) }}</td>
    </tr>
    {% endif %}
    {% if invoice.tax_rate > 0 %}
    <tr><td>Tax ({{ "{:.0%}".format(invoice.tax_rate) }})</td><td>{{ invoice.currency_symbol }}{{ "{:,.2f}".format(invoice.tax_amount) }}</td></tr>
    {% endif %}
    <tr class="total-row"><td>Total</td><td>{{ invoice.currency_symbol }}{{ "{:,.2f}".format(invoice.total) }}</td></tr>
  </table>
</div>

<div class="payment-section">
  <h3>Payment Information</h3>
  {% if invoice.bank_name %}<p><strong>Bank:</strong> {{ invoice.bank_name }}</p>{% endif %}
  {% if invoice.bank_account %}<p><strong>Account:</strong> {{ invoice.bank_account }}</p>{% endif %}
  {% if invoice.bank_routing %}<p><strong>Routing:</strong> {{ invoice.bank_routing }}</p>{% endif %}
  {% if invoice.payment_instructions %}<p>{{ invoice.payment_instructions }}</p>{% endif %}
</div>

<div class="notes-section">
  {% if invoice.notes %}
  <h3>Notes</h3>
  <p>{{ invoice.notes }}</p>
  {% endif %}
  {% if invoice.terms %}
  <h3>Terms</h3>
  <p>{{ invoice.terms }}</p>
  {% endif %}
</div>

</body>
</html>
```

---

## 3. Python Invoice Generation

### ReportLab Invoice Generator

```python
"""Professional invoice generation with ReportLab."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    Image, PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_RIGHT, TA_LEFT, TA_CENTER
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timedelta


class InvoiceGenerator:
    """Generate professional invoice PDFs using ReportLab."""
    
    def __init__(self, company_info: dict):
        self.company = company_info
        self.styles = getSampleStyleSheet()
        self._setup_styles()
    
    def _setup_styles(self):
        """Set up custom paragraph styles."""
        self.styles.add(ParagraphStyle(
            'InvoiceTitle',
            fontName='Helvetica-Bold',
            fontSize=28,
            textColor=colors.HexColor('#1a1a2e'),
            alignment=TA_RIGHT,
            spaceAfter=4,
        ))
        self.styles.add(ParagraphStyle(
            'CompanyName',
            fontName='Helvetica-Bold',
            fontSize=11,
            textColor=colors.HexColor('#1a1a2e'),
            spaceAfter=2,
        ))
        self.styles.add(ParagraphStyle(
            'SmallText',
            fontName='Helvetica',
            fontSize=8.5,
            textColor=colors.HexColor('#666666'),
            spaceAfter=1,
        ))
        self.styles.add(ParagraphStyle(
            'SectionLabel',
            fontName='Helvetica-Bold',
            fontSize=8,
            textColor=colors.HexColor('#999999'),
            spaceBefore=8,
            spaceAfter=4,
        ))
    
    def _header_table(self, invoice_data: dict) -> Table:
        """Create the invoice header with company info and title."""
        # Company info
        company_cells = [
            [Paragraph(self.company['name'], self.styles['CompanyName'])],
            [Paragraph(self.company['address'], self.styles['SmallText'])],
            [Paragraph(
                f"{self.company['city']}, {self.company['state']} {self.company['zip']}",
                self.styles['SmallText']
            )],
        ]
        if self.company.get('phone'):
            company_cells.append([Paragraph(f"Phone: {self.company['phone']}", self.styles['SmallText'])])
        if self.company.get('email'):
            company_cells.append([Paragraph(f"Email: {self.company['email']}", self.styles['SmallText'])])
        
        company_table = Table(company_cells, colWidths=[8*cm])
        company_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 1),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
        ]))
        
        # Invoice title
        title_cells = [
            [Paragraph('INVOICE', self.styles['InvoiceTitle'])],
            [Paragraph(f"# {invoice_data['invoice_number']}", ParagraphStyle(
                'InvNumber', parent=self.styles['SmallText'],
                fontSize=12, textColor=colors.HexColor('#e94560'),
                alignment=TA_RIGHT, fontName='Helvetica-Bold',
            ))],
        ]
        title_table = Table(title_cells, colWidths=[8*cm])
        title_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ]))
        
        header = Table([[company_table, title_table]], colWidths=[8*cm, 8*cm])
        header.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LINEBELOW', (0, 0), (-1, 0), 3, colors.HexColor('#1a1a2e')),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ]))
        return header
    
    def _billing_section(self, invoice_data: dict) -> Table:
        """Create the bill-to and invoice details section."""
        bill_to = [
            [Paragraph('BILL TO', self.styles['SectionLabel'])],
            [Paragraph(f"<b>{invoice_data['client_name']}</b>", self.styles['SmallText'])],
            [Paragraph(invoice_data['client_address'], self.styles['SmallText'])],
            [Paragraph(
                f"{invoice_data['client_city']}, {invoice_data['client_state']} {invoice_data['client_zip']}",
                self.styles['SmallText']
            )],
        ]
        if invoice_data.get('client_email'):
            bill_to.append([Paragraph(invoice_data['client_email'], self.styles['SmallText'])])
        
        bill_table = Table(bill_to, colWidths=[8*cm])
        bill_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('TOPPADDING', (0, 0), (-1, -1), 1),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
            ('LINEBELOW', (0, 0), (0, 0), 1, colors.HexColor('#dddddd')),
        ]))
        
        # Invoice details
        details_data = [
            [Paragraph('INVOICE DETAILS', self.styles['SectionLabel']),
             Paragraph('', self.styles['SmallText'])],
        ]
        detail_fields = [
            ('Invoice Date', invoice_data['issue_date']),
            ('Due Date', invoice_data['due_date']),
            ('Payment Terms', invoice_data.get('payment_terms', 'Net 30')),
        ]
        if invoice_data.get('po_number'):
            detail_fields.append(('PO Number', invoice_data['po_number']))
        
        for label, value in detail_fields:
            details_data.append([
                Paragraph(label, self.styles['SmallText']),
                Paragraph(f"<b>{value}</b>", ParagraphStyle(
                    'DetailValue', parent=self.styles['SmallText'],
                    alignment=TA_RIGHT,
                )),
            ])
        
        details_table = Table(details_data, colWidths=[3.5*cm, 4.5*cm])
        details_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 1),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
            ('LINEBELOW', (0, 0), (-1, 0), 1, colors.HexColor('#dddddd')),
        ]))
        
        billing = Table([[bill_table, details_table]], colWidths=[8*cm, 8*cm])
        billing.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        return billing
    
    def _items_table(self, items: list[dict], currency: str = "$") -> Table:
        """Create the line items table."""
        header_row = ['#', 'Description', 'Qty', 'Rate', 'Amount']
        data = [header_row]
        
        for idx, item in enumerate(items, 1):
            data.append([
                str(idx),
                item['description'],
                str(item['quantity']),
                f"{currency}{item['unit_price']:,.2f}",
                f"{currency}{item['amount']:,.2f}",
            ])
        
        col_widths = [0.8*cm, 8.5*cm, 1.5*cm, 2.5*cm, 2.7*cm]
        table = Table(data, colWidths=col_widths, repeatRows=1)
        
        style_cmds = [
            # Header
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a2e')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 8.5),
            ('ALIGN', (0, 0), (0, -1), 'CENTER'),
            ('ALIGN', (2, 0), (-1, -1), 'RIGHT'),
            ('ALIGN', (1, 1), (1, -1), 'LEFT'),
            
            # Body
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            
            # Grid
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#dee2e6')),
            ('LINEBELOW', (0, 0), (-1, 0), 2, colors.HexColor('#1a1a2e')),
            ('LINEBELOW', (0, -1), (-1, -1), 2, colors.HexColor('#1a1a2e')),
            
            # Alternating colors
            *[('BACKGROUND', (0, i), (-1, i),
               colors.HexColor('#f8f9fa') if i % 2 == 0 else colors.white)
              for i in range(1, len(data))],
        ]
        
        table.setStyle(TableStyle(style_cmds))
        return table
    
    def _totals_section(self, subtotal: Decimal, tax_rate: Decimal,
                        discount_rate: Decimal, currency: str = "$") -> Table:
        """Create the totals section."""
        data = [
            ['Subtotal', f"{currency}{subtotal:,.2f}"],
        ]
        
        if discount_rate > 0:
            discount_amt = subtotal * discount_rate
            data.append([
                f'Discount ({discount_rate*100:.0f}%)',
                f"-{currency}{discount_amt:,.2f}",
            ])
        
        if tax_rate > 0:
            tax_amt = subtotal * tax_rate
            data.append([
                f'Tax ({tax_rate*100:.0f}%)',
                f"{currency}{tax_amt:,.2f}",
            ])
        
        total = subtotal * (1 + tax_rate - discount_rate)
        data.append(['Total', f"{currency}{total:,.2f}"])
        
        table = Table(data, colWidths=[5*cm, 3*cm])
        
        style_cmds = [
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, -2), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -2), 9),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            
            # Total row
            ('LINEABOVE', (0, -1), (-1, -1), 2, colors.HexColor('#1a1a2e')),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, -1), (-1, -1), 11),
            ('TEXTCOLOR', (0, -1), (-1, -1), colors.HexColor('#1a1a2e')),
        ]
        
        if discount_rate > 0:
            style_cmds += [
                ('TEXTCOLOR', (0, 1), (1, 1), colors.HexColor('#e94560')),
            ]
        
        table.setStyle(TableStyle(style_cmds))
        return table
    
    def _payment_section(self, invoice_data: dict) -> Table:
        """Create the payment information section."""
        cells = [[Paragraph('PAYMENT INFORMATION', self.styles['SectionLabel'])]]
        
        if invoice_data.get('bank_name'):
            cells.append([Paragraph(
                f"<b>Bank:</b> {invoice_data['bank_name']}",
                self.styles['SmallText']
            )])
        if invoice_data.get('bank_account'):
            cells.append([Paragraph(
                f"<b>Account:</b> {invoice_data['bank_account']}",
                self.styles['SmallText']
            )])
        if invoice_data.get('bank_routing'):
            cells.append([Paragraph(
                f"<b>Routing:</b> {invoice_data['bank_routing']}",
                self.styles['SmallText']
            )])
        if invoice_data.get('payment_instructions'):
            cells.append([Paragraph(
                invoice_data['payment_instructions'],
                self.styles['SmallText']
            )])
        
        table = Table(cells, colWidths=[16*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8f9fa')),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#dee2e6')),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('RIGHTPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (0, 0), 8),
        ]))
        return table
    
    def generate(self, invoice_data: dict, output_path: str):
        """Generate the complete invoice PDF."""
        doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            leftMargin=2*cm,
            rightMargin=2*cm,
            topMargin=1.5*cm,
            bottomMargin=2*cm,
            title=f"Invoice {invoice_data['invoice_number']}",
            author=self.company['name'],
        )
        
        story = []
        
        # Header
        story.append(self._header_table(invoice_data))
        story.append(Spacer(1, 0.5*cm))
        
        # Billing section
        story.append(self._billing_section(invoice_data))
        story.append(Spacer(1, 0.5*cm))
        
        # Line items
        for item in invoice_data.get('line_items', []):
            item['amount'] = item['quantity'] * item['unit_price']
        story.append(self._items_table(
            invoice_data.get('line_items', []),
            invoice_data.get('currency_symbol', '$')
        ))
        story.append(Spacer(1, 0.3*cm))
        
        # Totals
        story.append(self._totals_section(
            invoice_data['subtotal'],
            invoice_data.get('tax_rate', Decimal('0')),
            invoice_data.get('discount_rate', Decimal('0')),
            invoice_data.get('currency_symbol', '$'),
        ))
        story.append(Spacer(1, 0.5*cm))
        
        # Payment info
        story.append(self._payment_section(invoice_data))
        story.append(Spacer(1, 0.3*cm))
        
        # Notes
        if invoice_data.get('notes') or invoice_data.get('terms'):
            notes_cells = []
            if invoice_data.get('notes'):
                notes_cells.append([Paragraph('NOTES', self.styles['SectionLabel'])])
                notes_cells.append([Paragraph(invoice_data['notes'], self.styles['SmallText'])])
            if invoice_data.get('terms'):
                notes_cells.append([Paragraph('TERMS', self.styles['SectionLabel'])])
                notes_cells.append([Paragraph(invoice_data['terms'], self.styles['SmallText'])])
            
            notes_table = Table(notes_cells, colWidths=[16*cm])
            notes_table.setStyle(TableStyle([
                ('LINEABOVE', (0, 0), (-1, 0), 1, colors.HexColor('#dddddd')),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
            ]))
            story.append(notes_table)
        
        doc.build(story)
        print(f"Invoice generated: {output_path}")


# Usage
if __name__ == '__main__':
    generator = InvoiceGenerator({
        'name': 'Cosmic Stack Labs',
        'address': '123 Innovation Drive',
        'city': 'San Francisco',
        'state': 'CA',
        'zip': '94105',
        'phone': '(555) 123-4567',
        'email': 'billing@cosmicstack.com',
    })
    
    invoice = {
        'invoice_number': 'INV-2025-0042',
        'issue_date': '2025-01-15',
        'due_date': '2025-02-14',
        'payment_terms': 'Net 30',
        'po_number': 'PO-2025-001',
        'client_name': 'Acme Corporation',
        'client_address': '456 Business Ave, Suite 200',
        'client_city': 'New York',
        'client_state': 'NY',
        'client_zip': '10001',
        'client_email': 'ap@acmecorp.com',
        'line_items': [
            {'description': 'Web Development - Frontend React Implementation', 'quantity': 40, 'unit_price': Decimal('150.00')},
            {'description': 'UI/UX Design - Dashboard Redesign', 'quantity': 20, 'unit_price': Decimal('125.00')},
            {'description': 'DevOps Setup - CI/CD Pipeline Configuration', 'quantity': 8, 'unit_price': Decimal('175.00')},
            {'description': 'Database Optimization - Query Performance Tuning', 'quantity': 12, 'unit_price': Decimal('200.00')},
        ],
        'subtotal': Decimal('9900.00'),
        'tax_rate': Decimal('0.08'),
        'discount_rate': Decimal('0.05'),
        'currency_symbol': '$',
        'bank_name': 'First National Bank',
        'bank_account': 'XXXX-XXXX-1234',
        'bank_routing': '021000021',
        'payment_instructions': 'Please include invoice number with payment.',
        'notes': 'Thank you for your business!',
        'terms': 'Payment due within 30 days. Late payment subject to 1.5% monthly fee.',
    }
    
    generator.generate(invoice, 'invoice_2025_0042.pdf')
```

### FPDF Invoice Generator (Lightweight Alternative)

```python
"""Lightweight invoice generation with FPDF2."""

from fpdf import FPDF
from decimal import Decimal


class InvoicePDF(FPDF):
    """Simple invoice PDF generator using FPDF."""
    
    def header(self):
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(26, 26, 46)
        self.cell(0, 8, 'INVOICE', align='R', new_x="LMARGIN", new_y="NEXT")
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)
    
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', align='C')
    
    def company_info(self, name, address, city, state, zip_code, phone, email):
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(26, 26, 46)
        self.cell(0, 6, name, new_x="LMARGIN", new_y="NEXT")
        self.set_font('Helvetica', '', 9)
        self.set_text_color(102, 102, 102)
        self.cell(0, 4, address, new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 4, f'{city}, {state} {zip_code}', new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 4, f'Phone: {phone} | Email: {email}', new_x="LMARGIN", new_y="NEXT")
        self.ln(5)
    
    def bill_to(self, client_name, client_address, client_city, client_state, client_zip):
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(153, 153, 153)
        self.cell(0, 5, 'BILL TO', new_x="LMARGIN", new_y="NEXT")
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(51, 51, 51)
        self.cell(0, 5, client_name, new_x="LMARGIN", new_y="NEXT")
        self.set_font('Helvetica', '', 9)
        self.cell(0, 4, client_address, new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 4, f'{client_city}, {client_state} {client_zip}', new_x="LMARGIN", new_y="NEXT")
        self.ln(5)
    
    def invoice_details(self, inv_number, issue_date, due_date, terms, po_number=None):
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(153, 153, 153)
        self.cell(0, 5, 'INVOICE DETAILS', new_x="LMARGIN", new_y="NEXT")
        
        details = [
            ('Invoice #:', inv_number),
            ('Date:', issue_date),
            ('Due:', due_date),
            ('Terms:', terms),
        ]
        if po_number:
            details.append(('PO #:', po_number))
        
        for label, value in details:
            self.set_font('Helvetica', '', 9)
            self.set_text_color(102, 102, 102)
            self.cell(30, 5, label)
            self.set_font('Helvetica', 'B', 9)
            self.set_text_color(51, 51, 51)
            self.cell(0, 5, value, new_x="LMARGIN", new_y="NEXT")
        self.ln(5)
    
    def line_items(self, items, currency='$'):
        """Add line items table."""
        # Table header
        self.set_fill_color(26, 26, 46)
        self.set_text_color(255, 255, 255)
        self.set_font('Helvetica', 'B', 9)
        
        col_widths = [10, 85, 20, 30, 35]
        headers = ['#', 'Description', 'Qty', 'Rate', 'Amount']
        
        for i, header in enumerate(headers):
            self.cell(col_widths[i], 8, header, border=1, align='C' if i != 1 else 'L', fill=True)
        self.ln()
        
        # Table body
        self.set_text_color(51, 51, 51)
        fill = False
        for idx, item in enumerate(items, 1):
            if fill:
                self.set_fill_color(248, 249, 250)
            else:
                self.set_fill_color(255, 255, 255)
            
            self.set_font('Helvetica', '', 9)
            self.cell(col_widths[0], 7, str(idx), border=1, align='C', fill=True)
            self.cell(col_widths[1], 7, item['description'], border=1, align='L', fill=True)
            self.cell(col_widths[2], 7, str(item['quantity']), border=1, align='R', fill=True)
            self.cell(col_widths[3], 7, f"{currency}{item['unit_price']:,.2f}", border=1, align='R', fill=True)
            self.cell(col_widths[4], 7, f"{currency}{item['amount']:,.2f}", border=1, align='R', fill=True)
            self.ln()
            fill = not fill
        
        # Bottom line
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(3)
    
    def totals(self, subtotal, tax_rate, discount_rate, currency='$'):
        """Add totals section."""
        self.set_font('Helvetica', '', 9)
        
        items = [
            ('Subtotal:', f"{currency}{subtotal:,.2f}"),
        ]
        
        if discount_rate > 0:
            discount_amt = subtotal * discount_rate
            items.append((f'Discount ({discount_rate*100:.0f}%):', f"-{currency}{discount_amt:,.2f}"))
        
        if tax_rate > 0:
            tax_amt = subtotal * tax_rate
            items.append((f'Tax ({tax_rate*100:.0f}%):', f"{currency}{tax_amt:,.2f}"))
        
        total = subtotal * (1 + tax_rate - discount_rate)
        items.append(('Total:', f"{currency}{total:,.2f}"))
        
        # Right-align totals
        x_start = 130
        for label, value in items:
            self.set_x(x_start)
            self.set_text_color(102, 102, 102)
            self.cell(35, 6, label, align='R')
            self.set_text_color(51, 51, 51)
            self.set_font('Helvetica', 'B' if 'Total' in label else '', 9)
            self.cell(35, 6, value, align='R', new_x="LMARGIN", new_y="NEXT")
        
        self.ln(5)
    
    def payment_info(self, bank_name, account, routing, instructions=None):
        """Add payment information block."""
        self.set_fill_color(248, 249, 250)
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(26, 26, 46)
        self.cell(0, 6, 'PAYMENT INFORMATION', border=1, fill=True, new_x="LMARGIN", new_y="NEXT")
        
        self.set_font('Helvetica', '', 9)
        self.set_text_color(51, 51, 51)
        
        info = [
            (f'Bank: {bank_name}', ''),
            (f'Account: {account}', ''),
            (f'Routing: {routing}', ''),
        ]
        if instructions:
            info.append((instructions, ''))
        
        for label, _ in info:
            self.cell(0, 5, label, border=1, new_x="LMARGIN", new_y="NEXT")
        
        self.ln(5)


# Usage
pdf = InvoicePDF()
pdf.alias_nb_pages()
pdf.add_page()
pdf.company_info('Cosmic Stack Labs', '123 Innovation Drive',
                 'San Francisco', 'CA', '94105', '(555) 123-4567', 'billing@cosmicstack.com')
pdf.bill_to('Acme Corporation', '456 Business Ave, Suite 200', 'New York', 'NY', '10001')
pdf.invoice_details('INV-2025-0042', '2025-01-15', '2025-02-14', 'Net 30', 'PO-2025-001')

items = [
    {'description': 'Web Development Services', 'quantity': 40, 'unit_price': 150.00,
     'amount': 6000.00},
    {'description': 'UI/UX Design', 'quantity': 20, 'unit_price': 125.00, 'amount': 2500.00},
    {'description': 'DevOps Setup', 'quantity': 8, 'unit_price': 175.00, 'amount': 1400.00},
]
pdf.line_items(items)
pdf.totals(Decimal('9900.00'), Decimal('0.08'), Decimal('0.05'))
pdf.payment_info('First National Bank', 'XXXX-XXXX-1234', '021000021',
                 'Please include invoice number with payment.')
pdf.output('fpdf_invoice.pdf')
print("FPDF invoice generated: fpdf_invoice.pdf")
```

---

## 4. Receipt and Contract Templates

### Receipt Template

```html
<!-- templates/receipt.html -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
@page { size: A5; margin: 1cm; }
body { font-family: 'Helvetica', sans-serif; font-size: 9pt; color: #333; }
.header { text-align: center; margin-bottom: 0.5cm; }
.header h1 { font-size: 16pt; color: #1a1a2e; margin: 0; }
.header p { color: #999; font-size: 8pt; margin: 2px 0; }
.receipt-info { margin-bottom: 0.5cm; }
.receipt-info table { width: 100%; }
.receipt-info td { padding: 2px 0; font-size: 8pt; }
.receipt-info td:last-child { text-align: right; font-weight: bold; }
.items-table { width: 100%; border-collapse: collapse; margin-bottom: 0.5cm; }
.items-table th { background: #1a1a2e; color: white; padding: 4px 6px; font-size: 7pt; text-align: left; }
.items-table th:last-child, .items-table th:nth-child(3) { text-align: right; }
.items-table td { padding: 4px 6px; border-bottom: 1px solid #eee; font-size: 8pt; }
.items-table td:last-child, .items-table td:nth-child(3) { text-align: right; }
.total { text-align: right; font-size: 11pt; font-weight: bold; color: #1a1a2e; }
.thank-you { text-align: center; color: #999; font-size: 8pt; margin-top: 0.5cm; border-top: 1px dashed #ddd; padding-top: 0.3cm; }
</style>
</head>
<body>
<div class="header">
  <h1>Receipt</h1>
  <p>{{ store_name }} | {{ store_location }}</p>
</div>
<div class="receipt-info">
  <table>
    <tr><td>Receipt #:</td><td>{{ receipt_number }}</td></tr>
    <tr><td>Date:</td><td>{{ date }}</td></tr>
    <tr><td>Cashier:</td><td>{{ cashier }}</td></tr>
  </table>
</div>
<table class="items-table">
  <thead><tr>
    <th>Item</th><th>Qty</th><th>Price</th><th>Total</th>
  </tr></thead>
  <tbody>
    {% for item in items %}
    <tr>
      <td>{{ item.name }}</td>
      <td>{{ item.qty }}</td>
      <td>\${{ "{:,.2f}".format(item.price) }}</td>
      <td>\${{ "{:,.2f}".format(item.total) }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>
<div class="total">Total: \${{ "{:,.2f}".format(total) }}</div>
<div class="thank-you">Thank you for your purchase!</div>
</body>
</html>
```

### Contract PDF Generation

```python
"""Generate professional contract PDFs with signature blocks."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle
from datetime import datetime


def generate_contract(output_path: str, contract_data: dict):
    """Generate a PDF contract with signature blocks."""
    doc = SimpleDocTemplate(
        output_path, pagesize=A4,
        leftMargin=2.5*cm, rightMargin=2.5*cm,
        topMargin=2.5*cm, bottomMargin=2.5*cm,
        title=contract_data.get('title', 'Agreement'),
        author=contract_data.get('party_a', ''),
    )
    
    styles = {}
    styles['title'] = ParagraphStyle(
        'ContractTitle', fontName='Helvetica-Bold',
        fontSize=18, textColor=colors.HexColor('#1a1a2e'),
        spaceAfter=6, alignment=1,
    )
    styles['subtitle'] = ParagraphStyle(
        'ContractSubtitle', fontName='Helvetica',
        fontSize=10, textColor=colors.HexColor('#666666'),
        spaceAfter=20, alignment=1,
    )
    styles['h2'] = ParagraphStyle(
        'ContractH2', fontName='Helvetica-Bold',
        fontSize=11, textColor=colors.HexColor('#1a1a2e'),
        spaceBefore=12, spaceAfter=6,
    )
    styles['body'] = ParagraphStyle(
        'ContractBody', fontName='Helvetica',
        fontSize=9.5, leading=14, textColor=colors.HexColor('#333333'),
        spaceAfter=8, alignment=4,
    )
    styles['small'] = ParagraphStyle(
        'Small', fontName='Helvetica', fontSize=8,
        textColor=colors.HexColor('#999999'), spaceAfter=4,
    )
    
    story = []
    
    # Title
    story.append(Paragraph(contract_data.get('title', 'AGREEMENT'), styles['title']))
    story.append(Paragraph(
        f"Date: {contract_data.get('date', datetime.now().strftime('%B %d, %Y'))}",
        styles['subtitle']
    ))
    story.append(Spacer(1, 0.3*cm))
    
    # Parties
    story.append(Paragraph(
        f"This Agreement is made between <b>{contract_data['party_a']}</b> "
        f"and <b>{contract_data['party_b']}</b>.",
        styles['body']
    ))
    story.append(Spacer(1, 0.3*cm))
    
    # Sections
    for section in contract_data.get('sections', []):
        story.append(Paragraph(section['title'], styles['h2']))
        for paragraph in section['paragraphs']:
            story.append(Paragraph(paragraph, styles['body']))
    
    # Signature block
    story.append(Spacer(1, 1*cm))
    story.append(Paragraph("IN WITNESS WHEREOF, the parties have executed this Agreement.", styles['body']))
    story.append(Spacer(1, 0.5*cm))
    
    sig_data = [
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
    ]
    
    sig_table = Table(sig_data, colWidths=[7*cm, 1*cm, 0.5*cm, 7*cm])
    sig_table.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (0, 0), 1, colors.HexColor('#333333')),
        ('LINEBELOW', (3, 0), (3, 0), 1, colors.HexColor('#333333')),
        ('LINEBELOW', (0, 1), (0, 1), 1, colors.HexColor('#333333')),
        ('LINEBELOW', (3, 1), (3, 1), 1, colors.HexColor('#333333')),
        ('LINEBELOW', (0, 2), (0, 2), 1, colors.HexColor('#333333')),
        ('LINEBELOW', (3, 2), (3, 2), 1, colors.HexColor('#333333')),
    ]))
    
    story.append(sig_table)
    
    # Signature labels
    sig_labels = Table([
        [Paragraph(contract_data['party_a'], styles['small']),
         '', '',
         Paragraph(contract_data['party_b'], styles['small'])],
        [Paragraph('Signature', styles['small']),
         '', '',
         Paragraph('Signature', styles['small'])],
        [Paragraph('Date', styles['small']),
         '', '',
         Paragraph('Date', styles['small'])],
    ], colWidths=[7*cm, 1*cm, 0.5*cm, 7*cm])
    sig_labels.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(sig_labels)
    
    doc.build(story)
    print(f"Contract generated: {output_path}")


# Usage
contract = {
    'title': 'SERVICE AGREEMENT',
    'date': 'January 15, 2025',
    'party_a': 'Cosmic Stack Labs',
    'party_b': 'Acme Corporation',
    'sections': [
        {
            'title': '1. Services',
            'paragraphs': [
                'Service Provider agrees to provide the following services to Client: '
                'cloud infrastructure management, application deployment, monitoring and alerting, '
                'and 24/7 technical support as described in Exhibit A.',
                'All services will be delivered in accordance with the Service Level Agreement '
                'attached as Exhibit B.',
            ],
        },
        {
            'title': '2. Compensation',
            'paragraphs': [
                'Client agrees to pay Service Provider a monthly fee of $5,000 for the Services.',
                'Payment is due within 30 days of invoice date. Late payments will incur a '
                'monthly service charge of 1.5% of the outstanding balance.',
            ],
        },
        {
            'title': '3. Term and Termination',
            'paragraphs': [
                'This Agreement shall commence on the Effective Date and continue for a period '
                'of twelve (12) months.',
                'Either party may terminate this Agreement with 30 days written notice.',
                'In the event of a material breach, the non-breaching party may terminate '
                'immediately with written notice.',
            ],
        },
    ],
}

generate_contract('service_agreement.pdf', contract)
```

---

## 5. QR Codes and Barcodes

```python
"""Add QR codes and barcodes to invoices and documents."""

import qrcode
from io import BytesIO
from reportlab.lib.units import cm
from reportlab.platypus import Image as RLImage


def generate_qr_code(data: str, size: int = 200) -> BytesIO:
    """Generate a QR code image for embedding in PDFs."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    return buffer


def add_qr_to_document(story, payment_data: dict):
    """Add a payment QR code to an invoice story."""
    # Encode payment information (example: UPI/IMPS details)
    qr_content = f"""
    PAYMENT DETAILS
    Invoice: {payment_data.get('invoice_number', '')}
    Amount: {payment_data.get('currency', '$')}{payment_data.get('amount', '0')}
    Account: {payment_data.get('account', '')}
    IFSC: {payment_data.get('ifsc', '')}
    """
    
    qr_buffer = generate_qr_code(qr_content.strip(), size=150)
    qr_img = RLImage(qr_buffer, width=3*cm, height=3*cm)
    
    qr_table = Table([[qr_img]], colWidths=[3*cm])
    qr_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    
    story.append(qr_table)


# Generate and save QR code as standalone image
def save_qr_code(data: str, output_path: str):
    """Save a QR code as a standalone PNG image."""
    import qrcode
    img = qrcode.make(data)
    img.save(output_path)
    print(f"QR Code saved: {output_path}")


# Usage
save_qr_code(
    "https://pay.example.com/inv/INV-2025-0042",
    "payment_qr.png"
)
```

---

## 6. Batch Invoice Generation

```python
"""Batch invoice generation from spreadsheet data."""

import csv
import json
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from invoice_generator import InvoiceGenerator
from decimal import Decimal


class BatchInvoiceProcessor:
    """Process invoices in batch from various data sources."""
    
    def __init__(self, generator: InvoiceGenerator, output_dir: str = "invoices"):
        self.generator = generator
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def from_csv(self, csv_path: str, item_csv_dir: str = None):
        """Generate invoices from a CSV file."""
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            invoices = list(reader)
        
        results = []
        for row in invoices:
            invoice_data = self._parse_csv_row(row, item_csv_dir)
            output_path = str(self.output_dir / f"{invoice_data['invoice_number']}.pdf")
            
            try:
                self.generator.generate(invoice_data, output_path)
                results.append((row['invoice_number'], True, output_path))
            except Exception as e:
                results.append((row['invoice_number'], False, str(e)))
        
        return results
    
    def _parse_csv_row(self, row: dict, item_dir: str = None) -> dict:
        """Parse a CSV row into invoice data dict."""
        invoice = {
            'invoice_number': row.get('invoice_number', f"INV-BATCH-{len(row)}"),
            'issue_date': row.get('issue_date', ''),
            'due_date': row.get('due_date', ''),
            'payment_terms': row.get('payment_terms', 'Net 30'),
            'client_name': row.get('client_name', ''),
            'client_address': row.get('client_address', ''),
            'client_city': row.get('client_city', ''),
            'client_state': row.get('client_state', ''),
            'client_zip': row.get('client_zip', ''),
            'line_items': [],
            'subtotal': Decimal('0'),
            'tax_rate': Decimal(row.get('tax_rate', '0')),
            'currency_symbol': row.get('currency', '$'),
        }
        
        # Load line items from separate file if specified
        if item_dir and row.get('items_file'):
            items_path = Path(item_dir) / row['items_file']
            if items_path.suffix == '.csv':
                with open(items_path, 'r') as f:
                    item_reader = csv.DictReader(f)
                    for item_row in item_reader:
                        qty = Decimal(item_row['quantity'])
                        price = Decimal(item_row['unit_price'])
                        item = {
                            'description': item_row['description'],
                            'quantity': qty,
                            'unit_price': price,
                        }
                        invoice['line_items'].append(item)
                        invoice['subtotal'] += qty * price
        
        return invoice
    
    def from_json(self, json_path: str):
        """Generate invoices from a JSON file."""
        with open(json_path, 'r') as f:
            data = json.load(f)
        
        results = []
        for invoice_data in data.get('invoices', []):
            # Calculate subtotal from items
            subtotal = Decimal('0')
            for item in invoice_data.get('line_items', []):
                qty = Decimal(str(item['quantity']))
                price = Decimal(str(item['unit_price']))
                item['amount'] = qty * price
                subtotal += item['amount']
            invoice_data['subtotal'] = subtotal
            
            output_path = str(self.output_dir / f"{invoice_data['invoice_number']}.pdf")
            
            try:
                self.generator.generate(invoice_data, output_path)
                results.append((invoice_data['invoice_number'], True, output_path))
            except Exception as e:
                results.append((invoice_data['invoice_number'], False, str(e)))
        
        return results
    
    def from_directory(self, input_dir: str, file_pattern: str = "*.csv"):
        """Process all data files in a directory."""
        import glob
        data_dir = Path(input_dir)
        all_results = []
        
        for file_path in data_dir.glob(file_pattern):
            print(f"Processing: {file_path.name}")
            if file_path.suffix == '.csv':
                results = self.from_csv(str(file_path))
            elif file_path.suffix == '.json':
                results = self.from_json(str(file_path))
            else:
                print(f"Skipping unsupported format: {file_path}")
                continue
            all_results.extend(results)
        
        return all_results
    
    def parallel_generate(self, invoices_data: list[dict],
                          max_workers: int = 4) -> list:
        """Generate multiple invoices in parallel."""
        results = []
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_inv = {}
            
            for inv_data in invoices_data:
                output_path = str(self.output_dir / f"{inv_data['invoice_number']}.pdf")
                future = executor.submit(
                    self.generator.generate, inv_data, output_path
                )
                future_to_inv[future] = (inv_data['invoice_number'], output_path)
            
            for future in as_completed(future_to_inv):
                inv_number, output_path = future_to_inv[future]
                try:
                    future.result()
                    results.append((inv_number, True, output_path))
                except Exception as e:
                    results.append((inv_number, False, str(e)))
        
        return results


# Usage
gen = InvoiceGenerator({'name': 'Cosmic Stack Labs', ...})
processor = BatchInvoiceProcessor(gen, 'generated_invoices')

# Process all CSVs in a directory
results = processor.from_directory('./invoice_data/', '*.csv')

# Print summary
success = sum(1 for _, ok, _ in results if ok)
failed = sum(1 for _, ok, _ in results if not ok)
print(f"Batch complete: {success} generated, {failed} failed")
```

---

## 7. PDF/A Compliance for Archiving

```python
"""Create PDF/A-compliant documents for long-term archiving."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


def create_pdfa_compliant(output_path: str, content: str):
    """Create a PDF/A-1b compliant document."""
    # PDF/A requires:
    # 1. All fonts embedded
    # 2. No transparency
    # 3. No audio/video content
    # 4. Color spaces specified
    # 5. XMP metadata
    
    c = canvas.Canvas(output_path, pagesize=A4)
    
    # Set PDF/A metadata
    c.setTitle("Archived Document")
    c.setAuthor("Cosmic Stack Labs")
    c.setSubject("PDF/A Compliant Document")
    
    # Use only embedded fonts
    c.setFont('Helvetica', 11)
    
    # Simple black text on white background (no transparency)
    c.setFillColorRGB(0, 0, 0)  # Explicit RGB color
    c.drawString(2*cm, A4[1] - 2*cm, content)
    
    c.showPage()
    c.save()
    
    print(f"PDF/A-compliant document: {output_path}")


# Add PDF/A identifier to existing PDF
def add_pdfa_identifier(input_pdf: str, output_pdf: str):
    """Add PDF/A identification to an existing PDF."""
    from PyPDF2 import PdfReader, PdfWriter
    
    reader = PdfReader(input_pdf)
    writer = PdfWriter()
    
    for page in reader.pages:
        writer.add_page(page)
    
    # Set PDF/A metadata
    metadata = reader.metadata or {}
    writer.add_metadata({
        '/Title': metadata.get('/Title', 'Document'),
        '/Author': metadata.get('/Author', ''),
        '/Subject': 'PDF/A Compliant Document',
        '/Keywords': 'pdfa, archive, document',
    })
    
    with open(output_pdf, 'wb') as f:
        writer.write(f)
    
    print(f"PDF/A identifier added: {output_pdf}")
```

---

## 8. Email + PDF Workflow Automation

```python
"""Automated email + PDF invoice delivery system."""

import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
from pathlib import Path
import csv
import json


class InvoiceDeliverySystem:
    """Send generated invoices via email automatically."""
    
    def __init__(self, smtp_config: dict):
        self.smtp_host = smtp_config['host']
        self.smtp_port = smtp_config['port']
        self.smtp_user = smtp_config['user']
        self.smtp_password = smtp_config['password']
        self.from_address = smtp_config['from_address']
        self.from_name = smtp_config.get('from_name', 'Billing Department')
    
    def send_invoice(self, recipient_email: str, recipient_name: str,
                     invoice_path: str, invoice_number: str,
                     amount: str, due_date: str):
        """Send an invoice email with PDF attachment."""
        msg = MIMEMultipart('alternative')
        msg['From'] = f"{self.from_name} <{self.from_address}>"
        msg['To'] = recipient_email
        msg['Subject'] = f"Invoice {invoice_number} — ${amount} due by {due_date}"
        
        # HTML body
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <h2>Invoice {invoice_number}</h2>
            <p>Dear {recipient_name},</p>
            <p>Please find attached invoice <b>{invoice_number}</b> for
               <b>${amount}</b>, due on <b>{due_date}</b>.</p>
            <p>You can make payment via bank transfer or credit card.
               Details are included in the invoice.</p>
            <hr>
            <p style="color: #999; font-size: 11px;">
                <b>{self.from_name}</b><br>
                Questions? Reply to this email.
            </p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html, 'html'))
        
        # Attach PDF
        with open(invoice_path, 'rb') as f:
            attachment = MIMEBase('application', 'pdf')
            attachment.set_payload(f.read())
            encoders.encode_base64(attachment)
            attachment.add_header(
                'Content-Disposition',
                f'attachment; filename="{Path(invoice_path).name}"'
            )
            msg.attach(attachment)
        
        # Send
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(self.smtp_host, self.smtp_port, context=context) as server:
            server.login(self.smtp_user, self.smtp_password)
            server.sendmail(self.from_address, recipient_email, msg.as_string())
        
        print(f"Sent: {invoice_number} → {recipient_email}")
    
    def send_batch(self, recipients_csv: str, invoice_dir: str):
        """Send invoices to all recipients listed in a CSV."""
        with open(recipients_csv, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                invoice_path = Path(invoice_dir) / f"{row['invoice_number']}.pdf"
                if invoice_path.exists():
                    self.send_invoice(
                        recipient_email=row['email'],
                        recipient_name=row['name'],
                        invoice_path=str(invoice_path),
                        invoice_number=row['invoice_number'],
                        amount=row['amount'],
                        due_date=row['due_date'],
                    )
                else:
                    print(f"Missing: {invoice_path}")

    def send_reminder(self, recipient_email: str, recipient_name: str,
                      invoice_number: str, amount: str,
                      days_overdue: int):
        """Send a payment reminder for overdue invoices."""
        msg = MIMEMultipart('alternative')
        msg['From'] = f"{self.from_name} <{self.from_address}>"
        msg['To'] = recipient_email
        msg['Subject'] = f"REMINDER: Invoice {invoice_number} is {days_overdue} days overdue"
        
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <h2>Payment Reminder</h2>
            <p>Dear {recipient_name},</p>
            <p>This is a reminder that invoice <b>{invoice_number}</b>
               for <b>${amount}</b> is now <b>{days_overdue} days overdue</b>.</p>
            <p>Please arrange payment at your earliest convenience to avoid
               any late fees or service interruption.</p>
            <hr>
            <p style="color: #999; font-size: 11px;">
                <b>{self.from_name}</b><br>
                Questions? Reply to this email.
            </p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html, 'html'))
        
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(self.smtp_host, self.smtp_port, context=context) as server:
            server.login(self.smtp_user, self.smtp_password)
            server.sendmail(self.from_address, recipient_email, msg.as_string())
        
        print(f"Reminder sent: {invoice_number} → {recipient_email}")
```

---

## Scoring Rubric

| Criteria | 1 (Basic) | 2 (Functional) | 3 (Proficient) | 4 (Advanced) | 5 (Expert) |
|----------|-----------|----------------|----------------|---------------|------------|
| **Layout** | Plain text | Basic formatting | Professional layout | Branded template | Multi-page with design |
| **Data Handling** | Manual entry | Single file input | CSV/JSON import | Multiple sources | Real-time API integration |
| **Line Items** | Fixed list | Simple table | Formatted with styles | Conditional formatting | Dynamic grouping/subtotals |
| **Automation** | Manual generation | Shell script | Batch processing | Parallel generation | Full pipeline with email |
| **Compliance** | None | Basic info included | Tax calculations | PDF/A, digital signatures | Regulatory compliance |
| **Delivery** | Manual send | Email attachment | Batch email | Scheduled delivery | Automated reminders |

---

## Common Mistakes

1. **Incorrect tax calculations**: Tax rounding errors add up in batch processing. Use `Decimal` for all monetary calculations, never floats.
2. **Missing payment information**: An invoice without clear payment instructions will delay payment. Always include bank details and payment links.
3. **No invoice numbering system**: Sequential, non-repeating invoice numbers are required for accounting. Use a prefix + year + sequence pattern.
4. **Line items without descriptions**: Vague descriptions like "Services rendered" cause disputes. Be specific about scope, quantity, and rate.
5. **Ignoring PDF file size**: Large invoices with embedded high-res images can be 50MB+. Resize logos to 150 DPI and compress images.
6. **Not testing different page sizes**: An invoice designed for A4 may break on Letter. Test both if your clients are international.
7. **No backup of generated invoices**: Regenerating invoices from data can fail if source data changes. Always archive the final PDF.
8. **Forgetting decimal precision**: Monetary values should always use 2 decimal places. Use `Decimal('10.00')` not `10.0`.
9. **No PDF metadata**: Invoices without title, author, or subject are hard to search in document management systems.
10. **Mishandling negative amounts**: Credits, discounts, and adjustments should be clearly marked and calculated correctly in the total.
