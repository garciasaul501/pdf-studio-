import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Box, Eye, Layers, Maximize2, Minimize2, Palette, RefreshCw, 
  RotateCw, Sparkles, Sun, Video, Zap, Camera, Play, Pause
} from 'lucide-react';

interface ThreeJsStudioViewProps {
  onCaptureSnapshot?: (dataUrl: string) => void;
  onSendToVideoTool?: (snapshotUrl: string) => void;
}

export const ThreeJsStudioView: React.FC<ThreeJsStudioViewProps> = ({
  onCaptureSnapshot,
  onSendToVideoTool
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameId = useRef<number | null>(null);

  // Floating dock state (compact <=15% footprint)
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [activeModel, setActiveModel] = useState<'neural-core' | 'molecular-helix' | 'camera-rig'>('neural-core');
  const [lightingPreset, setLightingPreset] = useState<'studio-pbr' | 'cyber-neon' | 'deep-space'>('cyber-neon');
  const [autoRotate, setAutoRotate] = useState(true);
  const [particleDensity, setParticleDensity] = useState<'high' | 'med'>('high');
  const [snapshotTaken, setSnapshotTaken] = useState<string | null>(null);

  // References to keep animation loop stable without UI re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const clockRef = useRef(new THREE.Clock());

  // Lighting refs
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const accentLightRef = useRef<THREE.PointLight | null>(null);

  // Interaction / damped rotation state
  const targetRotation = useRef({ x: 0.2, y: 0 });
  const currentRotation = useRef({ x: 0.2, y: 0 });
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  // Procedural Canvas Texture Generator (Zero external URL 404s)
  const createProceduralRoughnessTexture = () => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    // Micro grid noise
    for (let x = 0; x < size; x += 4) {
      for (let y = 0; y < size; y += 4) {
        const val = Math.floor(110 + Math.random() * 50);
        ctx.fillStyle = `rgb(${val},${val},${val})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  };

  const createProceduralNormalTexture = () => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgb(128,128,255)';
    ctx.fillRect(0, 0, size, size);

    // Geometric micro circuit traces
    ctx.strokeStyle = 'rgb(140,140,255)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * size, Math.random() * size);
      ctx.lineTo(Math.random() * size, Math.random() * size);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  };

  // Build Model 1: Composite 8-Part 3D Quantum Neural Core & Hologram Server
  const buildNeuralCoreModel = (noiseTex: THREE.Texture, normalTex: THREE.Texture): THREE.Group => {
    const group = new THREE.Group();
    group.name = 'NeuralCore';

    // 1. Pedestal Base (Beveled Octagon)
    const baseGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.4, 8);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x181c24,
      roughness: 0.35,
      metalness: 0.85,
      roughnessMap: noiseTex,
      normalMap: normalTex
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.2;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // 2. Central Translucent Resonator Cylinder
    const coreGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.2, 32);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      transmission: 0.65,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1,
      ior: 1.52,
      thickness: 1.2
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 2.0;
    group.add(coreMesh);

    // 3. Inner Pulsing Energy Nucleus
    const innerGeo = new THREE.IcosahedronGeometry(0.75, 2);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xff6243,
      emissive: 0xff3b14,
      emissiveIntensity: 1.6,
      roughness: 0.2,
      metalness: 0.8
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMesh.name = 'InnerNucleus';
    innerMesh.position.y = 2.0;
    group.add(innerMesh);

    // 4. Floating Magnetic Energy Torus Rings (Part A & B)
    const ringGeo1 = new THREE.TorusGeometry(1.8, 0.08, 16, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.2
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.name = 'RingUpper';
    ringMesh1.position.y = 2.4;
    ringMesh1.rotation.x = Math.PI / 3;
    group.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(1.95, 0.08, 16, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.9,
      metalness: 0.9,
      roughness: 0.2
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.name = 'RingLower';
    ringMesh2.position.y = 1.6;
    ringMesh2.rotation.x = -Math.PI / 3.5;
    group.add(ringMesh2);

    // 5. Heat Sync Cooling Fins (4 radial parts)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const finGeo = new THREE.BoxGeometry(0.12, 2.6, 0.6);
      const finMat = new THREE.MeshStandardMaterial({
        color: 0x222834,
        metalness: 0.9,
        roughness: 0.3
      });
      const finMesh = new THREE.Mesh(finGeo, finMat);
      finMesh.position.set(Math.cos(angle) * 1.5, 2.0, Math.sin(angle) * 1.5);
      finMesh.rotation.y = -angle;
      group.add(finMesh);
    }

    // 6. Upper Holographic Emitter Cap
    const capGeo = new THREE.ConeGeometry(1.4, 0.6, 8);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x1e2430,
      metalness: 0.8,
      roughness: 0.3
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 3.9;
    group.add(capMesh);

    // 7. Soft Radial Ground Contact Shadow Disk
    const shadowGeo = new THREE.CircleGeometry(2.8, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.01;
    group.add(shadowMesh);

    return group;
  };

  // Build Model 2: Composite 9-Part 3D Molecular Double Helix & Protein Capsule (Science Skill)
  const buildMolecularHelixModel = (): THREE.Group => {
    const group = new THREE.Group();
    group.name = 'MolecularHelix';

    const baseGeo = new THREE.CylinderGeometry(2.0, 2.3, 0.35, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x121620, metalness: 0.8, roughness: 0.4 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.175;
    group.add(baseMesh);

    // Double Helix Spirals
    const steps = 30;
    const radius = 1.1;
    const heightSpan = 3.6;

    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const angle = t * Math.PI * 4;
      const y = 0.5 + t * heightSpan;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      // Strand A Atom (AlphaFold pLDDT Blue >90)
      const atomGeoA = new THREE.SphereGeometry(0.16, 16, 16);
      const atomMatA = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.6
      });
      const atomA = new THREE.Mesh(atomGeoA, atomMatA);
      atomA.position.set(x1, y, z1);
      group.add(atomA);

      // Strand B Atom (AlphaFold pLDDT Cyan 70-90)
      const atomGeoB = new THREE.SphereGeometry(0.16, 16, 16);
      const atomMatB = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x0891b2,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.6
      });
      const atomB = new THREE.Mesh(atomGeoB, atomMatB);
      atomB.position.set(x2, y, z2);
      group.add(atomB);

      // Base Pair Covalent Bond Connector (every 2 steps)
      if (i % 2 === 0) {
        const bondGeo = new THREE.CylinderGeometry(0.04, 0.04, radius * 2, 8);
        const bondMat = new THREE.MeshStandardMaterial({
          color: i % 4 === 0 ? 0xff6243 : 0xf59e0b,
          roughness: 0.3,
          metalness: 0.5
        });
        const bondMesh = new THREE.Mesh(bondGeo, bondMat);
        bondMesh.position.set(0, y, 0);
        bondMesh.rotation.z = Math.PI / 2;
        bondMesh.rotation.y = -angle;
        group.add(bondMesh);
      }
    }

    // Outer Translucent Protein Capsule Shell
    const capsuleGeo = new THREE.CapsuleGeometry(1.6, 2.4, 16, 32);
    const capsuleMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.82,
      opacity: 1,
      transparent: true,
      roughness: 0.08,
      ior: 1.45,
      thickness: 1.0
    });
    const capsuleMesh = new THREE.Mesh(capsuleGeo, capsuleMat);
    capsuleMesh.position.y = 2.3;
    group.add(capsuleMesh);

    // Contact shadow
    const shadowGeo = new THREE.CircleGeometry(2.4, 32);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    group.add(shadow);

    return group;
  };

  // Build Model 3: Composite 7-Part 3D Cyber Camera Rig & Hologram Presenter
  const buildCameraRigModel = (): THREE.Group => {
    const group = new THREE.Group();
    group.name = 'CameraRig';

    // Base Tripod Column
    const standGeo = new THREE.CylinderGeometry(0.3, 0.7, 1.4, 16);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x1a202c, metalness: 0.9, roughness: 0.25 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.y = 0.7;
    group.add(stand);

    // Articulated Head Gimbal
    const gimbalGeo = new THREE.SphereGeometry(0.45, 24, 24);
    const gimbalMat = new THREE.MeshStandardMaterial({ color: 0xff6243, metalness: 0.8, roughness: 0.2 });
    const gimbal = new THREE.Mesh(gimbalGeo, gimbalMat);
    gimbal.position.y = 1.6;
    group.add(gimbal);

    // Main Studio Camera Body
    const bodyGeo = new THREE.BoxGeometry(1.4, 1.0, 1.8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 2.2, 0);
    group.add(body);

    // Optical Lens Barrel
    const lensGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.2, 32);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.95, roughness: 0.1 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 2.2, 1.2);
    group.add(lens);

    // Front Glass Element
    const glassGeo = new THREE.CircleGeometry(0.42, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      transmission: 0.7,
      transparent: true,
      roughness: 0.05
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, 2.2, 1.81);
    group.add(glass);

    // Live Tally Emitter Light
    const tallyGeo = new THREE.BoxGeometry(0.3, 0.1, 0.1);
    const tallyMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tally = new THREE.Mesh(tallyGeo, tallyMat);
    tally.position.set(0, 2.75, 0.8);
    group.add(tally);

    // Contact Shadow
    const shadowGeo = new THREE.CircleGeometry(2.0, 32);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    group.add(shadow);

    return group;
  };

  // Initialize Scene, PBR Studio Lighting & Animation Loop
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x080a10);
    scene.fog = new THREE.FogExp2(0x080a10, 0.08);

    // 2. Camera with Damped Response
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 8.5);
    camera.lookAt(0, 2.0, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer with ACESFilmicToneMapping
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true // Allows capturing snapshot for video tool
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Studio PBR Lighting System
    // Key Light: Warm directional light with tight shadow frustum
    const keyLight = new THREE.DirectionalLight(0xffecd6, 2.4);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Fill Light: Cool HemisphereLight
    const hemiLight = new THREE.HemisphereLight(0xd8e8f8, 0x121722, 1.2);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // Accent Rim PointLight
    const accentLight = new THREE.PointLight(0xff6243, 3.5, 12);
    accentLight.position.set(-4, 4, -3);
    scene.add(accentLight);
    accentLightRef.current = accentLight;

    // 5. Procedural Textures & Initial Model
    const noiseTex = createProceduralRoughnessTexture();
    const normalTex = createProceduralNormalTexture();

    const modelGroup = buildNeuralCoreModel(noiseTex, normalTex);
    scene.add(modelGroup);
    currentGroupRef.current = modelGroup;

    // 6. Floating Ambient Particle Field
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 14;
      positions[i + 1] = Math.random() * 8;
      positions[i + 2] = (Math.random() - 0.5) * 14;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 7. Ground Grid Simulation
    const grid = new THREE.GridHelper(16, 16, 0xff6243, 0x1f293d);
    grid.position.y = 0;
    scene.add(grid);

    // 8. 60 FPS Damped Animation Loop
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      const delta = clockRef.current.getDelta();
      const elapsed = clockRef.current.getElapsedTime();

      // Exponential damping smoothing: 1 - Math.exp(-k * dt)
      const dampFactor = 1 - Math.exp(-6 * delta);
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * dampFactor;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * dampFactor;

      if (autoRotate && !isDragging.current) {
        targetRotation.current.y += delta * 0.4;
      }

      // Apply smoothed rotation to current model
      if (currentGroupRef.current) {
        currentGroupRef.current.rotation.y = currentRotation.current.y;
        currentGroupRef.current.rotation.x = currentRotation.current.x * 0.3;

        // Animate sub-parts if present
        const nucleus = currentGroupRef.current.getObjectByName('InnerNucleus');
        if (nucleus) {
          nucleus.rotation.y += delta * 1.5;
          nucleus.scale.setScalar(0.95 + Math.sin(elapsed * 3) * 0.08);
        }

        const ringUp = currentGroupRef.current.getObjectByName('RingUpper');
        if (ringUp) ringUp.rotation.z -= delta * 1.2;

        const ringLow = currentGroupRef.current.getObjectByName('RingLower');
        if (ringLow) ringLow.rotation.z += delta * 1.4;
      }

      // Float particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 560;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
    };
  }, []);

  // Switch Model dynamically
  const handleModelChange = (modelType: 'neural-core' | 'molecular-helix' | 'camera-rig') => {
    setActiveModel(modelType);
    if (!sceneRef.current) return;

    if (currentGroupRef.current) {
      sceneRef.current.remove(currentGroupRef.current);
    }

    const noiseTex = createProceduralRoughnessTexture();
    const normalTex = createProceduralNormalTexture();

    let newModel: THREE.Group;
    if (modelType === 'molecular-helix') {
      newModel = buildMolecularHelixModel();
    } else if (modelType === 'camera-rig') {
      newModel = buildCameraRigModel();
    } else {
      newModel = buildNeuralCoreModel(noiseTex, normalTex);
    }

    sceneRef.current.add(newModel);
    currentGroupRef.current = newModel;
  };

  // Switch Lighting Preset
  const handleLightingChange = (preset: 'studio-pbr' | 'cyber-neon' | 'deep-space') => {
    setLightingPreset(preset);
    if (!keyLightRef.current || !hemiLightRef.current || !accentLightRef.current) return;

    if (preset === 'cyber-neon') {
      keyLightRef.current.color.setHex(0x06b6d4);
      keyLightRef.current.intensity = 2.8;
      accentLightRef.current.color.setHex(0xff6243);
      accentLightRef.current.intensity = 4.0;
      hemiLightRef.current.color.setHex(0x1e1b4b);
    } else if (preset === 'studio-pbr') {
      keyLightRef.current.color.setHex(0xffeedb);
      keyLightRef.current.intensity = 2.2;
      accentLightRef.current.color.setHex(0x38bdf8);
      accentLightRef.current.intensity = 2.0;
      hemiLightRef.current.color.setHex(0xf8fafc);
    } else {
      // deep space
      keyLightRef.current.color.setHex(0x3b82f6);
      keyLightRef.current.intensity = 1.8;
      accentLightRef.current.color.setHex(0xa855f7);
      accentLightRef.current.intensity = 3.5;
      hemiLightRef.current.color.setHex(0x0f172a);
    }
  };

  // Drag controls with mouse/touch
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMouse.current.x;
    const deltaY = e.clientY - previousMouse.current.y;

    targetRotation.current.y += deltaX * 0.01;
    targetRotation.current.x = Math.max(-0.6, Math.min(0.8, targetRotation.current.x + deltaY * 0.01));

    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Capture current 3D canvas snapshot and send to PDF-to-Video tool
  const handleCaptureSnapshot = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    setSnapshotTaken(dataUrl);
    onCaptureSnapshot?.(dataUrl);
  };

  return (
    <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-white/10 bg-[#080A10] shadow-2xl select-none" ref={containerRef}>
      {/* Three.js WebGL Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Viewport-First Floating Dock (Compact <=15% footprint) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="bg-[#10131F]/90 border border-white/10 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">
            Three.js Studio 3D (PBR 60fps)
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
            WebGL
          </span>
        </div>
      </div>

      {/* Floating Control Dock (Collapsible Solid Surface, No backdrop-filter over WebGL) */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-[#10131F] border border-white/10 rounded-2xl p-3 shadow-2xl space-y-3 max-w-[260px]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-orange-400" />
              <span>Controles 3D</span>
            </span>
            <button
              onClick={() => setIsDockCollapsed(!isDockCollapsed)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              {isDockCollapsed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {!isDockCollapsed && (
            <div className="space-y-3 pt-1 border-t border-white/5 text-xs">
              {/* Model Selector */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Modelo 3D Compuesto:
                </label>
                <div className="space-y-1">
                  {[
                    { id: 'neural-core', label: 'Quantum Core (8 Partes)', desc: 'Servidor IA' },
                    { id: 'molecular-helix', label: 'Doble Hélice (9 Partes)', desc: 'ADN Biociencia' },
                    { id: 'camera-rig', label: 'Cámara Estudio (7 Partes)', desc: 'Producción' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleModelChange(m.id as any)}
                      className={`w-full p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                        activeModel === m.id
                          ? 'bg-orange-500/15 border-orange-500/60 text-white font-bold'
                          : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{m.label}</span>
                      <span className="text-[9px] font-mono text-slate-500">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lighting Presets */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Iluminación PBR:
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'cyber-neon', label: 'Cyber' },
                    { id: 'studio-pbr', label: 'Studio' },
                    { id: 'deep-space', label: 'Space' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleLightingChange(p.id as any)}
                      className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer text-[11px] ${
                        lightingPreset === p.id
                          ? 'bg-white/10 border-orange-500 text-white font-bold'
                          : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-2 rounded-xl border flex items-center gap-1.5 cursor-pointer text-xs w-full justify-center transition-all ${
                    autoRotate
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                  <span>{autoRotate ? 'Rotación Activa' : 'Pausado'}</span>
                </button>
              </div>

              {/* Capture Snapshot Action */}
              <button
                onClick={handleCaptureSnapshot}
                className="w-full py-2.5 px-3 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Capturar Fotograma 3D</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Snapshot Preview Toast & Transfer */}
      {snapshotTaken && (
        <div className="absolute bottom-4 left-4 z-20 bg-[#10131F] border border-orange-500/40 rounded-2xl p-3 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <img src={snapshotTaken} alt="3D Snapshot" className="w-14 h-14 object-cover rounded-xl border border-white/10" />
          <div>
            <p className="text-xs font-bold text-white">¡Fotograma 3D Capturado!</p>
            <p className="text-[10px] text-slate-400">Listo para usar como fondo en tu video</p>
            <div className="flex items-center gap-2 mt-1.5">
              <button
                onClick={() => {
                  onSendToVideoTool?.(snapshotTaken);
                  setSnapshotTaken(null);
                }}
                className="text-[10px] font-bold text-orange-400 hover:text-orange-300 underline cursor-pointer"
              >
                Insertar en Convertidor Video &gt;
              </button>
              <button
                onClick={() => setSnapshotTaken(null)}
                className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-[11px] text-slate-400 bg-black/60 px-3 py-1 rounded-full border border-white/5">
        <span>Arrastra para orbitar el modelo 3D en tiempo real</span>
      </div>
    </div>
  );
};
