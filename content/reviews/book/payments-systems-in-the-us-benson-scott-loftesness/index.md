---
authors:
- first: Carol Coye
  last: Benson
  role: author
- first: ''
  last: Scott Loftesness
  role: author
cover: ./cover.jpg
date_reviewed: 2020-03-22
isbn: '9780982789735'
og_cover: ./og-cover.jpg
page_count: 170
publication_year: 2014
publisher: Glenbrook Press
rating: 4.0
reads:
- date_finished: 2020-03-22
  year: 2020
tags:
- non-fiction
title: Payments Systems in the U.S.
type: book
---

Payments is a mess.  I work for a bank, I have a good friend who works for a cyptocurrency startup, and payments is a nonsensical nightmare.  This book is a decent introduction to the world of ACH, credit and debit cards, but doesn't really get at the true underlying weirdness.

See, cash is easy.  It's a physical object which is deemed to have worth because you can pay your taxes with it, and we believe that money has value.  Of course, cash is just a physical representation of the abstraction of debt (see [Graeber, Debt: The First 5000 years](https://www.goodreads.com/review/show/642427586)).  To deal with a transaction, two banks have to make matching records in their ledgers, crediting one party and debiting the other. Simple enough. What makes this hard is doing this process with no errors, at the absolute minimum of cost, while avoiding increasingly sophisticated attacks by fraudsters.

There's some useful information in here, about the fundamental differences between push and pull transactions, open and closed networks, and what the Federal Reserve actually does in terms of mediating between banks.  Doing payments well is hard.

Yet this book doesn't get at some hard issues.  Why are credit card interchange fees still the same as they were in the 1950s, especially for smaller merchants. Why have mobile payments been so slow to take off in the US.  The authors point to the payments industry as tech leaders, yet in practice it's incredibly conservative.  I have to deal with 80 character fixed width formats because the spec was laid down in 1986 and has to be backwards compatible with *punch cards.* The daily batch processing on big iron mainframes is decades behind actually impressive tech infrastructure, thing like high-reliability auto-scaling kubernetes clusters, Kafka message queues, and distributed databases. And it has little to say about the actual work that I'm doing as a payments systems engineer.