---
authors:
- first: Harry
  last: Percival
  role: author
- first: ''
  last: Bob Gregory
  role: author
cover: ./cover.jpg
date_reviewed: 2022-08-31
isbn: '9781492052203'
og_cover: ./og-cover.jpg
page_count: 280
publication_year: 2020
publisher: O'Reilly Media
rating: 4.0
reads:
- date_finished: 2022-08-31
  year: 2022
tags:
- data-science
title: 'Architecture Patterns with Python: Enabling Test-Driven Development, Domain-Driven
  Design, and Event-Driven Microservices'
type: book
---

I'm somewhat mixed on this book.  The authors are very clear about one particular design pattern, using Domain Driven Design to create aggregates which push events to a message bus, and layers of abstraction between the changeable facts of any specific database or infrastructure on one end, and the confusion of business logic which has to represent the messiness of the real world in a way that computers can understand on the other.

I'm somewhat pleased that I stumbled into their preferred pattern on my own before reading this book.  But the meat of what I was interested in, test-driven development in the real world with legacy code, is left underexplained.  I should spend more time with the accompanying Github, and in many ways this book is closer to my day to day than *Designing Data-Intensive Applications*, but as other reviews have mentioned, it's one architecture pattern.