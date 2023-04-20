# Etrian Character Customizer

A character portrait generator for the PC releases of the first three Etrian Odyssey games, released as the Etrian Odyssey Origins Collection, published by Atlus.

The games will be releasing in North America on June 1, 2023.

## Why?

Starting with 2016's Etrian Odyssey V and continuing with 2018's Etrian Odyssey Nexus, players have been able to customize their characters' appearances – their skin color, their eye color(s), and their hair color. The feature has been well-received by fans worldwide.

However, the games being remade for the new collection (which originally came out between 2007-2010 for the Nintendo DS) are not having this feature back-ported. That's a shame, because (1) people like customization options, and (2) there's not a lot of racial diversity in the first few games' portraits.

Modders are inevitably going to hack the game to let players use any images they want, so why not give people a tool that lets them customize the official character portraits exactly how they want?

I'm also using it as a way to get back to my roots and practice parts of software development I haven't had as many chances to practice professionally before now. I'm just building a production-ready full-stack application from scratch (or as close as I can get without being irresponsible).

## Current plan/roadmap

Aiming for a mid-June release.

1. Get a full, working prototype done by mid-May at the latest.
2. Spend the rest of May fine-tuning the client code and also taking care of servers/databases/automated deployment.
3. When the game comes out and people inevitably get the portraits ripped on day 1, start converting them into SVG vectors + transparent PNGs via Photoshop and Illustrator.
4. Once all the portraits created specifically for the remake have been converted (42 total, including DLC), focus on polishing the project.

Manually editing the images is going to be the most-time consuming part by far. There should be 222 portraits to edit:

1. EO1

   - 36 portraits from the original game
   - 9 portraits created for the remake
   - 2 DLC portraits

2. EO2

   - 48 portraits from the original game
   - 3 portraits created for the remake (excluding portraits shared with EO1)
   - 2 DLC portraits

3. EO3

   - 96 portraits from the original game (each character has two variants)
   - 24 portraits created for the remake
   - 2 DLC portraits

I can't make a guarantee that I'll ever do all of them, but I'm also happy to accept any help with this process specifically.

## Tech Stack

This project will be built with:

- TypeScript
- React + Radix + TailwindCSS
- Node.js + Express + tRPC + Vite
- PostgreSQL + Prisma

## Other notes

- Going to be doing my best to get well below 100kb for the client bundle size. The only problem is that accessibility is non-negotiable for me, and I don't trust myself to get it right out without a library. Radix only works with React, so it'll be harder to switch off to other frameworks, including Preact (Radix makes no guarantees for compatibility).
- The prototype is currently using SWR, but that might need to be swapped for React Query, depending on how hard it is to get useSWR integrated with the raw tRPC client library. I don't need most of React Query's features, and prefer SWR's smaller size.
- Deliberately trying to minimize the number of useEffect calls I have to write. As of 4/19/2023, there are only two, and they're both for handling animation in LoadingIndicator.
