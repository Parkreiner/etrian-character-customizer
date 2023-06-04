# Etrian Character Customizer

A character portrait generator for the PC releases of the first three Etrian Odyssey games, released as the Etrian Odyssey Origins Collection, published by Atlus.

The games will be releasing in North America on June 1, 2023.

## Background

Starting with 2016's Etrian Odyssey V and continuing with 2018's Etrian Odyssey Nexus, players have been able to customize their characters' appearances – their skin color, their eye color (you can even give them heterochromia), and their hair color. The feature has been well-received by fans worldwide.

However, the games being remade for the new collection (which originally came out between 2007-2010 for the Nintendo DS) are not having this feature back-ported. That's a shame, because (1) people like customization options, and (2) there's not a lot of racial diversity in the first few games' portraits.

Modders have already figured out how to hack custom portraits into the games. So if changing the images is already figured out, why not make an online color editor that makes these color changes for you?

I'm also using this project as a way to get back to my roots and practice parts of webdev I haven't had as many chances to practice professionally before now. I'm going to make this full-stack app as production-ready as I can, building everything from scratch\*.

\* Within reason. There are some things (like accessibility and data fetching) that would be irresponsible for me to try building on my own.

## Installation

This is only for the prototype; instructions likely to change.

1. Install the repo locally
2. From the installed directory, run `npm run dev`
3. Vite will spin up a local dev server (likely on [`localhost:5173`](http://localhost:5173/)).
4. Navigate to the page, and start playing around!

## Current plan/roadmap

This app is going to take a while. Please see [the projects page](https://github.com/users/Parkreiner/projects/1/views/3) for a list of things on my radar. I'm hoping to have all core issues wrapped up by the end of 2023.

At first, I'm going to prioritize the new portraits (including DLC), and will then move on to the others. Manually editing the images is going to be the most-time consuming part by far, though. There should be 222 portraits to edit:

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

I can't make a guarantee I'll ever do all of them, but once I get a workflow figured out, I'd love it if anyone would be willing to help out.

## Tech Stack

This project will be built with:

- TypeScript
- React + Radix + TailwindCSS
- Node.js + Express/Fastify/Koa\* + tRPC + Vite
- PostgreSQL + Prisma

\* Backend framework TBD
