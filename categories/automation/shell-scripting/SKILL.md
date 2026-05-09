---
name: Shell Scripting
description: Master shell scripting best practices, error handling, portability, debugging, and performance optimization for reliable automation scripts
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: automation
  tags:
    - shell-scripting
    - bash
    - posix
    - error-handling
    - debugging
    - portability
    - automation
---

# Shell Scripting

## Core Principles

### 1. Fail Explicitly
A script that encounters an error should stop, not continue with corrupted state. Use defensive coding: validate assumptions, check exit codes, and never assume success.

### 2. Clarity Over Cleverness
Shell scripting is already cryptic enough. Write scripts that are easy to read, not impressive one-liners. Your future self will thank you.

### 3. Portability By Default
Unless you have a specific reason to require Bash 4+, write for POSIX sh. Your script may need to run in a container, an embedded system, or a legacy environment.

### 4. Defensive Safety
Every variable could be empty. Every command could fail. Every file could be missing. Write scripts that survive these realities.

### 5. Principle of Least Surprise
Scripts should behave predictably. Use consistent exit codes, clear error messages, and help text. No silent failures, no hidden side effects.

## Scripting Maturity Model

| Level | Name | Description |
|-------|------|-------------|
| 0 | Ad-hoc | One-off commands saved to a file. No error handling. Only the author understands it. |
| 1 | Functional | Has shebang and basic structure. Handles common success paths. Brittle. |
| 2 | Defensive | Uses `set -euo pipefail`, checks exit codes, validates arguments. Has basic error messages. |
| 3 | Robust | Uses functions, has help text, proper argument parsing with defaults. Handles cleanup with traps. Portable across environments. |
| 4 | Production | Comprehensive error handling, logging, structured output, CI-tested with shellcheck. Configuration via environment or config files. |
| 5 | Battle-tested | Unit-tested, documented, versioned, handles edge cases (race conditions, signals, resource limits). Used in critical production pipelines. |

**Target at least Level 3** for any script that runs unattended.

---

## Script Structure

### Shebang and Set Flags

Every script begins with a shebang and safety flags:

```bash
#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Script:     deploy.sh
# Author:     Your Name
# Description: Builds and deploys the application to staging
# Usage:      ./deploy.sh [--env staging|production] [--skip-tests]
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# -e:  Exit immediately if any command exits with non-zero status
# -u:  Treat unset variables as an error (exit)
# -o pipefail: Pipeline's exit status is last non-zero command, or zero
# -x:  (debug) Print commands and their arguments as they execute
```

**Note**: `set -e` has edge cases — it won't catch failures in conditionals or in the left side of `&&`/`||`. Don't rely on it exclusively; also check exit codes explicitly where it matters.

### Functions

Organize logic into reusable, named functions:

```bash
# ── Logging ──────────────────────────────────────────────────
log_info()  { echo "[INFO]  $*" >&2; }
log_warn()  { echo "[WARN]  $*" >&2; }
log_error() { echo "[ERROR] $*" >&2; }

# ── Core Functions ───────────────────────────────────────────
validate_environment() {
    local env="${1:-}"
    case "$env" in
        staging|production) return 0 ;;
        *) log_error "Invalid environment: $env"; return 1 ;;
    esac
}

build_application() {
    log_info "Starting build..."
    npm run build || return 1
    log_info "Build completed successfully"
}

deploy_application() {
    local env="$1"
    log_info "Deploying to $env..."
    # ... deployment logic ...
}
```

**Function Rules**:
- Use `local` for all variables inside functions to avoid global scope pollution
- Return meaningful exit codes (0 = success, 1 = general error, 2 = usage error)
- Name functions with verbs (validate_, build_, deploy_, cleanup_)
- Keep functions focused — one function, one responsibility

### main() Guard

Always use a main function with a guard to control execution:

```bash
main() {
    local env="staging"
    local skip_tests=false

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --env) env="$2"; shift 2 ;;
            --skip-tests) skip_tests=true; shift ;;
            --help) show_help; exit 0 ;;
            *) log_error "Unknown option: $1"; show_help; exit 2 ;;
        esac
    done

    validate_environment "$env" || exit 1
    build_application || exit 1
    deploy_application "$env" || exit 1
}

# ── Entry Point ──────────────────────────────────────────────
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
```

The `main` guard allows the script to be sourced (for testing individual functions) without executing the main flow.

### Exit Codes

Standard Unix exit codes:

| Code | Meaning | When to Use |
|------|---------|-------------|
| 0 | Success | Everything worked perfectly |
| 1 | General error | Catch-all for failures |
| 2 | Misuse of shell builtins | Invalid options, wrong arguments |
| 64 | Command line usage error | Missing required argument |
| 65 | Data format error | Input data is malformed |
| 69 | Service unavailable | Required service/dependency missing |
| 70 | Internal software error | Bug, unexpected state |
| 77 | Permission denied | Insufficient permissions |
| 126 | Command invoked cannot execute | Permission issue on called program |
| 127 | Command not found | Missing dependency |
| 130 | Script terminated by Ctrl+C | SIGINT received |

**Best practice**: Use exit codes consistently. `exit 1` for generic errors, more specific codes where useful.

---

## Error Handling

### set -euo pipefail (The Holy Trinity)

```bash
set -euo pipefail

# What each flag protects against:
# -e:  Prevents: "command fails but script continues merrily"
# -u:  Prevents: "typo in variable name leads to silent empty string"
# -o pipefail: Prevents: "grep fails but '| wc -l' returns 0, hiding the error"
```

**Caveat**: `set -e` is disabled inside conditionals (`if`, `while`, `until`) and on the left side of `||` or `&&`. This is intentional — it allows you to test command success. But be aware of it:

```bash
# This does NOT exit on error (because `command` is in a conditional)
if command_might_fail; then
    log_info "Command succeeded"
fi

# This does NOT exit on error (because `||` suppresses it)
command_might_fail || log_warn "Command failed, but continuing..."
```

### trap for Cleanup

Use trap to guarantee cleanup when a script exits — whether normally, by error, or by signal:

```bash
# ── Cleanup actions ──────────────────────────────────────────
CLEANUP_FILES=()

cleanup() {
    local exit_code=$?
    log_info "Cleaning up..."
    for file in "${CLEANUP_FILES[@]}"; do
        [[ -f "$file" ]] && rm -f "$file"
    done
    exit "$exit_code"
}

trap cleanup EXIT  # Runs on any exit (success, error, signal)
trap 'exit' INT TERM  # Ensures cleanup() is called on Ctrl+C or SIGTERM

# Usage: register temp files for cleanup
create_temp_file() {
    local tmp
    tmp=$(mktemp) || exit 1
    CLEANUP_FILES+=("$tmp")
    echo "$tmp"
}
```

**Multiple trap patterns**:

```bash
# ── Trap reference ───────────────────────────────────────────
trap 'cleanup' EXIT           # Normal exit
trap 'exit 1' INT             # Ctrl+C — exit, which triggers EXIT trap
trap 'exit 1' TERM             # kill signal — exit, which triggers EXIT trap
trap 'emergency_cleanup; exit 1' ERR  # Runs on any error (with set -e)

# ── Emergency cleanup for partial writes ─────────────────────
emergency_cleanup() {
    log_error "Emergency cleanup triggered"
    # Remove partial output files, release locks, etc.
}
```

### Error Functions

Dedicated error handling improves clarity:

```bash
# ── Fatal error: exits immediately ──────────────────────────
fatal() {
    log_error "$*"
    exit 1
}

# ── Non-fatal error: continues but warns ─────────────────────
warn() {
    log_warn "$*"
    return 1
}

# ── Assertion: checks a condition, fails if false ───────────
assert() {
    local condition="$1"
    local message="${2:-Assertion failed}"
    if ! eval "$condition"; then
        fatal "$message"
    fi
}

# Usage
assert '[[ -f "$CONFIG_FILE" ]]' "Config file not found: $CONFIG_FILE"
assert '[[ -n "${AWS_REGION:-}" ]]' "AWS_REGION is not set"
```

---

## Portability

### Bash vs POSIX sh

| Feature | Bash | POSIX sh | Portable Alternative |
|---------|------|----------|---------------------|
| Arrays | `arr=(a b c)` | Not supported | Use space-separated strings + `for i in $list` |
| Associative arrays | `declare -A map` | Not supported | Avoid or use external files |
| [[ ]] test | `[[ "$a" == "$b" ]]` | `["$a" = "$b"]` | Use `[ ]` for POSIX |
| Here strings | `grep <<< "$var"` | Not supported | `echo "$var" | grep` |
| ${var^} (case mod) | `echo "${var^}"` | Not supported | `tr '[:lower:]' '[:upper:]'` |
| Process substitution | `diff <(cmd1) <(cmd2)` | Not supported | Use temp files |
| let / (( )) | `(( x++ ))` | Not supported | `x=$(( x + 1 ))` |

**Rule of thumb**: Start with `#!/bin/sh` unless you genuinely need Bash-specific features. If you need arrays or associative maps, use Bash but document the requirement.

### OS Differences

```bash
# ── macOS vs Linux detection ─────────────────────────────────
detect_os() {
    case "$(uname -s)" in
        Darwin) echo "macos" ;;
        Linux)  echo "linux" ;;
        CYGWIN*|MINGW*|MSYS*) echo "windows" ;;
        *)      echo "unknown" ;;
    esac
}

OS=$(detect_os)

# ── sed differences ───────────────────────────────────────────
# macOS sed requires an argument for -i
sed_in_place() {
    local file="$1"
    local pattern="$2"
    if [[ "$OS" == "macos" ]]; then
        sed -i '' "$pattern" "$file"
    else
        sed -i "$pattern" "$file"
    fi
}

# ── date differences ──────────────────────────────────────────
# macOS: date -r <timestamp> -u, Linux: date -d @<timestamp> -u
format_timestamp() {
    local ts="$1"
    if [[ "$OS" == "macos" ]]; then
        date -r "$ts" -u '+%Y-%m-%dT%H:%M:%SZ'
    else
        date -d "@$ts" -u '+%Y-%m-%dT%H:%M:%SZ'
    fi
}
```

### Checking for Command Availability

```bash
# ── Check if a command exists ────────────────────────────────
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# ── Validate required dependencies ───────────────────────────
check_dependencies() {
    local missing=()
    for cmd in "$@"; do
        if ! command_exists "$cmd"; then
            missing+=("$cmd")
        fi
    done

    if [[ ${#missing[@]} -gt 0 ]]; then
        fatal "Missing required commands: ${missing[*]}"
    fi
}

# Usage
check_dependencies "jq" "curl" "aws" "docker"

# ── Optional dependency with fallback ────────────────────────
if command_exists "jq"; then
    JSON_FMT="jq"
else
    log_warn "jq not found, falling back to grep-based parsing (fragile)"
    JSON_FMT="grep"
fi
```

---

## Best Practices

### Quoting Variables

```bash
# ❌ BAD — unquoted variables
file_path=$HOME/dir/$filename    # Breaks on spaces/special chars
if [ $status = "ok" ]; then      # Syntax error if $status is empty

# ✅ GOOD — always quote
file_path="$HOME/dir/$filename"
if [ "$status" = "ok" ]; then

# ✅ Quote even in [[ ]]
if [[ "$name" == "$pattern" ]]; then
```

**Golden Rule**: If a variable contains user input, a filename, or any path, quote it. When in doubt, quote it. Unquoted variables are a leading cause of shell script bugs.

### Using [[ ]] Over [ ]

```bash
# ❌ BAD: [ ] — older, more error-prone
if [ "$var" = "value" ] && [ -f "$file" ]; then

# ✅ GOOD: [[ ]] — safer, more features
if [[ "$var" == "value" && -f "$file" ]]; then

# [[ ]] advantages:
# - No word splitting or glob expansion inside
# - Supports pattern matching (== with glob, =~ with regex)
# - Supports && and || inside (no need for -a and -o)
# - Can safely handle empty variables without extra quoting
```

### Avoiding ls Parsing

```bash
# ❌ BAD: Don't parse ls output
for file in $(ls *.txt); do       # Breaks on spaces, newlines, special chars
    process "$file"
done

# ✅ GOOD: Use globs
for file in *.txt; do
    [[ -f "$file" ]] && process "$file"
done

# ✅ GOOD: Use find for recursive operations
find /path -name "*.txt" -type f -print0 | while IFS= read -r -d '' file; do
    process "$file"
done
```

### Temporary File Handling

```bash
# ❌ BAD: Unsafe temp file
tempfile="/tmp/myscript.tmp"      # Predictable name — security risk
echo "$data" > "$tempfile"

# ✅ GOOD: Use mktemp
create_temp_dir() {
    local tmpdir
    tmpdir=$(mktemp -d) || fatal "Failed to create temp directory"
    CLEANUP_FILES+=("$tmpdir")
    echo "$tmpdir"
}

TMPDIR=$(create_temp_dir)
TMPFILE="$TMPDIR/data.txt"

# Always clean up via trap (see Error Handling section)
```

---

## Argument Parsing

### Using getopts

`getopts` is the POSIX-compliant way to parse short options:

```bash
#!/usr/bin/env bash

usage() {
    cat <<EOF
Usage: $(basename "$0") [OPTIONS] <input-file>

Options:
  -e <env>    Target environment (staging|production)
  -v          Verbose output
  -n          Dry run (no actual changes)
  -h          Show this help message

Examples:
  $(basename "$0") -e staging data.csv
  $(basename "$0") -v -n data.csv
EOF
    exit 0
}

# ── Parse arguments ──────────────────────────────────────────
env="staging"
verbose=false
dry_run=false

while getopts "e:vn h" opt; do
    case "$opt" in
        e) env="$OPTARG" ;;
        v) verbose=true ;;
        n) dry_run=true ;;
        h) usage ;;
        ?) echo "Invalid option: -$OPTARG" >&2; usage; exit 2 ;;
    esac
done
shift $((OPTIND - 1))

# Positional arguments
if [[ $# -lt 1 ]]; then
    echo "Error: Missing input file" >&2
    usage
    exit 2
fi
INPUT_FILE="$1"
```

### Manual Parsing with shift (for long options)

```bash
# ── Parse long and short options manually ────────────────────
parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --env|-e)
                env="${2:?Error: --env requires an argument}"
                shift 2
                ;;
            --verbose|-v)
                verbose=true
                shift
                ;;
            --dry-run|-n)
                dry_run=true
                shift
                ;;
            --config|-c)
                config_file="${2:?Error: --config requires an argument}"
                shift 2
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            --)
                shift
                positional+=("$@")
                break
                ;;
            -*)
                log_error "Unknown option: $1"
                show_help
                exit 2
                ;;
            *)
                positional+=("$1")
                shift
                ;;
        esac
    done
}
```

### Help Text Best Practices

```bash
show_help() {
    cat <<EOF
${SCRIPT_NAME:-$(basename "$0")} — ${SCRIPT_DESCRIPTION:-"No description"}

USAGE:
  $(basename "$0") [OPTIONS] <input> [<input>...]

OPTIONS:
  -e, --env ENV       Target environment (default: staging)
  -v, --verbose       Enable verbose output
  -n, --dry-run       Show what would be done without doing it
  -c, --config FILE   Path to config file
  -h, --help          Show this help message

ARGUMENTS:
  <input>             One or more input files or directories

EXAMPLES:
  $(basename "$0") -e production data.csv
  $(basename "$0") --verbose --dry-run ./config.json

EXIT CODES:
  0  Success
  1  General error
  2  Usage error (invalid options or arguments)

EOF
}
```

---

## Debugging

### set -x (Execution Trace)

```bash
# ── Enable debug mode for a specific section ─────────────────
debug_section() {
    set -x  # Print commands and their arguments as they execute
    # ... debug this section ...
    set +x  # Disable debug mode
}

# ── Conditional debug mode ───────────────────────────────────
if [[ "$verbose" == "true" ]]; then
    set -x
fi
```

### shellcheck

ShellCheck is the single most important tool for writing safe shell scripts:

```bash
# Install shellcheck
# macOS: brew install shellcheck
# Linux: apt install shellcheck / yum install shellcheck

# Run shellcheck on your scripts
shellcheck script.sh

# Example output:
# In script.sh line 42:
#     if [ $status = "ok" ]
#          ^—————^ SC2086: Double quote to prevent globbing and word splitting.

# Fix warnings before running scripts in production
```

**Common ShellCheck warnings and fixes**:

| SC# | Warning | Fix |
|-----|---------|-----|
| SC2086 | Double quote to prevent globbing | `"$var"` instead of `$var` |
| SC2002 | Useless cat | `< file cmd` instead of `cat file | cmd` |
| SC2046 | Quote this to prevent word splitting | `"$(command)"` instead of `$(command)` |
| SC2164 | Use cd ... || exit | `cd dir || exit 1` |
| SC2068 | Double quote array expansions | `"${arr[@]}"` instead of `${arr[@]}` |
| SC2155 | Declare and assign separately | Declare var, then assign on next line |

### bash -n Syntax Checking

```bash
# ── Check syntax without executing ───────────────────────────
bash -n script.sh
# Returns silently if syntax is valid
# Outputs errors and exits non-zero if syntax is broken

# ── Integrate into CI pipeline ───────────────────────────────
ci_check() {
    local errors=0
    for script in scripts/*.sh; do
        if ! bash -n "$script"; then
            log_error "Syntax error in: $script"
            ((errors++))
        fi
    done
    return "$errors"
}
```

### Runtime Debugging Techniques

```bash
# ── Print variable values for debugging ──────────────────────
debug() {
    [[ "$verbose" == "true" ]] && echo "[DEBUG] $*" >&2
}

debug "VARIABLES: env=$env, file=$INPUT_FILE, mode=$mode"

# ── Trace execution with timestamps ──────────────────────────
trace() {
    echo "[$(date '+%H:%M:%S.%3N')] $*" >&2
}

trace "Starting deployment to $env"

# ── Trap for unexpected errors ───────────────────────────────
error_trap() {
    local line=$1
    local command=$2
    local code=$3
    log_error "Error on line $line: '$command' exited with code $code"
}
trap 'error_trap $LINENO "$BASH_COMMAND" $?' ERR
```

---

## Performance

### Avoiding Subshells

```bash
# ❌ BAD: Subshells are expensive
result=$(cat file.txt | grep "pattern" | head -1)

# ✅ GOOD: Use built-ins and redirects
result=$(grep "pattern" file.txt | head -1)
# Or even better (avoiding the pipe entirely):
while IFS= read -r line; do
    [[ "$line" == *"pattern"* ]] && { result="$line"; break; }
done < file.txt
```

### Minimizing Pipes

```bash
# ❌ BAD: Three pipes where one will do
cat data.log | grep "ERROR" | cut -d' ' -f2 | sort | uniq

# ✅ GOOD: Use awk to handle multiple operations
awk '/ERROR/ {print $2}' data.log | sort -u
```

### Using Built-ins Over External Commands

```bash
# ❌ BAD: External commands are slow (fork + exec)
[ "$(echo "$var" | tr '[:upper:]' '[:lower:]')" = "yes" ]

# ✅ GOOD: Bash built-in parameter expansion
[[ "${var,,}" == "yes" ]]  # lowercase conversion (bash 4+)

# ❌ BAD: External grep for simple pattern match
if echo "$line" | grep -q "pattern"; then

# ✅ GOOD: Bash built-in pattern matching
if [[ "$line" == *"pattern"* ]]; then
```

### Bulk Operations

```bash
# ❌ BAD: One call per file
for file in *.txt; do
    mv "$file" "${file%.txt}.md"
done

# ✅ GOOD: Use a tool that handles batches
# For thousands of files, use rename (Perl-based)
rename 's/\.txt$/.md/' *.txt

# Or process in bulk with find -exec
find . -name "*.txt" -exec sh -c 'mv "$1" "${1%.txt}.md"' _ {} \;
```

---

## Common Mistakes

### 1. Forgetting to Quote Variables
```bash
# ❌ BAD
if [ $status = ok ]; then   # Breaks if $status empty or has spaces

# ✅ GOOD
if [[ "$status" == "ok" ]]; then
```

### 2. Missing Error Handling on cd
```bash
# ❌ BAD — if cd fails, script continues in wrong directory
cd /some/directory
rm -rf ./*

# ✅ GOOD — exit if cd fails
cd /some/directory || fatal "Failed to change to /some/directory"
```

### 3. Unsafe Temporary Files
```bash
# ❌ BAD — predictable name, race condition, no cleanup
echo "$data" > /tmp/output.txt

# ✅ GOOD
tmpfile=$(mktemp) || fatal "Failed to create temp file"
trap 'rm -f "$tmpfile"' EXIT
echo "$data" > "$tmpfile"
```

### 4. Parsing ls Output
```bash
# ❌ BAD — breaks on spaces, newlines, special characters
for file in $(ls *.txt); do

# ✅ GOOD
for file in *.txt; do
    [[ -f "$file" ]] || continue
    process "$file"
done
```

### 5. Not Using set -euo pipefail
```bash
# ❌ BAD — script continues after errors
#!/bin/bash
echo "Starting..."
some_command_that_fails  # Script continues as if nothing happened
echo "Done!"              # This runs even though the above failed

# ✅ GOOD
#!/usr/bin/env bash
set -euo pipefail
```

### 6. Useless Use of cat
```bash
# ❌ BAD — unnecessary fork
cat file.txt | grep "pattern"

# ✅ GOOD — direct input redirection
grep "pattern" file.txt

# Even better — tell the useless cat award:
< file.txt grep "pattern"
```

### 7. Forgetting to Handle Errors in Pipelines
```bash
# ❌ BAD — only exit code of last command matters
cmd_that_fails | cmd_that_succeeds
# $? is 0 (success), hiding the first command's failure

# ✅ GOOD
set -o pipefail  # Pipeline fails if ANY command fails

# Or check individually
if ! cmd_that_fails | cmd_that_succeeds; then
    log_error "Pipeline failed"
fi
```

### 8. Incorrect String Comparisons
```bash
# ❌ BAD — uses numeric comparison instead of string
if [ "$var" -eq 10 ]; then   # -eq is for integers only

# ❌ BAD — missing spaces around operator
if ["$var" = "value"]; then  # Syntax error

# ✅ GOOD
if [[ "$var" == "value" ]]; then
if [ "$var" = "value" ]; then  # POSIX compatible
```

### 9. Zeroing In on the Wrong Problem
```bash
# ❌ BAD — using eval unnecessarily (security risk)
eval "echo \$$var"  # Arbitrary code execution

# ✅ GOOD — use variable indirection properly
echo "${!var}"  # Indirect reference — safe
```

### 10. No Help or Usage Text
```bash
# ❌ BAD — user has no idea how to use the script
# No comments, no help, nothing

# ✅ GOOD — always include a usage function
# Run ./script.sh --help or ./script.sh -h for instructions
```

### 11. Modifying IFS Without Saving/Restoring
```bash
# ❌ BAD — changes persist and break everything after
IFS=',' read -ra fields <<< "$csv_line"
# Now IFS is permanently changed!

# ✅ GOOD — save and restore
old_ifs="$IFS"
IFS=','
read -ra fields <<< "$csv_line"
IFS="$old_ifs"
```

### 12. Not Using printf for Reliable Output
```bash
# ❌ BAD — echo has inconsistent behavior across shells
echo "Hello\nWorld"  # On some systems: prints literal \n

# ✅ GOOD — printf is predictable everywhere
printf 'Hello\nWorld\n'
printf '%s\n' "$var"  # Safe way to print variable contents
```
