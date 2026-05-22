---
authors:
- first: Liam
  last: Taylor
  role: author
date_reviewed: 2022-04-21
page_count: 124
publication_year: 2022
rating: 4.0
reads:
- year: 2022
tags:
- data-science
title: 'System Design Interview: Zero to Hero. Learn How to Pass Your System Design
  Interview Following Modern Case Studies.'
type: book
---

Having recently done poorly on a few system design interviews, I'm kicking myself for not doing the sensible thing and doing my research first.  System design is something which is inherently hard to get to from hobby programming, and there's a big difference between something that runs once in a Jupyter Notebook to something that reliably serves millions of requests daily worldwide.

The contents cover the high level system design of web services you know and possibly love, like Twitter, Whatsapp, Youtube, and Tiktok.  There's some decent discussion of how to calculate resource requirements based on users and data per transaction.  There are also some very good pragmatic points about the importance of sharding and caching in systems which tend to be governed by power laws.  Basically, recent and popular content is going to be served way more often that the major of uploads, so for read-heavy systems, you want to find a way to spread popular content across different shards, rather than overloading one server with your biggest accounts, and to keep popular content cached in Redis rather than a conventional disk-based database.

Conversely, there's also a little bit of "you get what you pay for", and while the models are useful explanations, there's not much theory about why you should make the choices that you're making, or how to think systematically about analysis of the system as a whole.