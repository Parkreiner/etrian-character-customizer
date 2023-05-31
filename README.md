# Etrian Character Customizer

A character portrait generator for the PC releases of the first three Etrian Odyssey games, released as the Etrian Odyssey Origins Collection, published by Atlus.

The games will be releasing in North America on June 1, 2023.

## Background

Starting with 2016's Etrian Odyssey V and continuing with 2018's Etrian Odyssey Nexus, players have been able to customize their characters' appearances – their skin color, their eye color(s), and their hair color. The feature has been well-received by fans worldwide.

However, the games being remade for the new collection (which originally came out between 2007-2010 for the Nintendo DS) are not having this feature back-ported. That's a shame, because (1) people like customization options, and (2) there's not a lot of racial diversity in the first few games' portraits.

Modders are inevitably going to hack the game to let players use any images they want, so why not give people a tool that lets them customize the official character portraits exactly how they want?

I'm also using it as a way to get back to my roots and practice parts of software development I haven't had as many chances to practice professionally before now. I'm just building a production-ready full-stack application from scratch (or as close as I can get without being irresponsible).

## Installation

This is only for the prototype; instructions likely to change.

1. Install the repo locally
2. From the installed directory, run `npm run dev`
3. Vite will spin up a local dev server (likely on [`localhost:5173`](http://localhost:5173/)).
4. Navigate to the page, and start playing around!

## Current plan/roadmap

Aiming for a mid-June release.

1. Get a fully-working client-side prototype done no later than mid-May.
2. Spend the rest of May fine-tuning the client code and also taking care of servers/databases/automated deployment.
3. When the game comes out and people inevitably get the portraits ripped on day 1, start converting them into SVG vectors + transparent PNGs via Photoshop and Illustrator.
4. Once all the portraits created specifically for the remake have been converted (42 total, including DLC), focus on refining the code.
5. Once the code is in a good spot, go back to doing more image edits to add more portraits.

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

   - 96 portraits from the original game (each portrait is available in two color variants)
   - 24 portraits created for the remake (12 main styles, each with two color variants)
   - 2 DLC portraits

I can't make a guarantee I'll ever do all of them, but I'm also happy to accept any help with getting all these images edited.

## Tech Stack

This project will be built with:

- TypeScript
- React + Radix + TailwindCSS
- Node.js + Express/Fastify/Koa\* + tRPC + Vite
- PostgreSQL + Prisma

\* Backend framework TBD

## Other notes

- Trying to be aggresive about getting my client-side bundle size down as low as possible. I'm aiming for less than 100kb, but am willing to go above that if it leads to a better user experience. The main packages that'll take up space will be React/React DOM, as well as Radix UI (accessibility is non-negotiable for me, but I don't trust myself to get it right).
- The prototype is currently using SWR, but that might need to be swapped for React Query, depending on how hard it is to get useSWR integrated with the raw tRPC client library. I don't need most of React Query's features, and prefer SWR's smaller size.
