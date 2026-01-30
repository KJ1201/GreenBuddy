# Quick Start Testing Guide

## 🚀 How to Run Tests & Verify Quality

### 1. Local Development Server
```bash
npm run dev
```
Then open http://localhost:5173 and follow the testing checklist in `TESTING.md`.

### 2. Production Build
```bash
npm run build
npm run preview
```
This simulates the production environment locally.

### 3. Run Lighthouse Audit
1. Open the app in **Chrome**
2. Open DevTools (F12)
3. Go to **Lighthouse** tab
4. Select categories: Performance, Accessibility, Best Practices, SEO
5. Click **Analyze page load**
6. Target: All scores 90+

### 4. Cross-Browser Testing
Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### 5. Responsive Testing
Use Chrome DevTools Device Toolbar (Ctrl+Shift+M):
- Mobile: iPhone SE (375px)
- Tablet: iPad (768px)
- Desktop: 1920px

### 6. Accessibility Quick Check
1. **Keyboard Navigation**:
   - Press Tab key - should see coral outline on focused elements
   - All interactive elements should be reachable
   - Escape should close modals

2. **Screen Reader** (Optional but recommended):
   - Windows: NVDA (free)
   - Mac: VoiceOver (built-in, Cmd+F5)

### 7. Performance Quick Check
In Chrome DevTools:
1. Network tab → Throttle to "Fast 3G"
2. Reload page → Should still load under 10s
3. Check if images lazy load (they should)

## 📋 Critical User Flows to Test

### Flow 1: Complete Teardown
1. Landing → "Start Your First Teardown"
2. Device Catalog → Select "HP DeskJet 2700"
3. Device Detail → "Start Guided Teardown"
4. Teardown Runner → Complete all steps
   - Test safety gates (should block progress)
   - Test educational cards (should open/close)
   - Upload image for AI verification
5. Teardown Complete → "List on Marketplace"
6. Register Part modal → Fill form → Submit
7. Marketplace → Verify listing appears

### Flow 2: Gamification
1. Profile → Check XP updates
2. Leaderboard → Verify rankings
3. Profile → Check badges/artifacts unlock

### Flow 3: Modal UX (Bug Fix Verification)
1. Marketplace → "Register Part"
2. **Verify**: Modal fits on screen without zooming
3. **Verify**: Can scroll within modal if needed
4. **Verify**: Click outside closes modal
5. **Verify**: X button closes modal

## ⚡ Quick Win Checklist

Before deploying, verify these 5 things:
- [ ] Modal bug is fixed (test on Marketplace page)
- [ ] Images lazy load (open DevTools Network, scroll page)
- [ ] Lighthouse Performance score > 80
- [ ] All pages load without console errors
- [ ] Keyboard Tab key shows visible focus outlines

## 🐛 Common Issues & Fixes

### Issue: "Missing Supabase environment variables"
**Fix**: Check `.env` file has:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### Issue: Build fails with TypeScript errors
**Fix**: Run `npx vite build` instead of `npm run build`

### Issue: Images not loading
**Fix**: Check Supabase Storage bucket is public

### Issue: AI verification not working
**Fix**: Check Gemini API key in Supabase Edge Function secrets

## 📊 Success Criteria

### Minimum Bar for Deployment
- ✅ No critical bugs (e.g., modals work)
- ✅ No console errors on main pages
- ✅ Build succeeds
- ✅ Lighthouse Performance > 70
- ✅ Basic keyboard navigation works

### Ideal Bar for Deployment
- ✅ All critical flows tested (see above)
- ✅ Lighthouse all scores > 90
- ✅ Cross-browser tested
- ✅ Mobile responsive verified
- ✅ Accessibility audit passed

## 🎯 Next Steps After Testing

1. If all tests pass → **Deploy to Vercel**
2. If critical bugs found → **Fix and retest**
3. If minor issues found → **Document as known issues**

## 📚 Resources

- Full testing checklist: `TESTING.md`
- Improvements summary: `POST_MVP_IMPROVEMENTS.md`
- Implementation plan: `to-do.md`
- Product requirements: `PRD.md`

---

**Good luck! 🚀**
