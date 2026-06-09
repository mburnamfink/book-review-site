---
authors:
- first: Nick
  last: Seaver
  role: author
cover: ./cover.jpg
date_reviewed: 2023-04-10
isbn: '9780226702261'
og_cover: ./og-cover.jpg
page_count: 216
publication_year: 2022
publisher: University of Chicago Press
rating: 5.0
reads:
- date_finished: 2023-04-11
  year: 2023
tags:
- academic
- data-science
- sts
title: 'Computing Taste: Algorithms and the Makers of Music Recommendation'
type: book
---

When you interact with anything but the simplest website these days, you're interacting with algorithmically presented content, the output of a class of machine learning techniques called recommender systems.  When people complain about the evils of the Algorithm with a capital-A, they usually mean a recommender system which is malfunctioning in some way, whether it's Youtube, Twitter, and Facebook boosting extremist viewpoints, Amazon suggesting suicide kits via 'commonly bought together', or TikTok showing conservative legislators hot twinks.

Recommender systems are messy, complex objects, and Seaver provides a close study of streaming music. As an anthropologist, he focuses on the cultural aspects of music recommendation systems, but shorn of the heated political aspects of recommender systems in general, music becomes a kind of data drosophilia, enabling us to view the many complexities and intellectual assumptions behind recommender systems in a kind of model system. Seaver ably synthesizes a survey of relevant academic theories and ethnographic work at music recommendation companies and conferences to provide a deeper and more full understanding of algorithms not as a black monolith, but as an open framework of human effort.

![](./img-1.jpg)

*I need a picture here, and this monolith seems good.*

Seaver begins with the early web of the 1990s, and the then heady concept that computers + networking + digital audio files could create a kind of galactic jukebox, seamless access to every piece of recorded music ever. But with great music comes the problem of information overload. When you can listen to everything, how do you decide what to listen to? Even simple cataloging becomes a problem, as anyone who remembers the glory days of Napster knows. A college experiment in databasing my dorm's shared music library lead to a host of bad file names and random deletes.

Aside from technical issues, music is also deeply personal. We all have [a favorite song](https://www.youtube.com/watch?v=55FMOJMhV9s), which probably hasn't changed much since we were 21. Music is mood, generation, and subculture defining. And traditionally, music has been defined by gatekeepers: label executives, radio DJs, what's available at the local record store, and the constantly shifting definitions of hipness. For music aficionados, finding what you like in the galaxy of everything becomes a burden, though actual information overload is much harder to pin down as a phenomena real people experience with music.

The first suite of techniques was based around collaborative filtering. Given users, items, and rankings, [simple mathematical techniques can fill in the grid](https://medium.com/mbf-data-science/finding-books-that-should-be-loved-but-arent-yet-using-goodreads-ratings-89993782ab80), producing lists of what each user would like. Collaborative filtering isn't actually very effective, and modern services have turned to captivation metrics to see what drives people to keep listening, and what drives them to stop listening.

Seaver's ethnography closes studies some of the key imaginaries of algorithmic recommendations, including idealized listeners, who are active or passive, and much more diverse than the overwhelmingly American, white, male, and hip developers who work for these companies. Developers describe their issues with wanting to play plunderphondics for listeners who prefer K-pop. 

*Computing Taste* also provides a solid description of the Second Good Trick of Data Science, transforming messy objects into a dense vector space. A song which can be classified in many ways: human labeling, collaborative filtering, acoustic pattern matching, becomes described as a set of coordinates in a n-dimensional space. Coordinates which are close are similar songs, and a listening session becomes a journey through this space. Spatial metaphors can be deeply misleading, but are fundamental to machine learning.

As a data scientist and Science, Technology, and Society PhD with an avid interest in music recommendation systems (top 1% of Spotify listeners by time in 2022), this book could have been written specifically for me. Match between user and item aside, I'm serious in my recommendation that this provides a nicely grounded and well executed case study of a key branch of applied machine learning. 

Seaver doesn't answer all the questions I have. Having tried a bunch of streaming music services, I qualitatively believe that Spotify's secret sauce, whatever it might be, is better than the competitors. There is a fine balance between familiarity and novelty in playlists, and I do wish Spotify provided better tools to tweak the algorithm for power-users. And while the harms of algorithmic misjudgment in the case of music are pretty minimal compared to other uses of recommender systems, there's still plenty left unsaid about pitifully low artist payments, the potential for payola, the dominance of old hits over new music, and the reshaping of performance around what triggers curiosity in a playlist, like ALLCAPS band names, and what won't cause a negative captivation interaction where the user shuts off the song, in terms of unchallenging styles. The dark side of the galactic jukebox might be a million songs all the same, running off of an engine of venture capitalist money, aiming towards monopoly abuses.  But until the machine breaks breaks, I'm going to turn that song up.

(Disclosure notice: I received a free copy of this book from the author, and no other compensation)