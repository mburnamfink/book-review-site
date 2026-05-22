---
authors:
- first: Chip
  last: Huyen
  role: author
cover: ./cover.jpg
date_reviewed: 2024-11-07
isbn: '9781098107963'
og_cover: ./og-cover.jpg
page_count: 368
publication_year: 2022
publisher: O'Reilly
rating: 4.0
reads:
- year: 2024
tags:
- data-science
title: 'Designing Machine Learning Systems: An Iterative Process for Production-Ready
  Applications'
type: book
---

Data science is not that hard. Simply clean and annotate a dataset, select one of the available algorithms from the basics like linear regression to the latest transformer architecture neural networks, train and optimize a loss function for accuracy, precision, and/or recall, make some pretty plots, and move on. You did it!

Unfortunately, the company is going to need you to keep doing that every single day, forever. 

Deploying and maintaining models in production is machine learning engineering and operations, and it is in fact pretty hard. *Designing Machine Learning Systems* is a solid introduction about how to go from ad hoc data science to continual learning with machine learning engineering and operations.

The first and foremost issue is one of data shifts. The data coming into any system is continuously evolving, and entropy means that changes are away from the data that the model was trained on. This means that a useful ML product has to be constantly retrained and redeployed, even in the absence of 

The second issue is that platforms and tooling for doing this is apparently not great. Code versioning via Git is solid. Model versioning via some kind of artifact store is okay, but varies via company. Data versioning is likely bad, requiring painstaking reconstruction from a data swamp (like a data lake, but full of sludge). And the totality of being able to maintain a consistent workflow around code, data, models, and compute is basically non-existent. 

This book has a lot of good questions to ask and targets to aim for, especially in the later chapters (I found the first five or so chapters very basic), but fewer good answers, particularly around the key questions of what metrics to monitor and when to refresh models.  I guess this is why they pay us.