# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

No application code exists yet — only `PLAN.md` (the agreed plan, in Bulgarian) and a placeholder `README.md`. Read `PLAN.md` before starting any stage; it defines the lesson format, the algorithm list per level, and the build stages (stage 1 = home screen + shared player + Bubble sort). Update this file once real code lands.

## What this is

An interactive algorithm visualizer for students aged 12–16. Each lesson shows an animation, a plain-language explanation of every step, the algorithm's JavaScript code with the current line highlighted, a live variables table, and comparison/swap counters.

- All UI text is in Bulgarian; algorithm terms also given in English in parentheses (e.g. "сортиране чрез мехурчета (bubble sort)").
- Audience is teenagers: modern, clean look with light and dark themes — not a childish design.

## Tech and running

- Plain HTML + CSS + vanilla JavaScript, no frameworks, no npm, no build step. The code shown inside lessons is also JavaScript (not C#, not a separate pseudocode) — one language for the whole project. Rationale and rejected options are in `PLAN.md` → "Технология".
- Do NOT pick tech or simplify code based on the students' skill level. The only criteria are: the code is easy to read, easy to edit, and the user (Sarkis) can open any file and fix it himself.
- Must work when `index.html` is opened directly from disk (`open index.html` → Safari), so avoid ES module imports or `fetch` of local files that break under `file://`; load scripts with plain `<script>` tags.
- Intended to be hosted on GitHub Pages later.

## Planned architecture

The core idea, which spans all lessons: **each algorithm does not animate itself.** A lesson file in `js/lessons/` runs the algorithm on the input array and produces a precomputed list of step objects (which elements to highlight/swap, which code line is active, current variable values, counter values, explanation text). The shared player in `js/player.js` only renders a given step and handles play / pause / step forward / step back / speed. Because steps are precomputed, stepping backward is just showing the previous step. Adding an algorithm = adding one lesson file that emits steps.

Lesson progress and quiz results are stored in `localStorage`.

## Code style

Goal: any file can be opened, understood, and fixed by hand without tooling.

- One lesson = one file in `js/lessons/`: the displayed code (array of lines), and the function that runs the algorithm and builds the steps, together.
- Lesson files never touch the DOM. Only `js/player.js` (lesson screen) and `js/main.js` (home screen, navigation) draw.
- Plain functions and global variables loaded via `<script>` tags in `index.html`. No modules, no libraries; classes only if they clearly help.
- Descriptive names (`compareCount`, not `cc`), functions around 30 lines max, `const`/`let`, no clever one-liners.
- Comments only where the "why" isn't obvious.
- Step `lines` are 1-based and must match the lesson's displayed code lines. If you edit a lesson's code array, re-check every line number in that lesson.

## Repo

- Remote: https://github.com/sako4018/basic-algorithms, branch `master`.
- Small commits, one step each; do not push without the user's explicit approval.
- Several agents may work at the same time. Each agent works in its own git worktree on its own branch (e.g. `stage1-player`), never directly on `master`, and pushes only that branch. Branches are merged into `master` one at a time by the coordinating session after checking that the app still runs. Agents only edit the files assigned to them, so merges don't conflict.
