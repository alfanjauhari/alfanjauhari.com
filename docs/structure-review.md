# Structure review

The workspace split (`apps`, published `packages`, and copyable `examples`) is appropriate. Keep public package entry points and the flat Astro Actions API stable.

## Decisions

- Split the action registry by feature, with `actions/index.ts` composing the existing names.
  - Authentication, comments, likes, profile, and feed changes previously shared a 544-line file.
- Give authorization its own module and share browser-safe data contracts.
  - Admin checks import dashboard queries just to read the admin policy.
  - Comment types depend on an internal Astro action runtime entry and the full action registry.
  - The feed editor duplicates the dashboard feed model.
- Share the comment query and serializer between public and dashboard readers, preserving their different fields.
  - Parent joins, timestamps, and redaction are repeated in the registry and dashboard.
- Register MDX components once and use the existing published-update selector for static update paths.
  - Three detail routes duplicate rendering imports and component maps.
  - Draft filtering appears in both content helpers and the update route.
- Remove unused private content lookups; colocate the playground's implementation and tests.
  - Work/snippet lookups have no callers.
  - Playground files are scattered through the general Solid component directory.
- Extend the base lint preset and define editor marks once for toolbar and shortcuts.
  - The Solid lint preset copies the base policy.
  - The editor repeats mark-command mappings.
- Make existing tests available through the workspace task graph and correct contributor guidance.
  - Root validation omits the web test task; README claimed there were no tests.
- Use one comment form for both root comments and replies, with an optional parent ID.
  - CommentForm and ReplyForm duplicate validation, Turnstile handling, action submission, and errors.
- OG image probes skip missing files but propagate other filesystem failures.
  - Catch-all access handling silently hides permission and I/O failures.
- Apply Solid build conditions to the mutable build options.
  - The preset callback returned options that its caller ignored, so server imports selected browser-only icon code.

- Use Turbo as the single owner of dependency builds, including example commands.
  - Example lifecycle hooks rebuilt dependencies after Turbo completed them, deleting declarations while sibling typechecks used them. Example documentation now invokes Turbo.

## Deliberately retained

- The editor's public adapter context and class merging remain compatible with consumers.
- OG error-page and output-format branches encode supported Astro output behavior.
- Runtime SDK cleanup remains best-effort after iframe removal; compilation debouncing and operation serialization are required by the playground.
- Existing playground tests exercise path resolution, compiler inputs, events, cleanup, and update ordering. Keep these regression checks rather than deleting useful coverage.

Comments and tests are included in this review at the user's request. Remove implementation narration while retaining external constraints, compiler annotations, and actionable TODOs.

## Validation

- `pnpm exec turbo run build lint typecheck test --output-logs=errors-only`: all 14 tasks passed across the workspaces; 13 tests passed.
- Changed-file formatting and `git diff --check` passed. The repository-wide formatting check still reports 17 untouched files.
- Package smoke checks verified editor toolbar/shortcut equivalence, browser and server imports, and OG directory/file output fallbacks.
- Final independent audits found no further worthwhile structural changes. All 14 action names, six named input schemas, authorization errors, and public/admin comment response differences were preserved.
