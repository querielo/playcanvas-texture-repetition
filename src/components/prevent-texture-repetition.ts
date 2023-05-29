import { createScript } from '../utils/createScript';

// THE NEXT SHADER WAS TAKEN FROM: https://www.shadertoy.com/view/Xtl3zf
// THE SHADER LICENSE:
// The MIT License
// Copyright © 2017 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// One way to avoid texture tile repetition one using one small
// texture to cover a huge area. Basically, it creates 8 different
// offsets for the texture and picks two to interpolate between.
//
// Unlike previous methods that tile space (https://www.shadertoy.com/view/lt2GDd
// or https://www.shadertoy.com/view/4tsGzf), this one uses a random
// low frequency texture (cache friendly) to pick the actual
// texture's offset.
//
// Also, this one mipmaps to something (ugly, but that's better than
// not having mipmaps at all like in previous methods)
//
// More info here: https://iquilezles.org/articles/texturerepetition

const TEXTURE_NO_TILE_CHUNK = `
uniform sampler2D uNoiseTexture;

float sum( vec4 v ) { return v.x+v.y+v.z; }

vec4 textureNoTile(sampler2D tex, in vec2 x )
{
  float v = 1.;
  float k = texture( uNoiseTexture, 0.005*x ).x; // cheap (cache friendly) lookup
  
  vec2 duvdx = dFdx( x );
  vec2 duvdy = dFdy( x );
  
  float l = k*8.0;
  float f = fract(l);
  
#if 1
  float ia = floor(l); // my method
  float ib = ia + 1.0;
#else
  float ia = floor(l+0.5); // suslik's method (see comments)
  float ib = floor(l);
  f = min(f, 1.0-f)*2.0;
#endif    
  
  vec2 offa = sin(vec2(3.0,7.0)*ia); // can replace with any other hash
  vec2 offb = sin(vec2(3.0,7.0)*ib); // can replace with any other hash

  vec4 cola = textureGrad( tex, x + v*offa, duvdx, duvdy );
  vec4 colb = textureGrad( tex, x + v*offb, duvdx, duvdy );
  return mix( cola, colb, smoothstep(0.2,0.8,f-0.1*sum(cola-colb)) );
}
`;

@createScript({
  materials: {
    type: 'asset',
    assetType: 'material',
    description: 'Material to prevent texture repeatition.',
    array: true,
  },
  noiseTеxture: {
    type: 'asset',
    assetType: 'texture',
    description: 'Noise texture.',
  },
})
export class PreventTextureRepetition extends pc.ScriptType {
  public materials: pc.Asset[] = [];
  public noiseTеxture: pc.Asset | null = null;

  public async initialize() {
    await new Promise((resolve) => {
      this.noiseTеxture?.ready(resolve);
    });

    for (const material of this.materials) {
      this.preventTextureRepetition(material);
    }
    // this.entity.element.texture.repeat.set(1, 1);
  }

  private async preventTextureRepetition(materialAsset: pc.Asset) {
    await new Promise((resolve) => {
      materialAsset.ready(resolve);
    });

    const resources = materialAsset.resources;

    for (const material of resources) {
      if (!(material instanceof pc.StandardMaterial)) {
        continue;
      }

      // @ts-ignore
      const litShaderArgsPS = pc.shaderChunks.litShaderArgsPS as string;
      const newLitShaderArgsPS = litShaderArgsPS + TEXTURE_NO_TILE_CHUNK;
      material.chunks.litShaderArgsPS = newLitShaderArgsPS;

      const shadersChunk = [
        'aoPS',
        'clearCoatPS',
        'clearCoatGlossPS',
        'clearCoatNormalPS',
        'diffusePS',
        'diffuseDetailMapPS',
        'emissivePS',
        'glossPS',
        'iridescencePS',
        'iridescenceThicknessPS',
        'lightmapSinglePS',
        'metalnessPS',
        'normalDetailMapPS',
        'normalMapPS',
        'opacityPS',
        'parallaxPS',
        'sheenPS',
        'sheenGlossPS',
        'specularPS',
        'specularityFactorPS',
        'thicknessPS',
        'transmissionPS',
      ];

      for (const shaderChunk of shadersChunk) {
        // @ts-ignore
        const chunk = pc.shaderChunks[shaderChunk] as string;
        if (!chunk) {
          continue;
        }
        const newChunk = chunk.replace(
          'texture2DBias($SAMPLER, $UV, textureBias)',
          'textureNoTile($SAMPLER, $UV)'
        );
        material.chunks[shaderChunk] = newChunk;
      }

      // @ts-ignore
      material.chunks.APIVersion = '1.63.6';

      material.setParameter('uNoiseTexture', this.noiseTеxture?.resource);

      material.update();
    }
  }
}
