# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

No application code exists yet — only `PLAN.md` (the agreed plan, in Bulgarian) and a placeholder `README.md`. Read `PLAN.md` before starting any stage; it defines the lesson format, the algorithm list per level, and the build stages (stage 1 = home screen + shared player + Bubble sort). Update this file once real code lands.

## What this is

An interactive algorithm visualizer for students aged 12–16. Each lesson shows an animation, a plain-language explanation of every step, the code with the current line highlighted (pseudocode + C# / Python / JavaScript), a live variables table, and comparison/swap counters.

- All UI text is in Bulgarian; algorithm terms also given in English in parentheses (e.g. "сортиране чрез мехурчета (bubble sort)").
- Audience is teenagers: modern, clean look with light and dark themes — not a childish design.

## Tech and running

- Plain HTML + CSS + vanilla JavaScript, no frameworks and no build step.
- Must work when `index.html` is opened directly from disk (`open index.html` → Safari), so avoid ES module imports or `fetch` of local files that break under `file://`; load scripts with plain `<script>` tags.
- Intended to be hosted on GitHub Pages later.

## Planned architecture

The core idea, which spans all lessons: **each algorithm does not animate itself.** A lesson file in `js/lessons/` runs the algorithm on the input array and produces a precomputed list of step objects (which elements to highlight/swap, which code line is active, current variable values, counter values, explanation text). The shared player in `js/player.js` only renders a given step and handles play / pause / step forward / step back / speed. Because steps are precomputed, stepping backward is just showing the previous step. Adding an algorithm = adding one lesson file that emits steps.

Lesson progress and quiz results are stored in `localStorage`.

## Repo

- Remote: https://github.com/sako4018/basic-algorithms, branch `master`.
- Small commits, one step each; do not push without the user's explicit approval.
