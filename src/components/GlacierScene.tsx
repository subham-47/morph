import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// GLSL HELPERS
// ─────────────────────────────────────────────────────────────
const noise = `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i =floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g =step(x0.yzx,x0.xyz);
    vec3 l =1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
     +i.y+vec4(0.0,i1.y,i2.y,1.0))
     +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`;

// ─────────────────────────────────────────────────────────────
// VERTEX SHADER  (FIX: removed duplicate setSize/setPixelRatio)
// ─────────────────────────────────────────────────────────────
const vertexShader = `
  ${noise}
  uniform float uTime;
  uniform float uPhase;      // 0 = Ice · 1 = Mountain · 2 = Volcano
  varying vec3  vPosition;
  varying vec3  vNormal;
  varying float vNoise;
  varying float vElevation;

  void main(){
    vPosition = position;
    vNormal   = normalize(normalMatrix * normal);

    float n = snoise(position * 1.5 + uTime * 0.1);
    vNoise  = n;

    // ── Ice: irregular berg surface ──
    vec3  icePos    = position;
    float iceHeight = snoise(position * 2.0) * 0.2;
    icePos *= (position.y > 0.1) ? (0.8 + iceHeight) : (1.2 - iceHeight);

    // ── Mountain: broad base, narrow peak, snow cap ──
    vec3  mtnPos    = position;
    float mtnT      = pow(max(0.0,(position.y+1.0)/2.0), 0.6);
    mtnPos.y        = mtnT * 2.5 - 0.5 + n * 0.2;
    mtnPos.xz      *= (1.0 - pow(max(0.0,(position.y+1.0)/2.0), 0.5)) * 2.0 + 0.1;

    // ── Volcano: wide base, concave crater ──
    vec3  volPos    = position;
    float volT      = pow(max(0.0,(position.y+1.0)/2.0), 0.5);
    float volHeight = volT * 2.6;
    if(position.y > 0.85) volHeight -= (position.y - 0.85) * 4.0;
    volPos.y        = volHeight - 0.5 + n * 0.1;
    volPos.xz      *= (1.0 - pow(max(0.0,(position.y+1.0)/2.0), 0.4)) * 2.2 + 0.1;

    // ── Blend phases ──
    vec3 finalPos = (uPhase <= 1.0)
      ? mix(icePos, mtnPos, uPhase)
      : mix(mtnPos, volPos, uPhase - 1.0);

    vElevation  = finalPos.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
  }
`;

// ─────────────────────────────────────────────────────────────
// FRAGMENT SHADER  (FIX: clamped lavaColor, improved lava glow)
// ─────────────────────────────────────────────────────────────
const fragmentShader = `
  uniform float uTime;
  uniform float uPhase;
  varying vec3  vPosition;
  varying vec3  vNormal;
  varying float vNoise;
  varying float vElevation;

  void main(){
    vec3 lightDir = normalize(vec3(5.0, 5.0, 5.0));
    float diff    = max(0.0, dot(vNormal, lightDir));
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0,0.0,1.0))), 3.0);

    // Ice: deep blue → glacier white
    vec3 iceColor = mix(vec3(0.05,0.25,0.7), vec3(0.75,0.93,1.0),
                        smoothstep(-1.0, 1.5, vElevation));
    iceColor = mix(iceColor, vec3(0.9,0.97,1.0), fresnel * 0.5);

    // Mountain: dark earth → forest green → snow
    vec3 mtnColor = mix(vec3(0.18,0.12,0.06), vec3(0.15,0.45,0.15),
                        smoothstep(-0.5, 0.8, vElevation));
    mtnColor      = mix(mtnColor, vec3(0.35,0.55,0.25),
                        smoothstep(0.5, 1.4, vElevation));
    if(vElevation > 1.8)
      mtnColor = mix(mtnColor, vec3(0.92,0.92,0.96),
                     clamp((vElevation - 1.8) * 2.5, 0.0, 1.0));

    // Volcano: dark rock → glowing lava cracks
    vec3 volColor = mix(vec3(0.08,0.04,0.02), vec3(0.28,0.18,0.12),
                        smoothstep(-0.5, 2.0, vElevation));
    if(vElevation > 1.0){
      // Animated crack / flow pattern
      float flow  = sin(vPosition.x * 10.0 + uTime * 3.0) * 0.5 + 0.5;
      flow       *= sin(vPosition.z * 10.0 + uTime * 2.5) * 0.5 + 0.5;
      flow       *= sin((vPosition.x - vPosition.z) * 6.0 + uTime * 1.5) * 0.5 + 0.5;
      float crack = smoothstep(0.9, 2.2, vElevation);
      float mask  = flow * crack;
      // FIX: clamp lava colour to HDR-safe range (was 1.5 which blows out)
      vec3 lava   = clamp(vec3(1.2, 0.35, 0.0) * mask, 0.0, 2.0);
      lava       *= (0.7 + 0.3 * sin(uTime * 5.0));
      volColor    = mix(volColor, lava, mask * 0.85);
    }

    vec3 finalColor = (uPhase <= 1.0)
      ? mix(iceColor, mtnColor, uPhase)
      : mix(mtnColor, volColor, uPhase - 1.0);

    finalColor += fresnel * 0.5;
    finalColor *= (diff * 0.8 + 0.2);

    // Extra emission at crater rim
    if(uPhase > 1.5)
      finalColor += vec3(1.0, 0.25, 0.0)
                    * smoothstep(1.0, 2.2, vElevation)
                    * 0.7
                    * (uPhase - 1.5) * 2.0;

    gl_FragColor = vec4(clamp(finalColor, 0.0, 3.0), 1.0);
  }
`;

// ─────────────────────────────────────────────────────────────
// BACKGROUND PARTICLE SHADER
// Tiny drifting flakes: snow (ice) → pollen/spores (mountain) → ash (volcano)
// ─────────────────────────────────────────────────────────────
const bgParticleVert = `
  attribute float aSize;
  attribute float aSpeed;
  attribute float aSway;    // unique sway frequency per particle
  uniform   float uTime;
  uniform   float uPhase;
  varying   float vAlpha;
  varying   float vPhase;
  varying   float vDepth;

  void main(){
    vPhase = uPhase;
    vec3 p = position;

    // Fall downward (snow/ash fall), loop seamlessly
    p.y = mod(p.y - uTime * aSpeed * 0.18, 20.0) - 10.0;

    // Tiny side-to-side sway — looks like real flakes caught in air
    p.x += sin(uTime * aSway * 0.4 + position.y * 1.3) * 0.06;
    p.z += cos(uTime * aSway * 0.3 + position.x * 1.1) * 0.04;

    // Depth: particles far from camera are dimmer (atmospheric depth)
    vDepth = clamp(1.0 - abs(p.z) / 9.0, 0.0, 1.0);
    vAlpha = vDepth;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // Small fixed size — no perspective scaling so they stay tiny
    gl_PointSize = aSize;
    gl_Position  = projectionMatrix * mv;
  }
`;

const bgParticleFrag = `
  uniform float uPhase;
  varying float vAlpha;
  varying float vPhase;
  varying float vDepth;

  void main(){
    // Hard crisp disc — no soft blur so they look like tiny specks not blobs
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if(d > 1.0) discard;                          // sharp circle edge
    float alpha = (1.0 - smoothstep(0.7, 1.0, d)) // only very edge feather
                  * vAlpha * 0.45;

    // Phase colours: ice-white → pale green pollen → grey ash
    vec3 iceC = vec3(0.88, 0.94, 1.00);   // cold white-blue
    vec3 mtnC = vec3(0.72, 0.90, 0.60);   // pale pollen green
    vec3 volC = vec3(0.55, 0.50, 0.48);   // grey ash

    vec3 col = (uPhase <= 1.0)
      ? mix(iceC, mtnC, clamp(uPhase, 0.0, 1.0))
      : mix(mtnC, volC, clamp(uPhase - 1.0, 0.0, 1.0));

    gl_FragColor = vec4(col, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
interface GlacierSceneProps {
  onPhaseUpdate?: (phase: number) => void;
}

export const GlacierScene: React.FC<GlacierSceneProps> = ({ onPhaseUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ── Fountain time state ──
    let targetFountainTime  = 0;
    let currentFountainTime = 0;

    // ── Renderer  (FIX: removed duplicate setSize / setPixelRatio calls) ──
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.set(0, 1.5, 6);

    // ── Main mesh ──
    const geometry = new THREE.SphereGeometry(1.5, 128, 128);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:  { value: 0 },
        uPhase: { value: 0 },
      },
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ── Water base ──
    const waterGeometry = new THREE.CylinderGeometry(3, 3, 2, 64);
    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color:       0x1e3a8a,
      transparent: true,
      opacity:     0.35,
      roughness:   0.3,
      metalness:   0.1,
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = -1.5;
    scene.add(water);

    // ── Trees ──
    const treeCount   = 200;
    const treeAngles  = new Float32Array(treeCount);
    const treeRadii   = new Float32Array(treeCount);
    const treeGeometry = new THREE.ConeGeometry(0.05, 0.2, 6);
    const treeMaterial = new THREE.MeshStandardMaterial({
      color:       0x1f7a1f,
      emissive:    new THREE.Color(0x051105),
      transparent: true,
      opacity:     0,
    });
    const dummy = new THREE.Object3D();
    const trees = new THREE.InstancedMesh(treeGeometry, treeMaterial, treeCount);
    for (let i = 0; i < treeCount; i++) {
      treeAngles[i] = Math.random() * Math.PI * 2;
      treeRadii[i]  = 1.1 + Math.random() * 0.7;
      const x = Math.cos(treeAngles[i]) * treeRadii[i];
      const z = Math.sin(treeAngles[i]) * treeRadii[i];
      dummy.position.set(x, -0.2, z);
      dummy.rotation.set(0, -treeAngles[i], 0);
      dummy.updateMatrix();
      trees.setMatrixAt(i, dummy.matrix);
    }
    scene.add(trees);

    // ── Background particles: tiny falling flakes / ash ──
    const bgCount     = 2200;
    const bgPositions = new Float32Array(bgCount * 3);
    const bgSizes     = new Float32Array(bgCount);
    const bgSpeeds    = new Float32Array(bgCount);
    const bgSways     = new Float32Array(bgCount);

    for (let i = 0; i < bgCount; i++) {
      bgPositions[i * 3 + 0] = (Math.random() - 0.5) * 26;
      bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      bgSizes[i]  = 0.6 + Math.random() * 1.6;   // max ~2px — never blob-sized
      bgSpeeds[i] = 0.3 + Math.random() * 0.9;
      bgSways[i]  = 0.4 + Math.random() * 1.2;
    }

    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    bgGeo.setAttribute('aSize',    new THREE.BufferAttribute(bgSizes,     1));
    bgGeo.setAttribute('aSpeed',   new THREE.BufferAttribute(bgSpeeds,    1));
    bgGeo.setAttribute('aSway',    new THREE.BufferAttribute(bgSways,     1));

    const bgMat = new THREE.ShaderMaterial({
      vertexShader:   bgParticleVert,
      fragmentShader: bgParticleFrag,
      uniforms: {
        uTime:  { value: 0 },
        uPhase: { value: 0 },
      },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    const bgParticles = new THREE.Points(bgGeo, bgMat);
    scene.add(bgParticles);

    // ── Lava fountain ──
    const fountainCount     = 2500;
    const fountainPositions = new Float32Array(fountainCount * 3);
    const fountainParams    = new Float32Array(fountainCount * 4);
    for (let i = 0; i < fountainCount; i++) {
      fountainParams[i * 4 + 0] = Math.random() * Math.PI * 2;
      fountainParams[i * 4 + 1] = Math.random() * 1.8;
      fountainParams[i * 4 + 2] = Math.random() * 6.0 + 4.0;
      fountainParams[i * 4 + 3] = Math.random();
      fountainPositions[i * 3 + 0] = 0;
      fountainPositions[i * 3 + 1] = 1.3;
      fountainPositions[i * 3 + 2] = 0;
    }
    const fountainGeo = new THREE.BufferGeometry();
    fountainGeo.setAttribute('position', new THREE.BufferAttribute(fountainPositions, 3));
    fountainGeo.setAttribute('aParams',  new THREE.BufferAttribute(fountainParams, 4));

    const fountainMat = new THREE.PointsMaterial({
      size:        0.045,
      color:       0xff4400,
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });
    const fountainParticles = new THREE.Points(fountainGeo, fountainMat);
    fountainParticles.visible = false;
    scene.add(fountainParticles);

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // ── Resize ──
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── Tree colour states ──
    const colorGreen    = new THREE.Color(0x1f7a1f);
    const colorYellow   = new THREE.Color(0xaa5533);
    const colorBlack    = new THREE.Color(0x110500);
    const emissiveGreen = new THREE.Color(0x051105);
    const emissiveYellow= new THREE.Color(0x441100);
    const emissiveBlack = new THREE.Color(0x000000);

    // ── ScrollTrigger ──
    ScrollTrigger.create({
      trigger: '#scroll-container',
      start:   'top top',
      end:     'bottom bottom',
      scrub:   true,
      onUpdate(self) {
        const p = self.progress * 2;

        targetFountainTime = Math.max(0, (p - 1.2) * 6);

        material.uniforms.uPhase.value  = p;
        bgMat.uniforms.uPhase.value     = p;  // FIX: sync bg particles to phase
        mesh.rotation.y                 = self.progress * Math.PI * 4;
        onPhaseUpdate?.(p);

        // Tree growth & spread
        const spread = 1.0 + Math.max(0, p - 0.4) * 0.45;
        if (p > 0.35) {
          for (let i = 0; i < treeCount; i++) {
            const r = treeRadii[i] * spread;
            const x = Math.cos(treeAngles[i]) * r;
            const z = Math.sin(treeAngles[i]) * r;
            const y = -0.2 + Math.max(0, p - 0.4) * 0.25;
            dummy.position.set(x, y, z);
            dummy.rotation.set(0, -treeAngles[i], 0);
            dummy.updateMatrix();
            trees.setMatrixAt(i, dummy.matrix);
          }
          trees.instanceMatrix.needsUpdate = true;

          let treeAlpha = 0;
          if (p > 0.4 && p <= 0.6) {
            treeAlpha = (p - 0.4) * 5.0;
            treeMaterial.color.copy(colorGreen);
            treeMaterial.emissive.copy(emissiveGreen);
          } else if (p > 0.6 && p <= 1.1) {
            treeAlpha = 1;
            treeMaterial.color.copy(colorGreen);
            treeMaterial.emissive.copy(emissiveGreen);
          } else if (p > 1.1 && p <= 1.6) {
            treeAlpha = p > 1.35 ? 1.0 - (p - 1.35) * 4.0 : 1;
            const burn = (p - 1.1) * 2.0;
            if (burn < 0.5) {
              treeMaterial.color.copy(colorGreen).lerp(colorYellow, burn * 2.0);
              treeMaterial.emissive.copy(emissiveGreen).lerp(emissiveYellow, burn * 2.0);
            } else {
              treeMaterial.color.copy(colorYellow).lerp(colorBlack, (burn - 0.5) * 2.0);
              treeMaterial.emissive.copy(emissiveYellow).lerp(emissiveBlack, (burn - 0.5) * 2.0);
            }
          }
          treeMaterial.opacity = Math.max(0, Math.min(1, treeAlpha));
        } else {
          treeMaterial.opacity = 0;
        }

        water.visible          = p < 0.8;
        (water.material as THREE.MeshPhysicalMaterial).opacity
                               = Math.max(0, 1 - p * 0.8);

        fountainParticles.visible = p > 1.2;
        fountainMat.opacity       = Math.max(0, Math.min(1, (p - 1.2) * 2));
      },
    });

    // ── Animation loop  (FIX: call getElapsedTime ONCE per frame) ──
    const clock = new THREE.Clock();
    let   raf   = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime(); // FIX: single call; removed duplicate getDelta

      material.uniforms.uTime.value = elapsedTime;
      bgMat.uniforms.uTime.value    = elapsedTime;

      water.rotation.y  = elapsedTime * 0.05;
      water.position.y  = -1.5 + Math.sin(elapsedTime * 1.5) * 0.05;

      bgParticles.rotation.y = elapsedTime * 0.01;  // Very slow global drift

      // Smooth fountain interpolation
      currentFountainTime += (targetFountainTime - currentFountainTime) * 0.05;

      if (fountainParticles.visible) {
        const positions = fountainGeo.attributes.position.array as Float32Array;
        const params    = fountainGeo.attributes.aParams.array  as Float32Array;
        const gravity   = 3.5;
        for (let i = 0; i < fountainCount; i++) {
          const i3 = i * 3, i4 = i * 4;
          const angle      = params[i4];
          const spread     = params[i4 + 1];
          const jumpHeight = params[i4 + 2];
          const offset     = params[i4 + 3];
          const t          = (currentFountainTime + offset) % 1.0;
          positions[i3]     = Math.cos(angle) * spread * t;
          positions[i3 + 1] = 1.3 + jumpHeight * t - 0.5 * gravity * t * t;
          positions[i3 + 2] = Math.sin(angle) * spread * t;
        }
        fountainGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      bgGeo.dispose();
      bgMat.dispose();
      treeGeometry.dispose();
      treeMaterial.dispose();
      fountainGeo.dispose();
      fountainMat.dispose();
      waterGeometry.dispose();
      waterMaterial.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default GlacierScene;
