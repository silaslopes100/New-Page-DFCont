import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Button } from '../../common/Button/Button';
import { buildWhatsAppUrl, NAV_SECTIONS } from '../../../config/site';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const DF_GOLD = '#C9A84C';

export const Hero = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const statsRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 3;

  const threeRefs = useRef({
    scene: null, camera: null, renderer: null, composer: null,
    stars: [], nebula: null, animationId: null,
    targetCameraX: 0, targetCameraY: 30, targetCameraZ: 300,
  });

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 300 });

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.6;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    const initThree = () => {
      const refs = threeRefs.current;

      refs.scene = new THREE.Scene();
      refs.scene.background = null;

      refs.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      refs.camera.position.set(0, 30, 300);

      refs.renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.5;
      refs.renderer.setClearColor(0x000000, 0);

      refs.composer = new EffectComposer(refs.renderer);
      refs.composer.addPass(new RenderPass(refs.scene, refs.camera));
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.5, 0.2, 0.85);
      refs.composer.addPass(bloomPass);

      createStarField();
      createNebula();
      animate();
      setIsReady(true);
    };

    const createStarField = () => {
      const refs = threeRefs.current;
      for (let layer = 0; layer < 3; layer++) {
        const count = 4000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
          const radius = 200 + Math.random() * 800;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = radius * Math.cos(phi);

          const color = new THREE.Color();
          const choice = Math.random();
          if (choice < 0.6) color.setHSL(0.1, 0.3, 0.7 + Math.random() * 0.3);
          else if (choice < 0.85) color.setHSL(0.08, 0.6, 0.7);
          else color.setHSL(0.6, 0.4, 0.7);
          colors[i * 3] = color.r; colors[i * 3 + 1] = color.g; colors[i * 3 + 2] = color.b;
          sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: { time: { value: 0 }, depth: { value: layer } },
          vertexShader: `
            attribute float size; attribute vec3 color; varying vec3 vColor;
            uniform float time; uniform float depth;
            void main() {
              vColor = color; vec3 pos = position;
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const refs = threeRefs.current;
      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }, color1: { value: new THREE.Color(DF_GOLD) },
          color2: { value: new THREE.Color('#1a0a2e') }, opacity: { value: 0.2 },
        },
        vertexShader: `
          varying vec2 vUv; varying float vElevation; uniform float time;
          void main() {
            vUv = uv; vec3 pos = position;
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation; vElevation = elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1; uniform vec3 color2; uniform float opacity; uniform float time;
          varying vec2 vUv; varying float vElevation;
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true, blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide, depthWrite: false,
      });
      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.set(0, 0, -1050);
      refs.scene.add(nebula);
      refs.nebula = nebula;
    };

    const animate = () => {
      const refs = threeRefs.current;
      refs.animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      refs.stars.forEach((sf) => { if (sf.material.uniforms) sf.material.uniforms.time.value = time; });
      if (refs.nebula?.material?.uniforms) refs.nebula.material.uniforms.time.value = time * 0.5;

      const smoothing = 0.05;
      smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothing;
      smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothing;
      smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothing;

      const floatX = Math.sin(time * 0.1) * 2;
      const floatY = Math.cos(time * 0.15) * 1;
      refs.camera.position.x = smoothCameraPos.current.x + floatX;
      refs.camera.position.y = smoothCameraPos.current.y + floatY;
      refs.camera.position.z = smoothCameraPos.current.z;
      refs.camera.lookAt(0, 10, -600);

      if (refs.composer) refs.composer.render();
    };

    initThree();

    const handleResize = () => {
      const refs = threeRefs.current;
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      const refs = threeRefs.current;
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener('resize', handleResize);
      refs.stars.forEach((s) => { s.geometry.dispose(); s.material.dispose(); });
      if (refs.nebula) { refs.nebula.geometry.dispose(); refs.nebula.material.dispose(); }
      if (refs.renderer) refs.renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    gsap.set([titleRef.current, subtitleRef.current, ctaRef.current, scrollIndicatorRef.current, statsRef.current], { visibility: 'visible' });

    const tl = gsap.timeline();
    tl.from(titleRef.current, { y: 100, opacity: 0, duration: 1.2, ease: 'power4.out' })
      .from(subtitleRef.current, { y: 60, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
      .from(ctaRef.current, { y: 40, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
      .from(statsRef.current, { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3')
      .from(scrollIndicatorRef.current, { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' }, '-=0.2');

    return () => tl.kill();
  }, [isReady]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const wh = window.innerHeight;
      const maxScroll = Math.max(document.documentElement.scrollHeight - wh, 1);
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
      const newSection = Math.min(Math.floor(progress * totalSections), totalSections - 1);
      setCurrentSection(newSection);

      const refs = threeRefs.current;
      const totalProg = progress * totalSections;
      const sectionProg = totalProg % 1;

      const positions = [
        { x: 0, y: 30, z: 300 },
        { x: 0, y: 40, z: 50 },
        { x: 0, y: 50, z: -500 },
      ];

      const cur = positions[newSection] || positions[0];
      const next = positions[Math.min(newSection + 1, totalSections - 1)] || cur;
      refs.targetCameraX = cur.x + (next.x - cur.x) * sectionProg;
      refs.targetCameraY = cur.y + (next.y - cur.y) * sectionProg;
      refs.targetCameraZ = cur.z + (next.z - cur.z) * sectionProg;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSections]);

  const sections = [
    {
      title: 'Excelência em',
      highlight: 'Assessoria Contábil',
      subtitle: 'Soluções contábeis personalizadas para sua empresa crescer com segurança, tranquilidade e o apoio de profissionais especializados.',
    },
    {
      title: 'Contabilidade',
      highlight: '100% Digital',
      subtitle: 'Processos otimizados com tecnologia de ponta. Acompanhe tudo pelo nosso portal, emite notas, relatórios e muito mais.',
    },
    {
      title: 'Sua Empresa',
      highlight: 'Decola com a Gente',
      subtitle: 'Da abertura ao crescimento, estamos ao seu lado em cada etapa. Mais de 500 empresas confiam na DFCont.',
    },
  ];

  return (
    <div ref={containerRef} id="hero" className="hero-container cosmos-style">
      <video
        ref={videoRef}
        className="hero-video-bg"
        src="/hero-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <canvas ref={canvasRef} className="hero-canvas" />

      <div className="hero-overlay">
        <div className="hero-inner">
          <div ref={titleRef} className="hero-title-block" style={{ visibility: 'hidden' }}>
            <h1 className="hero-title">
              {sections[currentSection].title}{' '}
              <span className="hero-title-highlight">{sections[currentSection].highlight}</span>
            </h1>
          </div>

          <div ref={subtitleRef} className="hero-subtitle-block" style={{ visibility: 'hidden' }}>
            <p className="hero-subtitle">{sections[currentSection].subtitle}</p>
          </div>

          <div ref={ctaRef} className="hero-cta" style={{ visibility: 'hidden' }}>
            <a href={`#${NAV_SECTIONS.planos}`}>
              <Button variant="primary" size="large">Conheça nossos planos</Button>
            </a>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="large">Fale conosco</Button>
            </a>
          </div>

          <div ref={statsRef} className="hero-stats" style={{ visibility: 'hidden' }}>
            <div className="hero-stat-item">
              <span className="hero-stat-num">+500</span>
              <span className="hero-stat-lbl">Empresas ativas</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <span className="hero-stat-num">+10</span>
              <span className="hero-stat-lbl">Anos de mercado</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <span className="hero-stat-num">98%</span>
              <span className="hero-stat-lbl">Satisfação</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollIndicatorRef} className="hero-scroll-indicator" style={{ visibility: 'hidden' }}>
        <span className="scroll-label">SCROLL</span>
        <div className="scroll-line">
          <div className="scroll-dot" style={{ top: `${scrollProgress * 100}%` }} />
        </div>
        <span className="scroll-counter">
          {String(currentSection + 1).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};
