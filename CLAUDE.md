# SOMEjsPractice

React + Vite PWA for closed-book practice questions based on *Murach's JavaScript and jQuery*.
See `README.md` for commands, the storage layout and the `public/questions.json` format.

## Session log (required)

Keep `claude-log.md` up to date in every session in this folder:

- Append every interaction in order: the user's prompt **verbatim**, a short bullet list of the
  work done, and Claude's final response **verbatim**.
- Timestamp each entry in local time (`date '+%H:%M'`); start a new `## Session N — YYYY-MM-DD`
  heading for each new session.
- Write the user's prompt to the log when starting on it, and the response before finishing the turn.
- Never rewrite or delete earlier entries.

## Notes

- `src/config.js` holds `GITHUB_URL` (shown on the About page).
- After changing questions, verify that every `solution` passes its `tests` and that blank starter code fails them.
