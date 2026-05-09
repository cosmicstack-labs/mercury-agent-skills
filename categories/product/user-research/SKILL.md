---
name: User Research
description: A comprehensive skill for user research — covering research methods, interview techniques, participant recruitment, synthesis, insight generation, readout formats, and continuous discovery habits. From early generative research to evaluative usability testing.
metadata:
  author: cosmicstack-labs
  version: 1.0.0
  category: product
  tags:
    - user-research
    - generative-research
    - evaluative-research
    - interviews
    - contextual-inquiry
    - affinity-mapping
    - thematic-analysis
    - journey-mapping
    - how-might-we
    - continuous-discovery
    - usability-testing
    - research-synthesis
---

# User Research

## Core Principles

Great user research produces not just data, but decision-grade insights. These principles underpin every effective research practice:

1. **Research without action is entertainment.** Every study should end with a clear "so what" — actionable recommendations that change what you build or how you build it.

2. **Bias is always present.** The best you can do is name it, design around it, and account for it in your analysis. Common biases: confirmation bias, interviewer bias, selection bias, social desirability bias.

3. **Quality over quantity.** Five well-recruited, well-moderated interviews produce more insight than fifty poorly run surveys. Depth beats breadth for generative work.

4. **Triangulate methods.** No single method tells the whole story. Combine qualitative (what people say/do) with quantitative (how many, how often) for robust insights.

5. **Participant comfort is paramount.** Research participants are giving you their time, attention, and vulnerability. Respect that. Make them feel safe, valued, and heard.

6. **Share raw data, not just summaries.** Teams make better decisions when they can watch recordings, read transcripts, and see patterns themselves. Don't gatekeep the data.

7. **Research is a team sport.** Invite engineers, designers, and PMs to observe sessions. Direct exposure to users builds empathy and conviction that second-hand reports cannot match.

---

## Research Maturity Model

Understand your organization's research maturity to identify the right next step.

| Level | Name | Characteristics |
|-------|------|-----------------|
| 1 | Ad-hoc | No dedicated researcher. Decisions based on intuition or stakeholder opinions. Research is reactive and rare. |
| 2 | Foundational | Occasional usability tests and surveys. Research is done but not systematic. Findings may not influence decisions. |
| 3 | Operational | Dedicated research function exists. Research is planned quarterly. Methods are consistent. Findings reach product teams. |
| 4 | Integrated | Research is embedded in every product team. Continuous discovery is practiced. Researchers participate in roadmap decisions. |
| 5 | Strategic | Research drives company strategy. Research-led innovation is standard. The org runs experiments to test strategic hypotheses. |

**Quick self-assessment:** When was the last time a product decision was reversed or changed because of user research? If you can't recall a specific example, you're likely at Level 1 or 2.

---

## Research Methods

### Generative vs. Evaluative Research

| Dimension | Generative | Evaluative |
|-----------|------------|------------|
| Goal | Discover what problems to solve | Validate whether a solution works |
| When | Early, before solutions exist | During or after design/development |
| Questions | "What do users struggle with?" | "Can users complete this task?" |
| Methods | Interviews, diary studies, contextual inquiry | Usability testing, A/B testing, desirability studies |
| Output | Opportunity areas, user needs, personas | Usability issues, satisfaction scores, task success rates |

### Qualitative vs. Quantitative Research

| Dimension | Qualitative | Quantitative |
|-----------|-------------|--------------|
| Sample size | Small (5-30) | Large (100+) |
| Output | Themes, stories, behaviors, motivations | Numbers, statistics, benchmarks |
| Strengths | Deep understanding of "why" | Reliable measurements of "how many" and "how often" |
| Weaknesses | Can't generalize broadly | Lacks context and depth |
| Common methods | Interviews, observations, diary studies | Surveys, analytics, A/B tests |

**Rule of thumb:** Use qualitative to discover *what* matters and *why*. Use quantitative to measure *how much* it matters and to *whom*.

### Method Selection Matrix

| Question you're trying to answer | Recommended method |
|----------------------------------|-------------------|
| What problems do users face? | Generative interviews, diary study |
| How do users currently accomplish X? | Contextual inquiry, diary study |
| Can users complete this flow? | Usability testing (moderated) |
| Which design do users prefer? | A/B test, desirability study |
| How satisfied are users overall? | Survey (e.g., SUS, NPS, CSAT) |
| What language do users use? | Search log analysis, interview transcripts |
| Is the problem big enough to solve? | Survey, analytics, competitive analysis |

---

## Interview Techniques

### Structured Interviews

A fully scripted interview where every question is asked in the same order to every participant.

**When to use:** Large-scale studies where comparability across participants is critical. Late-stage evaluation.

**Pros:** Highly comparable data, lower moderator bias, easier for novice moderators.
**Cons:** Rigid — can't follow interesting threads. Misses serendipitous discoveries.

### Semi-Structured Interviews

A guided conversation with a prepared question framework but the freedom to probe and follow tangents.

**When to use:** Most generative and discovery research. This is the gold standard for most product research.

**Structure:**
1. **Warm-up** (5 min): Build rapport. Explain the purpose. Get consent.
2. **Context** (10 min): Understand their world. Ask about their role, environment, recent experiences.
3. **Deep dive** (20 min): Explore specific behaviors, decisions, and pain points. Use the "last time" technique.
4. **Reflection** (10 min): Have them reflect on ideal experiences, unmet needs, or what they wish existed.
5. **Wrap-up** (5 min): Any final thoughts. Thank them. Explain next steps.

**Probing techniques:**

- **The silence technique:** After the participant finishes speaking, wait 3-5 seconds before asking the next question. They'll often add their most honest thoughts.
- **The "last time" prompt:** "Tell me about the *last* time you did X." Specific recency yields more accurate details than hypotheticals.
- **The five whys:** Keep asking "why" to drill past surface-level answers to root causes.
- **Paraphrasing:** "So if I understand correctly, what happened was..." — confirms understanding and invites correction.
- **Show me:** Instead of "tell me," ask "can you show me how you do that?" — actions reveal more than words.

```python
# Semi-structured interview guide template
def generate_interview_guide(research_questions: list, method: str = "semi_structured") -> dict:
    """
    Generate an interview guide from research questions.
    Maps each research question to specific interview questions.
    """
    guide = {
        "metadata": {
            "method": method,
            "estimated_duration_minutes": 45,
            "created_for": "discovery_round_1"
        },
        "sections": [
            {
                "name": "Warm-up",
                "duration_minutes": 5,
                "purpose": "Build rapport and establish context",
                "questions": [
                    "Tell me a little about your role and what you do day-to-day.",
                    "What tools do you use most frequently in your work?"
                ]
            },
            {
                "name": "Context",
                "duration_minutes": 10,
                "purpose": "Understand current behavior",
                "questions": [
                    "Walk me through the last time you needed to [core activity].",
                    "What was working well? What was frustrating?"
                ]
            },
            {
                "name": "Deep Dive",
                "duration_minutes": 20,
                "purpose": "Explore specific behaviors and motivations",
                "questions": [
                    "Tell me about a time when [specific scenario] happened.",
                    "What did you do next?",
                    "Why was that important to you?"
                ]
            },
            {
                "name": "Reflection",
                "duration_minutes": 10,
                "purpose": "Uncover unmet needs and aspirations",
                "questions": [
                    "If you could wave a magic wand, what would change about this process?",
                    "What have you tried that didn't work?"
                ]
            }
        ],
        "probes": [
            "Can you tell me more about that?",
            "What happened next?",
            "How did that make you feel?",
            "Walk me through that step by step."
        ]
    }
    return guide
```

### Contextual Inquiry

A field research method where you observe users in their natural environment while they work. You ask questions *while* they work.

**Core principles (the four C's):**
1. **Context:** Go to the user's environment. Don't bring them to a lab.
2. **Partnership:** User is the expert; you are the apprentice learning from them.
3. **Focus:** Steer the conversation toward the research questions without breaking the flow.
4. **Interpretation:** Share your observations with the user to validate understanding in real-time.

**When to use:** Understanding complex workflows, physical environments, collaborative tasks, or processes that are hard to articulate from memory.

**Example setup:**

```python
def contextual_inquiry_plan(research_goal: str, participant_role: str) -> dict:
    """
    Plan a contextual inquiry session.
    """
    return {
        "research_goal": research_goal,
        "participant_role": participant_role,
        "session_structure": {
            "introduction": {
                "duration": 10,
                "activities": [
                    "Explain that you're there to learn from them",
                    "Ask them to work as they normally would",
                    "Let them know you may interrupt to ask questions"
                ]
            },
            "observation": {
                "duration": 30,
                "activities": [
                    "Observe silently for 5 minutes initially",
                    "Ask 'what are you doing right now?' frequently",
                    "Ask 'why did you do that?' when interesting moments occur",
                    "Take photos (with permission) of the workspace",
                    "Note tools, artifacts, workarounds"
                ]
            },
            "debrief": {
                "duration": 10,
                "activities": [
                    "Summarize what you observed",
                    "Ask 'is there anything I missed?'",
                    "Thank the participant"
                ]
            }
        },
        "equipment_needed": [
            "Notebook and pen (backup)",
            "Recording device (with consent)",
            "Camera for workspace photos",
            "List of research questions printed"
        ]
    }
```

---

## Recruitment

### Screening

A screener survey filters participants to ensure you talk to the right people.

**Screener best practices:**
- Start broad, narrow down (general demographics → specific behaviors)
- Include trap questions (e.g., "Select 'Agree' for this question") to filter bots
- Ask about *behavior*, not *attitudes* ("How often do you use X?" vs. "Do you like X?")
- Keep it under 10 questions for higher completion rates

```python
# Screener survey data model
class Screener:
    def __init__(self, study_name: str, ideal_participant_profile: dict):
        self.study_name = study_name
        self.profile = ideal_participant_profile  # e.g., {"role": "PM", "company_size": "50-500"}
        self.questions = []
        self.passing_criteria = []

    def add_question(self, question_text: str, question_type: str,
                     options: list = None, passing_answer: str = None):
        self.questions.append({
            "text": question_text,
            "type": question_type,  # multiple_choice, scale, open_text
            "options": options,
            "passing_answer": passing_answer
        })

    def is_qualified(self, responses: dict) -> tuple:
        """
        Returns (qualified: bool, reason: str).
        """
        for q in self.questions:
            if q["passing_answer"] and responses.get(q["text"]) != q["passing_answer"]:
                return False, f"Failed: {q['text']}"
        return True, "Qualified"

    def calculate_qualification_rate(self, all_responses: list) -> float:
        qualified = sum(1 for r in all_responses if self.is_qualified(r)[0])
        return qualified / len(all_responses) if all_responses else 0
```

### Incentives

Incentives must be appropriate for the audience, the time commitment, and the difficulty of recruitment.

| Participant type | 30-min interview | 60-min interview | Diary study (1 week) |
|-----------------|-----------------|------------------|---------------------|
| General consumers | $25-$50 | $50-$100 | $100-$200 |
| Professionals (e.g., PMs, engineers) | $50-$100 | $100-$150 | $200-$300 |
| Executives / Specialists | $100-$200 | $200-$400 | $500+ |
| B2B (enterprise) | $75-$150 | $150-$250 | $300-$500 |

**Pro tip:** Send gift cards within 24 hours of the session. Late incentives damage your recruitment pipeline.

### Sample Size

The right sample size depends on your method and goals.

| Method | Recommended n | Why |
|--------|--------------|-----|
| Generative interviews | 8-15 per segment | Saturation typically occurs around 8-12 interviews |
| Usability testing | 5-8 per test | Nielsen's law: 5 users uncover ~85% of usability issues |
| Survey | 100-400+ per segment | Depends on desired confidence interval and population size |
| Diary study | 8-15 per segment | Attrition is common; overshoot by 20-30% |
| Card sorting | 20-30 per segment | 20+ participants stabilizes the similarity matrix |

**The saturation rule:** Stop recruiting when you stop hearing new things. If interviews 3-5 in a row surface no new themes, you've likely reached saturation.

---

## Synthesis

Synthesis transforms raw data into structured insights. It is the hardest and most valuable part of research.

### Affinity Mapping

A bottom-up synthesis technique where individual observations (notes, quotes, behaviors) are grouped into themes.

**Process:**
1. **Capture:** Write each observation on a sticky note (physical or digital)
2. **Cluster:** Group related notes without forcing categories
3. **Label:** Name each cluster with a descriptive theme
4. **Hierarchy:** Group clusters into higher-level categories
5. **Connect:** Look for relationships between categories
6. **Prioritize:** Identify the most impactful themes

**Tools:** Miro, FigJam, MURAL for digital. Sticky notes and walls for physical.

```python
# Affinity map data structure
class AffinityMap:
    def __init__(self, study_name: str):
        self.study_name = study_name
        self.raw_notes = []      # [(participant_id, note_text, category)]
        self.themes = {}         # {theme_name: [note_indices]}
        self.insights = []       # Synthesized insights

    def add_note(self, participant_id: str, note_text: str, category: str = ""):
        self.raw_notes.append((participant_id, note_text, category))

    def cluster_notes(self, clusters: dict):
        """clusters = {theme_name: [note_index, ...]}"""
        self.themes = clusters

    def generate_insight(self, theme_name: str, insight_text: str, confidence: float):
        self.insights.append({
            "theme": theme_name,
            "insight": insight_text,
            "supporting_notes": self.themes.get(theme_name, []),
            "confidence": confidence
        })

    def get_insights_by_confidence(self, min_confidence: float = 0.7):
        return [i for i in self.insights if i["confidence"] >= min_confidence]
```

### Thematic Analysis

A rigorous, structured approach to identifying patterns in qualitative data. Adapted from Braun & Clarke's 6-phase framework.

**Phases:**
1. **Familiarization:** Read all transcripts. Watch recordings. Immerse yourself.
2. **Initial coding:** Label meaningful segments of data. Code line-by-line or paragraph-by-paragraph.
3. **Theme generation:** Group codes into potential themes. Look for patterns across participants.
4. **Theme review:** Check that themes are coherent and distinct. Merge, split, or discard.
5. **Theme definition:** Name each theme and write a clear definition. Include what it is AND what it is not.
6. **Report writing:** Tell the story. Use quotes to illustrate. Connect themes to research questions.

### Journey Mapping

A journey map visualizes a user's experience over time — capturing actions, thoughts, emotions, and pain points.

**Components of a good journey map:**
- **Lens:** Who is this journey for? (a specific persona or segment)
- **Scenario:** What situation or goal drives this journey?
- **Phases:** The high-level stages (e.g., Discover, Evaluate, Purchase, Use, Support)
- **Actions:** What the user does in each phase
- **Thoughts:** What the user is thinking
- **Emotions:** The emotional arc (typically plotted visually with a line)
- **Pain points:** Where the user struggles
- **Opportunities:** Where you could improve the experience

```python
# Journey map data model
class JourneyMap:
    def __init__(self, persona: str, scenario: str):
        self.persona = persona
        self.scenario = scenario
        self.phases = []

    def add_phase(self, name: str):
        self.phases.append(JourneyPhase(name))

    def get_opportunities(self):
        """Aggregate opportunities across all phases."""
        opportunities = []
        for phase in self.phases:
            for step in phase.steps:
                if step.opportunity:
                    opportunities.append({
                        "phase": phase.name,
                        "step": step.action,
                        "opportunity": step.opportunity,
                        "pain_intensity": step.pain_intensity
                    })
        return sorted(opportunities, key=lambda x: x["pain_intensity"], reverse=True)

class JourneyPhase:
    def __init__(self, name: str):
        self.name = name
        self.steps = []

    def add_step(self, action: str, thought: str, emotion: int,
                 pain: str = "", opportunity: str = ""):
        """
        emotion: 1 (very negative) to 5 (very positive)
        pain_intensity: 1 (minor) to 5 (blocking)
        """
        self.steps.append({
            "action": action,
            "thought": thought,
            "emotion": emotion,
            "pain": pain,
            "pain_intensity": len(pain) if pain else 0,  # rough heuristic
            "opportunity": opportunity
        })
```

---

## Insight Generation

### How Might We (HMW) Statements

HMW statements transform pain points and observations into design opportunities.

**Formula:**
> How might we [action] for [user] so that [desired outcome]?

**From observation to HMW:**

| Observation | How Might We |
|-------------|-------------|
| "I have no idea if my report was received" | "HMW give users confidence that their submission was received?" |
| "I have to check five different tools to get my work done" | "HMW reduce the number of tools a user needs to complete a single task?" |
| "I always forget to back up my work" | "HMW make data backup automatic and invisible?" |

**HMW brainstorming tips:**
- Generate 20-50 HMWs from a single research session
- Vary the scope (some broad, some narrow)
- Avoid solutions in the HMW ("HMW build a chatbot" → too solutiony)
- Cluster HMWs by theme after generating them

```python
# HMW statement generator from research notes
class HMWGenerator:
    def __init__(self):
        self.statements = []

    def from_observation(self, observation: str, user: str) -> str:
        """Convert an observation into a HMW statement."""
        return f"How might we address '{observation}' for {user}?"

    def from_pain_point(self, pain: str, desired_outcome: str) -> str:
        """Convert a pain point into a HMW statement."""
        return f"How might we {desired_outcome} so that {pain} is eliminated?"

    def generate_batch(self, observations: list, user: str) -> list:
        self.statements = [self.from_observation(o, user) for o in observations]
        return self.statements

    def cluster_hmws(self, clusters: dict):
        """
        clusters = {"theme_name": [index_of_hmw, ...]}
        """
        return {
            theme: [self.statements[i] for i in indices]
            for theme, indices in clusters.items()
        }
```

### Opportunity Areas

Opportunity areas are broader than HMWs — they describe a space where value can be created for users and the business.

**Format:**
> **[Area name]:** [Description of the opportunity]
>
> **Evidence:** [What research data supports this]
>
> **Potential impact:** [What could change for users and business]
>
> **Rough sizing:** [How many users affected, how frequently]

**Example:**
> **Opportunity:** Proactive Status Communication
>
> **Evidence:** 8/12 interview participants mentioned anxiety about not knowing whether their submission was received. Support tickets related to "did you get my X?" account for 15% of volume.
>
> **Potential impact:** Reduce support tickets by 15%. Increase user trust and decrease anxiety.
>
> **Sizing:** Affects 100% of users in the submission flow. Estimated 40,000 occurrences per month.

---

## Research Readout Formats

Different audiences need different formats. One study should produce multiple readout artifacts.

### The One-Pager

Best for: Busy executives, stakeholders who need the bottom line.

**Template:**
```
Title: [Descriptive name of the study]
Date: [Date]
Researcher(s): [Names]

Bottom line (3 bullet points max):
- Bullet 1
- Bullet 2
- Bullet 3

Key findings (5-7 with supporting evidence):
1. Finding (with 1-2 representative quotes)
2. Finding (with 1-2 representative quotes)

Recommendations (linked to findings):
→ [Recommendation 1] (addresses Finding 1 & 2)
→ [Recommendation 2] (addresses Finding 3)

Methodology: [n=X, method, dates]
```

### The Presentation Deck

Best for: Team readouts, design reviews, kickoffs.

**Slide structure:**
1. Title & logistics
2. Research questions
3. Methodology & participants (screenshot the screener, show participant grid)
4. Top 3 insights (each on its own slide with a quote and visual)
5. Supporting findings (2-3 slides)
6. Journey map or affinity diagram (high-level visual)
7. Opportunities & HMWs (grouped by theme)
8. Recommendations & next steps
9. Appendix: Full methodology, transcripts, raw data links

### The Video Highlight Reel

Best for: Building empathy across the org, especially for stakeholders who won't read.

- 3-5 minute compilation of the most impactful clips
- Each clip should illustrate one key finding
- Add text overlays naming the finding
- Share via Slack/Teams with a one-line summary

### The Living Document

Best for: Teams that need ongoing reference to research findings.

- Airtable, Notion, or Confluence database of findings
- Each finding tagged by: theme, participant segment, confidence level, research study
- Searchable and filterable
- Updated as new research is conducted

---

## Continuous Discovery Habits

Popularized by Teresa Torres, continuous discovery is the practice of running small, frequent research activities alongside development — not as separate phases.

### The Weekly Discovery Cadence

| Activity | Frequency | Duration | Who participates |
|----------|-----------|----------|-----------------|
| User interview | Weekly | 30 min | PM, Designer, optional Engineer |
| Opportunity review | Weekly | 30 min | Product trio (PM, Designer, Tech Lead) |
| Experiment review | Bi-weekly | 30 min | Full product team |
| Backlog refinement | Weekly | 30 min | Product trio |

### The Product Trio

The PM, Designer, and Tech Lead form the core discovery team. All three participate in interviews and synthesis together.

**Why it works:**
- Engineers hear user frustrations directly — builds empathy and context
- Designers observe behaviors firsthand — better designs
- PMs get alignment in real-time rather than through handoffs

### Continuous Discovery Anti-Patterns

- Doing all research at the start of a quarter (binge-and-purge research)
- One person owns all research (bottleneck)
- Research findings are presented once and forgotten
- No systematic repository for insights
- Research is seen as a phase, not a habit

```python
# Continuous discovery habit tracker
class DiscoveryHabits:
    def __init__(self, team_name: str):
        self.team_name = team_name
        self.weekly_interviews = 0
        self.weeks_active = 0
        self.studies_completed = []

    def log_interview(self, participant_role: str, method: str, insights_count: int):
        self.weekly_interviews += 1
        self.studies_completed.append({
            "week": self.weeks_active + 1,
            "participant": participant_role,
            "method": method,
            "insights": insights_count
        })

    def weekly_summary(self) -> dict:
        return {
            "team": self.team_name,
            "interviews_this_week": self.weekly_interviews,
            "total_interviews": len(self.studies_completed),
            "unique_participants": len(set(s["participant"] for s in self.studies_completed)),
            "avg_insights_per_session": (
                sum(s["insights"] for s in self.studies_completed) /
                max(len(self.studies_completed), 1)
            )
        }

    def reset_week(self):
        self.weekly_interviews = 0
        self.weeks_active += 1
```

---

## Common Mistakes

1. **Confirmation research.** Running studies to prove what you already believe instead of genuinely seeking truth. Guard against this by writing the research questions before seeing any data.

2. **The "interesting" trap.** Reporting findings that are fascinating but don't lead to any decision. Before presenting any insight, ask: "If this is true, what will we do differently?"

3. **Bad recruitment.** Talking to the wrong people (friends, family, power users who aren't your target market). Invest heavily in screening. Bad participants waste everyone's time.

4. **Leading questions.** "How much do you love this feature?" — this biases the participant. Instead: "Tell me about your experience with this feature."

5. **Asking users to design solutions.** "What button should we add?" Users are experts on their problems, not on solutions. Ask about the problem, then synthesize the solution yourself.

6. **Not recording sessions.** Memory is unreliable. You will forget key details. Always record (with permission) and transcribe.

7. **Single-method bias.** Relying only on interviews (or only on surveys). Every method has blind spots. Triangulate for robust findings.

8. **Over-reliance on NPS.** NPS tells you whether users would recommend your product. It does not tell you why, or what to build next. Use NPS as a signal, not a strategy.

9. **Research without stakeholders present.** Findings shared second-hand have less impact. Invite the team to observe live sessions. It changes everything.

10. **Paralysis by analysis.** Spending weeks synthesizing when the key insight was clear after session 5. Good research is timely. Ship insights fast, iterate on them.

11. **Not connecting research to business outcomes.** "Users want X" is weak. "Improving X correlates with 20% higher retention" is powerful. Tie insights to metrics.

12. **Incentive neglect.** Inadequate or late incentives damage goodwill and make future recruitment harder. Treat participants fairly and generously.

---

*This skill is maintained by Cosmic Stack Labs. For questions or contributions, refer to the contributing guide in the repository root.*
