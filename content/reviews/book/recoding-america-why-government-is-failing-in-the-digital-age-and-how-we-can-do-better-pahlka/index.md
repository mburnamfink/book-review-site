---
authors:
- first: Jennifer
  last: Pahlka
  role: author
cover: ./cover.jpg
date_reviewed: 2024-07-02
isbn: '9781250266774'
og_cover: ./og-cover.jpg
page_count: 336
publication_year: 2023
publisher: Metropolitan Books
rating: 5.0
reads:
- date_finished: 2024-07-02
  year: 2024
tags:
- non-fiction
- politics
- data-science
title: 'Recoding America: Why Government Is Failing in the Digital Age and How We
  Can Do Better'
type: book
---

One of the books that profoundly influences my worldview is *[Seeing Like a State.](/book/seeing-like-a-state-how-certain-schemes-to-improve-the-human-condition-have-failed-scott/)* There, Scott describes the central problem of statecraft and of government as one of legibility; the state must make its citizens and their activities visible before it can appropriate revenue and orchestrate any plan for the general welfare. In the 19th century, this was a matter of censuses, maps, and ledgers. In the 21st century, it's about websites and databases. As anyone who has interacted with the American government experiences, this process of becoming legible is profoundly awful. Taxes suck, beyond the financial cost. The DMV is a pain in the neck. If you've been to the post office lately, [you know](https://www.youtube.com/watch?v=B0pSK5Er6UU) (Bob's Burgers link, trust me). And god forbid you ever have to apply for social services or get the justice system to fix a mistake.  The inability of government to do anything well, particularly anything involving digital service delivery, is a joke as tired as the deal with airline food. If statecraft is about seeing, the American government is stumbling around blind.

![](./img-1.jpg)

*U.S. President Donald Trump looks up toward the Solar Eclipse while joined by his wife first lady Melania Trump on the Truman Balcony at the White House on August 21, 2017 in Washington, DC. 

(Photo by Mark Wilson/Getty Images) (Mark Wilson, 2017 Getty Images)*

Pahlka's analysis is based on her personal experience in the tech industry, leading her non-profit Code For America, and a year as deputy chief technology officer for government innovation in 2013, where she learned a lot of hard lessons in the Obamacare rollout.  She's kept in touch with colleagues from that time. She has deep experience with the cultures of both tech and government. The American government's failures with technology over decades are primarily self-inflicted wounds, and one where there is a chance of hope, however slim, with a potential bipartisan 

Pahlka's core premise is that there is basically a good way to write usable software, as developed by internet-era companies and described in the Agile manifesto. Start with something small and simple. Iterate rapidly, using user experience research to guide the development of the product. Trust the expertise of the people involved and their ability to make good decisions. Have someone empowered to make decisions in charge who doesn't lose sight of providing a success product to end-users. There's a lot of (justified) anti-Tech and anti-Agile opinions out there, but she isn't some kind of one-true-wayist or egomaniacal platform god-king.  This is the mundane tech stuff of "How do we build and maintain a website that doesn't absolutely *suck*?"

The largest barrier is cultural. Government is a hierarchy. At the very top are We The People, who elect representatives who write laws, which are turned into policy by senior bureaucrats, the most exalted of whom are at the Office of Management and Budget, which become program requirements and bids negotiated by mid-level bureaucrats and contractors, which is built by software developers who have no agency, which becomes a system used by junior bureaucrats and inflicted on the public.  This a classic waterfall method, which as Pahlka acidly observes is "a promise not to learn anything."

Hierarchies are also embedded into the details of the policy, which for any specific program will likely be a combination of Federal, State, and County guidelines, as interpreted by multiple agencies, including both the primary and partner agencies, judges, and a constantly updating set of legal changes and refines at multiple levels. Enacting policy is genuinely complex.

And finally, and most fatally, bureaucratic culture is built around consensus and avoiding blame. You get promoted by following the rules exactly, and saying "I followed the process" is the only shield when things go wrong. Which means that there is no one who can say "This requirement is dumb, and it is killing the rest of the program. I am removing it. If necessary, we can do it later", short of going all the way back to Congress or having a major lawsuit. Americans are rightfully suspicious of the super-bureaucrat in the vein of Robert Moses or J. Edgar Hoover, but in our fear of empowering a dictator, we've instead empowered nobody.

Culture aside, there are a few specific laws and norms which are particular pernicious. A longstanding interpretation of the Paperwork Reduction Act effectively prohibits agencies from surveying and interviewing their users without a full on Federal IRB. The Administrative Procedures Act requires a multi-step detailed bidding process for literally everything. Various civil rights decisions argue that if a program is not maximally inclusive, 

And a variety of laws and norms say that Federal agencies should buy, not build, what they make. Which is all fine and dandy, except that while in many cases a lot of digital technologies are commodities, like web hosting and database servers, the specifics of the logic that is encapsulated **ARE THE POLICIES!** In a fight between a human's opinion of how code works, and the computer's reality of how the code is working, the human will lose every time. Agencies which do not have some in-house capacity to operate their own data systems are incapable of seeing like a state.

The end result is policy vomit as product. The entire program gets thrown into a poorly designed questionnaire with no particular organization, confusing wording, and an actively hostile attitude towards actually getting anything done. For example, unemployment relief basically relies on former paystubs, and good luck if you don't know where those are (I'm pretty organized, and I'd have to search), or had informal employment as a gig worker or something.

This book is full of horrifying tech war stories, elaborations of what you'll read at the excellent Statecraft blog on fixing the [Veteran's Administration](https://www.statecraft.pub/p/how-to-salvage-the-va-with-marina) and the [Department of Labor.](https://www.statecraft.pub/p/how-to-make-government-less-like)  The VA had an electronic form system which would only work on the specific versions of Internet Explorer and Adobe Acrobat installed on VA computers. The California Unemployment system collapsed under COVID because millions of people were dumped into a manual queue based on minor data entry errors associated with a 0.25% instance of fraud, which could only be remedied by a small number of 20+ veterans due to the arcane nature of the system. A next-generation GPS satellite kept missing latency targets due to a requirement to translate data from standard UDP to a complex enterprise service bus *back to UDP* because of a game of telephone from mid-90s IT standards. Most horrifyingly, Immigration was unable to reunite family after Trump's family separation policy because families who had previously been under a single case number were now under ones for adults and separate one for each child, and there was no possible way to link case numbers in the INS database.

Ironically, I finished this book in a DMV lobby, waiting two hours to submit a piece of paper in place of a broken website. But I agree entirely with Pahlka's critique and argument. My last job was at a bank, where I was an in-house dev responsible for automating a bunch of reports that were not being done properly by vendor software. I had a toaster's worth of compute, a few gigs of database space, and with that I could do things in two weeks which would take our vendors six months and $3 million. 

Liberals want a government that delivers services. Conservatives want a government that is efficient and gets out of the way. In the 21st century, this will require a new mode of supplying government services, new types of leaders, and a culture that is willing to be accountable and learn from mistakes. We should automate what we can, and trust the discretion of human beings to what can't be automated. Better things are possible. After the fiasco of the healthcare.gov launch, a follow-up program to help Medicare pay more to doctors who keep people alive launched more or less smoothly. In countless ways, government is getting better. The question is if government can rebuild trust by being effective before cynics in positions of power bring down the whole state.