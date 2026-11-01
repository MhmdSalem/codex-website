"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { pointer } from "@/experience/caret/pointer";
import { readMotionCapability } from "@/motion/hooks/useMotionPreference";

import styles from "./build.module.css";

/**
 * The network behind the page.
 *
 * A few hundred points in a volume, joined wherever two are close, so the
 * page sits inside a living graph of its own systems. It turns slowly, leans
 * with the pointer, and the camera draws back as the reader scrolls so the
 * graph recedes as the content comes forward.
 *
 * Loaded dynamically and client-only; the page is complete without it.
 */
export function NetworkField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const capability = readMotionCapability();
    const count = capability.isLowPower ? 180 : 420;
    const linkDistance = capability.isLowPower ? 18 : 16;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);
    camera.position.z = 60;

    // ---------------------------------------------------------------- points
    const positions = new Float32Array(count * 3);
    const colours = new Float32Array(count * 3);
    const vectors: THREE.Vector3[] = [];
    const warm = new THREE.Color(0xe89b80);
    const bone = new THREE.Color(0xece9e2);
    const cool = new THREE.Color(0x5b7cff);

    for (let index = 0; index < count; index += 1) {
      const vector = new THREE.Vector3(
        (Math.random() - 0.5) * 160,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 120,
      );
      vectors.push(vector);
      positions.set([vector.x, vector.y, vector.z], index * 3);
      const roll = Math.random();
      const colour = roll < 0.55 ? bone : roll < 0.86 ? warm : cool;
      colours.set([colour.r, colour.g, colour.b], index * 3);
    }

    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = spriteCanvas.height = 64;
    const context = spriteCanvas.getContext("2d");
    if (context) {
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.25, "rgba(255,255,255,.6)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
    }
    const sprite = new THREE.CanvasTexture(spriteCanvas);

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute("color", new THREE.BufferAttribute(colours, 3));
    const pointMaterial = new THREE.PointsMaterial({
      size: 1.6,
      map: sprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(pointGeometry, pointMaterial);

    // ----------------------------------------------------------------- links
    const linkPositions: number[] = [];
    for (let a = 0; a < count; a += 1) {
      for (let b = a + 1; b < count; b += 1) {
        if (vectors[a]!.distanceTo(vectors[b]!) < linkDistance) {
          linkPositions.push(
            vectors[a]!.x,
            vectors[a]!.y,
            vectors[a]!.z,
            vectors[b]!.x,
            vectors[b]!.y,
            vectors[b]!.z,
          );
        }
      }
    }
    const linkGeometry = new THREE.BufferGeometry();
    linkGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(linkPositions), 3),
    );
    const linkMaterial = new THREE.LineBasicMaterial({
      color: 0xd77758,
      transparent: true,
      opacity: 0.13,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const links = new THREE.LineSegments(linkGeometry, linkMaterial);

    const group = new THREE.Group();
    group.add(points);
    group.add(links);
    scene.add(group);

    // ----------------------------------------------------------------- frame
    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let scrollProgress = 0;
    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? window.scrollY / max : 0;
    };
    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });

    const clock = new THREE.Clock();
    let frame = 0;
    let running = true;

    const render = () => {
      if (!running) return;
      const elapsed = clock.getElapsedTime();
      const pointerX = pointer.active ? pointer.cx / window.innerWidth - 0.5 : 0;
      const pointerY = pointer.active ? pointer.cy / window.innerHeight - 0.5 : 0;

      group.rotation.y += (pointerX * 0.25 + elapsed * 0.02 - group.rotation.y) * 0.04;
      group.rotation.x += (pointerY * 0.15 - group.rotation.x) * 0.04;
      camera.position.z += (60 - scrollProgress * 70 - camera.position.z) * 0.05;
      camera.position.y += (-scrollProgress * 30 - camera.position.y) * 0.05;
      pointMaterial.opacity = 0.75 + Math.sin(elapsed * 1.2) * 0.15;

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };

    if (capability.prefersReducedMotion) {
      // One settled frame; the graph is a picture, not a motion.
      renderer.render(scene, camera);
    } else {
      frame = window.requestAnimationFrame(render);
    }

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", readScroll);
      pointGeometry.dispose();
      linkGeometry.dispose();
      pointMaterial.dispose();
      linkMaterial.dispose();
      sprite.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.network} aria-hidden="true" />;
}
