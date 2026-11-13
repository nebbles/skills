---
name: create-pr
description: Guidance on creating a pull request (PR) following the user's norms. Use whenever creating a PR.
---

PR description should be suitable for a squash commit (without line wrapping), and additional info in PR comment.

A good reference is the linux kernel patches. The commit message includes the background a justification in concise form, and the explanation of what's changed.

Structure with minimal markdown (i.e. avoiding tables, HTML, etc.) and keeping to simple formatting is easier to read. 

Footers should be used for relevant metadata, like issue numbers and co-authors where relevant.
Examples:

```
Resolves ENG-479
Resolves SENTRY-1A
Claude-Session: https://claude.ai/code/session_123
Co-Authored-By: John Smith <john.smith@example.com>
Signed-Off-By: John Smith <john.smith@example.com>
```

Aspects that are relevant only to the review, merging, and deployment of the patch (e.g. test methodology, PR stacking, deployment notes) do not belong in the description but instead should be put in a comment.

Good efficient writing often follows BLUF (Bottom Line Up Front) technique, as well as other concise writing techniques.

When creating a GitHub PR description for the first time you should be aware that headers/footers are sometimes added by the harness. You should read-back the description of the PR after creating it to make sure that there are no harness/model specific headers or footers added. Remove them if you find them.
