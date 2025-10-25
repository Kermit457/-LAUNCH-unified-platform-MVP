# Agent Management Rules - Maximum Potential Protocol

**Purpose:** Extract maximum value from specialized agents regardless of task size.

---

## Core Principle

**EVERY UI/UX or frontend task deserves specialized agent attention.**
- Small button fix? → UI/UX agent reviews design system compliance
- Single component? → Frontend agent considers performance, accessibility, mobile
- Color change? → UI/UX agent checks brand consistency, contrast ratios
- **No task is too small for quality**

---

## UI/UX Designer Agent - Mandatory Use Cases

### ALWAYS use for:
1. **Any visual design decision** (colors, spacing, typography, shadows)
2. **Component styling** (buttons, cards, modals, forms, badges)
3. **Layout changes** (grids, flex, positioning, responsive)
4. **Design system compliance** (matching btdemo, brand guidelines)
5. **User flow analysis** (onboarding, conversion paths, interactions)
6. **Accessibility review** (WCAG compliance, color contrast, screen readers)
7. **Mobile responsiveness** (breakpoints, touch targets, gestures)
8. **Animation/motion design** (timing, easing, purposeful motion)
9. **Visual hierarchy** (what users see first, emphasis, de-emphasis)
10. **Before/after comparisons** (validate improvements)

### Agent Briefing Template:
```
Context: [What page/component, what it does]
Current State: [What exists now, what's wrong]
Design Requirements: [Brand system, constraints, references]
Success Criteria: [How to measure if it's better]
References: [Screenshots, design systems to match]
```

### Expected Deliverables:
- Design specification document (exact colors, spacing, fonts)
- Accessibility compliance report
- Mobile responsive strategy
- Component implementation guidelines
- Before/after visual mockups (if applicable)

---

## Frontend Developer Agent - Mandatory Use Cases

### ALWAYS use for:
1. **Component implementation** (React components, hooks, state)
2. **Performance optimization** (memoization, lazy loading, bundle size)
3. **Code quality** (TypeScript strict mode, proper types, error handling)
4. **Responsive implementation** (media queries, mobile-first approach)
5. **Animation implementation** (Framer Motion, CSS animations)
6. **API integration** (data fetching, error states, loading states)
7. **Form handling** (validation, UX, accessibility)
8. **State management** (context, props, derived state)
9. **Browser compatibility** (cross-browser testing)
10. **Code refactoring** (DRY, maintainability, patterns)

### Agent Briefing Template:
```
Context: [What needs to be built/fixed]
Technical Constraints: [Next.js 14, TypeScript, etc.]
Design Spec: [Link to UI/UX agent output]
Performance Requirements: [Load time, bundle size, metrics]
Accessibility Requirements: [WCAG level, keyboard nav, screen readers]
Browser Support: [Chrome, Safari, mobile browsers]
```

### Expected Deliverables:
- Production-ready code (TypeScript, error handling, edge cases)
- Performance analysis (bundle impact, render performance)
- Accessibility implementation (ARIA, keyboard, focus management)
- Responsive implementation (mobile, tablet, desktop tested)
- Code documentation (JSDoc, usage examples)

---

## Workflow Rules

### Rule 1: Always Coordinate Both Agents
**For any UI change:**
1. UI/UX agent creates design spec first
2. Frontend agent implements from spec
3. UI/UX agent reviews implementation
4. Iterate if needed

**Never:** Have frontend agent "wing it" on design decisions

### Rule 2: Parallel Tasking for Efficiency
**When appropriate, run agents in parallel:**
- UI/UX agent: Designs component A
- Frontend agent: Implements component B (already designed)
- Use TodoWrite to track which agent is working on what

### Rule 3: Require Detailed Specifications
**UI/UX agent must provide:**
- Exact hex codes for colors
- Exact pixel values for spacing/sizing
- Exact font weights, sizes, line heights
- Exact border radius, shadow values
- Exact animation timing and easing functions

**Frontend agent must provide:**
- TypeScript interfaces for props
- Error handling strategy
- Loading state implementation
- Mobile responsive breakpoints
- Performance optimization techniques used

### Rule 4: Review Before User Sees It
**Before showing work to user:**
1. UI/UX agent validates design system compliance
2. Frontend agent runs local test
3. Check accessibility (keyboard nav, screen reader)
4. Check mobile responsiveness (320px → 2560px)
5. Check performance (no console errors, smooth animations)

### Rule 5: Use TodoWrite for Multi-Agent Tasks
```
[TodoWrite]
- Design listing card layout (UI/UX agent) - in_progress
- Implement listing card component (Frontend agent) - pending
- Review design implementation (UI/UX agent) - pending
- Optimize performance (Frontend agent) - pending
- User acceptance testing - pending
```

### Rule 6: Document Agent Outputs
**Create .md files for major features:**
- `FEATURE_DESIGN_SPEC.md` - UI/UX agent output
- `FEATURE_IMPLEMENTATION.md` - Frontend agent output
- `FEATURE_REVIEW.md` - Combined review and iterations

---

## Quality Gates - Agent Must Achieve

### UI/UX Agent Quality Gates:
- [ ] Design matches brand system 100%
- [ ] WCAG 2.1 AA compliance verified
- [ ] Mobile responsive strategy defined
- [ ] Animation purposeful and performant
- [ ] Visual hierarchy clear and intentional
- [ ] Touch targets minimum 44x44px
- [ ] Color contrast ratios meet standards
- [ ] Consistent spacing using design system

### Frontend Agent Quality Gates:
- [ ] TypeScript strict mode passing
- [ ] No console errors or warnings
- [ ] Proper error boundaries
- [ ] Loading states implemented
- [ ] Mobile responsive tested
- [ ] Keyboard navigation working
- [ ] Bundle size impact analyzed
- [ ] Performance metrics acceptable
- [ ] Code documented with JSDoc

---

## Agent Briefing Examples

### Example 1: Small Task - Button Color Change
**Bad Approach:**
```typescript
// Just change the color myself
className="bg-blue-500"  // Wrong!
```

**Correct Approach:**
1. **Send to UI/UX Agent:**
   ```
   Task: Review button color change
   Context: Primary CTA button on BLAST listing cards
   Current: Using incorrect blue
   Requirement: Match btdemo primary color
   Deliverable: Exact color value + design system compliance
   ```

2. **Agent Response:**
   ```
   Primary color: #D1FD0A (lime green)
   Hover state: #B8E309
   Shadow: shadow-lg shadow-primary/30
   Verify: All primary buttons use this across app
   ```

3. **Implement exactly as specified**

### Example 2: Medium Task - Component Redesign
**User Request:** "Fix the user profile on BLAST/test"

**Correct Approach:**
1. **Send to UI/UX Agent:**
   ```
   Task: Redesign BLAST user profile bar
   Context: User complained - not matching btdemo quality
   Current State: [Screenshot or description]
   Requirements:
   - Match btdemo design language
   - Show Motion Score prominently
   - Display user stats
   - Curator referral system
   Reference: app/btdemo/page.tsx design patterns

   Deliverables needed:
   - Complete design specification
   - Layout structure
   - Color palette
   - Typography system
   - Spacing/sizing
   - Responsive strategy
   - Animation specifications
   ```

2. **Review UI/UX Output with User**
   - Get approval on design direction
   - Clarify any questions
   - Iterate on design if needed

3. **Send to Frontend Agent:**
   ```
   Task: Implement redesigned user profile bar
   Context: BLAST test page user profile component
   Design Spec: [Link to UI/UX agent output]
   Technical Requirements:
   - Next.js 14, TypeScript strict
   - Framer Motion animations
   - Mobile-first responsive
   - Memoized component
   File: app/BLAST/test/page.tsx (UserProfileBar component)

   Quality requirements:
   - TypeScript strict mode
   - Accessibility compliant
   - Performance optimized
   - Error handling
   ```

4. **Review Implementation:**
   - UI/UX agent validates design compliance
   - Test locally
   - Check mobile responsiveness
   - **Then show to user**

### Example 3: Large Task - Full Page Design
**User Request:** "Redesign BLAST section, make it BLAST!"

**Correct Approach:**
1. **Create Design Vision Document First**
   ```markdown
   # BLAST_DESIGN_VISION.md

   ## Questions for User:
   1. What emotion should users feel? (excitement/competitive/exclusive/etc.)
   2. What's the energy level? (high-energy/professional/premium/etc.)
   3. Reference examples? (show me sites/apps with the vibe you want)
   4. Key differentiators? (what makes BLAST different from job boards?)
   5. Primary user action? (what should users do most?)
   ```

2. **Get User Answers**

3. **Send to UI/UX Agent:**
   ```
   Task: Create comprehensive BLAST page design system
   Context: High-energy opportunity platform for crypto community
   Vision: [User's answers from above]
   Pages to design:
   - Listings feed
   - Listing detail
   - User profile
   - My Panel
   - Activity feed

   Deliverables:
   - Complete design system (colors, typography, components)
   - Wireframes for each page
   - Component library specification
   - Interaction patterns
   - Animation strategy
   - Mobile responsive strategy
   - Accessibility compliance plan
   ```

4. **Create TodoWrite Plan:**
   ```
   - Design system creation (UI/UX) - in_progress
   - Get user approval on design system - pending
   - Implement core components (Frontend) - pending
   - Implement listings feed (Frontend) - pending
   - Implement user profile (Frontend) - pending
   - Design review iteration (UI/UX) - pending
   - Performance optimization (Frontend) - pending
   - User acceptance testing - pending
   ```

5. **Execute in Phases with User Approval at Each Phase**

---

## Common Mistakes to Avoid

### ❌ DON'T:
1. **Skip agent for "small" changes** - No change is too small
2. **Let frontend agent make design decisions** - Always UI/UX first
3. **Implement without user approval** - Show design spec first
4. **Work without TodoWrite** - Track multi-step tasks
5. **Push to production without approval** - Test page = local only
6. **Give vague briefs to agents** - Be specific and detailed
7. **Accept generic agent output** - Demand exact specifications
8. **Forget accessibility** - WCAG 2.1 AA is minimum
9. **Ignore mobile** - Mobile-first always
10. **Skip performance check** - Bundle size and render performance matter

### ✅ DO:
1. **Always brief agents properly** - Context, requirements, deliverables
2. **Get user approval on design** - Before implementation
3. **Use TodoWrite for tracking** - Visibility for user
4. **Review agent output critically** - Demand quality
5. **Test before showing user** - Local testing is mandatory
6. **Iterate with agents** - Don't accept first output if not perfect
7. **Document everything** - .md files for major features
8. **Check design system compliance** - Every change
9. **Verify accessibility** - Every component
10. **Measure performance** - Every implementation

---

## Agent Performance Standards

### UI/UX Agent Must:
- Provide exact pixel-perfect specifications
- Reference design system explicitly
- Include accessibility requirements
- Specify responsive breakpoints
- Define animation timing/easing
- Include visual examples or mockups
- Cite WCAG compliance

### Frontend Agent Must:
- Write TypeScript strict mode code
- Include proper error handling
- Implement loading states
- Add keyboard navigation
- Document code with JSDoc
- Optimize for performance
- Test mobile responsiveness
- Verify accessibility implementation

---

## Success Metrics

**For each UI/UX task:**
- Design system compliance: 100%
- WCAG 2.1 AA compliance: 100%
- User approval: Required before implementation
- Visual quality: Matches btdemo or better

**For each frontend task:**
- TypeScript strict: No errors
- Console: No errors or warnings
- Performance: No bundle bloat, smooth 60fps
- Accessibility: Keyboard nav + screen reader tested
- Mobile: 320px → 2560px responsive
- Code quality: DRY, documented, maintainable

---

## When to Use Each Agent

### UI/UX Designer Agent:
**Trigger words from user:**
- "design", "redesign", "make it nice", "polish", "improve UX"
- "it doesn't look like [reference]"
- "make it [emotion]" (exciting, premium, professional, etc.)
- "match btdemo", "follow design system"
- "add animations", "make it smooth"
- **ANY visual/design feedback**

### Frontend Developer Agent:
**Trigger words from user:**
- "build", "implement", "create component"
- "optimize", "performance", "bundle size"
- "fix bug", "error", "not working"
- "add feature", "integrate API"
- "make it responsive", "mobile"
- **ANY technical implementation task**

### Both Agents Together:
**Trigger words from user:**
- "redesign and rebuild"
- "new page/section"
- "improve experience"
- "make it better"
- **ANY major feature or page**

---

## Agent Coordination Protocol

### Sequential (Design → Implement):
```
1. UI/UX Agent: Design spec
2. User: Approve design
3. Frontend Agent: Implement
4. UI/UX Agent: Review implementation
5. User: Final approval
```

### Parallel (Efficiency):
```
1. UI/UX Agent: Design component A
   Frontend Agent: Implement component B (already designed)
2. UI/UX Agent: Design component C
   Frontend Agent: Implement component A
3. Continue pattern...
```

---

## This is NOT Optional

**These rules are mandatory for all UI/frontend work.**

- No shortcuts
- No "I'll just quickly fix it myself"
- No skipping design phase
- No implementing without specs
- No showing user unreviewed work
- No pushing to production without approval

**Quality is non-negotiable. Use agents to their maximum potential.**

---

**Last Updated:** 2025-10-25
**Applies To:** All BLAST work, all UI/UX work, all frontend work
**Enforcement:** Self-review before every user interaction
