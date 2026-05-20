<!-- SPECKIT START -->
# Project Development Rules

Follow Spec-Driven Development.

Before implementing:
1. Read spec.md
2. Read plan.md
3. Read tasks.md
4. If any of these files are missing or lack critical content (for example: missing requirements, missing task list, or unresolved placeholders), halt implementation and request clarification.
5. Treat a conflict as a direct contradiction or incompatible requirement between files.
6. For feature requirements, resolve conflicts in this order: implementation rules below > spec.md > plan.md > tasks.md.
7. If rules still conflict after applying this order, halt and request clarification.

Implementation rules:
- Primary rule: Do not break existing APIs
- Secondary rules:
	- Follow clean architecture
	- Use TypeScript strict mode
	- Prefer components that can be reused within this project
	- Add error handling
	- Write modular code
	- Write migration scripts for any database schema changes
	- Write unit tests for all new code and ensure existing tests pass
- Third rules
	- Focus on security best practices (e.g. input validation, output encoding, least privilege)
	- Follow formatting and style guidelines (e.g. Prettier, ESLint)
- Fourth rules
	- Update spec and plan files to reflect any changes in requirements or implementation details

Always use virtual environment (Backend) for local development. Do not commit virtual environment files to the repository.

<!-- SPECKIT END -->
