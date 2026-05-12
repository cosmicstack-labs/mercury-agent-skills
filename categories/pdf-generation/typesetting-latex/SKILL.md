---
name: typesetting-latex
description: 'Professional document preparation with LaTeX for academic papers, resumes, books, presentations, and formal documents'
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: pdf-generation
  tags: [latex, typesetting, academic, document-preparation, pdf]
---

# LaTeX Typesetting

LaTeX is the gold standard for professional typesetting — used for academic papers, technical books, theses, resumes, and presentations. This skill covers document structure, packages, math typesetting, tables, figures, bibliographies, beamer presentations, and CI/CD workflows.

---

## LaTeX Document Structure

### Minimum Working Example

```latex
% document.tex — A minimal LaTeX document
\documentclass{article}

\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}

\title{A Simple LaTeX Document}
\author{Jane Doe}
\date{\today}

\begin{document}

\maketitle

\section{Introduction}

This is the first paragraph of the document. 
LaTeX handles all the typesetting automatically.

\section{Methodology}

We describe our approach in this section.

\end{document}
```

### Document Classes

```latex
% Available document classes with typical use cases

% Research articles and short reports
\documentclass{article}

% Books and long-form content
\documentclass{book}

% Reports and theses
\documentclass{report}

% Presentations
\documentclass{beamer}

% Letters
\documentclass{letter}

% Resumes/CVs
\documentclass{resume}

% IEEE conference papers
\documentclass[conference]{IEEEtran}

% ACM conference papers
\documentclass[sigconf]{acmart}

% American Mathematical Society
\documentclass{amsart}

% With options
\documentclass[
  11pt,              % Font size: 10pt, 11pt, 12pt
  a4paper,           % Paper size: a4paper, letterpaper, legalpaper
  twoside,           % Two-sided printing
  openright,         % Chapters start on right-hand pages
  draft,             % Draft mode with overfull boxes marked
]{report}
```

### Preamble Organization

```latex
% preamble.tex — Clean preamble organization

% ---------- Encoding and Fonts ----------
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{lmodern}               % Latin Modern (enhanced Computer Modern)

% ---------- Page Layout ----------
\usepackage[
  top=2.5cm,
  bottom=2.5cm,
  left=3cm,
  right=2.5cm,
  headheight=15pt,
]{geometry}

% ---------- Language ----------
\usepackage[english]{babel}        % Language-specific rules
\usepackage{csquotes}              % Context-sensitive quotes

% ---------- Math ----------
\usepackage{amsmath}               % AMS math environments
\usepackage{amssymb}               % AMS symbol collection
\usepackage{amsthm}                % Theorem environments
\usepackage{mathtools}             % Math tool enhancements

% ---------- Graphics and Color ----------
\usepackage{graphicx}              % Include images
\usepackage[table,xcdraw]{xcolor}  % Color support
\usepackage{caption}               % Caption customization
\usepackage{subcaption}            % Sub-figures

% ---------- Tables ----------
\usepackage{array}                 % Advanced table columns
\usepackage{booktabs}              % Professional table rules
\usepackage{longtable}             % Multi-page tables
\usepackage{tabularx}              % Auto-width columns

% ---------- Hyperlinks ----------
\usepackage[
  colorlinks=true,
  linkcolor=blue!60!black,
  citecolor=green!40!black,
  urlcolor=blue!60!black,
]{hyperref}

% ---------- Bibliography ----------
\usepackage[
  style=ieee,
  sorting=none,
  backend=biber,
]{biblatex}
\addbibresource{references.bib}

% ---------- Custom Commands ----------
\newcommand{\R}{\mathbb{R}}
\newcommand{\N}{\mathbb{N}}
\newcommand{\E}{\mathbb{E}}
\newcommand{\Var}{\operatorname{Var}}

% ---------- Theorem Environments ----------
\newtheorem{theorem}{Theorem}[section]
\newtheorem{lemma}{Lemma}[section]
\newtheorem{corollary}{Corollary}[theorem]
\theoremstyle{definition}
\newtheorem{definition}{Definition}[section]
\theoremstyle{remark}
\newtheorem{remark}{Remark}[section]

% ---------- Metadata ----------
\title{Advanced Topics in Machine Learning}
\author{Jane Doe\textsuperscript{1} \and John Smith\textsuperscript{2}}
\date{\today}

\begin{document}
\maketitle
\end{document}
```

---

## 2. Essential Packages

### Geometry — Page Layout

```latex
\usepackage[
  a4paper,              % Paper size
  margin=2.5cm,         % Equal margins
  top=2cm,              % Top margin
  bottom=3cm,           % Bottom margin (for page numbers)
  left=3cm,             % Left margin (binding offset)
  right=2cm,            % Right margin
  headsep=1cm,          % Space between header and text
  footskip=1.5cm,       % Space from text to footer
  bindingoffset=0.5cm,  % Extra space for binding
  includehead,          % Include header in the top margin
  includefoot,          % Include footer in the bottom margin
]{geometry}

% Quick symmetrical margins
\usepackage[margin=1in]{geometry}

% Book layout
\usepackage[twoside, bindingoffset=1cm]{geometry}
```

### Hyperref — Hyperlinks and Bookmarks

```latex
\usepackage[
  pdfauthor={Jane Doe},
  pdftitle={Advanced Topics in Machine Learning},
  pdfsubject={Machine Learning},
  pdfkeywords={deep learning, neural networks, transformers},
  colorlinks=true,              % Colored text instead of boxes
  linkcolor=blue!60!black,     % Internal links
  citecolor=green!40!black,    % Citation links
  urlcolor=blue!60!black,      % URL links
  linktoc=all,                 % TOC entries are links
  bookmarks=true,              % PDF bookmarks
  bookmarksnumbered=true,      % Bookmark numbers
  bookmarksopen=true,          % Expand bookmarks
  pdfstartview=FitH,           % Fit page width
  pdfpagemode=UseOutlines,     % Open bookmarks panel
]{hyperref}
```

### Graphicx — Images

```latex
\usepackage{graphicx}
\graphicspath{{images/}{./figures/}}  % Search paths

% Including images
\includegraphics{diagram.png}
\includegraphics[width=0.5\textwidth]{chart.pdf}
\includegraphics[height=5cm]{photo.jpg}
\includegraphics[scale=0.75]{graph}
\includegraphics[width=\textwidth, height=4cm, keepaspectratio]{banner}

% Image types supported
% PDF — Best, vector graphics, scalable
% EPS — Legacy vector format (needs dvips)
% PNG — Good for screenshots, raster
% JPG — Photos, raster with compression
```

### Listings — Code in Documents

```latex
\usepackage{listings}
\usepackage{xcolor}

% Define a code style
\lstdefinestyle{pythonstyle}{
    language=Python,
    basicstyle=\ttfamily\small,
    backgroundcolor=\color{gray!10},
    commentstyle=\color{green!40!black},
    keywordstyle=\color{blue!60!black}\bfseries,
    stringstyle=\color{orange!80!black},
    numberstyle=\tiny\color{gray},
    numbers=left,
    numbersep=5pt,
    frame=single,
    framesep=5pt,
    rulecolor=\color{gray!30},
    tabsize=4,
    breaklines=true,
    showstringspaces=false,
    captionpos=b,
    literate=
        {á}{{\'a}}1 {é}{{\'e}}1 {í}{{\'i}}1
        {ó}{{\'o}}1 {ú}{{\'u}}1,
}

% Usage in document
\begin{lstlisting}[style=pythonstyle, caption=Data loading function]
import pandas as pd
import numpy as np

def load_data(path):
    """Load and preprocess dataset."""
    df = pd.read_csv(path)
    df = df.dropna()
    return df
\end{lstlisting}

% Inline code
The function \lstinline{load_data()} returns a DataFrame.
```

---

## 3. Math Mode

### Inline Math

```latex
% Inline math is enclosed in $...$
Einstein's equation is $E = mc^2$.

The function $f(x) = ax^2 + bx + c$ is a quadratic.

A vector $\mathbf{v} = (v_1, v_2, \ldots, v_n)$.

Set notation: $\{x \in \mathbb{R} \mid x > 0\}$.

Greek letters: $\alpha, \beta, \gamma, \delta, \epsilon, \theta, \lambda, \mu, \pi, \sigma, \omega$.

Operators: $\sum_{i=1}^n$, $\prod_{i=1}^n$, $\int_a^b$, $\lim_{x \to 0}$.
```

### Display Math

```latex
% Display math — unnumbered
\[
E = mc^2
\]

% Equation environment — numbered
\begin{equation}
\label{eq:einstein}
E = mc^2
\end{equation}

% Multi-line equations with align
\begin{align}
\label{eq:quadratic}
x &= \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} \\
  &= \frac{-b \pm \sqrt{\Delta}}{2a}
\end{align}

% Cases
\[
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}
\]

% Matrices
\[
A = \begin{pmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{pmatrix}
\]

% Extended align with \intertext
\begin{align}
A &= B + C \label{eq:sum} \\
\intertext{where $B$ is the baseline and $C$ is the correction term,}
D &= E - F \label{eq:diff}
\end{align}
```

### Theorem Environments

```latex
% Definition in preamble
\newtheorem{theorem}{Theorem}[section]
\newtheorem{lemma}{Lemma}[section]  
\newtheorem{corollary}{Corollary}[theorem]
\theoremstyle{definition}
\newtheorem{definition}{Definition}[section]
\newtheorem{example}{Example}[section]
\theoremstyle{remark}
\newtheorem{remark}{Remark}[section]

% Usage in document
\begin{definition}[Gradient Descent]
\label{def:gradient_descent}
Gradient descent is a first-order iterative optimization algorithm
for finding a local minimum of a differentiable function.
\end{definition}

\begin{theorem}[Universal Approximation Theorem]
\label{thm:universal_approximation}
A feedforward network with a single hidden layer containing
a finite number of neurons can approximate any continuous function
on a compact subset of $\mathbb{R}^n$.
\end{theorem}

\begin{proof}
Follows from the Stone-Weierstrass theorem...
\end{proof}

\begin{remark}
This assumes activation functions are non-polynomial.
\end{remark}
```

### Advanced Math Notation

```latex
% Common math notation examples

% Brackets and delimiters
\left( \frac{a}{b} \right)          % Auto-sized parentheses
\left[ \sum_{i=1}^n x_i \right]     % Auto-sized brackets
\left\{ \frac{\partial f}{\partial x} \right\}  % Auto-sized braces
\lvert x \rvert                     % Absolute value
\lVert \mathbf{v} \rVert            % Norm
\langle \phi, \psi \rangle          % Inner product

% Derivatives
\frac{df}{dx}                       % Derivative
\frac{\partial f}{\partial x}       % Partial derivative
\dot{x}                             % Time derivative (dot)
\ddot{x}                            % Second time derivative

% Integrals
\int_{a}^{b} f(x) \, dx             % Definite integral
\iint                              % Double integral
\iiint                             % Triple integral
\oint                              % Contour integral

% Summations and products
\sum_{i=1}^{n} x_i                 % Summation
\prod_{i=1}^{n} x_i                % Product
\bigcup_{i=1}^{n} A_i              % Union
\bigcap_{i=1}^{n} A_i              % Intersection

% Special functions
\lim_{x \to 0} \frac{\sin x}{x}    % Limit
\exp(x)                            % Exponential
\log(x)                            % Logarithm
\sin, \cos, \tan                   % Trigonometric

% Decorations
\hat{x}                            % Hat
\tilde{x}                          % Tilde
\bar{x}                            % Bar
\vec{x}                            % Vector
\dot{x}                            % Dot
\ddot{x}                           % Double dot

% Spacing in math
\,   % thin space
\:   % medium space
\;   % thick space
\quad  % 1em space
\qquad % 2em space
```

---

## 4. Tables

### Basic Tables with booktabs

```latex
% Professional tables using booktabs
\usepackage{booktabs}
\usepackage{array}

\begin{table}[htbp]
\centering
\caption{Experimental Results Summary}
\label{tab:results}
\begin{tabular}{lcrr}
\toprule
\textbf{Model} & \textbf{Accuracy} & \textbf{F1-Score} & \textbf{Time (s)} \\
\midrule
CNN-Baseline    & 94.2\%            & 0.937             & 142              \\
ResNet-50       & 96.8\%            & 0.965             & 287              \\
Transformer     & \textbf{97.1\%}   & \textbf{0.969}    & 412              \\
\bottomrule
\end{tabular}
\end{table}
```

### Advanced Tables

```latex
% Multi-page table
\usepackage{longtable}
\usepackage{tabularx}

\begin{longtable}{p{3cm} X r}
\caption{Extended Results Over Multiple Pages} \\
\toprule
\textbf{Parameter} & \textbf{Description} & \textbf{Value} \\
\midrule
\endfirsthead

\multicolumn{3}{c}%
{{\bfseries \tablename\ \thetable{} -- continued from previous page}} \\
\toprule
\textbf{Parameter} & \textbf{Description} & \textbf{Value} \\
\midrule
\endhead

\bottomrule
\multicolumn{3}{r}{{Continued on next page}} \\
\endfoot

\bottomrule
\endlastfoot

Learning Rate & Initial learning rate for optimizer & 0.001 \\
Batch Size & Number of samples per batch & 64 \\
Epochs & Total training epochs & 100 \\
Dropout & Dropout rate for regularization & 0.2 \\
... & (continues for many rows) & ... \\
\end{longtable}

% Column types with custom widths
\usepackage{array}
\newcolumntype{L}[1]{>{\raggedright\arraybackslash}p{#1}}
\newcolumntype{C}[1]{>{\centering\arraybackslash}p{#1}}
\newcolumntype{R}[1]{>{\raggedleft\arraybackslash}p{#1}}

\begin{tabular}{L{3cm} C{2cm} R{2cm}}
\toprule
\textbf{Item} & \textbf{Quantity} & \textbf{Price} \\
\midrule
Widget A & 100 & \$12.50 \\
Widget B & 50  & \$24.00 \\
\bottomrule
\end{tabular}

% Colored tables
\usepackage[table]{xcolor}
\rowcolors{2}{gray!10}{white}  % Alternating row colors

\begin{tabular}{llr}
\toprule
\textbf{Name} & \textbf{Department} & \textbf{Salary} \\
\midrule
Alice & Engineering & \$95,000 \\
Bob   & Marketing  & \$82,000 \\
Carol & Sales      & \$78,000 \\
\bottomrule
\end{tabular}
```

---

## 5. Figures and Floating

### Including Figures

```latex
% Basic figure
\begin{figure}[htbp]
\centering
\includegraphics[width=0.8\textwidth]{architecture.pdf}
\caption{System architecture overview showing the data flow
         from input to output through the processing pipeline.}
\label{fig:architecture}
\end{figure}

% Multiple sub-figures
\usepackage{subcaption}

\begin{figure}[htbp]
\centering
\begin{subfigure}{0.45\textwidth}
    \centering
    \includegraphics[width=\textwidth]{result_a.pdf}
    \caption{Experiment A}
    \label{fig:exp_a}
\end{subfigure}
\hfill
\begin{subfigure}{0.45\textwidth}
    \centering
    \includegraphics[width=\textwidth]{result_b.pdf}
    \caption{Experiment B}
    \label{fig:exp_b}
\end{subfigure}
\caption{Comparison of experimental results under different conditions.}
\label{fig:experiments}
\end{figure}

% Side-by-side figure and table
\begin{figure}[htbp]
\centering
\begin{minipage}{0.55\textwidth}
    \includegraphics[width=\textwidth]{chart.pdf}
    \caption{Performance chart}
    \label{fig:chart}
\end{minipage}
\hfill
\begin{minipage}{0.4\textwidth}
    \centering
    \begin{tabular}{lr}
    \toprule
    Model & Score \\
    \midrule
    A & 94\% \\
    B & 97\% \\
    \bottomrule
    \end{tabular}
    \captionof{table}{Comparison}
    \label{tab:comparison}
\end{minipage}
\end{figure}
```

### Floating Placement Options

```latex
% Placement specifiers
% h — Here (approximate location)
% t — Top of page
% b — Bottom of page
% p — Float page (separate page)
% ! — Override internal parameters

\begin{figure}[htbp]  % Try here, then top, then bottom, then float page
    ...
\end{figure}

% Force exact placement
\usepackage{float}
\begin{figure}[H]  % Exactly here (from float package)
    ...
\end{figure}

% Prevent floats from breaking sections
\usepackage[section]{placeins}  % Floats before section break
```

---

## 6. Bibliography

### BibTeX

```bibtex
% references.bib
@article{goodfellow2014generative,
    author    = {Goodfellow, Ian and Pouget-Abadie, Jean and
                 Mirza, Mehdi and Xu, Bing and Warde-Farley, David and
                 Ozair, Sherjil and Courville, Aaron and Bengio, Yoshua},
    title     = {Generative Adversarial Nets},
    journal   = {Advances in Neural Information Processing Systems},
    year      = {2014},
    volume    = {27},
    pages     = {2672--2680},
}

@inproceedings{vaswani2017attention,
    author    = {Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and
                 Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N and
                 Kaiser, {\L}ukasz and Polosukhin, Illia},
    title     = {Attention is All You Need},
    booktitle = {Advances in Neural Information Processing Systems},
    year      = {2017},
    pages     = {5998--6008},
}

@book{goodfellow2016deep,
    author    = {Goodfellow, Ian and Bengio, Yoshua and Courville, Aaron},
    title     = {Deep Learning},
    publisher = {MIT Press},
    year      = {2016},
    note      = {\url{http://www.deeplearningbook.org}},
}

@misc{openai2023gpt4,
    author    = {OpenAI},
    title     = {GPT-4 Technical Report},
    year      = {2023},
    eprint    = {2303.08774},
    archivePrefix = {arXiv},
}

@online{pytorch2024docs,
    author    = {{PyTorch Contributors}},
    title     = {PyTorch Documentation},
    year      = {2024},
    url       = {https://pytorch.org/docs/stable/},
    urldate   = {2024-01-15},
}
```

### Using BibTeX

```latex
% In document preamble (choose one approach)

% BibTeX approach
\bibliographystyle{ieeetr}
% or
\bibliographystyle{plain}
% or
\bibliographystyle{alpha}

% At the end of document
\bibliography{references}
% or
\bibliography{references,additional_refs}
```

### Using BibLaTeX (Modern Approach)

```latex
% Preamble — more flexible and powerful
\usepackage[
    style=ieee,              % Citation style: ieee, apa, mla, chicago, nature
    sorting=none,            % Sort: none (order cited), ybmt (year), nyt (name)
    backend=biber,           % Use biber instead of bibtex
    maxbibnames=10,          % Max names in bibliography
    minbibnames=3,           % Min names before et al.
    giveninits=true,         % Use initials for given names
    url=true,                % Include URLs
    doi=true,                % Include DOIs
    isbn=false,              % Omit ISBNs
]{biblatex}

\addbibresource{references.bib}

% In document
This result was first shown in \cite{goodfellow2014generative}.
The transformer architecture \cite{vaswani2017attention} revolutionized NLP.
See \cite{goodfellow2016deep} for a comprehensive introduction.

% Multiple citations
Related work \cite{goodfellow2014generative, vaswani2017attention}.

% Print bibliography
\printbibliography[title=References, heading=bibintoc]
```

---

## 7. Cross-Referencing

```latex
% Labels and references
\section{Introduction}
\label{sec:introduction}

As discussed in Section~\ref{sec:introduction}, the results show...

See Figure~\ref{fig:results} for the experimental outcomes.

Table~\ref{tab:comparison} summarizes the key metrics.

Equation~\ref{eq:einstein} is the foundation of modern physics.

Chapter~\ref{ch:methods} describes the experimental setup.

% Cleveref for smart references
\usepackage{cleveref}

\cref{sec:introduction}    % → "section 1"
\cref{fig:results}         % → "figure 1"
\cref{tab:comparison}      % → "table 1"
\cref{eq:einstein}         % → "equation (1)"
\Cref{sec:introduction}    % → "Section 1" (capitalized)

\cref{fig:results,tab:comparison}  % → "figures 1 and table 1"

% Varioref for page references
\usepackage{varioref}
\vref{fig:results}  % → "figure 1 on page 5"
\vpageref{fig:results}  % → "on page 5"

% Footnotes
This is a statement.\footnote{This is the accompanying footnote.}

% Table footnotes
\begin{table}
\centering
\begin{tabular}{lr}
\toprule
Item & Value \\
\midrule
A & 100\footnotemark \\
B & 200\footnotemark \\
\bottomrule
\end{tabular}
\footnotetext{Measured in units.}
\footnotetext{Estimated value.}
\end{table}
```

---

## 8. Beamer Presentations

### Basic Beamer Template

```latex
% presentation.tex
\documentclass[11pt, aspectratio=169]{beamer}

% Theme
\usetheme{metropolis}          % Modern, clean theme
% \usetheme{Madrid}            % Classic with navigation bars
% \usetheme{CambridgeUS}       % Academic
% \usetheme{Singapore}         % Minimal

% Color scheme
\usecolortheme{default}
\setbeamercolor{title}{fg=white, bg=blue!60!black}
\setbeamercolor{frametitle}{fg=white, bg=blue!60!black}

% Packages
\usepackage{amsmath}
\usepackage{graphicx}
\usepackage{listings}
\usepackage{booktabs}

% Metadata
\title{Deep Learning: A Modern Perspective}
\subtitle{An Overview of Architectures and Applications}
\author{Jane Doe}
\institute{Cosmic Stack Labs}
\date{\today}

\begin{document}

% Title slide
\begin{frame}
    \titlepage
\end{frame}

% Table of contents
\begin{frame}{Outline}
    \tableofcontents
\end{frame}

\section{Introduction}

\begin{frame}{Motivation}
    \begin{itemize}
        \item Deep learning has transformed AI research
        \item Key breakthroughs in vision, language, and speech
        \item Modern architectures scale to billions of parameters
    \end{itemize}
\end{frame}

\section{Architectures}

\begin{frame}{Transformer Architecture}
    
    The transformer uses self-attention mechanisms:
    
    \[
    \text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
    \]
    
    \begin{block}{Key Components}
        \begin{enumerate}
            \item Multi-head attention
            \item Position-wise feed-forward networks
            \item Layer normalization and residual connections
        \end{enumerate}
    \end{block}
\end{frame}

\begin{frame}{Experimental Results}
    \begin{table}
    \centering
    \begin{tabular}{lcc}
    \toprule
    \textbf{Model} & \textbf{Parameters} & \textbf{BLUE Score} \\
    \midrule
    RNN & 85M & 26.8 \\
    LSTM & 110M & 28.4 \\
    Transformer & 65M & \textbf{28.9} \\
    \bottomrule
    \end{tabular}
    \end{table}
    
    \begin{itemize}
        \item Transformer achieves highest score with fewer parameters
        \item Parallel training significantly reduces wall-clock time
    \end{itemize}
\end{frame}

\begin{frame}{Results Visualization}
    \centering
    \includegraphics[width=0.7\textwidth]{results_chart.pdf}
    
    \caption{Performance comparison across model architectures.}
\end{frame}

\section{Conclusion}

\begin{frame}{Key Takeaways}
    \begin{columns}
        \column{0.5\textwidth}
        \textbf{Future Directions}
        \begin{itemize}
            \item Efficient attention mechanisms
            \item Multimodal learning
            \item Sparse models
        \end{itemize}
        
        \column{0.5\textwidth}
        \textbf{Open Challenges}
        \begin{itemize}
            \item Computational cost
            \item Data efficiency
            \item Interpretability
        \end{itemize}
    \end{columns}
\end{frame}

\begin{frame}[standout]
    Questions?
\end{frame}

\end{document}
```

---

## 9. Custom Commands and Environments

```latex
% Custom commands
\newcommand{\R}{\mathbb{R}}
\newcommand{\N}{\mathbb{N}}
\newcommand{\eps}{\varepsilon}
\newcommand{\todo}[1]{\textcolor{red}{[TODO: #1]}}

% Commands with arguments
\newcommand{\keyword}[1]{\textbf{#1}}
\newcommand{\pderiv}[2]{\frac{\partial #1}{\partial #2}}
\newcommand{\bigO}[1]{\mathcal{O}(#1)}

% Commands with optional arguments
\newcommand{\note}[2][Note]{\textbf{#1:} #2}
% Usage: \note{Some text} or \note[Warning]{Some text}

% Custom environments
\newenvironment{info}{%
    \begin{center}
    \begin{tabular}{|p{0.9\textwidth}|}
    \rowcolor{blue!10}
    \hline
    \textbf{Info:}
}{%
    \\ \hline
    \end{tabular}
    \end{center}
}

% Usage
\begin{info}
This is an informational box with important context.
\end{info}

% Numbered exercise environment
\newcounter{exercise}[section]
\newenvironment{exercise}{%
    \refstepcounter{exercise}
    \par\medskip
    \noindent\textbf{Exercise~\thesection.\theexercise:}
    \itshape
}{\par\medskip}

% Usage
\begin{exercise}
Prove that the gradient descent algorithm converges for convex functions.
\end{exercise}
```

---

## 10. Compilation Workflows

### Basic Compilation

```bash
# Simple document (one pass)
pdflatex document.tex

# Document with cross-references (two passes)
pdflatex document.tex
pdflatex document.tex

# Document with bibliography (three passes)
pdflatex document.tex
bibtex document
pdflatex document.tex
pdflatex document.tex

# Using biblatex with biber
pdflatex document.tex
biber document
pdflatex document.tex
pdflatex document.tex

# XeLaTeX (for Unicode/CJK/system fonts)
xelatex document.tex

# LuaLaTeX (for OpenType/lua scripting)
lualatex document.tex
```

### Using latexmk (Recommended)

```bash
# Automatically determine required passes
latexmk -pdf document.tex

# Continuous compilation (watch for changes)
latexmk -pdf -pvc document.tex

# Clean auxiliary files
latexmk -c

# Full clean (including PDF)
latexmk -C

# With XeLaTeX
latexmk -xelatex document.tex

# With LuaLaTeX
latexmk -lualatex document.tex

# Force recompilation
latexmk -pdf -g document.tex
```

### Makefile for LaTeX Projects

```makefile
# Makefile for LaTeX document compilation

PROJECT = thesis
LATEX = pdflatex -shell-escape -interaction=nonstopmode
BIBTEX = biber

.PHONY: all clean distclean watch

all: $(PROJECT).pdf

$(PROJECT).pdf: $(PROJECT).tex $(wildcard *.bib) $(wildcard chapters/*.tex)
	$(LATEX) $(PROJECT)
	$(BIBTEX) $(PROJECT)
	$(LATEX) $(PROJECT)
	$(LATEX) $(PROJECT)
	@echo "=== Compilation complete ==="

watch:
	latexmk -pdf -pvc $(PROJECT)

quick:
	$(LATEX) $(PROJECT)

clean:
	rm -f *.aux *.log *.out *.toc *.lof *.lot *.bbl *.blg *.bcf
	rm -f *.xml *.synctex.gz *.fls *.fdb_latexmk *.run.xml
	rm -f chapters/*.aux

distclean: clean
	rm -f $(PROJECT).pdf
```

---

## 11. CI/CD for LaTeX

### GitHub Actions

```yaml
# .github/workflows/latex-build.yml
name: Build LaTeX Document
on:
  push:
    branches: [main]
    paths:
      - '**.tex'
      - '**.bib'
      - '**.cls'
      - '**.sty'
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install TeX Live
        run: |
          sudo apt-get update
          sudo apt-get install -y texlive-full latexmk biber
      
      - name: Build document
        run: |
          latexmk -pdf -interaction=nonstopmode main.tex
      
      - name: Check for errors
        run: |
          if grep -q "Error" main.log; then
            echo "=== LaTeX Errors Found ==="
            grep "Error" main.log
            exit 1
          fi
      
      - name: Upload PDF artifact
        uses: actions/upload-artifact@v3
        with:
          name: document
          path: main.pdf
      
      - name: Release on tag
        if: startsWith(github.ref, 'refs/tags/v')
        uses: softprops/action-gh-release@v1
        with:
          files: main.pdf
```

### Docker Build

```dockerfile
# Dockerfile for reproducible LaTeX builds
FROM texlive/texlive:latest

WORKDIR /workspace

# Install additional packages
RUN tlmgr install \
    moderncv \
    fontawesome5 \
    mhchem \
    and additional needed packages

COPY . .

RUN latexmk -pdf main.tex

CMD ["cp", "main.pdf", "/output/"]
```

### Pre-commit Hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: latex-lint
        name: LaTeX Linting
        entry: chktex
        language: system
        files: '\.tex$'
        args: ['-q', '-n', '1', '-n', '2']
      
      - id: latex-build
        name: LaTeX Build Check
        entry: latexmk -pdf -interaction=nonstopmode
        language: system
        files: '\.tex$'
        pass_filenames: false
```

---

## Troubleshooting Cheat Sheet

### Common Errors and Solutions

```latex
% Error: "! Undefined control sequence"
% Solution: Missing package
\usepackage{amsmath}   % For \mathbb, \mathcal, etc.
\usepackage{graphicx}  % For \includegraphics
\usepackage{hyperref}  % For \url, \href

% Error: "! LaTeX Error: File `*.eps' not found"
% Solution: Use PDF images or convert
% Or use: \usepackage{epstopdf}

% Error: "! Package inputenc Error: Unicode character"
% Solution: Use xelatex or lualatex
% Or: \usepackage[utf8]{inputenc}

% Error: "Overfull \hbox"
% Solution: Reword or use
\sloppy  % Less strict line breaking
% Or: \usepackage{microtype}  % Better character protrusion

% Error: "! Bibliography not compatible with author-year"
% Solution: Use consistent style
% biblatex with style=apa requires biber, not bibtex

% Warning: "No file *.bbl"
% Solution: Run bibtex/biber after pdflatex
```

---

## Scoring Rubric

| Criteria | 1 (Basic) | 2 (Functional) | 3 (Proficient) | 4 (Advanced) | 5 (Expert) |
|----------|-----------|----------------|----------------|---------------|------------|
| **Structure** | Single file | Preamble + sections | Modular files | Class/packages | Full project architecture |
| **Math** | Basic inline | Display equations | Align, matrices | Theorem environments | Custom math commands |
| **Tables** | Simple tabular | booktabs | Multi-page tables | Complex layouts | Dynamic generation |
| **Bibliography** | Manual | Basic BibTeX | BibLaTeX | Multiple .bib files | Custom styles |
| **Automation** | Manual compile | Simple script | Makefile | latexmk | CI/CD pipeline |
| **Output Quality** | Basic layout | Professional | Publication-ready | Print-quality | Book-level typesetting |

---

## Common Mistakes

1. **Forgetting the second compile pass**: Cross-references, TOC, and citations need at least two `pdflatex` runs. Use `latexmk` to automate this.
2. **Mismatched bibliography engine**: Using `biblatex` with style=ieee requires `biber`, not `bibtex`. Check your compilation command.
3. **Overfull boxes in tables**: Tables with too much content overflow margins. Use `tabularx` or `p{}` column specifiers for wrapping.
4. **Using `\\` outside tabular/array**: Line breaks in normal text need blank lines (new paragraph), not `\\`. Use `\newline` if needed.
5. **Missing `%` at line ends**: Unwanted spaces from trailing newlines matter in LaTeX. Comment out blank lines in command definitions.
6. **Fragile commands in moving arguments**: Commands like `\textbf` in section titles need `\protect`. Better yet, use `\texorpdfstring` for PDF bookmarks.
7. **Figures that float to the wrong place**: Use `[H]` from the `float` package for precise placement, or `[htbp!]` for flexibility.
8. **Not using `~` before references**: Always use `Figure~\ref{fig:x}` not `Figure \ref{fig:x}` to prevent line breaks between the word and number.
9. **Forgetting to escape special characters**: Characters like `&`, `%`, `$`, `#`, `_`, `{`, `}` need backslash escaping in normal text.
10. **Ignoring `chktex` warnings**: Run `chktex` (or `lacheck`) to catch typographical issues like wrong spacing, unmatched quotes, and improper dashes.
