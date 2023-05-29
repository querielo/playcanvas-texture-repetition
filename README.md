# PlayCanvas Texture Repetition

Read more about preventing texture repetition [here](https://iquilezles.org/articles/texturerepetition/). The project is just a copy/paste of https://www.shadertoy.com/view/Xtl3zf and integration it into PlayCanvas. I had written [a similar solution before Iq's solution](https://www.shadertoy.com/view/Xtl3zf) but it has 3 lookups instead of 2, so I prefer Iq's solution. Consider the project as PoC.

PlayCanvas project: https://playcanvas.com/project/1080774/overview/texture-repetition

<img width="800" alt="Preview" src="https://github.com/querielo/playcanvas-texture-repetition/assets/104348270/1b5607e9-9af3-448e-88bf-d5ae21d7d61a">

The repo is based on the [Playcanvas TypeScript Template](https://github.com/querielo/playcanvas-typescript-template). I highly recommend you to check it out. Read more about usage of PlayCanvas Texture Repetition in the Playcanvas TypeScript Template.

## Usage

The repo contains the next Typescript ScriptComponent for Playcanvas:

* **preventTextureRepetition** -- the script that prevents texture repetition. It is not perfect, but it is good enough for most cases. It is defined in **prevent-texture-repetition.js**. So, copy/paste it into your project.

<img width="507" alt="Image with usage example in Playcanvas Editor" src="https://github.com/querielo/playcanvas-texture-repetition/assets/104348270/5c054f83-f17f-4a1a-a0aa-69b7908246b8">

## Plans

* Improve performance of the shaders. Reduce number of the noise texture lookups.
