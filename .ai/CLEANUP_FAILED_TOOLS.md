# CLEANUP: Purge Failed Tools (One-Time Execution)

**Targets:** GitNexus, Graphify, Claude-Mem + Bun package manager  
**Scope:** This project only — not reusable  
**Mode:** Execute in BUILD mode only  
**Prerequisites:** Read-only audit complete, user approved cleanup

---

## 1. Claude-Mem — Complete Removal

### 1.1 Stop Worker & Kill Processes
```bash
# Find and kill claude-mem worker process
pkill -f "claude-mem" 2>/dev/null || true
pkill -f "worker-service.cjs" 2>/dev/null || true

# Windows (if running via WSL interop):
powershell.exe -Command "Get-Process | Where-Object { \$_.ProcessName -like '*claude-mem*' -or \$_.CommandLine -like '*claude-mem*' } | Stop-Process -Force 2>/dev/null" 2>/dev/null || true
```

### 1.2 Remove Plugin & Config Files
```bash
# Remove from project opencode.json (check both WSL and Windows paths)
# Remove line: "C:\\Users\\AHMADY~1\\.config\\opencode\\plugins\\claude-mem.js"
# Or: "./plugins/claude-mem.js"

# Remove WSL plugin file
rm -f /home/yusuf/.opencode/plugins/claude-mem.js 2>/dev/null || true

# Remove Windows plugin file
rm -f "/mnt/c/Users/Ahmad Yusuf Ar rafi/.config/opencode/plugins/claude-mem.js" 2>/dev/null || true

# Remove from Windows config
rm -f "/mnt/c/Users/Ahmad Yusuf Ar rafi/.config/opencode/opencode.json" 2>/dev/null || true
```

### 1.3 Remove Claude-Mem Data
```bash
# WSL data
rm -rf /home/yusuf/.claude-mem/ 2>/dev/null || true
rm -rf /home/yusuf/.local/share/claude-mem/ 2>/dev/null || true

# Windows data (via WSL mount)
rm -rf "/mnt/c/Users/Ahmad Yusuf Ar rafi/.claude-mem/" 2>/dev/null || true
```

### 1.4 Remove Claude-Mem from opencode.json
Edit `opencode.json` (check all locations: `~/.opencode/`, `~/.config/opencode/`, `C:\Dev\`):
- Remove `"claude-mem"` MCP entry (or `"claude-mem-mcp"` if renamed)
- Remove any plugin path pointing to claude-mem.js
- Remove any `CLAUDE_MEM_*` references if present

### 1.5 Remove MCP Entry
```json
// Remove from mcp section in opencode.json:
"claude-mem": { ... }
// or
"claude-mem-mcp": { ... }
```

---

## 2. GitNexus — Complete Removal

### 2.1 Uninstall CLI
```bash
# Remove npm global package
npm uninstall -g gitnexus 2>/dev/null || true
npx gitnexus uninstall 2>/dev/null || true

# Remove project .gitnexus directory
rm -rf /mnt/c/Dev/Mobile/gurun/.gitnexus 2>/dev/null || true
```

### 2.2 Remove Config References
```bash
# Check ~/.opencode/opencode.json for gitnexus references
# Remove any "gitnexus" entries from MCP, plugins, or tools sections
```

---

## 3. Graphify — Complete Removal

### 3.1 Uninstall CLI
```bash
# Remove npm global package
npm uninstall -g graphify @graphify-labs/graphify 2>/dev/null || true

# Remove pip/uv package if installed via Python
pip uninstall -y graphify graphifyy 2>/dev/null || true
uv tool uninstall graphifyy 2>/dev/null || true
```

### 3.2 Remove Project Artifacts
```bash
# Remove generated graph directory
rm -rf /mnt/c/Dev/Mobile/gurun/graphify-out/ 2>/dev/null || true

# Remove from .gitignore if graphify-out/ was added
# Edit .gitignore and remove 'graphify-out/' line
```

---

## 4. Bun Package Manager — Complete Removal

### 4.1 Remove Bun Binary & Cache
```bash
# WSL/Linux path
rm -rf /home/yusuf/.bun/ 2>/dev/null || true

# Windows path (via WSL mount)
rm -rf "/mnt/c/Users/Ahmad Yusuf Ar rafi/.bun/" 2>/dev/null || true

# Remove from npm global (if installed via npm)
npm uninstall -g bun 2>/dev/null || true
```

### 4.2 Remove from PATH
```bash
# Edit ~/.bashrc or ~/.zshrc — remove or comment out:
# export BUN_INSTALL="$HOME/.bun"
# export PATH="$BUN_INSTALL/bin:$PATH"

# Reload shell config:
source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null || true
```

### 4.3 Remove Bun-related node_modules
```bash
# Check for any bun-related modules in global node_modules
rm -rf /home/yusuf/.nvm/versions/node/*/lib/node_modules/bun 2>/dev/null || true
```

---

## 5. Clean Config Files (opencode.json)

### 5.1 Check All Config Locations
```bash
# Check each location for references to the 3 failed tools
CONFIG_PATHS=(
  "/home/yusuf/.opencode/opencode.json"
  "/home/yusuf/.config/opencode/opencode.jsonc"
  "/mnt/c/Dev/opencode.json"
)

for path in "${CONFIG_PATHS[@]}"; do
  if [ -f "$path" ]; then
    echo "Checking: $path"
    # Look for claude-mem, gitnexus, graphify references
    grep -i "claude-mem\|gitnexus\|graphify" "$path" 2>/dev/null || echo "  → Clean"
  fi
done
```

### 5.2 Remove from MCP Section
Remove any entries named `"claude-mem"`, `"claude-mem-mcp"`, `"gitnexus"`, or `"graphify"` from the `"mcp"` object in opencode.json.

### 5.3 Remove from Plugin Section
Remove any plugin paths or package names referencing claude-mem, gitnexus, or graphify from the `"plugin"` array in opencode.json.

---

## 6. Verify Cleanup

### 6.1 Check No Processes Running
```bash
ps aux | grep -i "claude-mem\|gitnexus\|graphify" | grep -v grep || echo "No processes found — OK"
```

### 6.2 Check No Config References
```bash
grep -r "claude-mem\|gitnexus\|graphify" /home/yusuf/.opencode/ 2>/dev/null || echo "No config references — OK"
```

### 6.3 Check No Bun
```bash
which bun 2>/dev/null && echo "Bun STILL installed — manual removal needed" || echo "Bun removed — OK"
```

### 6.4 Check Project Clean
```bash
ls /mnt/c/Dev/Mobile/gurun/.gitnexus 2>/dev/null && echo "GitNexus artifacts remain" || echo "GitNexus clean — OK"
ls /mnt/c/Dev/Mobile/gurun/graphify-out 2>/dev/null && echo "Graphify artifacts remain" || echo "Graphify clean — OK"
```

---

## 7. Final Steps

1. **Restart OpenCode** — exit completely and reopen
2. **Verify no errors** — check that OpenCode starts without "connection closed" or "not found" errors
3. **Test clean state** — run a simple task to confirm everything works

---

**Note:** This is a ONE-TIME cleanup file. Do NOT copy to other projects. Each tool's removal is independent — if any step fails, proceed with the next. Safety: never delete files outside the listed paths.
