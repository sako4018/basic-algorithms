# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

All lessons from `PLAN.md` are built (19): loop trace, minimum, maximum, sum, count, linear and binary search, bubble, selection, insertion, merge and quick sort, recursion (factorial, Hanoi), sort comparison, stack and queue, BFS, DFS, Dijkstra. Lessons that are not bars use a view in `js/views/` (see `docs/ARCHITECTURE.md`). Still to do: progress and "провери се" tests, GitHub Pages, and looking at the new views on screen (see `docs/TASKS.md`). The look follows `TASTE.md`. `PLAN.md` (in Bulgarian) has the lesson format, the algorithm list per level and the remaining stages.

## What this is

An interactive algorithm visualizer for students aged 12–16. Each lesson shows an animation, a plain-language explanation of every step, the algorithm's code with the current line highlighted (tabs for C, C++, C#, Java, JS, Python), and a live variables table. The teacher moves through the steps with Next / Back.

- All UI text is in Bulgarian; algorithm terms also given in English in parentheses (e.g. "сортиране чрез мехурчета (bubble sort)").
- Audience is teenagers: modern, clean look — not a childish design.
- Look and behavior follow `TASTE.md` (Sarkis's agreed taste, in Bulgarian): black minimal theme, teacher-driven step-by-step controls, bars that visibly slide when swapped. Read it before changing any UI.

## Tech and running

- Plain HTML + CSS + vanilla JavaScript, no frameworks, no npm, no build step. The lesson's main `code` is JavaScript and steps point at its lines. Each lesson also has `otherLanguages` (c, cpp, csharp, java, python): the same algorithm with the same variable names, plus an optional `lineMap` from JS line numbers to that language's lines. When you edit a lesson, update every language and re-check the line mapping. Rationale and rejected options are in `PLAN.md` → "Технология".
- Do NOT pick tech or simplify code based on the students' skill level. The only criteria are: the code is easy to read, easy to edit, and the user (Sarkis) can open any file and fix it himself.
- Must work when `index.html` is opened directly from disk (`open index.html` → Safari), so avoid ES module imports or `fetch` of local files that break under `file://`; load scripts with plain `<script>` tags.
- Intended to be hosted on GitHub Pages later.

## Planned architecture

The core idea, which spans all lessons: **each algorithm does not animate itself.** A lesson file in `js/lessons/` runs the algorithm on the input array and produces a precomputed list of step objects (which elements to highlight/swap, which code line is active, current variable values, compare/swap counts, explanation text). The counts are not shown on screen any more; lessons use them in the final "Готово!" text. The shared player in `js/player.js` only renders a given step and handles step forward / step back, optional play / pause and the swap animation speed. Because steps are precomputed, stepping backward is just showing the previous step. Adding an algorithm = adding one lesson file that emits steps.

Lesson progress and quiz results will be stored in `localStorage` (planned, stage 5). Today only the theme (`theme`) and the chosen code language (`codeLanguage`) are stored there.

## Code style

Goal: any file can be opened, understood, and fixed by hand without tooling.

- One lesson = one file in `js/lessons/`: the displayed code (array of lines), and the function that runs the algorithm and builds the steps, together.
- Lesson files never touch the DOM. Only `js/player.js` (lesson screen) and `js/main.js` (home screen, navigation) draw.
- Plain functions and global variables loaded via `<script>` tags in `index.html`. No modules, no libraries; classes only if they clearly help.
- Descriptive names (`compareCount`, not `cc`), functions around 30 lines max, `const`/`let`, no clever one-liners.
- Comments only where the "why" isn't obvious.
- Step `lines` are 1-based and point at lines of the lesson's JS `code`. If you edit a lesson's code (any language), re-check every line number and the `lineMap` of the other languages.

## Checks and docs

- After touching any lesson or `player.js`, run `node tests/validate-lessons.js` (must print `ALL OK`), then open the lesson in Safari. C, C++ and Java code is only syntax-checked; it has never been run on this Mac (broken linker, no JDK).
- Details in `docs/`: `ARCHITECTURE.md` (how it works), `TASKS.md` (open work with IDs and statuses), `ROADMAP.md`, `DECISIONS.md`, `TESTING.md`. Keep `TASKS.md` statuses honest; mark a task done only after it was checked.

## Repo

- Remote: https://github.com/sako4018/basic-algorithms, branch `master`.
- Small commits, one step each; do not push without the user's explicit approval.
- Several agents may work at the same time. Each agent works in its own git worktree on its own branch (e.g. `stage1-player`), never directly on `master`, and commits + pushes only that branch using the `/safe-commit-and-push` skill. Branches are merged into `master` one at a time by the coordinating session after checking that the app still runs. Agents only edit the files assigned to them, so merges don't conflict.
