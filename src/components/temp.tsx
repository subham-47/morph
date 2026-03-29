import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Noise helper (Simplex-like) ---
const noise = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }
`;

const vertexShader = `
  ${noise}
  uniform float uTime;
  uniform float uPhase; // 0: Ice, 1: Mountain, 2: Volcano
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vNoise;
  varying float vElevation;

  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);

    // Morphing logic
    float n = snoise(position * 1.5 + uTime * 0.1);
    vNoise = n;

    vec3 icePos = position;
    float iceHeight = snoise(position * 2.0) * 0.2;
    if(position.y > 0.1) {
        icePos *= (0.8 + iceHeight);
    } else {
        icePos *= (1.2 - iceHeight);
    }

    vec3 mtnPos = position;
    float mtnHeight = pow(max(0.0, (position.y + 1.0) / 2.0), 0.6) * 2.5;
    mtnPos.y = mtnHeight - 0.5 + n * 0.2;
    float mtnSpread = (1.0 - pow(max(0.0, (position.y + 1.0) / 2.0), 0.5)) * 2.0 + 0.1;
    mtnPos.xz *= mtnSpread;

    vec3 volPos = position;
    float volHeight = pow(max(0.0, (position.y + 1.0) / 2.0), 0.5) * 2.6;
    if(position.y > 0.85) {
        volHeight -= (position.y - 0.85) * 4.0; // Crater
    }
    volPos.y = volHeight - 0.5 + n * 0.1;
    float volSpread = (1.0 - pow(max(0.0, (position.y + 1.0) / 2.0), 0.4)) * 2.2 + 0.1;
    volPos.xz *= volSpread;

    vec3 finalPos;
    if(uPhase <= 1.0) {
        finalPos = mix(icePos, mtnPos, uPhase);
    } else {
        finalPos = mix(mtnPos, volPos, uPhase - 1.0);
    }

    vElevation = finalPos.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uPhase;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vNoise;
  varying float vElevation;

  void main() {
    vec3 lightDir = normalize(vec3(5.0, 5.0, 5.0));
    float diff = max(0.0, dot(vNormal, lightDir));
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);

    vec3 iceColor = mix(vec3(0.1, 0.4, 0.8), vec3(0.8, 0.95, 1.0), smoothstep(-1.0, 1.5, vElevation));
    vec3 mtnColor = mix(vec3(0.1, 0.3, 0.1), vec3(0.4, 0.6, 0.3), smoothstep(-0.5, 1.5, vElevation));
    if(vElevation > 1.8) mtnColor = mix(mtnColor, vec3(0.9, 0.9, 0.9), (vElevation - 1.8) * 2.0);

    vec3 volColor = mix(vec3(0.1, 0.05, 0.02), vec3(0.3, 0.2, 0.15), smoothstep(-0.5, 2.0, vElevation));
    if(vElevation > 1.2) {

    // 🌋 flowing lava pattern
    float flow = sin(vPosition.x * 8.0 + uTime * 2.5) * 0.5 + 0.5;
    flow *= sin(vPosition.z * 8.0 + uTime * 2.0) * 0.5 + 0.5;

    // restrict to cracks
    float cracks = smoothstep(1.2, 2.2, vElevation);

    float lavaMask = flow * cracks;

    // glowing lava color
    vec3 lavaColor = vec3(1.5, 0.4, 0.0) * lavaMask;

    // animate brightness
    lavaColor *= (0.6 + 0.4 * sin(uTime * 4.0));

    // mix with volcano surface
    volColor = mix(volColor, lavaColor, lavaMask * 0.8);
}

    vec3 finalColor;
    if(uPhase <= 1.0) {
        finalColor = mix(iceColor, mtnColor, uPhase);
    } else {
        finalColor = mix(mtnColor, volColor, uPhase - 1.0);
    }

    finalColor += fresnel * 0.6;
    finalColor *= (diff * 0.8 + 0.2);
    
    // 🔥 lava emission boost
if(uPhase > 1.5){
  finalColor += vec3(0.8, 0.2, 0.0) * smoothstep(1.2, 2.2, vElevation) * 0.6;
}

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface GlacierSceneProps {
  onPhaseUpdate: (phase: number) => void;
}

export const GlacierScene: React.FC<GlacierSceneProps> = ({ onPhaseUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({
  canvas: canvasRef.current,
  antialias: true,
  alpha: true,
});

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 6);

    const geometry = new THREE.SphereGeometry(1.5, 128, 128);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPhase: { value: 0 },
      },
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 🌊 Water base (iceberg effect)
const waterGeometry = new THREE.CylinderGeometry(3, 3, 2, 64);

const waterMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x1e3a8a,
  transparent: true,
  opacity: 0.35,
  roughness: 0.3,
  metalness: 0.1,
});

const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.position.y = -1.5;

scene.add(water);

    // 🌲 Trees (instanced for performance)
const treeCount = 200;

const treeGeometry = new THREE.ConeGeometry(0.05, 0.2, 6);
const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x1f7a1f });

const trees = new THREE.InstancedMesh(treeGeometry, treeMaterial, treeCount);

const dummy = new THREE.Object3D();

for (let i = 0; i < treeCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 1.2 + Math.random() * 0.6;

  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  // place slightly above surface
  const y = Math.random() * 0.3 - 0.2;

  dummy.position.set(x, y, z);
  dummy.scale.setScalar(0.8 + Math.random() * 0.6);

  dummy.updateMatrix();
  trees.setMatrixAt(i, dummy.matrix);
}

scene.add(trees);

    // Particles
    const particlesCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();

    ScrollTrigger.create({
  trigger: '#scroll-container',
  start: 'top top',
  end: 'bottom bottom',
  scrub: true,
  onUpdate: (self) => {
    const p = self.progress * 2;

    material.uniforms.uPhase.value = p;
    mesh.rotation.y = self.progress * Math.PI * 4;
    onPhaseUpdate(p);

    trees.visible = p > 0.5 && p < 1.5;
    water.visible = p < 0.8;
    water.material.opacity = Math.max(0, 1 - p * 0.8);

    if (p < 0.5) {
      particlesMaterial.color.set(0xffffff);
    } else if (p < 1.5) {
      particlesMaterial.color.set(0x4ade80);
    } else {
      particlesMaterial.color.set(0xff4400);
    }
  },
}); 

  const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  material.uniforms.uTime.value = elapsedTime;

  water.rotation.y = elapsedTime * 0.05;
  water.position.y = -1.5 + Math.sin(elapsedTime * 1.5) * 0.05;

  particlesMaterial.opacity = 0.4 + Math.sin(elapsedTime * 5) * 0.2;

  particlesMesh.rotation.y = elapsedTime * 0.05;
  particlesMesh.position.y = Math.sin(elapsedTime * 0.2) * 0.5;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
