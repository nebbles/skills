---
name: create-pr
description: Guidance on creating a pull request (PR) following the user's norms. Use whenever creating a PR.
---

PR description should be suitable for a squash commit (without line wrapping), and additional info in PR comment.

A good reference is the linux kernel patches. The commit message includes the background a justification in concise form, and the explanation of what's changed.

Aspects that are relevant only to the review, merging, and deployment of the patch (e.g. test methodology, PR stacking, deployment notes) do not belong in the description but instead should be put in a comment.

Good efficient writing often follows BLUF (Bottom Line Up Front) technique, as well as other concise writing techniques.
