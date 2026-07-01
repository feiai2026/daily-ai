#!/usr/bin/env bash
set -euo pipefail

SKILL_NAME="daily-ai"
REPO_TARBALL_URL="https://github.com/feiai2026/daily-ai/archive/refs/heads/main.tar.gz"

usage() {
  cat <<'USAGE'
Install daily-ai skill.

Usage:
  curl -fsSL https://raw.githubusercontent.com/feiai2026/daily-ai/main/install.sh | bash
  curl -fsSL https://raw.githubusercontent.com/feiai2026/daily-ai/main/install.sh | bash -s -- codex
  bash install.sh [auto|codex|claude|openclaw|opencode|all]

Default mode is auto:
  - install into existing agent skill roots
  - if no known root exists, install into Codex's skill root
USAGE
}

mode="${1:-auto}"
if [[ "$mode" == "-h" || "$mode" == "--help" ]]; then
  usage
  exit 0
fi

tmp_dir="$(mktemp -d)"
cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT

curl -fsSL "$REPO_TARBALL_URL" | tar -xz -C "$tmp_dir"
src_dir="$tmp_dir/daily-ai-main/$SKILL_NAME"

if [[ ! -f "$src_dir/SKILL.md" ]]; then
  echo "Could not find $SKILL_NAME/SKILL.md in downloaded archive." >&2
  exit 1
fi

codex_root="${CODEX_HOME:-$HOME/.codex}/skills"
claude_root="$HOME/.claude/skills"
openclaw_root="$HOME/.openclaw/skills"
opencode_root="$HOME/.config/opencode/skills"

destinations=()
case "$mode" in
  auto)
    [[ -d "$(dirname "$codex_root")" ]] && destinations+=("$codex_root")
    [[ -d "$(dirname "$claude_root")" ]] && destinations+=("$claude_root")
    [[ -d "$(dirname "$openclaw_root")" ]] && destinations+=("$openclaw_root")
    [[ -d "$(dirname "$opencode_root")" ]] && destinations+=("$opencode_root")
    if [[ "${#destinations[@]}" -eq 0 ]]; then
      destinations+=("$codex_root")
    fi
    ;;
  codex)
    destinations+=("$codex_root")
    ;;
  claude)
    destinations+=("$claude_root")
    ;;
  openclaw)
    destinations+=("$openclaw_root")
    ;;
  opencode)
    destinations+=("$opencode_root")
    ;;
  all)
    destinations+=("$codex_root" "$claude_root" "$openclaw_root" "$opencode_root")
    ;;
  *)
    echo "Unknown mode: $mode" >&2
    usage >&2
    exit 1
    ;;
esac

installed=0
for root in "${destinations[@]}"; do
  mkdir -p "$root"
  dest="$root/$SKILL_NAME"
  if [[ -d "$dest" ]]; then
    rm -rf "$dest"
  fi
  cp -R "$src_dir" "$dest"
  echo "Installed $SKILL_NAME -> $dest"
  installed=$((installed + 1))
done

echo
echo "Done. Restart your agent to pick up the new skill."
echo "Skill trigger: \$daily-ai"
