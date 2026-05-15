<!-- SPECKIT START -->
# Project Development Rules

Follow Spec-Driven Development.

Before implementing:
1. Read spec.md
2. Read plan.md
3. Read tasks.md
4. If any of these files are missing or incomplete (for example: missing requirements, missing task list, or unresolved placeholders), halt implementation and request clarification.
5. Treat a conflict as a direct contradiction or incompatible requirement between files.
6. For feature requirements, resolve conflicts in this order: spec.md > plan.md > tasks.md.
7. Implementation rules below remain mandatory. If resolving a file conflict would violate an implementation rule, prioritize the implementation rule.

Implementation rules:
- Primary rule: Do not break existing APIs
- Secondary rules:
	- Follow clean architecture
	- Use TypeScript strict mode
	- Prefer components that can be reused within this project
	- Add error handling
	- Write modular code

Always use virtual environment (Backend) for local development. Do not commit virtual environment files to the repository.

<!-- SPECKIT END -->
