import {
	MeshStandardMaterial,
	MeshToonMaterial,
	Vector3,
	ShaderMaterial,
	ShaderChunk,
	UniformsUtils,
	UniformsLib,
	Color,
} from 'three';

const dotMaterial = (color: number) =>
	new ShaderMaterial({
		vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      ${ShaderChunk.beginnormal_vertex}
      ${ShaderChunk.defaultnormal_vertex}
      ${ShaderChunk.begin_vertex}
      ${ShaderChunk.project_vertex}
      ${ShaderChunk.worldpos_vertex}
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
    }
  `,
		fragmentShader: `
    ${ShaderChunk.common}
    ${ShaderChunk.packing}
    ${ShaderChunk.bsdfs}
    ${ShaderChunk.lights_pars_begin}

    uniform vec3 uBaseColor;
    uniform vec3 uShadowColor;
    uniform vec3 uDirLightPos;
    uniform vec3 uDirLightColor;

    varying vec3 vNormal;

    void main() {
      float shadowPower = 0.5;
      float t = 0.0;
      float opacity = 1.0;
      float directionalLightWeighting = 0.5 * max(dot(normalize(vNormal), uDirLightPos), 0.0);
      vec3 lightWeighting = uDirLightColor * directionalLightWeighting;
      if (directionalLightWeighting < 1.0) {
        gl_FragColor = vec4(mix(uBaseColor, uShadowColor, 0.025), opacity);
      } else {
        gl_FragColor = vec4(uBaseColor, opacity);
      }
      if (directionalLightWeighting < 0.001) {
        t = (mod(gl_FragCoord.x + gl_FragCoord.y, 4.0));
        if (t > 2.0 && t < 4.0) {
          gl_FragColor = vec4( mix(uBaseColor, uShadowColor, shadowPower), opacity);
        }
      }
    }
  `,
		uniforms: UniformsUtils.merge([
			UniformsLib.lights,
			UniformsLib.fog,
			{
				uDirLightPos: { value: new Vector3(0, -2, 1) },
				uDirLightColor: { value: new Color(0x80808080) },
				uBaseColor: { value: new Color(color) },
				uShadowColor: { value: new Color(0x200000) },
			},
		]),
	});
function basicMaterial(color: Color) {
	return new MeshToonMaterial({
		color,
	});
}

export const red = dotMaterial(0xfd7e4d);

export const green = dotMaterial(0xe0f8bb);

export const brown = dotMaterial(0xebab5c);

export const lightBrown = dotMaterial(0xfce9d9);

export const darkBrown = dotMaterial(0x9e735a);

export const purple = dotMaterial(0xf6d7f2);

export const white = dotMaterial(0xffffff);

export const aqua = dotMaterial(0xc9ffed);

export const darkGreen = dotMaterial(0xadeb82);

export const metal = dotMaterial(0xefeff1);

export const glass = new MeshStandardMaterial({
	opacity: 0.5,
	color: 0xfafaff,
	alphaTest: 0,
	metalness: 0,
	fog: true,
	depthTest: true,
});
