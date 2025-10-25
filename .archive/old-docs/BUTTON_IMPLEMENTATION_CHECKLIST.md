# Button System Implementation Checklist

**Status:** Ready for Implementation
**Estimated Time:** 4 weeks (phased rollout)
**Priority:** High - Foundational system

---

## Quick Reference

**Main Spec:** `BUTTON_ARCHITECTURE_SPEC.md`
**TypeScript Coverage:** 100% strict mode
**Breaking Changes:** None (additive in Phase 1)

---

## Phase 1: Foundation (Week 1) - NO BREAKING CHANGES

### Core Type Definitions

- [ ] Create `lib/types/button-actions.ts`
  - [ ] Define `MODAL_IDS` constant
  - [ ] Define `ModalPropsMap` interface
  - [ ] Define `NAV_ROUTES` constant
  - [ ] Define `ButtonAction` discriminated union
  - [ ] Define `ButtonVariant` and `ButtonSize` types
  - [ ] Export all types

**Acceptance:** `tsc --noEmit` passes, zero breaking changes

### Modal Store

- [ ] Create `stores/modal-store.ts`
  - [ ] Install zustand: `npm install zustand`
  - [ ] Implement `useModalStore` with Zustand
  - [ ] Add `openModal<T>()` with generic constraint
  - [ ] Add `closeModal()` method
  - [ ] Add type-safe state interface

**Acceptance:** Store opens/closes with type safety, DevTools work

### Button Component

- [ ] Create `components/ui/Button/` directory
- [ ] Create `components/ui/Button/types.ts`
  - [ ] Define `ButtonProps` interface
  - [ ] Define `IconButtonProps` interface
  - [ ] Define `ModalTriggerButtonProps<T>` generic
- [ ] Create `components/ui/Button/variants.ts`
  - [ ] Install CVA: `npm install class-variance-authority`
  - [ ] Define `buttonVariants` with CVA
  - [ ] 8 variants: primary, secondary, tertiary, ghost, destructive, success, outline, icon
  - [ ] 5 sizes: xs, sm, md, lg, xl
- [ ] Create `components/ui/Button/Button.tsx`
  - [ ] Implement core Button component
  - [ ] Add action handler with switch/case (exhaustive)
  - [ ] Add loading state support
  - [ ] Add icon support (leading/trailing)
  - [ ] Add haptic feedback hook
  - [ ] Add accessibility (aria-label, focus-visible)
- [ ] Create `components/ui/Button/IconButton.tsx`
  - [ ] Wrapper for icon-only buttons
  - [ ] Enforce `ariaLabel` requirement
- [ ] Create `components/ui/Button/ModalTriggerButton.tsx`
  - [ ] Generic component with `<T extends ModalId>`
  - [ ] Better type inference than base Button
- [ ] Create `components/ui/Button/index.ts`
  - [ ] Barrel export all components

**Acceptance:** Button renders, all variants work, TypeScript autocomplete works

### Modal Registry

- [ ] Create `components/modals/ModalRegistry.tsx`
  - [ ] Import all modal components (lazy)
  - [ ] Connect to `useModalStore`
  - [ ] Render modal based on `openModalId`
  - [ ] Add Suspense boundary with skeleton
  - [ ] Type-safe switch/case for modal rendering
- [ ] Update `app/layout.tsx`
  - [ ] Add `<ModalRegistry />` before closing `</body>`

**Acceptance:** Modals render when store triggers, code-split correctly

### Testing

- [ ] Create `components/ui/Button/Button.test.tsx`
  - [ ] Test all variants render
  - [ ] Test action handlers (navigation, modal, action)
  - [ ] Test loading states
  - [ ] Test disabled state
  - [ ] Test accessibility

**Acceptance:** 100% test coverage, all tests pass

---

## Phase 2: Modal Migration (Week 2)

### Update Modal Components

- [ ] Update `components/modals/CreateCampaignModal.tsx`
  - [ ] Change signature: `({ open, onClose, ...props })`
  - [ ] Remove internal open state
  - [ ] Accept props from `ModalPropsMap[MODAL_IDS.CREATE_CAMPAIGN]`
- [ ] Update `components/modals/SubmitClipModal.tsx`
  - [ ] Same changes as CreateCampaignModal
  - [ ] Type props interface

**Acceptance:** Modals work with registry, props typed correctly

### Add to Modal Registry

- [ ] Add `CREATE_CAMPAIGN` case to ModalRegistry
- [ ] Add `SUBMIT_CLIP` case to ModalRegistry
- [ ] Verify lazy loading works (check bundle)

**Acceptance:** Both modals open via store, bundle size reduced

### Update Modal Triggers

- [ ] Find all `setCreateCampaignModal(true)` calls
- [ ] Replace with `ModalTriggerButton` or `Button` with modal action
- [ ] Remove useState for modal visibility
- [ ] Verify TypeScript validates props

**Acceptance:** All triggers use new system, zero useState for modals

---

## Phase 3: Component Migration (Week 3)

### Page: /app/clip/page.tsx

- [ ] Count total buttons (inline + components)
- [ ] Replace filter buttons with `<Button variant="secondary">`
- [ ] Replace action buttons with `<ModalTriggerButton>`
- [ ] Remove inline onClick handlers for modals
- [ ] Verify no breaking changes

**Acceptance:** Page works identically, type-safe buttons

### Page: /app/launch/page.tsx

- [ ] Replace hero CTA with `<Button variant="primary" size="xl">`
- [ ] Replace filter buttons
- [ ] Replace card action buttons
- [ ] Update TokenLaunchPreview buttons

**Acceptance:** Page works identically, type-safe buttons

### Component: BottomNav

- [ ] Update tab buttons to use `<Button variant="ghost">`
- [ ] Keep Link wrapper for navigation
- [ ] Maintain active state styling

**Acceptance:** Navigation works, active states correct

### Component Audit

- [ ] Find all `*Button.tsx` files
- [ ] Migrate `BuyKeysButton` to use new Button
- [ ] Migrate `SellKeysButton` to use new Button
- [ ] Migrate `VoteButton` to use new Button
- [ ] Migrate `ShareButton` to use new Button
- [ ] Migrate `FollowButton` to use new Button

**Acceptance:** All specialized buttons use base Button component

---

## Phase 4: Polish & Optimization (Week 4)

### Haptic Feedback

- [ ] Create `hooks/useHaptic.ts`
- [ ] Implement visual feedback for web
- [ ] Add Capacitor haptic for mobile
- [ ] Test on iOS/Android

**Acceptance:** Haptic works on all platforms

### Bundle Optimization

- [ ] Run `ANALYZE=true npm run build`
- [ ] Verify modal code-splitting
- [ ] Check button component size
- [ ] Optimize imports (no barrel exports for large files)

**Acceptance:** Bundle ≤58KB per page

### Accessibility Audit

- [ ] Run axe DevTools on all pages
- [ ] Verify all buttons have labels
- [ ] Test keyboard navigation
- [ ] Test screen reader (NVDA/VoiceOver)
- [ ] Add focus-visible styles

**Acceptance:** WCAG AA compliance, zero axe errors

### Documentation

- [ ] Create Storybook stories for Button
- [ ] Add JSDoc comments to all exports
- [ ] Create migration guide for team
- [ ] Record demo video

**Acceptance:** Team can use without asking questions

### Cleanup

- [ ] Delete old `components/ui/button.tsx` (shadcn version)
- [ ] Remove unused button components
- [ ] Remove modal visibility useState across codebase
- [ ] Update imports to new Button

**Acceptance:** Zero dead code, clean git history

---

## Rollback Plan

### If Phase 1 Issues
- No rollback needed - additive changes only
- Can coexist with old button system

### If Phase 2 Issues
- Revert modal migrations
- Keep new Button component for new features
- Continue with old modal state management

### If Phase 3 Issues
- Revert page-by-page
- Button component remains available
- No data loss risk (UI only)

---

## Success Criteria

### Code Quality
- [ ] `tsc --noEmit` passes with strict mode
- [ ] Zero `any` types in button system
- [ ] ESLint passes with no warnings
- [ ] 100% test coverage for Button

### Performance
- [ ] Bundle size ≤58KB per page
- [ ] Modal lazy load ≤200ms
- [ ] Lighthouse score ≥95
- [ ] Zero runtime errors

### Developer Experience
- [ ] IntelliSense works for all modal IDs
- [ ] TypeScript catches wrong modal props
- [ ] 50% reduction in modal-related bugs
- [ ] Team survey ≥90% satisfaction

---

## Daily Standup Template

**What I did yesterday:**
- Phase X, Task Y completed
- Blocked on: [if any]

**What I'm doing today:**
- Phase X, Task Z
- Expected completion: [time]

**Blockers:**
- None / [describe]

---

## PR Strategy

### PR 1: Foundation
**Title:** feat(ui): add type-safe button component system
**Files:** 10-15
**Reviewers:** 2
**Time:** 3 days

### PR 2: Modal System
**Title:** feat(modals): add global modal registry with code splitting
**Files:** 5-10
**Reviewers:** 2
**Time:** 2 days

### PR 3: Clip Page Migration
**Title:** refactor(clip): migrate to type-safe button system
**Files:** 3-5
**Reviewers:** 1
**Time:** 1 day

### PR 4: Launch Page Migration
**Title:** refactor(launch): migrate to type-safe button system
**Files:** 5-8
**Reviewers:** 1
**Time:** 1 day

### PR 5: Component Migrations
**Title:** refactor(components): migrate all buttons to new system
**Files:** 10-15
**Reviewers:** 2
**Time:** 2 days

### PR 6: Cleanup & Polish
**Title:** chore: remove old button system and optimize bundle
**Files:** 20+
**Reviewers:** 2
**Time:** 2 days

---

## Quick Command Reference

```bash
# Start development
npm run dev

# Type check
npx tsc --noEmit

# Run tests
npm test

# Bundle analysis
ANALYZE=true npm run build

# Lint
npm run lint

# Format
npm run format

# Build production
npm run build

# Clean build cache
rm -rf .next
```

---

## Common Issues & Solutions

### Issue: TypeScript can't infer modal props
**Solution:** Use `ModalTriggerButton<typeof MODAL_IDS.X>` with explicit generic

### Issue: Modal doesn't appear
**Solution:** Check ModalRegistry is in root layout, verify store triggers

### Issue: Button not responding to clicks
**Solution:** Check `action` prop is defined, verify handler logic

### Issue: Bundle size increased
**Solution:** Verify lazy loading works, check dynamic imports

### Issue: Haptic not working
**Solution:** Check platform (web has visual only), verify hook implementation

---

## Team Communication

### Slack Channel
`#button-system-migration`

### Weekly Sync
Fridays 3pm - Review progress, discuss blockers

### Demo
End of each phase - show working features

### Documentation
Update README.md with new button usage

---

## Dependencies to Install

```json
{
  "dependencies": {
    "zustand": "^4.4.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "@storybook/react": "^7.6.0"
  }
}
```

Install all:
```bash
npm install zustand class-variance-authority clsx tailwind-merge
npm install -D @testing-library/react @testing-library/user-event @storybook/react
```

---

**Ready to start Phase 1!**

Questions? See `BUTTON_ARCHITECTURE_SPEC.md` for detailed technical docs.
