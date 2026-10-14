# Rapidamente working agreements

Read `docs/ENGINEERING.md` before making changes. Testing and documentation are required parts of completing work on this project.

- For behavior changes, add or update meaningful automated tests at the appropriate layer. Cover failure paths and boundary conditions as well as success.
- For bug fixes, add a regression test that demonstrates the defect and passes with the fix whenever practical.
- Run the checks appropriate to the changed code. Report the commands and results accurately; never claim an unrun check passed.
- Update relevant documentation in the same change: behavior, architecture, APIs, configuration, setup, deployment, or operational procedures. For changes with no documentation impact, state why in the change summary.
- Keep unit/browser tests deterministic and isolated from production APIs, databases, and personal accounts.
- Preserve existing users and history during migration. Document intentional behavior changes and data compatibility decisions.
- Work toward the agreed Next.js migration and Vercel deployment plan. Keep framework migration, intentional gameplay changes, and new games independently reviewable.
