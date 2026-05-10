#!/bin/bash
# Generate docs/data/skills.json from all SKILL.md files
# This is run before deployment OR can be triggered via GitHub Actions

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/docs/data"
OUTPUT_FILE="$OUTPUT_DIR/skills.json"
mkdir -p "$OUTPUT_DIR"

echo "[" > "$OUTPUT_FILE"
FIRST=true

find "$ROOT_DIR/categories" -name "SKILL.md" | sort | while read -r file; do
  # Get relative path and extract metadata
  REL_PATH="${file#$ROOT_DIR/}"
  CATEGORY=$(echo "$REL_PATH" | cut -d'/' -f2)
  SKILL_NAME=$(echo "$REL_PATH" | cut -d'/' -f3)
  
  # Extract YAML frontmatter
  DESCRIPTION=$(awk '/^description:/{gsub(/^description: *["\x27]?|["\x27]?$/,""); print}' "$file")
  VERSION=$(awk '/^  version:/{gsub(/^  version: *["\x27]?|["\x27]?$/,""); print}' "$file")
  AUTHOR=$(awk '/^  author:/{gsub(/^  author: *["\x27]?|["\x27]?$/,""); print}' "$file")
  
  # Remove quotes from description if present
  DESCRIPTION=$(echo "$DESCRIPTION" | sed "s/^'//; s/'$//; s/^\"//; s/\"$//")
  
  # Extract tags as JSON array
  TAGS_LINE=$(awk '/^  tags:/{getline; while($0 ~ /^- /){print; getline}}' "$file" | sed 's/^- //' | tr '\n' ',' | sed 's/,$//')
  TAGS_JSON=""
  if [ -n "$TAGS_LINE" ]; then
    TAGS_JSON="["
    IFS=',' read -ra TAGS <<< "$TAGS_LINE"
    for i in "${!TAGS[@]}"; do
      TAG=$(echo "${TAGS[$i]}" | xargs)
      if [ $i -gt 0 ]; then TAGS_JSON+=", "; fi
      TAGS_JSON+="\"$TAG\""
    done
    TAGS_JSON+="]"
  else
    TAGS_JSON="[]"
  fi
  
  # Get title from first H1 in markdown
  TITLE=$(grep -m1 '^# ' "$file" | sed 's/^# //' | tr -d '\n')
  
  # Get word count as complexity indicator
  WC=$(wc -w < "$file" | tr -d ' ')
  
  # Get first 200 chars of content after frontmatter as excerpt
  EXCERPT=$(awk 'BEGIN{flag=0} /^---$/{if(flag==0){flag=1; next} else {flag=2; next}} flag==2{if(length>0){print; if(length>=200) exit}}' "$file" | head -c 200 | tr -d '\n' | sed 's/"/\\"/g')
  
  # Category display name
  CAT_DISPLAY=$(echo "$CATEGORY" | sed 's/-/ /g; s/\b\(.\)/\u\1/g')
  
  if [ "$FIRST" = true ]; then
    FIRST=false
  else
    echo "," >> "$OUTPUT_FILE"
  fi
  
  cat >> "$OUTPUT_FILE" << EOF
{
  "id": "$SKILL_NAME",
  "title": "$TITLE",
  "name": "$SKILL_NAME",
  "description": "$DESCRIPTION",
  "category": "$CATEGORY",
  "categoryDisplay": "$CAT_DISPLAY",
  "version": "$VERSION",
  "author": "$AUTHOR",
  "tags": $TAGS_JSON,
  "wordCount": $WC,
  "excerpt": "$EXCERPT",
  "path": "$REL_PATH",
  "githubUrl": "https://github.com/cosmicstack-labs/mercury-agent-skills/blob/main/$REL_PATH",
  "installCmd": "mercury skill install $SKILL_NAME"
}
EOF
done

echo "]" >> "$OUTPUT_FILE"

# Validate JSON
if command -v python3 &> /dev/null; then
  python3 -m json.tool "$OUTPUT_FILE" > /dev/null 2>&1 && echo "✅ skills.json generated successfully ($(grep -c '"id"' "$OUTPUT_FILE") skills)" || echo "❌ Invalid JSON generated"
elif command -v node &> /dev/null; then
  node -e "JSON.parse(require('fs').readFileSync('$OUTPUT_FILE','utf8')); console.log('✅ skills.json generated successfully')" || echo "❌ Invalid JSON"
fi
