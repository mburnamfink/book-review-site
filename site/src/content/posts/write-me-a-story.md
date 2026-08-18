---
title: "Write Me an Adventure: Autonomous Claude rpg-dev"
date: 2026-08-17
description: Analysis of what happened when I tested the /rpg-dev skill loop against several models.
image: /posts/write-me-a-story/share.png
---

After having put together decent adventures as demoed in [Building an Adventure with Claude](./quarry-that-woke-up.mdx), I had several questions. First, did different models perform differently? When I started this project a month ago, Fable had just been released and someone on Reddit suggested that Opus 4.6 had more "character" for narrative text. Maybe there was a difference between last generation and next generation. Second, I was curious if there were any patterns in what the model would produce. And third, I wanted to get some idea of how much this all cost.

What I learned was that LLMs will write an acceptable RPG adventure, but on their own will write the same RPG adventure multiple times. Safeguards around Claude prevent it from writing anything edgy or brutal. LLMs are averaging machines, and the average text is not very interesting.

The first round of experiments was for Blades '68 with this prompt:
> Generate an introductory Blades 68 one-shot adventure for a new crew of an undetermined type and composition. The adventure should draw from gritty crime fiction and see the players up against a vicious criminal faction that is stronger than them. I will not be working interactively so make all choices as you see fit.
Sonnet-5, Opus-4.6, Opus-4.8, Opus-5, and Fable-5 each fed the prompt through /rpg-dev three times, using my existing Blades '68 background material. I then had the adventures blinded by creating copies renamed from {model}-{adventure}.md to adv-XX.md, and manually scored them on 12 dimensions, starting with an overall impression and then moving through plot, clarity, npcs, use of setting lore, creativity, action, pacing, narrative consistency, and table readiness. Manually scoring adventures was by far the most tedious part, so I also had Claude/Opus 4.8 and Google Gemini score the models for kicks.

The lessons from the first round of adventures were that Sonnet-5 and Opus-4.6 were noticeably worse than more modern models. Within the more modern models, performance was a toss up. However, the prompt caused some attractors in the generation space to appear. 13 out of 20 adventures had the premise "the fence who gave you your first job and supported you is found dead in a canal. Investigating his murder traces back to the Limmerfield gang, who are stealing souls using paranormal tech in addition to mundane crimes." The prompt says "gritty crime" and one of the touchstones for the game is *Get Carter*. Swap a sympathetic mentor for a brother and add some paranormal flavor, and one source dominates.

More oddly, every single adventure featured the boss of the antagonistic criminal faction as a polite older person, usually a matriarch who conceals iron fists under a grandmotherly exterior. In a few cases, the boss was an old-fashioned and patrician man. While there might be an enforcer on the front lines who is more brutal, the top of the criminal pyramid speaks in complete sentences, never curses, and calls you dear.

Automated evaluation proved a bust. Gemini said that every single adventure was excellent, which was very much not the case. Claude was a little more critical than Gemini, though far more generous than I was. As someone who has direct experience with LLM sycophancy, seeing an adventure I gave a 2 out of 5 described as "An absolute masterclass in scenario design" and "Exceptionally brilliant crime fiction" was an ice-water bath.

For a second round, I tried to correct a few flaws in the experimental design. I switched to the D&D/Nentir Vale setting, and asked each model to look at prior runs and develop a premise that had not already been used by that same model. I also dropped Opus-4.6 as a model and created only one adventure with Fable-5, since at this point Fable is paid tokens only. I also added a /rpg-critic + /rpg-revise call to the loop, though I did not record the pre-revision version of the file. The critique files made sensible changes, which indicates that a critique-revise step is a key element in an LLM workflow.

The adventures tended heavily towards the premise of "a well-meaning local citizen unleashes a relic from the war, and it spins out of control." In a few cases, the local citizen was strictly after power, rather than having good intentions, or it was an ancient bargain that had been forgotten rather than something dug up. My favorite adventure of the lot involved a manticore stepping into its dead dragon master's role of local protector, taking tribute from townsfolk who had started a bargain they couldn't pay for long.

A couple of unusual attractors stood out. NPCs tended towards humanoid or monstrous, with very few elves, dwarves, and halflings. The rules for creating NPCs involve a Hollywood casting step, which pushes towards human. Whenever a Turathi military unit was needed, it was always The Ninth Legion or similar. Nine shows up as a big magic number, in the same way that Tolkien had nine ringwraiths. NPCs were also rarely outright brutal or stupid. Even villains were sympathetic or polite. LLMs simply won't be mean.

From a technical perspective, generating multiple adventures is costly. A single rpg-dev + rpg-critic + rpg-revise cycle uses about 50% of a 5-hour Claude window. Opus-5 uses 50% more tokens than Opus-4.8. It's simply more verbose.

## Mean token usage by model

| Model | Input | Output | Cache reads |
|---|--:|--:|--:|
| Opus-5 | 7,883 | 138,021 | 7,272,644 |
| Fable-5 | 6,539 | 128,858 | 1,758,272 |
| Opus-4.8 | 6,586 | 90,784 | 3,337,561 |
| Sonnet-5 | 63 | 72,681 | 3,845,997 |

ccusage says that an Opus run costs about $5, with an efficient use of cache read. I used local cron scheduling to kick off individual runs in the middle of the night to get the most out of my windows. All told, the entire set of runs for this experiment came in at a sticker price of $400. I paid $20 for a month of Claude Pro, and used about $50 worth of extra tokens which were an Anthropic promotion, so if the costs aren't totally made up (they are) net profit to Anthropic on this project was -$380. Thank you to whichever VC's investment I torched.

I think the biggest take-away is that plain LLM generation is simply not very interesting, because it gets stuck with the most statistically probable word choice. Human intervention can push it in more novel directions. Another improvement would be to combine random tables with the prompt by having a little script grab six or so elements from a much larger list and ordering the LLM to find a way to incorporate them. For now, full autonomy is a high-speed path to slop.