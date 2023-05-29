# PlayCanvas Texture Repetition

Read more about preventing texture repetition [here](https://iquilezles.org/articles/texturerepetition/). The project is just a copy/paste of https://www.shadertoy.com/view/Xtl3zf and integration it into PlayCanvas. I had written [a similar solution before Iq's solution](https://www.shadertoy.com/view/Xtl3zf) but it has 3 lookups of original texture instead of 2, so I prefer Iq's solution.

PlayCanvas project: https://playcanvas.com/project/1080774/overview/texture-repetition

The repo is based on the [Playcanvas TypeScript Template](https://github.com/querielo/playcanvas-typescript-template). I highly recommend you to check it out. Read more about usage of PlayCanvas Texture Repetition in the Playcanvas TypeScript Template.

## Usage

The repo contains the next Typescript ScriptComponent for Playcanvas:

* **preventTextureRepetition** -- the script that prevents texture repetition. It is not perfect, but it is good enough for most cases. It is defined in **prevent-texture-repetition.js**. So, copy/paste it into your project.