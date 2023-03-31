# Etrian Character Customizer

A character portrait generator for the PC releases of the first three Etrian Odyssey games, released as the Etrian Odyssey Origins Collection, published by Atlus.

The games will be releasing in North America on June 1, 2023.

## What is this really?

Starting with 2016's Etrian Odyssey V and continuing with 2018's Etrian Odyssey Nexus, players have been able to customize their characters' appearances – their skin color, their eye color(s), and their hair color. This has been a welcome feature.

However, the older games, while being remade for modern hardware, are not back-porting these features. This is a shame, because (1) people like customization, and (2) there's not a lot of racial diversity in the first few games' portraits.

Modders are inevitably going to hack the game to let players use custom portraits, so why not give people a tool that lets them customize their character portraits exactly how they want?

## Current plan/roadmap

1.

## Tech Stack

This project will be built with:

- TypeScript
- React + Radix + TailwindCSS
- Node.js + Express + tRPC + Vite
- PostgreSQL + Prisma

## Other notes

- Aside from Radix and useSWR, all the React code is being built from scratch. Accessibility is really hard to do right, and I don't trust myself to cover every use case, so some kind of accessibility library feels non-negotiable. useSWR could probably be removed in favor of manual data fetching, but it makes caching and retrying a lot easier. That will only be considered towards the end of the project.
- Radix only works with React, so it'll be harder to switch off to other frameworks, including Preact (Radix makes no guarantees for compatibility). I'm trying to get the final app bundle size as small as possible, but hitting accessibility compliance might limit how much I can do that. Still going to see if I can get under 100kb, though.
- I'm trying to see how far I can get without using stores or even context whatsoever. I'm just using useState and useReducer, along with super explicit component relationships and some rendering trickery. There's only one useEffect in the codebase so far (for the loading indicator), and I'm going to do my best to keep it that way.
