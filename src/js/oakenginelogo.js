class OakEngineLogo {
    constructor(selector, config = {}) {
        // Default-Werte definieren
        const defaults = {
            colors: ["#000", "#fff", "#000", "#fff", "#000", "#fff", "#4F4F4F", "#fff"],
            outerSpeed: -0.3,
            innerSpeed: 0.2,
            size: 200
        };

        // Konfiguration mit Defaults zusammenführen
        this.colors = config.colors || defaults.colors;
        this.outerSpeed = config.outerSpeed !== undefined ? config.outerSpeed : defaults.outerSpeed;
        this.innerSpeed = config.innerSpeed !== undefined ? config.innerSpeed : defaults.innerSpeed;
        this.size = config.size || defaults.size;

        // Rest der Initialisierung
        this.elements = typeof selector === 'string'
            ? document.querySelectorAll(selector)
            : [selector];
        this.instances = [];
        this.animating = true;

        this.init();
    }

    init() {
        this.elements.forEach(container => {
            // Skip if container already has SVG
            if (container.querySelector('svg')) return;

            // Read existing attributes from the element (if present)
            const elementColors = container.hasAttribute('data-colors')
                ? JSON.parse(container.getAttribute('data-colors'))
                : this.colors;

            const elementOuterSpeed = container.hasAttribute('data-outer-speed')
                ? parseFloat(container.getAttribute('data-outer-speed'))
                : this.outerSpeed;

            const elementInnerSpeed = container.hasAttribute('data-inner-speed')
                ? parseFloat(container.getAttribute('data-inner-speed'))
                : this.innerSpeed;

            const elementSize = container.hasAttribute('data-size')
                ? parseInt(container.getAttribute('data-size'))
                : this.size;

            // Calculate speeds array from outer and inner speeds
            const speeds = [
                elementOuterSpeed, // Outer elements (0-5)
                elementOuterSpeed,
                elementOuterSpeed,
                elementOuterSpeed,
                elementOuterSpeed,
                elementOuterSpeed,
                elementInnerSpeed, // Inner elements (6-7)
                elementInnerSpeed
            ];

            // Create instance data for this element
            const instance = {
                container,
                colors: elementColors,
                outerSpeed: elementOuterSpeed,
                innerSpeed: elementInnerSpeed,
                speeds: speeds,
                size: elementSize,
                angles: new Array(8).fill(0),
                groups: []
            };

            this.instances.push(instance);
            this.build(instance);
        });

        this.animate();
    }

    build(instance) {
        // Get the SVG template
        const svgTemplate = document.getElementById('oakengine-logo');

        // Create a new SVG element based on the template
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 557 557");
        svg.setAttribute("width", instance.size);
        svg.setAttribute("height", instance.size);

        // Create 8 groups, one for each layer
        for (let i = 0; i < 8; i++) {
            const g = document.createElementNS(svgNS, "g");
            g.setAttribute("fill", instance.colors[i] || "#000");

            // Clone the layer from the template
            const layerId = `oakengine-logo-${i+1}`;
            const layerNode = svgTemplate.getElementById(layerId);
            if (layerNode) {
                const clonedNode = layerNode.cloneNode(true);
                g.appendChild(clonedNode);
                svg.appendChild(g);
                instance.groups.push(g);
            }
        }

        instance.container.appendChild(svg);
    }

    animate() {
        if (this.animating) {
            this.instances.forEach(instance => {
                instance.groups.forEach((g, i) => {
                    // Determine whether to use outer or inner speed
                    const speed = i < 6 ? instance.outerSpeed : instance.innerSpeed;
                    instance.angles[i] += speed;
                    g.setAttribute("transform", `rotate(${instance.angles[i]} 278.5 278.5)`);
                });
            });
        }

        requestAnimationFrame(this.animate.bind(this));
    }

    // Control methods
    pause() {
        this.animating = false;
    }

    play() {
        this.animating = true;
    }

    toggleAnimation() {
        this.animating = !this.animating;
        return this.animating;
    }

    updateColors(colors, instanceIndex = null) {
        if (instanceIndex !== null && this.instances[instanceIndex]) {
            const instance = this.instances[instanceIndex];
            instance.colors = colors;
            instance.groups.forEach((g, i) => {
                g.setAttribute("fill", colors[i] || "#000");
            });
        } else {
            this.instances.forEach(instance => {
                instance.colors = colors;
                instance.groups.forEach((g, i) => {
                    g.setAttribute("fill", colors[i] || "#000");
                });
            });
        }
    }

    updateSpeeds(outerSpeed, innerSpeed, instanceIndex = null) {
        if (instanceIndex !== null && this.instances[instanceIndex]) {
            const instance = this.instances[instanceIndex];
            instance.outerSpeed = outerSpeed;
            instance.innerSpeed = innerSpeed;
        } else {
            this.instances.forEach(instance => {
                instance.outerSpeed = outerSpeed;
                instance.innerSpeed = innerSpeed;
            });
        }
    }

    reverse() {
        this.instances.forEach(instance => {
            instance.outerSpeed = -instance.outerSpeed;
            instance.innerSpeed = -instance.innerSpeed;
        });
    }

    reset(instanceIndex = null) {
        if (instanceIndex !== null && this.instances[instanceIndex]) {
            this.instances[instanceIndex].angles = new Array(8).fill(0);
        } else {
            this.instances.forEach(instance => {
                instance.angles = new Array(8).fill(0);
            });
        }
    }
}