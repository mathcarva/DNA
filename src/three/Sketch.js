// 🚀 COMO RODAR O PROJETO:
// 1. Instale o Node.js e o Yarn.
// 2. No terminal, dentro da pasta do projeto, rode:
//    yarn install  // ou: npm install
// 3. Instale as dependências principais:
//    yarn add three dat.gui three-orbit-controls vite-aliases vite-plugin-vue2 vue vue-router vue-template-compiler vuex
// 4. Instale as dependências de desenvolvimento:
//    yarn add -D vite sass // ou: npm install -D vite sass
// 5. Rode o projeto localmente:
//    yarn dev // ou: npm run dev
// 6. Para usar o DRACOLoader do three.js corretamente, adicione isso no código:
//    dracoLoader.setDecoderPath("https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/");

//------------------- IMPORTAÇÕES -------------------
import * as THREE from "three";
import fragment from "@three/shaders/fragment.glsl?raw";
import vertex from "@three/shaders/vertexParticles.glsl?raw";
import * as toc from "three-orbit-controls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import dna from "@assets/3d-models/dna.glb?url";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import * as dat from "dat.gui";
import { AberrationShader } from "@three/shaders/CustomPass";

//------------------- CLASSE PRINCIPAL -------------------
export default class Sketch {
    constructor() {
        this.scene = new THREE.Scene();
        this.container = document.body;
        this.clock = new THREE.Clock();

        this.mouse = new THREE.Vector2(0, 0);//Efeito mouse
        this.targetLook = new THREE.Vector3(0, 0, 0);//Efeito mouse

        this.initRenderer();
        this.initCamera();
        this.initControls();
        this.initScrollSync();//this.initScrollBehavior();
        this.initMouseParallax();//
        this.baseRotationSpeed = 0.00025;//velocidade da rotação do scroll
        this.scrollVelocity = 0;//velocidade da rotação do scroll

        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath("/draco/javascript/");
        this.loader.setDRACOLoader(this.dracoLoader);
        this.container.appendChild(this.renderer.domElement);
    }

    //------------------- RENDERER -------------------
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x1f1f26, .3);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
    }

    //------------------- CÂMERA -------------------
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        );
        this.camera.position.set(0.5, 0, 6); // distância da célula
    }

    initMouseParallax() {
    window.addEventListener("mousemove", (event) => {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.mouse.set(x, y);
    });
}

    //------------------- CONTROLES -------------------
    initControls() {
        const OrbitControls = toc(THREE);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Desativa interação com mouse
        this.controls.enableRotate = false;
        this.controls.enablePan = false;
        this.controls.enableZoom = false;
    }

    //------------------- SCROLL PARA MOVER A CÂMERA NO EIXO Y -------------------
    /*
    initScrollBehavior() {
        this.container.addEventListener("wheel", (event) => {
            if (event.target.id === "celulaCanvas") {
                event.preventDefault();
                const delta = event.deltaY * 0.01;
                this.camera.position.y -= delta;
                this.camera.updateProjectionMatrix();
            }
        }, { passive: false });
    }
    */
    initScrollSync() {
        window.addEventListener("scroll", () => {
            const scrollY = window.scrollY;
            const factor = 0.002;
            this.camera.position.y = -scrollY * factor;

            // Aumenta a velocidade de rotação com base na direção do scroll
            const scrollDelta = window.scrollY - (this.lastScrollY || 0);
            this.scrollVelocity += scrollDelta * 0.0005; // ajuste fino da intensidade
            this.lastScrollY = scrollY;

            this.camera.updateProjectionMatrix();
        });
    }

    //------------------- CÉLULA (MODELO 3D) -------------------
    loadObjects = () => {
        this.loader.load(dna, (gltf) => {
            this.geometry = gltf.scene.children[0].geometry;
            this.geometry.center();
            this.addObjects();
            this.createOrbs();
            this.initPost();
            this.resize();
            window.addEventListener("resize", this.resize);
            this.render();
            this.settings();
            this.dna.position.y = -6;
        });
    };

    addObjects() {
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable",
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { value: 0 },
                uColor1: { value: new THREE.Color(0x612574) },
                uColor2: { value: new THREE.Color(0x293583) },
                uColor3: { value: new THREE.Color(0x1954ec) },
                resolution: { value: new THREE.Vector4() },
                uvRate1: { value: new THREE.Vector2(1, 1) },
                uOpacity: { value: 1.0 },
            },
            transparent: true,
            vertexShader: vertex,
            fragmentShader: fragment,
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        this.number = this.geometry.attributes.position.array.length;
        let randoms = new Float32Array(this.number / 3);
        let colorRandoms = new Float32Array(this.number / 3);

        for (let i = 0; i < this.number / 3; i++) {
            randoms[i] = Math.random();
            colorRandoms[i] = Math.random();
        }

        this.geometry.setAttribute("randoms", new THREE.BufferAttribute(randoms, 1));
        this.geometry.setAttribute("colorRandoms", new THREE.BufferAttribute(colorRandoms, 1));

        this.dna = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.dna);
        
    }

    //------------------- ÓRBITAS (PARTÍCULAS) -------------------
    createOrbs() {
        this.floatingGroup = new THREE.Group();
        const numParticles = 100;
        const range = 10;
        const positions = new Float32Array(numParticles * 3);

        for (let i = 0; i < numParticles; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * range;
            positions[i3 + 1] = (Math.random() - 0.5) * range;
            positions[i3 + 2] = (Math.random() - 0.5) * range;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.03,
            transparent: true,
            opacity: 0.25,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        this.floatingParticles = new THREE.Points(particleGeometry, particleMaterial);
        this.floatingGroup.add(this.floatingParticles);
        this.scene.add(this.floatingGroup);
    }

    //------------------- EFEITOS -------------------
    initPost() {
        this.renderScene = new RenderPass(this.scene, this.camera);
        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.4, 0.87, 0.01);

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(this.renderScene);
        this.composer.addPass(this.bloomPass);

        this.effect1 = new ShaderPass(AberrationShader);
        this.composer.addPass(this.effect1);
    }

    settings() {
        this.settings = {
            progress: 0,
            bloomThreshold: 0,
            bloomStrength: 0.88,
            bloomRadius: -0.01,
        };
        this.gui = new dat.GUI();
        this.gui.add(this.settings, "progress", 0, 1, 0.01);
        this.gui.add(this.settings, "bloomThreshold", 0, 1, 0.01);
        this.gui.add(this.settings, "bloomStrength", 0, 100, 0.01);
        this.gui.add(this.settings, "bloomRadius", 0, 10, 0.01);
    }

    //------------------- RENDERIZAÇÃO -------------------
    resize = () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.composer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    };

    render = () => {
    this.time = this.clock.getElapsedTime();
    this.bloomPass.threshold = this.settings.bloomThreshold;
    this.bloomPass.strength = this.settings.bloomStrength;
    this.bloomPass.radius = this.settings.bloomRadius;

    this.scrollVelocity *= 0.80; // atrito, desacelera gradualmente
    const rotationIncrement = this.baseRotationSpeed + this.scrollVelocity;
    this.dna.rotation.y += rotationIncrement;
    this.material.uniforms.time.value = this.time;

    if (this.floatingGroup) {
        this.floatingGroup.rotation.y += 0.0003; // rotação das órbitas
    }

    // --- Atualiza a câmera ---

    // A posição Y já é alterada pelo scroll em outro listener, mantemos

    // Agora criamos o vetor para olhar suavemente conforme o mouse,
    // limitando o movimento pra não ficar estranho:
    const lookX = this.mouse.x * 0; // suaviza a influência no eixo X
    const lookY = this.mouse.y * 0.009 + this.camera.position.y; // adiciona Y da câmera

    const target = new THREE.Vector3(
        lookX,              // pequeno desvio no X pelo mouse
        lookY,              // mouse Y + scroll Y
        this.camera.position.z - 1 // sempre para frente
    );

    this.camera.lookAt(target);

    requestAnimationFrame(this.render);
    this.composer.render();
};

    goTo = (route) => {
        if (route === "home") this.loadObjects();
    };
}