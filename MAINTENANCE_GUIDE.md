# 🔧 Guide de Maintenance & Troubleshooting

## 📋 Quick Start pour Nouveaux Développeurs

### Installation Première Fois
```bash
# Clone ou navigate au repo
cd /Users/patoche/dev/italien

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to Netlify
npm run deploy
```

### Structure du Projet Rapide
```
src/
├── main.jsx              ← Entry point
├── App.jsx               ← Root component
├── index.css             ← Global styles + variables
├── mobile-optimizations.css ← Touch optimizations
└── components/
    ├── Dashboard.jsx     ← Module list
    ├── LessonPlayer.jsx  ← Lesson display + navigation
    └── Onboarding.jsx    ← Welcome screen
```

---

## 🐛 Troubleshooting Courant

### Problème: Bouton "Continuer" invisible sur mobile
**Cause**: Hauteur content trop grande (flexbox overflow)  
**Solution**: Vérifier les hauteurs dans `LessonPlayer.css`:
```css
.flashcard { height: 240px; } /* Mobile */
.lesson-body { max-height: calc(100vh - 160px); }
```

### Problème: Swipe navigation ne fonctionne pas
**Cause**: Event handlers non attachés ou touch events bloqués  
**Solution**: Vérifier dans `LessonPlayer.jsx`:
```jsx
onTouchStart={onTouchStart}
onTouchEnd={onTouchEnd}
onTouchMove={onTouchMove}
```

### Problème: Performance slow (Lighthouse < 90)
**Cause**: 
1. Images non optimisées
2. CSS non minifié
3. JS bundle trop gros

**Solution**:
```bash
# Check bundle size
npm run build -- --analyze

# Optimize images
npx imagemin src/assets/* --out-dir=src/assets

# Minify CSS manually if needed
npm install -D cssnano
```

### Problème: Layout cassé en paysage
**Cause**: Media query `max-height: 600px` pas appliquée  
**Solution**: Vérifier dans tous les fichiers CSS:
```css
@media (max-height: 600px) {
  .flashcard { height: 220px; }
}
```

### Problème: Texte coupé sur petit écran
**Cause**: Padding/margin excessif, font-size trop grand  
**Solution**: Réduire spacing mobile:
```css
@media (max-width: 767px) {
  .slide-content { padding: 0.25rem; }
  font-size: 0.9rem;
}
```

### Problème: Console CSS warnings
**Solution**: Valider avec W3C CSS Validator
```bash
# Online: https://jigsaw.w3.org/css-validator/
# Or local validation tools
```

---

## 🚀 Déploiement Quick Guide

### Local Testing Avant Deploy
```bash
# 1. Build local
npm run build

# 2. Preview build
npm run preview

# 3. Open browser
open http://localhost:4173

# 4. Test sur mobile (use DevTools)
# DevTools → Toggle device toolbar (Cmd+Shift+M)
```

### Deploy to Netlify
```bash
# Option 1: Automatic (via GitHub)
# Push to main branch → Netlify auto-deploys

# Option 2: Manual
npm run build
npx netlify deploy --prod --dir=dist

# Option 3: Using Netlify CLI
netlify login
netlify deploy --prod
```

### Vérifier le Déploiement
```bash
# Check production URL
open https://itallien.netlify.app

# Check unique deploy URL
# (shown in deploy output or on Netlify dashboard)

# Run Lighthouse test
# DevTools → Lighthouse → Generate report

# Expected score: 95+
```

### Rollback en Cas de Problème
```bash
# Via Netlify Dashboard
# Deployments → Choose previous version → Restore

# Via CLI
netlify api deployments --filter-state=active
netlify api deployments/[ID] --update '{"published":true}'
```

---

## 📝 Modifying Content

### Ajouter un Nouveau Module
1. **Edit `src/data/italianContent.js`**:
```javascript
export const lessons = [
  // ... existing lessons
  {
    id: 'new-module',
    name: 'Nuovo Modulo',
    description: 'Description here',
    slides: [
      { type: 'intro', title: '...', content: '...' },
      { type: 'flashcard', front: '...', back: '...', pronunciation: '...', context: '...' },
      // more slides
    ]
  }
];
```

2. **Test sur Dashboard**: Devrait apparaître automatiquement

### Éditer une Flashcard Existante
1. **Find in `italianContent.js`**: Search word or module
2. **Update front/back/pronunciation**
3. **Save and test locally**
4. **Deploy** (usually auto via git push)

### Ajouter du Contenu (Pronunciations, Context)
```javascript
{
  type: 'flashcard',
  front: 'Rosso',
  back: 'Red',
  pronunciation: 'ROHS-soh',  ← Add pronunciation
  context: 'Il cielo è rosso'  ← Add context sentence
}
```

---

## 🎨 CSS Customization

### Changer les Couleurs Primaires
**File**: `src/index.css`
```css
:root {
  --primary: #00C49A;        /* Change this */
  --primary-hover: #00A080;  /* And this */
  --accent: #FF6B6B;
  --background: #0A0E27;
  --surface: #141829;
}
```

### Ajouter une Nouvelle Media Query
```css
/* Mobile (320px - 767px) - Existing */
@media (max-width: 767px) { }

/* Extra small (320px - 480px) - New */
@media (max-width: 480px) {
  /* Extra adjustments for very small phones */
  .flashcard { height: 200px; }
}
```

### Changer les Dimensions Flashcard
**File**: `src/components/LessonPlayer.css`
```css
.flashcard {
  height: 280px;  ← Desktop height
}

@media (max-width: 767px) {
  .flashcard {
    height: 240px;  ← Mobile height (change here)
  }
}

@media (max-height: 600px) {
  .flashcard {
    height: 220px;  ← Landscape height (change here)
  }
}
```

---

## 🧪 Testing Checklist

### Avant Chaque Commit
- [ ] `npm run build` sans erreurs
- [ ] Aucune console error (F12 > Console)
- [ ] Responsive sur 3 appareils (mobile, tablet, desktop)
- [ ] Navigation fonctionne (click et swipe)
- [ ] Bouton "Continuer" visible

### Avant Chaque Deploy
- [ ] Lighthouse 95+
- [ ] Accessibility scan (no errors)
- [ ] Performance budget respected
- [ ] All tests passing
- [ ] No broken links

### Tester Localement
```bash
# DevTools Mobile View (Cmd+Shift+M)
- 320px (mobile)
- 768px (tablet)
- 1920px (desktop)

# Test Orientations
- Portrait
- Landscape

# Test Touch
- Tap (click)
- Swipe (drag)

# Test Accessibility
- Tab navigation
- Focus visible
- Color contrast
```

---

## 📊 Monitoring en Production

### Google Analytics (Future Setup)
```javascript
// Add to main.jsx
import { initializeAnalytics } from './analytics';
initializeAnalytics();

// Track events
trackEvent('lesson_started', { module: 'colori' });
trackEvent('lesson_completed', { module: 'colori' });
```

### Sentry Error Tracking (Future Setup)
```javascript
// Add to main.jsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production'
});
```

### Manual Monitoring
- Check browser console daily
- Monitor Netlify build logs
- Test app weekly on real device
- Collect user feedback

---

## 🔐 Security Checklist

- [ ] No sensitive data in client-side code
- [ ] HTTPS enabled (Netlify default)
- [ ] No exposed API keys
- [ ] Input validation implemented
- [ ] CORS headers correct
- [ ] CSP headers secure
- [ ] Dependencies up-to-date (`npm audit`)

### Update Dependencies Safely
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Update individual package
npm update package-name

# Check outdated packages
npm outdated
```

---

## 📚 Documentation Files

**Toujours à jour**:
1. `README.md` - Project overview
2. `MOBILE_OPTIMIZATIONS.md` - Mobile guide
3. `MOBILE_USER_GUIDE.md` - User instructions
4. `MOBILE_BUTTON_FIX.md` - Recent fix details
5. `CSS_OPTIMIZATION_TECHNICAL.md` - CSS deep dive
6. `VALIDATION_CHECKLIST.md` - QA checklist
7. `PROJECT_STATUS_COMPLETE.md` - Current status
8. `ROADMAP_FUTURE_FEATURES.md` - Future plans
9. `QUICK_REFERENCE.md` - Quick answers

---

## 🎯 Daily Developer Tasks

### Start of Day
1. Pull latest changes: `git pull`
2. Start dev server: `npm run dev`
3. Open DevTools: `F12`
4. Check browser console for errors

### During Development
1. Make changes
2. Test locally (multiple viewports)
3. Commit meaningful: `git commit -m "fix: ..."`
4. Push when ready: `git push`

### End of Day
1. Make sure build passes: `npm run build`
2. No console errors
3. Code review before merge (if applicable)
4. Document any TODOs in code

---

## 🆘 Emergency Procedures

### Site Down
1. Check Netlify status: https://app.netlify.com
2. Check GitHub Actions (if using CI/CD)
3. Rollback to previous deploy
4. Check error logs
5. Fix issue locally
6. Re-deploy

### Build Failing
```bash
# Clear caches
rm -rf node_modules
rm package-lock.json
npm install

# Rebuild
npm run build

# Check errors carefully
# Usually: missing import or syntax error
```

### CSS Broken on Mobile
1. Check if media query applied
2. Clear browser cache (Cmd+Shift+R on Chrome)
3. Test on real device (not just DevTools)
4. Check CSS file order (specificity)
5. Verify breakpoint values match

### JavaScript Error
1. Check console (F12 > Console)
2. Read error message carefully
3. Check line number in error
4. Look at source map
5. Test in different browser
6. Clear localStorage if needed

---

## 📞 Getting Help

### Check These First
1. README.md - Project info
2. QUICK_REFERENCE.md - Common Q&A
3. MOBILE_BUTTON_FIX.md - Known issues
4. Error message in console (F12)
5. Similar issue in code comments

### Ask the Team
1. Check Slack/Discord (if available)
2. Mention specific error
3. Describe what you were doing
4. Include screenshots
5. Mention device/browser

### Debug Tips
```javascript
// Log state
console.log('State:', { slideIndex, flipped });

// Log events
console.log('Slide changed', slideIndex);

// Check CSS applied
// DevTools → Elements → Inspect → Styles tab
```

---

## 🔄 Regular Maintenance

### Weekly
- [ ] Check error logs
- [ ] Test on 2-3 real devices
- [ ] Update dependencies check
- [ ] Review user feedback

### Monthly
- [ ] Full Lighthouse audit
- [ ] Accessibility audit
- [ ] Performance profile
- [ ] Security check (`npm audit`)
- [ ] Backup database (if using)

### Quarterly
- [ ] Update all dependencies
- [ ] Major version upgrades
- [ ] Refactor technical debt
- [ ] Plan next features
- [ ] Team retrospective

---

## 💾 Backup Strategy

### Code
- ✅ Git repository (automatic)
- ✅ GitHub backup (if using)
- ✅ Local backup: `git clone` to external drive

### Database (Future)
- User progress
- User profiles
- Analytics data
- Backup frequency: Daily automated

### Configuration
- Environment variables
- Firebase config
- API keys (secure storage)
- SSL certificates

---

## 🎓 Learning Resources

### For Developers New to Project
1. Read README.md (overview)
2. Read QUICK_REFERENCE.md (common tasks)
3. Review React components (start with App.jsx)
4. Understand data structure (italianContent.js)
5. Test manually (npm run dev)
6. Study CSS files (mobile optimizations)

### For CSS Improvements
- MDN CSS Reference
- Can I Use? (browser support)
- CSS Tricks
- Responsive Design Patterns

### For React Improvements
- React Hooks Documentation
- React Best Practices
- Performance Optimization Guide

### For Mobile Optimization
- MDN Web APIs
- Web.dev/responsive-web-design
- Google Mobile-Friendly Test

---

## 🚀 Success Metrics to Track

```
Monthly Checklist:
☐ Build time < 1 second
☐ Bundle size < 80kB (gzip)
☐ Lighthouse score 95+
☐ Zero breaking changes
☐ Zero production errors (console)
☐ All tests passing
☐ Performance stable
☐ Accessibility maintained
```

---

## 📝 Change Log Template

When making changes, log them:

```
## [Date] - [Developer]

### Changed
- Updated flashcard height: 300px → 280px

### Fixed
- Button not visible on small screens

### Added
- Dark mode support (planned)

### Deprecated
- Old CSS animation (still works, will remove next quarter)

### Testing
- ✅ Tested on iPhone SE (375px)
- ✅ Tested on iPad (768px)
- ✅ Lighthouse: 95
```

---

## 🎯 Final Checklist for New Maintainers

- [ ] Access to GitHub repo
- [ ] Access to Netlify dashboard
- [ ] Read entire README.md
- [ ] Read QUICK_REFERENCE.md
- [ ] Run `npm install && npm run dev` successfully
- [ ] Test app locally (multiple views)
- [ ] Understand folder structure
- [ ] Know where to find key files
- [ ] Know how to deploy
- [ ] Know how to rollback
- [ ] Know emergency procedures
- [ ] Know where documentation is
- [ ] Ask questions (don't assume!)

---

**Document Created**: 2 janvier 2026  
**Last Updated**: 2 janvier 2026  
**Status**: Active  
**Maintained by**: Development Team
