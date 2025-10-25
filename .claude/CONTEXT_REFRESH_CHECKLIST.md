# Context Refresh Checklist

**Purpose:** When context resets or new session starts, read these files IN ORDER to get back up to speed quickly.

---

## Critical Files - Read FIRST (Priority Order)

### 1. Project Status & Current Work
**Read these IMMEDIATELY:**
- [ ] `DEPLOYMENT_STATUS.md` - What's live, what works, what's broken
- [ ] `SPRINT.md` - Current priorities, what user is focused on
- [ ] `BLAST_PRODUCTION_STATUS.md` - BLAST deployment state (if working on BLAST)

**Why:** Know what's deployed, what's broken, what user cares about RIGHT NOW

### 2. Project Context & Rules
**Read these BEFORE starting any work:**
- [ ] `CLAUDE.md` (project root) - Project structure, commands, critical paths
- [ ] `.claude/AGENT_MANAGEMENT_RULES.md` - How to use agents properly
- [ ] `c:\Users\mirko\.claude\CLAUDE.md` - User's global instructions

**Why:** Understand project, know the rules, avoid repeating mistakes

### 3. Architecture & Design
**Read these BEFORE making changes:**
- [ ] `SOLANA_ARCHITECTURE_V3_FINAL.md` - If touching Solana code
- [ ] `BTDEMO_DESIGN_SPECIFICATION.md` - If doing UI/UX work
- [ ] `INTEGRATION_GUIDE.md` - If integrating frontend/backend

**Why:** Don't break existing architecture, follow design system

### 4. Feature-Specific Docs (if applicable)
**Read these if working on that feature:**
- [ ] `BLAST_MASTER_PLAN.md` - If working on BLAST
- [ ] `CURATION_SYSTEM_MASTER_PLAN.md` - If working on curation
- [ ] Any `FEATURE_*.md` files relevant to current task

**Why:** Understand feature requirements and design decisions

---

## Quick Reference Files

### When Working On:

**BLAST:**
1. `BLAST_PRODUCTION_STATUS.md` - What's deployed
2. `BLAST_MASTER_PLAN.md` - Feature requirements
3. `app/BLAST/` - Code location

**UI/UX Design:**
1. `BTDEMO_DESIGN_SPECIFICATION.md` - Design system
2. `app/btdemo/page.tsx` - Reference implementation
3. `lib/icons.tsx` - Icon system

**Solana Integration:**
1. `SOLANA_ARCHITECTURE_V3_FINAL.md` - Architecture
2. `lib/solana/` - Utilities
3. `solana-program/programs/curve/src/` - Smart contract

**Frontend Components:**
1. `INTEGRATION_GUIDE.md` - How to integrate
2. `components/` - Existing components
3. `hooks/` - Existing hooks

---

## Context Reset Protocol

**When starting new session or context resets:**

### Step 1: Read Core Files (5 min)
```
1. DEPLOYMENT_STATUS.md - What's live?
2. SPRINT.md - What's the priority?
3. CLAUDE.md - What's the structure?
```

### Step 2: Check Last Work (2 min)
```
git log --oneline -10  # Last 10 commits
git status             # Current changes
```

### Step 3: Read Agent Rules (2 min)
```
.claude/AGENT_MANAGEMENT_RULES.md - How to work properly
```

### Step 4: Ask User (if unclear)
```
"I see we were working on [X]. Should I continue with [Y]?"
```

**Total: ~10 minutes to get oriented**

---

## Files to NEVER Skip

### ALWAYS Read Before Coding:
1. **CLAUDE.md** - Project structure and commands
2. **DEPLOYMENT_STATUS.md** - Current production state
3. **SPRINT.md** - Current priorities

### ALWAYS Read Before Committing:
1. **Git status** - What am I committing?
2. **User approval** - Did user approve this?
3. **AGENT_MANAGEMENT_RULES.md** - Did I follow the process?

### ALWAYS Read Before Using Agents:
1. **AGENT_MANAGEMENT_RULES.md** - Agent briefing templates
2. **Relevant design spec** - What's the design requirement?
3. **Current code** - What exists now?

---

## File Reading Order by Task Type

### Task: "Fix Bug"
1. Read DEPLOYMENT_STATUS.md (is it deployed?)
2. Read relevant code file
3. Check git log for recent changes
4. Reproduce bug locally
5. Fix and test
6. Ask user before committing

### Task: "Add Feature"
1. Read SPRINT.md (is this prioritized?)
2. Read relevant architecture doc
3. Read AGENT_MANAGEMENT_RULES.md
4. Create TodoWrite plan
5. Get user approval
6. Brief agents properly
7. Implement with agents
8. Review before showing user

### Task: "Redesign UI"
1. Read BTDEMO_DESIGN_SPECIFICATION.md
2. Read AGENT_MANAGEMENT_RULES.md (UI/UX section)
3. Ask user for vision/feeling/references
4. Brief UI/UX agent with complete context
5. Get user approval on design
6. Brief frontend agent with design spec
7. Implement
8. Review with UI/UX agent
9. Show user

### Task: "Deploy Feature"
1. Read DEPLOYMENT_STATUS.md
2. Read relevant code
3. Check if user approved deployment
4. If YES: Deploy
5. If NO: Ask for approval first
6. Update DEPLOYMENT_STATUS.md after deploy

---

## Red Flags - Stop and Read

**If you find yourself:**
- Unsure what's deployed → Read DEPLOYMENT_STATUS.md
- Don't know priority → Read SPRINT.md
- About to commit → Read git status, get user approval
- Making UI changes → Read BTDEMO_DESIGN_SPECIFICATION.md
- Using agents → Read AGENT_MANAGEMENT_RULES.md
- Working on BLAST → Read BLAST_PRODUCTION_STATUS.md
- Touching Solana → Read SOLANA_ARCHITECTURE_V3_FINAL.md

**STOP and read the relevant doc before proceeding.**

---

## What NOT to Read (Outdated/Archive)

**Skip these unless specifically referenced:**
- Old planning docs with dates > 1 month ago
- Docs marked "ARCHIVED" or "DEPRECATED"
- Docs with conflicting info (use DEPLOYMENT_STATUS.md as source of truth)

**If in doubt, ask user:** "Should I reference [old doc] or is there a newer version?"

---

## Session Start Template

**Every new session, do this:**

```markdown
# Session Start - [Date]

## 1. Context Check
- [ ] Read DEPLOYMENT_STATUS.md
- [ ] Read SPRINT.md
- [ ] Read CLAUDE.md

## 2. Last Work Review
- [ ] git log --oneline -10
- [ ] git status
- [ ] Check TodoWrite (if exists)

## 3. Current Focus
Based on docs, current focus is: [X]

## 4. Ready to Work
User, I'm ready. Last session we worked on [X].
Should I continue or is there a new priority?
```

---

## File Update Responsibility

**I must update these files:**

### After Every Deployment:
- `DEPLOYMENT_STATUS.md` - Update status, add fixes

### After Major Feature:
- `SPRINT.md` - Mark completed tasks
- Relevant `FEATURE_*.md` - Document decisions

### After Learning:
- `.claude/PERFORMANCE_IMPROVEMENT_NOTES.md` - Add learnings

### After Agent Work:
- Create `FEATURE_DESIGN_SPEC.md` (from UI/UX agent)
- Create `FEATURE_IMPLEMENTATION.md` (from frontend agent)

---

## Memory Aid - Quick Commands

```bash
# Quick context check
cat DEPLOYMENT_STATUS.md | grep "Latest"
cat SPRINT.md | head -20
git log --oneline -5

# Quick file search
find . -name "*.md" -type f | grep -i "blast"
grep -r "TODO" --include="*.md" .

# Quick status
git status
npm run dev  # Start server
```

---

## Critical Reminders

### BEFORE Every Code Change:
1. Did I read the relevant docs?
2. Did I create TodoWrite plan?
3. Did I get user approval?

### BEFORE Every Commit:
1. Did user approve this?
2. Is this a test page? (local only)
3. Did I update docs?

### BEFORE Using Agents:
1. Did I read AGENT_MANAGEMENT_RULES.md?
2. Did I brief them properly?
3. Did I demand quality output?

---

**This checklist ensures I never start blind after context reset.**
