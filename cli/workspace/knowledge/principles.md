# Principles: Art Workspace Cli

## Isolation

Every repository remains independently buildable and releasable; the workspace coordinates cross-repository work without becoming a build root.

## Safe Operations

Operations respect repository state, avoid destructive surprises, and skip unsafe actions. Explicit checkout selection, dirty-state checks, conflict detection, and clear failure reports protect ongoing work.

## Idempotence

Repeating a command converges on the intended state without duplicating work or introducing unnecessary changes.

## Reliable State

Records are the source of truth for workspace knowledge and checkout identity; filesystem and Git scans provide current state. Mutations are persisted individually, and every side effect has a recorded outcome.

## Low-Friction Coordination

A consistent CLI, shared checkout selection, and actionable reports make cross-repository work predictable, inspectable, and efficient for humans and agents.
