# Application Development & Deployment Playbook

## Complete Guide: From Development to Production on Render

---

## Phase 1: Initial Setup & Development

### 1.1 Install Node.js
```bash
# Download and install from nodejs.org
# Verify installation
node --version
npm --version
```

### 1.2 Install Dependencies & Run Locally
```bash
cd "/path/to/your/project"
npm install
npm run dev
# App runs at http://localhost:8080/
```

### 1.3 Fix Initial Errors
- Read error messages carefully
- Fix missing component imports
- Update routing structure
- Ensure all files are properly imported

---

## Phase 2: Design Customization

### 2.1 Remove Third-Party Branding
**Files to update:**
- `index.html` - Update title, meta tags, remove vendor branding
- `vite.config.ts` - Remove vendor plugins

### 2.2 Implement Custom Color Scheme
**File:** `src/index.css`

```css
:root {
  --background: 220 25% 97%;
  --foreground: 230 20% 20%;
  --primary: 220 70% 50%;        /* Your primary color */
  --primary-foreground: 220 25% 97%;
  --secondary: 260 30% 92%;      /* Your secondary color */
  --accent: 270 50% 60%;         /* Your accent color */
}
```

**Update components** that use old color variables

---

## Phase 3: Feature Development

### 3.1 Add Flexible Layouts
- Create state for layout options (e.g., column count)
- Add UI controls (buttons/toggles)
- Implement dynamic CSS classes based on state

### 3.2 Refine Core Features
- Rename modules for clarity
- Update prompts and user flows
- Implement categorization systems
- Add visual feedback (icons, colors)

---

## Phase 4: AI Integration (Optional)

### 4.1 Create AI Service
**File:** `src/lib/aiService.ts`

```typescript
export async function generatePersonalizedQuestions(
  apiKey: string,
  // ... other parameters
): Promise<AIQuestionResponse> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [/* your messages */],
      temperature: 0.8,
      max_tokens: 500,
    }),
  });
  // Handle response
}
```

### 4.2 Add API Key Management
**Update:** `src/hooks/useLocalStorage.ts`
- Add storage key for API key
- Add setting to toggle AI features

**Update:** `src/pages/Settings.tsx`
- Add API key input with show/hide toggle
- Add enable/disable switch for AI features

### 4.3 Integrate AI into Features
- Add state for AI responses
- Create loading states
- Add error handling
- Implement iterative/contextual questioning

### 4.4 Add AI Summaries
```typescript
// Auto-generate summary when questions answered
useEffect(() => {
  if (allQuestionsAnswered && !summary) {
    generateSummary();
  }
}, [responses]);
```

---

## Phase 5: Prepare for Deployment

### 5.1 Test Build Locally
```bash
npm run build
# Check dist/ folder for output
```

### 5.2 Create Deployment Configuration

**File:** `render.yaml`
```yaml
services:
  - type: web
    name: your-app-name
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

**File:** `public/_redirects`
```
/*    /index.html   200
```

---

## Phase 6: Git Setup & Push to GitHub

### 6.1 Check Git Status
```bash
git status
# See what files changed
```

### 6.2 Install GitHub CLI (if not installed)
```bash
brew install gh
```

### 6.3 Authenticate with GitHub
```bash
gh auth login
# Follow prompts:
# - Copy one-time code
# - Open browser URL
# - Paste code
# - Authorize
```

### 6.4 Configure Git to Use GitHub CLI
```bash
gh auth setup-git
```

### 6.5 Commit Changes
```bash
git add .

git commit -m "$(cat <<'EOF'
Your commit message here

Describe your changes:
- Feature 1
- Feature 2
- Configuration updates

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 6.6 Push to GitHub
```bash
git push origin main
```

**Verify on GitHub:** Check that `render.yaml` appears in your repository

---

## Phase 7: Deploy to Render

### 7.1 Create Render Account
- Visit https://render.com
- Sign up or log in
- Connect GitHub account

### 7.2 Create New Static Site
1. Click **"New +"** → **"Static Site"**
2. Select your GitHub repository
3. Render auto-detects `render.yaml`
4. Review settings:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
5. Click **"Create Static Site"**

### 7.3 Wait for Deployment
- Build takes 1-2 minutes
- You'll get a URL like: `https://your-app.onrender.com`

### 7.4 Configure Custom Domain (Optional)
- Go to site Settings → Custom Domain
- Add your domain
- Update DNS records as instructed

---

## Phase 8: Post-Deployment

### 8.1 Verify Deployment
- Visit your live URL
- Test all features
- Check routing works (React Router)
- Test on mobile devices

### 8.2 Set Up Auto-Deploy
- Already configured by default
- Every push to `main` triggers new deployment

### 8.3 Monitor & Maintain
- Check Render dashboard for build logs
- Monitor any errors
- Update dependencies regularly

---

## Quick Reference Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Git
```bash
git status           # Check status
git add .            # Stage all changes
git commit -m "..."  # Commit changes
git push origin main # Push to GitHub
```

### GitHub CLI
```bash
gh auth login        # Authenticate
gh auth setup-git    # Configure git credentials
gh auth status       # Check auth status
```

---

## Troubleshooting

### Build Fails
- Check `package.json` for correct scripts
- Ensure all dependencies are in `dependencies`, not `devDependencies`
- Check build logs for specific errors

### Routes Don't Work
- Verify `public/_redirects` file exists
- Check `render.yaml` has route rewrite configuration

### Can't Push to GitHub
- Run `gh auth login` again
- Run `gh auth setup-git`
- Check you have write access to repository

### Environment Variables Needed
- Add them in Render Dashboard → Environment
- They'll be available during build time

---

## File Checklist for Deployment

✅ `render.yaml` - Render configuration
✅ `public/_redirects` - Client-side routing
✅ `package.json` - With `build` script
✅ `.gitignore` - Excludes node_modules, dist
✅ All source files committed to Git
✅ Pushed to GitHub

---

## Future Deployments

For your next project, follow these phases in order:
1. ✅ Initial Setup (10 min)
2. ✅ Design Customization (30 min)
3. ✅ Feature Development (varies)
4. ⚙️ AI Integration (optional, 1-2 hours)
5. ✅ Deployment Prep (15 min)
6. ✅ Git & GitHub (10 min)
7. ✅ Render Deploy (5 min)
8. ✅ Verify (10 min)

**Total time (excluding feature dev): ~1.5 hours**

---

## Key Learnings

1. **Always test build locally** before deploying
2. **GitHub CLI makes authentication easy** - install it first
3. **render.yaml automates configuration** - create it early
4. **_redirects is essential** for React Router apps
5. **Commit messages matter** - be descriptive for future reference
6. **Free tier on Render** includes SSL, CDN, auto-deploy

---

*This playbook created on December 5, 2024*
*For: Values Compass App Deployment*
*Platform: Render*
*Stack: Vite + React + TypeScript*
