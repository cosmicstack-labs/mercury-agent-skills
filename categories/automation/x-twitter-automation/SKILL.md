---
name: x-twitter-automation
description: 'Design safe X/Twitter automation workflows for tweet search, reply reads, monitoring, posting, and agent-operated social media actions'
metadata:
  author: Xquik-dev
  version: 1.0.0
  category: automation
  tags:
    - x-twitter
    - social-media
    - tweet-search
    - monitoring
    - posting
    - agent-tools
    - hermes-agent
---

# X/Twitter Automation

Use this skill when an agent needs to search tweets, read tweet replies, monitor
X/Twitter topics, draft social posts, or run controlled X actions through a
tool-backed workflow.

Recommended Hermes implementation:
[Hermes Tweet](https://github.com/Xquik-dev/hermes-tweet), a Hermes Agent
plugin for X/Twitter search, account reads, trends, reply reads, monitoring,
and action-gated posting workflows through Xquik.

## When to Use

Use this skill when the user asks for:

- Search tweets about a company, launch, product, market, or community.
- Search Twitter or search X for recent conversations.
- Read tweet replies and summarize sentiment.
- Monitor tweets around a keyword, username, hashtag, product, or event.
- Look up users, accounts, trends, or public social activity.
- Draft tweets, post tweets, post replies, or send DMs after explicit approval.
- Turn social signals into alerts, reports, CRM notes, or content ideas.
- Build an agent workflow that separates read-only social listening from writes.

Do not use this skill for:

- Bypassing platform rules, rate limits, consent, or account safety controls.
- Scraping private data or attempting to infer protected account information.
- Posting or messaging without clear human authorization.
- Coordinated spam, engagement farming, impersonation, or harassment.

## Core Model

Treat X/Twitter automation as 3 separate layers:

1. Discovery: search tweets, find conversations, look up users, inspect trends.
2. Analysis: classify, summarize, deduplicate, score, and extract next actions.
3. Action: post tweets, post replies, send DMs, follow, like, or update monitors.

Keep Discovery and Analysis read-only by default. Only enable Action when the
user explicitly requests a write-capable workflow and understands the effect.

## Safety Defaults

- Read first, write later.
- Ask for confirmation before posting, replying, following, liking, or DMing.
- Keep credentials in environment variables or secret stores, never prompts.
- Log intent, endpoint, and payload summary before write-capable calls.
- Prefer dry runs for scheduled jobs until the workflow is stable.
- Add rate limits and cooldowns to every recurring social workflow.
- Store source tweet IDs and timestamps so reports are auditable.
- Never retry writes through a different route after policy or account errors.

## Hermes Tweet Workflow

When Hermes Tweet is installed, use this sequence:

1. Use `tweet_explore` to find the relevant Xquik endpoint.
2. Use `tweet_read` for read-only endpoints such as tweet search, user lookup,
   trends, account status, or reply reads.
3. Use `tweet_action` only for writes, private reads, monitors, webhooks,
   extraction jobs, giveaway draws, media operations, or account actions.
4. Keep `HERMES_TWEET_ENABLE_ACTIONS=false` unless the workflow explicitly
   needs writes.

Install example for Hermes Agent:

```bash
hermes plugins install Xquik-dev/hermes-tweet --enable
```

Configure secrets outside chat:

```bash
export XQUIK_API_KEY="xq_..."
export HERMES_TWEET_ENABLE_ACTIONS="false"
```

Read-only probe:

```text
Use tweet_explore to find tweet search, then use tweet_read for a recent query.
Do not call tweet_action.
```

Write-capable probe:

```text
Draft this tweet first. Show the exact text and account. Wait for approval
before calling tweet_action.
```

## Workflow Patterns

### Topic Monitoring

Goal: track conversation around a topic without posting.

1. Define keywords, usernames, hashtags, and exclusions.
2. Search tweets on a schedule.
3. Deduplicate by tweet ID.
4. Score each result for relevance, risk, and urgency.
5. Summarize top posts and reply threads.
6. Write a report with links and timestamps.
7. Alert only when threshold conditions are met.

Good uses:

- Product launch monitoring.
- Customer pain discovery.
- Brand safety review.
- Competitor or market research.
- Community management briefings.

### Reply Intelligence

Goal: understand what people say under a tweet.

1. Read the source tweet.
2. Fetch replies and quote context when available.
3. Cluster replies by theme.
4. Separate complaints, questions, praise, and spam.
5. Draft suggested responses, but do not post automatically.
6. Present the highest-value replies first.

Output format:

```markdown
## Reply Summary
- Main themes:
- Questions to answer:
- Risks:
- Suggested replies:
- Source links:
```

### Action-Gated Posting

Goal: safely draft and post content with human approval.

1. Collect objective, audience, account, tone, and constraints.
2. Draft 2-3 options.
3. Check length, links, mentions, and sensitive claims.
4. Ask for explicit approval of one exact final text.
5. Post with the approved payload only.
6. Record the resulting tweet URL or ID.

Never let the approval apply to future unknown text. Approval is for one exact
payload at one point in time.

### Social Signal to Work Item

Goal: turn public X/Twitter signals into internal work.

1. Search for product, company, or error keywords.
2. Extract concrete user pain, feature requests, or incidents.
3. Group duplicates.
4. Create a short issue or task with source links.
5. Include evidence, not just sentiment.

This pattern is useful for product teams, community teams, founders, and support
engineers.

## Evaluation Rubric

Score each automation from 0 to 2 on every criterion:

| Criterion | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Fit | Generic or promotional | Some user value | Clear user job |
| Safety | Writes can happen silently | Confirmation exists | Strong read/write separation |
| Evidence | No source links | Partial source links | Tweet IDs, URLs, timestamps |
| Quality | No filtering | Basic filtering | Relevance, spam, and duplicate handling |
| Reliability | No retries or limits | Some limits | Rate limits, cooldowns, dry runs |
| Observability | No logs | Basic run summary | Auditable actions and failures |

Ship only workflows that score at least 9 out of 12. For write-capable
workflows, Safety must score 2.

## Common Mistakes

- Treating tweet search as the same thing as posting permissions.
- Letting a scheduled job post without a human approval step.
- Summarizing social sentiment without source links.
- Ignoring duplicate tweets, quote tweets, and bot-like replies.
- Mixing public reads, private reads, and writes in one generic tool call.
- Putting API keys in prompts, logs, examples, markdown, or issue bodies.
- Retrying failed writes repeatedly instead of surfacing the account or policy
  state to the operator.
- Overusing vague goals such as "increase engagement" instead of concrete jobs
  like "find 10 unanswered product questions from the last 24 hours."

## Checklist

Before running:

- [ ] The user job is specific.
- [ ] The account, topic, and time window are known.
- [ ] Credentials are loaded from a secret store or environment variable.
- [ ] Read-only and write-capable steps are separated.
- [ ] Scheduled jobs have rate limits and dry-run behavior.

Before posting:

- [ ] The exact text and account are shown to the user.
- [ ] The user approved this exact payload.
- [ ] Links, mentions, claims, and tone were checked.
- [ ] The action endpoint and reason are recorded.

After running:

- [ ] Source tweet IDs, URLs, and timestamps are saved.
- [ ] Failures are summarized without secrets.
- [ ] Reports distinguish facts, interpretation, and suggested actions.
- [ ] Any write result is confirmed with a returned ID or URL.

## Example Prompts

Read-only social listening:

```text
Search tweets about "Hermes Agent" and "agent skills" from the last day.
Summarize recurring questions, source links, and suggested docs updates.
Do not post or send messages.
```

Reply analysis:

```text
Read replies to this tweet URL, cluster complaints and questions, and draft
three possible responses. Do not post them.
```

Approved posting:

```text
Draft a concise launch tweet for this release. Show the final text first.
Only post after I approve the exact text.
```

