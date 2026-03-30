#!/usr/bin/env python3
"""
Math Heroes — Azure TTS Audio Generator
========================================
Generates all pre-recorded audio files for the Math Heroes PWA.
Uses Azure Cognitive Services TTS with emotion styles (cheerful, empathetic, excited).

SETUP:
  1. Create a free Azure account at portal.azure.com
  2. Create a "Speech" resource (free tier F0 = 500,000 chars/month, forever)
  3. Copy the Key 1 value from "Keys and Endpoint"
  4. Note your region (e.g. "eastus", "westeurope")
  5. Set environment variables (or edit CONFIG below):
       set AZURE_TTS_KEY=your_key_here
       set AZURE_TTS_REGION=eastus

RUN:
  pip install requests
  python scripts/generate-azure-audio.py

OUTPUT:
  ~162 MP3 files in audio/ subfolders (num/, op/, fb/, q/, streak/, mission/, misc/)
  Estimated total size: ~2 MB
  Estimated chars used: ~7,000 (well within 500K free tier)

VOICES TO TRY:
  en-US-JennyNeural   — warm, natural female (recommended)
  en-US-AnaNeural     — child's voice (fun for a kids' app!)
  en-US-AriaNeural    — bright, expressive female
  en-US-SaraNeural    — clear, friendly female
"""

import os
import sys
import time
import requests
from pathlib import Path

# ── CONFIG ────────────────────────────────────────────────────────────────────
AZURE_KEY    = os.environ.get("AZURE_TTS_KEY", "")        # paste key here if not using env vars
AZURE_REGION = os.environ.get("AZURE_TTS_REGION", "eastus")
VOICE        = "en-US-JennyNeural"   # change to en-US-AnaNeural for a child's voice
OUT_DIR      = Path(__file__).parent.parent / "audio"
SKIP_EXISTING = True   # set False to regenerate all files
# ─────────────────────────────────────────────────────────────────────────────

if not AZURE_KEY:
    print("ERROR: AZURE_TTS_KEY is not set.")
    print("  Set it via: set AZURE_TTS_KEY=your_key_here")
    print("  Or edit the AZURE_KEY variable in this script.")
    sys.exit(1)

total_chars = 0
generated   = 0
skipped     = 0
errors      = 0


def ssml(text, style=None, rate="0%", pitch="+5%", voice=VOICE):
    """Build SSML with optional emotion style."""
    inner = f'<prosody rate="{rate}" pitch="{pitch}">{text}</prosody>'
    if style:
        inner = f'<mstts:express-as style="{style}">{inner}</mstts:express-as>'
    return (
        '<speak version="1.0" xml:lang="en-US" '
        'xmlns="http://www.w3.org/2001/10/synthesis" '
        'xmlns:mstts="https://www.w3.org/2001/mstts">'
        f'<voice name="{voice}">{inner}</voice>'
        '</speak>'
    )


def synth(text_ssml, out_path):
    """Call Azure TTS REST API and save MP3. Returns True on success."""
    global total_chars, generated, skipped, errors

    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if SKIP_EXISTING and out_path.exists():
        print(f"  skip: {out_path.relative_to(OUT_DIR.parent)}")
        skipped += 1
        return True

    total_chars += len(text_ssml)
    url = f"https://{AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1"
    headers = {
        "Ocp-Apim-Subscription-Key": AZURE_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "MathHeroesAudioGen/1.0",
    }

    r = requests.post(url, headers=headers, data=text_ssml.encode("utf-8"))

    if r.status_code == 200:
        out_path.write_bytes(r.content)
        size_kb = len(r.content) / 1024
        print(f"  ✓ {out_path.relative_to(OUT_DIR.parent)}  ({size_kb:.1f} KB)")
        generated += 1
        time.sleep(0.12)   # gentle rate limiting (~8 req/sec)
        return True
    else:
        print(f"  ✗ ERROR {r.status_code}: {r.text[:120]}")
        errors += 1
        time.sleep(0.5)
        return False


# ═══════════════════════════════════════════════════════════════════════════════
# PHRASES
# ═══════════════════════════════════════════════════════════════════════════════

print(f"\nMath Heroes Audio Generator")
print(f"Voice: {VOICE}  |  Region: {AZURE_REGION}")
print(f"Output: {OUT_DIR}\n")

# ── Numbers 0–100 ─────────────────────────────────────────────────────────────
print("[1/7] Numbers (0–100)...")
for n in range(101):
    synth(ssml(str(n), rate="-5%", pitch="+5%"), OUT_DIR / f"num/num_{n}.mp3")

# ── Operators ─────────────────────────────────────────────────────────────────
print("\n[2/7] Operators...")
for key, text in [
    ("plus",       "plus"),
    ("minus",      "minus"),
    ("times",      "times"),
    ("divided_by", "divided by"),
    ("equals",     "equals"),
]:
    synth(ssml(text, rate="-5%", pitch="+5%"), OUT_DIR / f"op/op_{key}.mp3")

# ── Question frame ─────────────────────────────────────────────────────────────
print("\n[3/7] Question frame...")
synth(ssml("How much is", rate="-5%", pitch="+10%"), OUT_DIR / "q/how_much_is.mp3")

# ── Feedback phrases ───────────────────────────────────────────────────────────
print("\n[4/7] Feedback phrases...")

# Correct (6 variants, cheerful style)
for i, phrase in enumerate([
    "Correct!",
    "Great job!",
    "Amazing!",
    "You are a hero!",
    "Perfect!",
    "Awesome!",
]):
    synth(ssml(phrase, style="cheerful", rate="+5%", pitch="+10%"), OUT_DIR / f"fb/fb_correct_{i}.mp3")

# Wrong / explanation (empathetic style — encouraging, not punishing)
synth(ssml("Almost! Try again.",   style="empathetic", rate="-5%", pitch="+5%"), OUT_DIR / "fb/fb_wrong.mp3")
synth(ssml("Almost! The answer is", style="empathetic", rate="-5%", pitch="+5%"), OUT_DIR / "fb/fb_almost.mp3")
synth(ssml("because",               rate="-5%", pitch="+5%"),                     OUT_DIR / "fb/fb_because.mp3")

# ── Streak announcements ───────────────────────────────────────────────────────
print("\n[5/7] Streak announcements...")
for key, text in [
    ("2",  "Two in a row!"),
    ("3",  "Three in a row! Amazing!"),
    ("5",  "Five in a row! You are a superhero!"),
    ("10", "Ten in a row! Unstoppable!"),
]:
    synth(ssml(text, style="excited", rate="+5%", pitch="+15%"), OUT_DIR / f"streak/streak_{key}.mp3")

# ── Mission intros (36 levels, without player name) ────────────────────────────
print("\n[6/7] Mission intros...")
MISSIONS = {
    "1_1": "Time to run!",
    "1_2": "Three paths. Only one is correct!",
    "1_3": "Find all the numbers bigger than four!",
    "1_4": "Find two numbers that add up to the target!",
    "1_5": "What is the missing number? Build the bridge!",
    "1_6": "Doctor Zero is here! Three missions to free the city!",
    "2_1": "Climb the Web Tower!",
    "2_2": "Match the numbers to power the web shield!",
    "2_3": "Pick the right path through the webs!",
    "2_4": "Find all the numbers bigger than seven!",
    "2_5": "Build the spider bridge! What number is missing?",
    "2_6": "The Web King awaits! Three challenges to free the tower!",
    "3_1": "First experiment in the Iron Lab!",
    "3_2": "Choose the correct path through the lab!",
    "3_3": "Power up the iron shield!",
    "3_4": "Find all numbers bigger than ten!",
    "3_5": "Build the metal bridge! Find the missing number!",
    "3_6": "The Iron Robot is activated! Three missions to shut it down!",
    "4_1": "The mushroom journey begins!",
    "4_2": "Match numbers to power the mushroom shield!",
    "4_3": "Find the path through the forest!",
    "4_4": "Build the nature bridge! What is the missing number?",
    "4_5": "Find all numbers bigger than fifteen!",
    "4_6": "The Mushroom King rises! Three missions to save the forest!",
    "5_1": "Launch into the Grand Circuit!",
    "5_2": "Pick the right track!",
    "5_3": "Charge the race shield!",
    "5_4": "Find all numbers bigger than twenty!",
    "5_5": "Build the race bridge! Find the missing number!",
    "5_6": "The final race! Three challenges to become champion!",
    "6_1": "Enter Doctor Zero's Lair!",
    "6_2": "Break through Zero's shield!",
    "6_3": "Three paths. Choose wisely!",
    "6_4": "Build the final bridge!",
    "6_5": "Find the hidden numbers in the darkness!",
    "6_6": "Doctor Zero himself! Three final missions to save the world!",
}
for key, text in MISSIONS.items():
    synth(ssml(text, style="excited", pitch="+5%"), OUT_DIR / f"mission/mission_{key}.mp3")

# ── Misc ───────────────────────────────────────────────────────────────────────
print("\n[7/7] Misc...")
synth(ssml("You found them all!", style="cheerful", rate="+5%", pitch="+10%"), OUT_DIR / "misc/found_all.mp3")

# ── Summary ────────────────────────────────────────────────────────────────────
print("\n" + "="*60)
print(f"Done!")
print(f"  Generated : {generated} files")
print(f"  Skipped   : {skipped} files (already existed)")
print(f"  Errors    : {errors}")
print(f"  SSML chars: ~{total_chars:,}  (free tier limit: 500,000/month)")

if errors:
    print(f"\n  {errors} file(s) failed. Check your key/region and retry.")
    print("  Tip: Run again — SKIP_EXISTING=True means only failed files are retried.")
else:
    print(f"\n  All audio files ready in: {OUT_DIR}")
    print("  Next: push to GitHub Pages and refresh on the tablet.")
