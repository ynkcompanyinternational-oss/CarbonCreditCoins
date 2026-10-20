
import * as THREE from "./three.module.js";

const host = document.querySelector(
  "#ccc-world-3d-panel .world-wrap"
);

if (host) {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      35, 1, 0.1, 100
    );
    camera.position.z = 6.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    renderer.domElement.className = "ccc-globe-canvas";
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));

    const sun = new THREE.DirectionalLight(0xffe5b4, 2.7);
    sun.position.set(-3, 3, 5);
    scene.add(sun);

    const rimLight = new THREE.DirectionalLight(
      0xb68a49, 1.5
    );
    rimLight.position.set(4, -1, -3);
    scene.add(rimLight);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const geometry = new THREE.SphereGeometry(
      1.65, 96, 64
    );

    const orbit = new THREE.Mesh(
      new THREE.RingGeometry(1.91, 1.925, 160),
      new THREE.MeshBasicMaterial({
        color: 0xd7b575,
        transparent: true,
        opacity: 0.42,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    orbit.rotation.x = 1.05;
    orbit.rotation.y = 0.35;
    globeGroup.add(orbit);

    const loader = new THREE.TextureLoader();

    loader.load(
      "./assets/globo/terra.jpg",
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;

        const earth = new THREE.Mesh(
          geometry,
          new THREE.MeshStandardMaterial({
            map: texture,
            color: 0xe7d6ab,
            roughness: 0.78,
            metalness: 0.10
          })
        );

        earth.rotation.y = -0.5;
        earth.rotation.z = 0.08;
        globeGroup.add(earth);

        function resize() {
          const w = host.clientWidth;
          const h = host.clientHeight;
          if (!w || !h) return;

          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        }

        resize();
        renderer.render(scene, camera);

        host.classList.add("ccc-globe-ready");

        if (window.ResizeObserver) {
          new ResizeObserver(resize).observe(host);
        } else {
          window.addEventListener("resize", resize);
        }

        function animate() {
          requestAnimationFrame(animate);
          if (!document.hidden) {
            earth.rotation.y += 0.0022;
            orbit.rotation.z += 0.0005;
            renderer.render(scene, camera);
          }
        }

        animate();
      },
      undefined,
      () => {
        renderer.domElement.remove();
        console.warn("Textura indisponivel: mapa original mantido.");
      }
    );

  } catch (error) {
    console.warn("WebGL indisponivel: mapa original mantido.");
  }
}
