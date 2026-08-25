// ================= WOODLAND CINEMATIC HERO COMMERCIAL ENGINE =================

document.addEventListener("DOMContentLoaded", () => {

    const hero = document.getElementById("commercialHero");
    if (!hero) return;

    // Timeline Scene Configuration
    const SCENES = [
        { id: 1, name: "WOODPECKER TEST", duration: 7000 },
        { id: 2, name: "MATERIAL INTEGRITY", duration: 5500 },
        { id: 3, name: "HIPPO SHOCKWAVE", duration: 7000 },
        { id: 4, name: "EAGLE TALON STRIKE", duration: 6500 },
        { id: 5, name: "UNTAMED WILD", duration: 8000 }
    ];

    let currentSceneIndex = 0;
    let isPlaying = true;
    let sceneTimer = null;
    let progressInterval = null;
    let progressStartTime = 0;
    let sceneDuration = SCENES[0].duration;

    // DOM Elements
    const sceneElements = document.querySelectorAll(".commercial-scene");
    const timelinePills = document.querySelectorAll(".timeline-pill");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const skipBtn = document.getElementById("skipCommercialBtn");
    const canvas = document.getElementById("fxCanvas");
    const ctx = canvas ? canvas.getContext("2d") : null;

    // ================= 1. FX CANVAS ENGINE (Particles, Mist, Sparks, Wood Chips) =================
    let particles = [];
    let canvasWidth = 0;
    let canvasHeight = 0;

    function resizeCanvas() {
        if (!canvas) return;
        canvasWidth = canvas.width = hero.clientWidth;
        canvasHeight = canvas.height = hero.clientHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(type, x, y) {
            this.type = type; // "spore", "chip", "dust", "spark"
            this.x = x !== undefined ? x : Math.random() * canvasWidth;
            this.y = y !== undefined ? y : Math.random() * canvasHeight;
            
            if (type === "spore") {
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.7) * 0.5;
                this.size = Math.random() * 2.5 + 1;
                this.alpha = Math.random() * 0.5 + 0.2;
                this.color = "rgba(212, 181, 126, ";
            } else if (type === "chip") {
                this.vx = (Math.random() - 0.2) * 5;
                this.vy = (Math.random() - 0.6) * 4;
                this.gravity = 0.15;
                this.size = Math.random() * 3 + 1.5;
                this.alpha = 1;
                this.color = "rgba(185, 151, 91, ";
                this.rotation = Math.random() * Math.PI;
                this.vRot = (Math.random() - 0.5) * 0.2;
            } else if (type === "dust") {
                this.vx = (Math.random() - 0.5) * 4;
                this.vy = (Math.random() - 0.8) * 3;
                this.size = Math.random() * 25 + 10;
                this.alpha = Math.random() * 0.4 + 0.2;
                this.color = "rgba(180, 155, 120, ";
                this.growth = 0.3;
            } else if (type === "spark") {
                this.vx = (Math.random() - 0.5) * 8;
                this.vy = (Math.random() - 0.8) * 6;
                this.gravity = 0.2;
                this.size = Math.random() * 2.5 + 1;
                this.alpha = 1;
                this.color = "rgba(255, 220, 130, ";
            }
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.gravity) {
                this.vy += this.gravity;
            }

            if (this.type === "spore") {
                if (this.y < 0) this.y = canvasHeight;
                if (this.x < 0) this.x = canvasWidth;
                if (this.x > canvasWidth) this.x = 0;
            } else if (this.type === "chip" || this.type === "spark") {
                this.alpha -= 0.025;
            } else if (this.type === "dust") {
                this.size += this.growth;
                this.alpha -= 0.008;
            }
        }

        draw() {
            if (!ctx || this.alpha <= 0) return;
            ctx.save();
            ctx.fillStyle = `${this.color}${Math.max(0, this.alpha)})`;

            if (this.type === "chip") {
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.fillRect(-this.size, -this.size / 2, this.size * 2, this.size);
            } else if (this.type === "dust") {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Initialize Spores
    for (let i = 0; i < 40; i++) {
        particles.push(new Particle("spore"));
    }

    function emitBurst(type, x, y, count) {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(type, x, y));
        }
    }

    function animateFX() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();

            if (p.alpha <= 0 && p.type !== "spore") {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(animateFX);
    }
    animateFX();

    // ================= 2. CAMERA SHAKE & IMPACT PHYSICS =================
    function triggerCameraShake(intensity = "medium") {
        hero.classList.remove("shake-soft", "shake-hard", "shake-rumble");
        void hero.offsetWidth; // Trigger reflow

        if (intensity === "soft") {
            hero.classList.add("shake-soft");
        } else if (intensity === "hard") {
            hero.classList.add("shake-hard");
        } else if (intensity === "rumble") {
            hero.classList.add("shake-rumble");
        }

        setTimeout(() => {
            hero.classList.remove("shake-soft", "shake-hard", "shake-rumble");
        }, 800);
    }

    // ================= 3. SCENE LOGIC & SEQUENCING =================

    function activateScene(index) {
        currentSceneIndex = index;
        const sceneData = SCENES[index];
        sceneDuration = sceneData.duration;

        // Update Scene Visibility
        sceneElements.forEach((el, i) => {
            if (i === index) {
                el.classList.add("active");
                el.classList.remove("exit");
            } else {
                if (el.classList.contains("active")) {
                    el.classList.add("exit");
                }
                el.classList.remove("active");
            }
        });

        // Update Timeline Pills
        timelinePills.forEach((pill, i) => {
            const bar = pill.querySelector(".pill-progress-bar");
            if (i < index) {
                pill.classList.add("completed");
                pill.classList.remove("active");
                if (bar) bar.style.width = "100%";
            } else if (i === index) {
                pill.classList.add("active");
                pill.classList.remove("completed");
                if (bar) bar.style.width = "0%";
            } else {
                pill.classList.remove("active", "completed");
                if (bar) bar.style.width = "0%";
            }
        });

        // Trigger Scene Specific FX & Impact Choreography
        handleSceneChoreography(index);

        // Reset progress bar & timer
        progressStartTime = performance.now();
        if (sceneTimer) clearTimeout(sceneTimer);

        if (isPlaying) {
            sceneTimer = setTimeout(() => {
                const nextIndex = (currentSceneIndex + 1) % SCENES.length;
                activateScene(nextIndex);
            }, sceneDuration);
        }
    }

    function handleSceneChoreography(index) {
        if (index === 0) {
            // SCENE 1: Woodpecker Strike Test
            setTimeout(() => {
                // First pecks tree
                triggerCameraShake("soft");
                emitBurst("chip", canvasWidth * 0.35, canvasHeight * 0.45, 15);
            }, 1200);

            setTimeout(() => {
                // Pecks tree deeper hole
                triggerCameraShake("soft");
                emitBurst("chip", canvasWidth * 0.35, canvasHeight * 0.45, 25);
            }, 2400);

            setTimeout(() => {
                // Strikes Woodland shoe
                triggerCameraShake("medium");
                emitBurst("chip", canvasWidth * 0.65, canvasHeight * 0.55, 30);
                emitBurst("spark", canvasWidth * 0.65, canvasHeight * 0.55, 15);
            }, 4200);

        } else if (index === 1) {
            // SCENE 2: Macro Integrity Inspection
            setTimeout(() => {
                const telemetry = document.querySelector(".telemetry-hud");
                if (telemetry) telemetry.classList.add("scan-active");
            }, 800);

        } else if (index === 2) {
            // SCENE 3: Hippo Tremors
            setTimeout(() => {
                triggerCameraShake("rumble");
                emitBurst("dust", canvasWidth * 0.4, canvasHeight * 0.7, 20);
                emitBurst("dust", canvasWidth * 0.6, canvasHeight * 0.75, 20);
            }, 1000);

            setTimeout(() => {
                triggerCameraShake("hard");
                emitBurst("dust", canvasWidth * 0.5, canvasHeight * 0.8, 30);
            }, 3000);

        } else if (index === 3) {
            // SCENE 4: Eagle Talon Strike
            setTimeout(() => {
                // Talon contact point
                triggerCameraShake("hard");
                emitBurst("spark", canvasWidth * 0.55, canvasHeight * 0.52, 35);
                emitBurst("dust", canvasWidth * 0.55, canvasHeight * 0.55, 15);
            }, 2600);
        }
    }

    // ================= 4. TIMELINE SCRUBBER PROGRESS =================

    function updateProgress() {
        if (isPlaying) {
            const elapsed = performance.now() - progressStartTime;
            const pct = Math.min(100, (elapsed / sceneDuration) * 100);
            const activePill = timelinePills[currentSceneIndex];
            if (activePill) {
                const bar = activePill.querySelector(".pill-progress-bar");
                if (bar) bar.style.width = `${pct}%`;
            }
        }
        requestAnimationFrame(updateProgress);
    }
    updateProgress();

    // ================= 5. CONTROLS (Play/Pause, Skip, Timeline Click) =================

    timelinePills.forEach((pill, idx) => {
        pill.addEventListener("click", () => {
            activateScene(idx);
        });
    });

    if (playPauseBtn) {
        playPauseBtn.addEventListener("click", () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                playPauseBtn.innerHTML = `<span>⏸</span> PAUSE`;
                playPauseBtn.classList.remove("paused");
                activateScene(currentSceneIndex);
            } else {
                playPauseBtn.innerHTML = `<span>▶</span> PLAY`;
                playPauseBtn.classList.add("paused");
                if (sceneTimer) clearTimeout(sceneTimer);
            }
        });
    }

    if (skipBtn) {
        skipBtn.addEventListener("click", () => {
            activateScene(4); // Jump directly to Final Climax scene
        });
    }

    // Start Scene 1
    activateScene(0);

});
