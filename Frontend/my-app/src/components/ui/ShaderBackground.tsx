"use client";

import React, { useEffect, useRef } from "react";

/**
 * ShaderBackground is a high-performance WebGL component
 * that renders an interactive, flowy dark-neon aesthetic background.
 * It compiles a custom fragment shader that responds to mouse coordinates.
 */
export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.warn("WebGL not supported in this browser.");
      return;
    }

    // Vertex shader source
    const vsSource = `
      attribute vec4 position;
      varying vec2 v_texCoord;
      void main() {
        // Map vertices from [-1, 1] to [0, 1] texture coordinates
        v_texCoord = position.xy * 0.5 + 0.5;
        gl_Position = position;
      }
    `;

    // Fragment shader source ( Obsidian Flux neon flow )
    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      void main() {
        vec2 uv = v_texCoord;
        vec2 m = u_mouse / u_resolution;
        
        // Control flow speeds and frequencies
        float time = u_time * 0.15;
        vec3 color = vec3(0.04, 0.03, 0.06); 
        
        // Sine wave iteration for the flow morph distortion
        for(float i = 1.0; i < 4.0; i++){
          uv.x += 0.3 / i * sin(i * 3.0 * uv.y + time + m.x);
          uv.y += 0.3 / i * cos(i * 3.0 * uv.x + time + m.y);
        }
        
        float intensity = sin(uv.x + uv.y + time);
        vec3 accent = vec3(0.54, 0.36, 0.96); // Electric Purple
        color += accent * 0.12 * (1.0 / length(uv - 0.5));
        color *= 0.8 + 0.2 * intensity;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Helper to compile shaders
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    // Compile shaders and link program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Setup coordinates for a full-viewport screen quad
    const positionLoc = gl.getAttribLocation(program, "position");
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform cache references
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");

    // Track mouse coordinates
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Track viewport resizing
    const resizeCanvas = () => {
      if (!canvas) return;
      // Downscale rendering resolution to reduce pixel counts by 4x.
      // This resolves GPU fill-rate limits on high-DPI (Retina/4K) screens,
      // preventing main-thread scrolling stutter.
      canvas.width = Math.floor(window.innerWidth / 2);
      canvas.height = Math.floor(window.innerHeight / 2);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrameId: number;

    // Render loop
    const render = (time: number) => {
      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Clean up WebGL resources and event listeners on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="shader-canvas"
      className="fixed top-0 left-0 w-full h-full z-0 opacity-35 pointer-events-none"
    />
  );
}
