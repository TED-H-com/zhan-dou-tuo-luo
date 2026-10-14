# AI Teaches You Beyblade

**English** · [繁體中文](README.md)

Use an AI agent to play Beyblade and become a stronger player.

**Project page:** https://ted-h-com.github.io/zhan-dou-tuo-luo/

This repository turns several AI Sister discussions about Beyblade X (戰鬥陀螺, battle tops) into notes in Traditional Chinese. The core idea is simple: do not just ask "which top is strongest?" Ask "under the current rules, how do I use three tops to score points most efficiently?"

The notes in `docs/` are written in Chinese. This file is an English version of the README.

## The short version

Beyblade X is not just about which top spins the longest. A Spin Finish usually earns only 1 point, an Over Finish or Burst Finish earns 2, and an Xtreme Finish earns 3, and a match ends when one side reaches 4 points. So strong players do not just buy one "god-tier" top. They build a 3v3 deck that covers attack, holding, closing, and counters.

## Read these first

- [Forum thread: comparing the strongest versions, and the tactics with the best win rate](docs/01-forum-248.md)
- [Spinning longest is not strongest: the score sheet is what drives win rate](docs/02-blog-602.md)
- [Hitting hardest is not coolest: even pocket money needs a deck plan](docs/03-blog-603.md)
- [The exchange rate of winning: treat your tops as resource allocation](docs/04-blog-604.md)
- [Recommended models and 3v3 deck setups](docs/recommended-models.md)
- [Techniques and practice routine](docs/techniques.md)

## Buying order for beginners

1. Start with the Takara Tomy / Japanese system. For serious competition, its weights, part adjustability, and mainstream meta are closer to what you will face.
2. Make your first main top a stable type, such as the Wizard Rod line, to practice center control, angles, and consistent launches.
3. Add an attacker second, such as Phoenix Wing, Aero Pegasus, or Dran Buster, which can grab 2 to 3 points.
4. Add a counter or closer third, such as Cobalt Dragoon, Silver Wolf, or the defense or stamina setups common in your local meta.
5. Do not spend everything on the one top "the internet says is strongest." First check whether you play 1v1, 3v3, shop events, or official events, because ban lists and win conditions may differ.

## 3v3 deck thinking

- Point-grabber: goes for Over Finish, Burst Finish, and Xtreme Finish to open up the score in one hit.
- Anchor: cuts down self-KOs, holds the center, and makes the opponent's attacks miss.
- Counter: built against the decks common in your area, for example to beat right-spin stamina, to resist attackers, or to handle Wizard Rod types.

## How an AI agent can help you improve

- Turn the event format into a "scoring model," so you do not pick tops on gut feeling.
- Map your local meta: who plays Wizard Rod, who prefers attackers, which stadiums show up most.
- Test deck hypotheses: do these three tops complement each other, do any parts overlap, and how do you order them against attack, stamina, or defense?
- Write a practice routine: every day, 20 flat launches, 20 angled launches, and 10 soft launches for control, with success rates logged.
- Run post-match reviews: did you lose because of launch angle, the stadium, the matchup, or a deck that does not make sense?

## Caveat

The Beyblade X environment changes. New parts, official ban lists, shop rules, and regional formats all affect the "strongest" answer. Use these notes as a tactical framework, not a permanent ranking.

## Sources

AI Sister posts, each with its original Chinese version and an English version:

- Forum post 248: https://ai-sister.com/zh-TW/forum/post/248 (English: https://ai-sister.com/en/forum/post/248)
- Blog post 604: https://ai-sister.com/zh-TW/blog/604 (English: https://ai-sister.com/en/blog/604)
- Blog post 603: https://ai-sister.com/zh-TW/blog/603 (English: https://ai-sister.com/en/blog/603)
- Blog post 602: https://ai-sister.com/zh-TW/blog/602 (English: https://ai-sister.com/en/blog/602)

## License

The notes are licensed under [CC BY 4.0](LICENSE): you may share and adapt them, including for commercial use, as long as you give credit. The project page under `site/` is generated with the MIT-licensed page kit from [teddashh.github.io](https://github.com/teddashh/teddashh.github.io).
