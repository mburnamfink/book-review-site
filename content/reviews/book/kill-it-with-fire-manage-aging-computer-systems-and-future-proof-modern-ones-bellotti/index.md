---
authors:
- first: Marianne
  last: Bellotti
  role: author
cover: ./cover.jpg
date_reviewed: 2022-05-06
isbn: '9781718501188'
og_cover: ./og-cover.jpg
page_count: 248
publication_year: 2021
publisher: No Starch Press
rating: 4.0
reads:
- date_finished: 2022-05-06
  year: 2022
tags:
- data-science
title: 'Kill It with Fire: Manage Aging Computer Systems (and Future Proof Modern
  Ones)'
type: book
---

One of the unfortunate facts about computer systems is that there is far more legacy code than there is modern code. Systems are built in layers of stanky hacks on stanky hacks, temporary fixes made ages ago in obsolete languages and paradigms where the original developers have long departed and the original context has been forgotten. To share one of my own stories, I had a process fail a third of the time, because it was (my) contemporary Python calling a .NET framework which was emulating an IBM 3270 terminal to connect to a mainframe called The Core, and somewhere in there the ability to handle lower case letters got lost. "Kill it with fire" is both the title of the book, and most developers' reaction to being asked to work with legacy systems, but in the real world we can't reach for the napalm.  We have to find a way to live with creaky systems.

![](./img-1.jpg)

*IBM 3270, the finest in modern human-computer interaction peripherals*

Bellotti is trained as an anthropologist and has worked on both major open source projects like OAuth and with the United States Digital Service, and her advice is an extension of the dictum that computers are programmed and used by human beings.

This has a few major implications.  The first one is that a successful modernization is one which minimizes disruptions to existing users. Try to fit within existing mental models and interfaces, while swapping out parts of a system which are causing unacceptable delays.

The second implication is that while there is no single best architecture, there are patterns which developers like to work on. Mostly whatever is new and trendy, or systems of abstraction rather than specific use cases. If people are rewarded for shipping new code, they'll ship code and won't focus on maintenance. Social rewards are more powerful than organizational rewards.

The third implication is that what makes legacy systems hard isn't bad technology, but bad management. Migrating a complex system, with lots of stakeholders, undocumented features, and even bugs that have become features, is an exercise in frustration.  Leadership has to build morale and keep momentum up by focusing on alignment and productive questions that free the people doing the work to do the work, rather than run in circles on firedrills.

I'd have preferred a few more war stories and specific technical traps to be aware of, but this is definitely an interesting and useful book.