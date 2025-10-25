# Submission & Review Flow - Test Plan

## Prerequisites
1. Start dev server: `npm run dev`
2. Sign in with Privy (Twitter auth)
3. Make sure you have at least one campaign created

## Test Flow

### Part 1: Submit a Clip (as Creator)

1. **Navigate to a campaign**
   - Go to `/campaigns` or find a campaign card
   - Click on any campaign to open campaign detail page

2. **Join the campaign**
   - Click "Join Campaign" button
   - Should see green success message: "✓ You've joined this campaign!"

3. **Fill out submission form**
   - Platform: Select "YouTube" (or any platform)
   - Video URL: Enter `https://youtube.com/watch?v=test123`
   - Description: "Test submission for review"

4. **Submit**
   - Click "Submit Clip" button
   - Should see: "✓ Submission created successfully! Your clip is pending review"
   - Form should clear after submission

5. **Verify in Appwrite**
   - Go to Appwrite console → Database → submissions collection
   - Should see new document with:
     - `status: "pending"`
     - `mediaUrl: "https://youtube.com/watch?v=test123"`
     - `userId: <your-privy-id>`
     - `campaignId: <campaign-id>`

---

### Part 2: Review Submissions (as Campaign Owner)

1. **Navigate to campaigns dashboard**
   - Go to `/dashboard/campaigns`
   - Find your campaign in the table

2. **Click Review button**
   - Look for the cyan button with FileText icon (📄)
   - Click it → should navigate to `/dashboard/campaigns/[id]/review`

3. **Review page should show**
   - Stats: Pending (1), Approved (0), Rejected (0)
   - Your submission in "Pending Review" section with:
     - Creator avatar and name
     - Description: "Test submission for review"
     - "View Submission" link
     - Approve/Reject buttons

---

### Part 3: Approve Submission

1. **Click "Approve" button**
   - Modal opens: "Approve Submission"

2. **Enter view count**
   - Type: `10000`
   - Should auto-calculate earnings: `$200.00 USDC` (if rate is $20/1k)

3. **Optional: Add notes**
   - Type: "Great work!"

4. **Click "Approve"**
   - Modal closes
   - Submission moves to "Approved" section
   - Should show: 10,000 views and $200.00 earnings

5. **Verify in Appwrite**
   - Go to submissions collection
   - Document should now have:
     - `status: "approved"`
     - `views: 10000`
     - `earnings: 200`
     - `notes: "Great work!"`
     - `reviewedAt: <timestamp>`

---

### Part 4: Test Rejection

1. **Submit another clip** (repeat Part 1)

2. **Go back to review page**
   - Should see 2 submissions total
   - 1 approved, 1 pending

3. **Click "Reject" on the pending submission**
   - Modal opens: "Reject Submission"

4. **Optional: Add reason**
   - Type: "Doesn't meet requirements"

5. **Click "Reject"**
   - Submission moves to "Rejected" section
   - Shows as rejected with reduced opacity

6. **Verify in Appwrite**
   - `status: "rejected"`
   - `earnings: 0`
   - `notes: "Doesn't meet requirements"`

---

## Expected Issues to Watch For

### Potential Errors:

1. **"Please sign in to submit"**
   - Make sure you're signed in with Privy
   - Check `userId` is available in browser console

2. **"Platform and video URL are required"**
   - Fill in both required fields before submitting

3. **Appwrite errors**
   - Check Appwrite credentials in `.env`
   - Verify collections exist and have correct schema

4. **getUserProfile errors**
   - Creator profile must exist in users collection
   - Run seed script if needed: `npm run seed`

### Debug Console Logs:

Open browser console to see:
- `🔐 Privy user data:` - User authentication info
- `Failed to submit:` - Submission errors
- `Failed to fetch data:` - Review page errors
- `Failed to approve/reject submission:` - Approval/rejection errors

---

## Success Criteria

✅ Creator can submit clips to campaigns
✅ Submissions appear in review panel
✅ Campaign owner can approve with auto-calculated earnings
✅ Campaign owner can reject with optional notes
✅ All data persists correctly in Appwrite
✅ UI updates in real-time after approve/reject

---

## Next Steps After Testing

If all tests pass:
1. Update campaign budget stats when submissions are approved
2. Add pending submissions count badge to review button
3. Add submission history to creator's dashboard
4. Calculate and display total earnings for creators