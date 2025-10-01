TODO:
## -- TODAY --
- Make canvas infinite - INPROGRESS
- Make rectangle button edit the property INPROGRESS
- Add Camera to the canvas (Kinda like infinite) - INPROGRESS


## -- TODAY 2 --
- Enable Shape to be edited via normal edits like (H, W)
- Add create account and login functionality on the pages to lead to the design with id page (for now) - INPROGRESS - HEAVY
- Make the created account show in the page element properties via the clickable circle for collaboration
- Ensure that accounts with edit access to the design page is shown in the profile circle with different colors for now.
- Create animated text box for having the AI design feature. - INPROGRESS


Thoughts
- And save our design to convex and setup webhooks for convex using a dynamic link


-Problems we are solving
-How the app works
-Notable features
-Why did i build this
-Modern stack cohosts included
-Tech stack list
Prize category (openai) or inkeep

## Problem Tela is solving
The problem is quite simple, we want our users to collaboratively design whatever they want to in a quick and fluid manner, with the help of AI.
Think about Figma or Paper.design, that is what Tela.design aims to achieve: A place where designers can freely design whatever they can imagine collaboratively.
## How Tela works
Tela is built from the ground up in similar fashion to how figma and paper is built, I have basically built frames, shapes, and other design tools using webGL (webGPU later supported). Tela works by providing a canvas to a user to create mockups of apps, pages, or whatever they want. I am using convex to store designs and enable easy collaborative efforts between invited designers.

## Notable features of Tela
Whatever feature figma and paper has and is building tela is meant to have it as well, now despite this being a short time project, I have gone really far in ensuring that the core features (drawing shapes, editing shapes via properties, selection of shapes, adding collaborative features) are implemented and ready to be used, there are obviously some bugs but its fine because it will be fixed later down the line.
## Why did I build Tela
At first I had always wanted to enter into graphics processing on the browser, I use figma a lot and always wanted to understand how figma worked (I love reading their technical blog posts a lot). One time I applied for an internship position at paper.design (I was underqualified but decided to shoot my shot) and I got rejected. This project is honestly a way to prove to myself I can build something a bit similar to what they are building. I am already committed to making this a full time project if the hackathon goes well on my end.
## Modern stack cohosts involved:
There arent soo many:
- Convex for the backend and live collaborative feature
- Resend for sending invite emails
- Better Auth for log in and sign up
- Inkeep for performing AI actions
- Scorecard for AI tests and evals
That would be all for now.
## Tela Tech Stack
- Frontend: Nuxt, Typescript
- Backend: Convex, Typescript
## Prize Category
Subject to change but I am currently using inkeep.