# Contributing to Mercury Skills

Thank you for your interest in contributing to Mercury Skills! This guide will help you create and submit high-quality skills.

## How to Contribute

### 1. Create a Skill

Each skill is a `SKILL.md` file with YAML frontmatter. Skills must follow the standard format:

```yaml
---
name: your-skill-name
description: 'One sentence describing what this skill does and when to use it'
metadata:
  author: your-github-username
  version: 1.0.0
  category: development
  tags: [tag1, tag2, tag3]
---
```

### 2. Skill Requirements

- **Original content**: Don't copy from other skills or copyrighted material
- **Actionable**: Provide specific guidance, not just theory
- **Scorable**: Include a framework, rubric, or checklist for evaluation
- **Well-structured**: Use clear headings, code examples, and lists
- **Practical**: Include real-world examples and common mistakes

### 3. File Structure

```
categories/
  your-category/
    your-skill-name/
      SKILL.md
```

### 4. Naming Conventions

- **Skill directories**: Use kebab-case (e.g., `clean-code`, `api-design`)
- **Skill names**: Use kebab-case in frontmatter (e.g., `clean-code`)
- **Categories**: Use existing category names (development, frontend, backend, devops, ai-ml, security, product, marketing, design, business, automation, data, mobile, testing-qa, shop-restaurant, creative-personal-development, career, finance-legal, health-wellness, education-learning) or suggest a new one

### 5. Quality Checklist

Before submitting, ensure your skill:

- [ ] Has valid YAML frontmatter with all required fields
- [ ] Is at least 100 lines of substantive content
- [ ] Includes code examples where applicable
- [ ] Has a scoring or evaluation section
- [ ] Lists common mistakes or pitfalls
- [ ] Uses clear, professional language
- [ ] Has no broken links or references

### 6. Updating CATALOG.md

After creating your skill, add an entry to the appropriate category section in `CATALOG.md`:

```markdown
### [Skill Name](./categories/category/your-skill-name/)
- **File**: `SKILL.md`
- **Description**: One-line description of what this skill teaches
```

### 7. Submitting via Pull Request

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-skill-name`
3. Add your skill and update CATALOG.md
4. Commit: `git commit -m "Add skill: your-skill-name"`
5. Push: `git push origin feat/your-skill-name`
6. Open a Pull Request with a clear description

### 8. Code of Conduct

- Be respectful and constructive
- Focus on what's best for the community
- Welcome newcomers and diverse perspectives
- Accept constructive criticism gracefully

## Questions?

Open an issue on GitHub or reach out to the maintainers.

Thank you for helping make Mercury Skills better! 🪐
