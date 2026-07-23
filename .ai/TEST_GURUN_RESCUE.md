# Git Rescue: Gurun Islamic Mobile Repository

**Repository:** https://github.com/Ahmad-Yu2up-Ar-Raf/gurun-islamic-mobile  
**Local directory:** `/mnt/c/Dev/Mobile/gurun`  
**Mode:** Execute in BUILD mode only  
**Case type:** Unzipped folder from older commit (not a clone)

---

## Case Context

The local project directory originates from an **unzipped folder** matching an older commit (`1173b94db874b424a7f0d95c7db976a5ac153ee1`), NOT a standard `git clone`. This means:

- No `.git/` directory exists locally
- Local files contain uncommitted development changes
- Git history exists only on GitHub, not locally
- Goal: link local files to remote WITHOUT losing uncommitted changes

---

## Recovery Steps

### Step 1: Initialize Git & Link Remote
```bash
cd /mnt/c/Dev/Mobile/gurun

# Initialize fresh git repo
git init

# Set branch name to match remote
git checkout -b main

# Add remote origin
git remote add origin https://github.com/Ahmad-Yu2up-Ar-Raf/gurun-islamic-mobile.git

# Verify remote
git remote -v
```

### Step 2: Fetch Remote History
```bash
# Download all remote objects without merging
git fetch origin

# Check what's on remote
git log --oneline -5 origin/main
```

### Step 3: Align History Without Losing Local Changes

**Option A — Soft Reset (Recommended for minimal changes):**
```bash
# Reset HEAD to match remote, but keep all local files staged
git reset origin/main --soft

# Check what local changes exist
git status
```

**Option B — Stash + Hard Reset + Stash Pop (Recommended for many local changes):**
```bash
# Save local changes
git stash

# Force match remote exactly
git reset origin/main --hard

# Restore local changes on top
git stash pop
```

**Option C — Rebase (if local commits exist):**
```bash
# If local commits were made, rebase them onto remote
git rebase origin/main
```

### Step 4: Resolve Conflicts (if any)
```bash
# If git stash pop or rebase causes conflicts:
# 1. Open conflicted files and resolve manually
# 2. Mark as resolved:
git add <resolved-file>

# Continue rebase if applicable:
git rebase --continue
```

### Step 5: Verify State
```bash
git log --oneline -10
git status
git diff --stat
```

---

## 1-Command AI Auto-Commit Workflow (Daily Use)

### Install LLM CLI (one-time)
```bash
pip install llm
```

### Configure for OmniRoute
```bash
llm keys set openai --url http://localhost:20128/v1 --key sk_omniroute
```

### Test the AI Commit
```bash
# Make some changes first, then:
git add -A && git diff --cached | llm -m omniroute/my-kiro-claude "Generate a short conventional commit message (format: type(scope): description). Focus on WHAT changed and WHY." && git commit -F- && git push
```

### Create Shell Alias (add to ~/.bashrc or ~/.zshrc)
```bash
alias ai-commit='git add -A && git diff --cached | llm -m omniroute/my-kiro-claude "Generate a conventional commit message (type(scope): description). Max 72 chars. Explain WHAT and WHY, not HOW." && git commit -F- && git push'
```

After adding to shell config:
```bash
source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null || true
```

### Usage
```bash
# After making code changes, just run:
ai-commit

# Or with a custom prompt:
git add -A && git diff --cached | llm -m omniroute/my-kiro-claude "Summarize these changes for a commit message" && git commit -F- && git push
```

---

## Troubleshooting

### "fatal: not a git repository"
→ You haven't run `git init` yet. Start from Step 1.

### "fatal: refusing to merge unrelated histories"
→ Add `--allow-unrelated-histories` when pulling, or use the soft reset approach (Option A).

### "error: Your local changes would be overwritten"
→ Use Option B (stash approach) to save changes before aligning history.

### Push rejected
→ Remote has commits you don't have locally. Run `git fetch origin` then `git rebase origin/main` or `git pull --rebase origin main`.

### "llm: command not found"
→ Install: `pip install llm` or `npm install -g @simonw/llm`

---

## Verification Checklist

After rescue is complete:
- [ ] `git log --oneline` shows history from remote
- [ ] `git status` shows no unexpected changes
- [ ] Local file modifications are preserved
- [ ] `git remote -v` shows correct origin
- [ ] `git push` succeeds without errors
- [ ] `ai-commit` alias works (if configured)
