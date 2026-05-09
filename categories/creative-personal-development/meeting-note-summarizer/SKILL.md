---
name: meeting-note-summarizer
description: Transforms messy meeting transcripts, notes, or voice memos into structured summaries with clear action items, decisions, and key takeaways. Designed for freelancers, remote teams, and solopreneurs who need to extract signal from hours of meetings.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: creative-personal-development
  tags:
    - meeting-notes
    - summarization
    - productivity
    - action-items
    - remote-work
    - async-communication
---

# Meeting Note Summarizer

## What It Does

Takes raw meeting notes, voice transcripts, or bullet-point jumbles and turns them into clean, structured summaries organized by: **Decisions**, **Action Items**, **Key Discussion Points**, and **Next Steps**. No more digging through pages of notes to find what was actually decided.

---

## Output Structure

Every summary follows this template (adapted based on meeting type):

```
┌─────────────────────────────────────────┐
│         MEETING SUMMARY                 │
│  Topic: [Meeting Title]                 │
│  Date: [Date]                           │
│  Duration: [Duration]                   │
│  Participants: [People]                 │
├─────────────────────────────────────────┤
│                                         │
│  🎯 DECISIONS                           │
│  • [What was decided]                   │
│  • [Rationale if stated]                │
│                                         │
│  ✅ ACTION ITEMS                        │
│  • [Task] → [Owner] → [Deadline]       │
│  • [Task] → [Owner] → [Deadline]       │
│                                         │
│  💬 KEY DISCUSSION POINTS               │
│  • [Topic 1 — 1-2 sentence summary]     │
│  • [Topic 2 — 1-2 sentence summary]     │
│                                         │
│  ⏭️ NEXT STEPS                          │
│  • [Follow-up action]                   │
│  • [Next meeting date / check-in]       │
│                                         │
│  📎 ATTACHMENTS / REFERENCES            │
│  • [Links, docs, resources mentioned]   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Meeting Types & Custom Formats

### 1. Client Call

| Section | Focus |
|---------|-------|
| **Client Status** | How is the client feeling? Satisfied, concerned, urgent? |
| **Scope Changes** | Any new requests, changes, or scope creep? |
| **Feedback** | What did they approve or reject? |
| **Deliverables Due** | What are you committing to deliver? |

### 2. Brainstorming / Creative Session

| Section | Focus |
|---------|-------|
| **Ideas Generated** | List all ideas, however rough |
| **Themes** | Patterns across ideas |
| **Promising Directions** | Which ideas have energy behind them? |
| **Killed Ideas** | What was ruled out and why? |
| **Next Experiment** | What should be tested/prototyped? |

### 3. 1:1 / Coaching Call

| Section | Focus |
|---------|-------|
| **Check-In** | How is the person doing? |
| **Challenges Shared** | What's blocking them? |
| **Advice Given** | What guidance was offered? |
| **Accountability** | What did they commit to trying? |

### 4. Standup / Daily Sync (see also: Daily Standup skill)

| Section | Focus |
|---------|-------|
| **Completed** | What shipped since last sync |
| **In Progress** | What's being actively worked on |
| **Blockers** | What's stuck and who can help |
| **Plan** | What's next |

---

## Trigger Phrases

| Phrase | Action |
|--------|--------|
| "Summarize these notes..." | Takes raw text → structured summary |
| "Here are my meeting notes..." | Parses, organizes, and returns clean summary |
| "Extract action items from..." | Returns only the ✅ Action Items section |
| "What did we decide in..." | Surfaces decisions only |
| "Turn this transcript into..." | Full meeting summary from raw transcript |
| "Client call notes..." | Applies client call format |
| "Brainstorm session notes..." | Applies creative session format |
| "Make this shorter..." | Condenses — 1 sentence per section max |

---

## Step-by-Step Instructions

### Step 1: Receive Input

Accept notes in any format:
- Raw transcript text
- Bullet-point jumble
- Voice memo transcription
- Scattered chat messages
- Existing messy notes

### Step 2: Classify Meeting Type

| Signal | Type |
|--------|------|
| Client, deliverable, feedback | Client Call |
| Ideas, concepts, "what if" | Brainstorm |
| Status, blockers, standup | Standup |
| How are you, coaching, growth | 1:1 / Coaching |
| General | Standard |

If unclear → ask: "What kind of meeting was this?"

### Step 3: Extract Core Categories

Parse the input and tag each sentence/clause into:

1. **Decisions** — "We decided to..."
2. **Action Items** — "I'll send the draft by Friday"
3. **Discussion Points** — "We talked about pricing tiers"
4. **Questions Raised** — "Should we pivot to subscription?"
5. **Context / Background** — "The client's budget was approved"

### Step 4: Structure the Summary

Apply the output template. Use:
- **Action items** → Bold owner + deadline format
- **Decisions** → Bullet points with rationale
- **Discussion** → 1-2 sentence summaries per topic, not verbatim

### Step 5: Flag Missed Items

If the notes are ambiguous, call it out:
- ⚠️ "No clear deadline for the design handoff"
- ⚠️ "Unclear who owns the follow-up with the client"
- ⚠️ "No next meeting scheduled"

### Step 6: Provide a TL;DR

For long meetings (45min+), lead with a one-sentence TL;DR:

> **TL;DR**: Client approved the Q2 campaign direction. You need to deliver the creative brief by Thursday and schedule a follow-up for next Tuesday.

---

## Examples

### Example 1: Messy Notes → Clean Summary

> **Raw Input**:
> "meeting with sarah about the website redesign. she likes the new hero section but thinks the CTA is too small. we need to make it bigger and maybe red. also the testimonial section needs real photos not stock. she'll send us the client photos by wed. i need to update the mockup by friday. we decided to drop the animations page since it's out of scope. next meeting next tuesday?"
>
> **Output**:
> ```
> ┌─────────────────────────────────────────┐
> │         MEETING SUMMARY                 │
> │  Topic: Website Redesign Feedback       │
> │  With: Sarah (Client)                   │
> │  Duration: ~30 min                      │
> ├─────────────────────────────────────────┤
> │                                         │
> │  🎯 DECISIONS                           │
> │  • Drop the animations page (out of scope) │
> │                                         │
> │  ✅ ACTION ITEMS                        │
> │  • Sarah sends client photos → **Sarah** → **Wed** │
> │  • Update mockup (larger CTA, real photos) → **You** → **Fri** │
> │                                         │
> │  💬 KEY DISCUSSION POINTS               │
> │  • Hero section approved pending CTA size increase │
> │  • Testimonials need real client photos, not stock │
> │  • Animations page cut from scope       │
> │                                         │
> │  ⏭️ NEXT STEPS                          │
> │  • Next check-in: Next Tuesday           │
> │                                         │
> └─────────────────────────────────────────┘
> ```

### Example 2: Brainstorm Session

> **Raw Input**:
> "brainstorm for new newsletter format. someone suggested a weekly roundup of tools. another idea was a deep dive into one topic per issue. also could do founder interviews. sarah said the roundup might be too generic. mark said deep dive would take too long. we all liked the interview idea. tom will reach out to 3 potential guests. let's test one interview format and see open rates."
>
> **Output**:
> ```
> ┌─────────────────────────────────────────┐
> │      BRAINSTORM: NEWSLETTER FORMAT      │
> │  Participants: Sarah, Mark, Tom, You    │
> ├─────────────────────────────────────────┤
> │                                         │
> │  💡 IDEAS GENERATED                     │
> │  • Weekly tool roundup (killed — too generic) │
> │  • Single deep-dive per issue (killed — too time-heavy) │
> │  • Founder interviews (selected ✅)     │
> │                                         │
> │  ✅ ACTION ITEMS                        │
> │  • Reach out to 3 potential guests → **Tom** → **This week** │
> │  • Draft interview format template → **You** → **Fri** │
> │                                         │
> │  ⏭️ NEXT STEPS                          │
> │  • Tom shares guest shortlist → review together │
> │  • Run 1 test issue → measure open rates │
> │                                         │
> └─────────────────────────────────────────┘
> ```

---

## Pro Tips

- **Capture decisions immediately**: During the meeting, note decisions the moment they're made. Don't wait — you'll forget the rationale.
- **Owners + deadlines = real action**: An action item without a named owner is a wish. An action item without a deadline is a hobby.
- **Flag ambiguity**: If a decision was deferred or a question left unanswered, make that explicit. Don't smooth it over.
- **Send summaries fast**: The value of a meeting summary decays within hours. Send it within 30 minutes of the meeting ending.
- **Tag by project**: Keep a running document per project. Each meeting summary becomes a chapter in an evolving story.
