(() => {
  "use strict";

  const canvas = document.getElementById("shaderCanvas");
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: true,
    powerPreference: "high-performance",
  });

  if (!gl) {
    canvas.style.display = "none";
    const fallbackMenu = document.querySelector(".menu-toggle");
    const fallbackNavigation = document.querySelector(".site-nav");
    const fallbackYear = document.getElementById("year");
    fallbackYear.textContent = new Date().getFullYear();
    fallbackMenu?.addEventListener("click", () => {
      const isOpen = fallbackNavigation.classList.toggle("open");
      fallbackMenu.setAttribute("aria-expanded", String(isOpen));
      fallbackMenu.setAttribute(
        "aria-label",
        isOpen ? "Fermer le menu" : "Ouvrir le menu",
      );
    });
    fallbackNavigation?.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        fallbackNavigation.classList.remove("open");
        fallbackMenu?.setAttribute("aria-expanded", "false");
        fallbackMenu?.setAttribute("aria-label", "Ouvrir le menu");
      }),
    );
    const fallbackObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((item) => fallbackObserver.observe(item));
    return;
  }

  const vertexShaderSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;
    varying vec2 vTextureCoord;

    void main() {
      gl_Position = aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  // Premier shader uniquement : rendu plein écran, sans masque circulaire.
  const fragmentShaderSource = `
    precision highp float;

    uniform vec2 iResolution;
    uniform float iTime;
    varying vec2 vTextureCoord;

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      // Aspect ratio correct pour que l'animation remplisse tout l'écran.
      vec2 uv = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

      // Même mouvement fluide que le premier fond original.
      for (float i = 1.0; i < 10.0; i++) {
        uv.x += 0.6 / i * cos(i * 2.5 * uv.y + iTime);
        uv.y += 0.6 / i * cos(i * 1.5 * uv.x + iTime);
      }

      // Base sombre + reflets métalliques/clairs.
      float chrome = 0.1 / abs(sin(iTime - uv.y - uv.x));
      chrome = clamp(chrome, 0.0, 2.5);

      // Contraste légèrement renforcé pour donner un aspect chrome.
      float highlight = smoothstep(0.15, 1.4, chrome);
      vec3 dark = vec3(0.008, 0.009, 0.012);
      vec3 silver = vec3(0.72, 0.75, 0.80);
      vec3 color = mix(dark, silver, highlight);

      // Petites variations froides dans les reflets.
      color += vec3(0.10, 0.12, 0.15) * pow(highlight, 2.0);

      fragColor = vec4(color, 1.0);
    }

    void main() {
      vec2 fragCoord = vTextureCoord * iResolution;
      vec4 color;
      mainImage(color, fragCoord);
      gl_FragColor = color;
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compile(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return;
  }

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]),
    gl.STATIC_DRAW,
  );

  const uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
    gl.STATIC_DRAW,
  );

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 0, 2, 3]),
    gl.STATIC_DRAW,
  );

  const positionLocation = gl.getAttribLocation(program, "aVertexPosition");
  const uvLocation = gl.getAttribLocation(program, "aTextureCoord");
  const resolutionLocation = gl.getUniformLocation(program, "iResolution");
  const timeLocation = gl.getUniformLocation(program, "iTime");

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(window.innerWidth * dpr));
    const height = Math.max(1, Math.floor(window.innerHeight * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  const start = performance.now();

  function render(now) {
    resize();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(uvLocation);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, (now - start) / 1000);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  const revealItems = document.querySelectorAll(".reveal");
  const year = document.getElementById("year");

  year.textContent = new Date().getFullYear();

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Fermer le menu" : "Ouvrir le menu",
      );
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Ouvrir le menu");
      });
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
})();
