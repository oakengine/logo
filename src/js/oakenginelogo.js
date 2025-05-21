/**
 * OakEngine Logo Animation
 * A JavaScript class for creating and animating the OakEngine logo
 */
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

        // Check if we're in a browser environment
        this.isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

        if (this.isBrowser) {
            // Browser-specific initialization
            this.elements = typeof selector === 'string'
                ? document.querySelectorAll(selector)
                : [selector];
            this.instances = [];
            this.animating = true;

            // Create SVG template if it doesn't exist
            if (!document.getElementById('oakengine-logo')) {
                this.createSvgTemplate();
            }

            this.init();
        } else {
            // Node.js environment - just store the config
            console.warn('OakEngineLogo: Running in Node.js environment. DOM manipulation is not available.');
            this.elements = [];
            this.instances = [];
            this.animating = false;
        }
    }

    // Create the SVG template programmatically
    createSvgTemplate() {
        // Create a hidden div for templates if it doesn't exist
        let templatesDiv = document.getElementById('svg-templates');
        if (!templatesDiv) {
            templatesDiv = document.createElement('div');
            templatesDiv.id = 'svg-templates';
            templatesDiv.style.display = 'none';
            document.body.appendChild(templatesDiv);
        }

        // Create the SVG element
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("id", "oakengine-logo");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("viewBox", "0 0 557 557");

        // Path definitions
        const pathData = [
            "M486.57,100.94c.59.71,4.81,1.58,6.59,2.75,7.77,5.11,30.69,38.51,34.12,47.76,5.6,15.11,3.75,29,11.49,44.88,14.79,30.37,18.97,33.04,16.21,68.88-.71,9.15,1.38,15.5,1.93,23.78.99,14.96-6.66,29.7-10.1,44.27-4.55,19.28-7.6,51.8-19.77,67.22-5.14,6.52-13.02,11.56-17.57,18.91-3.38,5.47-3.76,11.43-6.62,16.1-1.94,3.16-6.04,6.64-8.48,10.26-4.96,7.34-8.93,16.5-14.38,23.12-9.47,11.5-52.58,45.56-65.97,50.25-15.43,5.4-14.22,5.81-27.34,13.98-31.38,19.55-97.88,26.3-134.16,23.01-11.18-1.01-16.96-10.71-30.33-9.93-8.13.47-10.04,2.71-19.33.68-18.13-3.97-41.24-13.2-57.66-21.98-19.56-10.47-28.18-24.67-45.93-36.82-4.18-2.86-10.19-4.62-13.75-7.9-3.69-3.4-7.32-11.23-10.91-15.73-8.59-10.76-17.25-22.04-26.91-31.27s-17.19-26.63-22.92-39.27c-5.02-11.07-14.51-31.07-15.7-42.6-.75-7.24.77-15.61-.21-22.59-.73-5.18-5.17-8.8-5.79-14.95-.73-7.17,1.96-10.19,2.68-16.12,1.16-9.45-4.99-20.41-5.66-30.43-1.23-18.4,9-65.16,16.23-82.77,3.12-7.6,9.31-12.42,12.1-19.48,1.84-4.65,1.86-9.46,3.88-13.92,3.46-7.67,11.49-13.34,13.66-22.86,4.29-18.79,10.29-26.57,24.72-39.42,5.12-4.56,12.68-8.72,17.21-13.32,7.27-7.38,7.86-13.31,18.18-20.28,13.45-9.09,26.67-5.82,37.68-16.41,3.35-3.22,4.42-7.03,7.82-9.93C171.17,12.11,239.32,1.03,265.26.04c9.45-.36,13.73,2.04,21.71,2.91,21.87,2.37,40.63.42,62.35,6.33,18.75,5.11,44.03,17.81,61.9,26.62,18.9,9.31,61.85,31.55,70.7,50.42,1.33,2.84,4.16,14.03,4.65,14.62Z",
            "M260.69,21.18c26.18-1.59,51.2,3.07,77.03,5.78,16.32,1.71,24.46,12.94,38.17,18.89,15.45,6.7,26.37,6.87,41.75,17.26,26.25,17.73,37.67,32.37,57.42,55.92,12.24,14.59,20.99,20.79,29.77,39.27,7.76,16.32,9.42,30.96,15.08,47.19,2.22,6.36,6.27,12.85,8.12,19.54,5.13,18.56,9.08,64.25,5.12,82.53-1.23,5.66-4.56,10.88-6.13,16.6-7.7,27.98-4.56,45.67-24.04,70.84-11.2,14.47-15.61,23.16-25.05,38.1-12.12,19.17-51.11,55.68-71.31,65.67-6.83,3.38-14.66,4.62-21.46,8.04-5.84,2.93-11.39,8.26-17.39,11.16-17.61,8.5-49.54,13.75-69.16,15.31-34.02,2.7-61.8-5.27-94.91-11.06-25.77-4.5-39.74-13.68-62.09-26.43-11.41-6.51-20.06-18.5-29.72-27.44-30.51-28.22-50.35-44.71-66.44-85.45-7.73-19.56-20.7-57.84-22.76-78.08-7.39-72.54,15.67-128.09,54.86-186.33,36.15-53.72,119.7-93.45,183.13-97.31Z",
            "M265.05,48.93c51.95-3.83,92.15,15.53,137.37,38.14,36.07,18.04,38.01,28.71,59.74,59.63,16.16,23,33.27,35.99,38.47,65.98,5.2,30.01,9.68,60.88,4.99,91.12-2.92,18.86-8.98,42.96-13.76,61.69-9.42,36.91-23.42,41.14-46.88,65.55-4.47,4.65-8.24,11.01-12.45,15.66-17.43,19.24-34.95,32.43-59.66,40.57-27.77,9.14-68.72,23.8-97.23,23.82-29.08.02-103.83-23.89-126.22-42.72-9.28-7.81-15.8-18.38-23.93-27.25-16.42-17.92-38.59-32.38-50.47-53.87-14.79-26.75-15.67-50.47-21.58-79-6.06-29.28-10.46-37.35-1.59-68.37,3.75-13.11,11.1-24.07,14.73-36.53,2.71-9.34,3.42-19.08,6.69-28.52,7.93-22.92,25.64-35.32,41.74-51.6,8.94-9.04,18.2-20.68,27.42-28.76,25.21-22.08,89.42-43.09,122.63-45.54Z",
            "M270.04,61.02c44.64-3,82.16,15.2,121.39,34.11,36.88,17.77,36.78,23.72,58.74,55.6,15.12,21.94,34.47,35.13,39.46,63.97,4.88,28.15,9.38,57.81,5,86.07-3.04,19.61-9.38,47.49-14.97,66.52-9.21,31.31-23.98,35.51-43.68,56.69-18.79,20.2-29.32,38.42-57.12,49.17-18.53,7.17-45.27,15.06-64.68,20.38-46.49,12.76-89.5-1.05-132.49-19.47-29.55-12.66-31.94-24.01-51.73-45.54-16.08-17.49-36.69-29.41-47.62-51.71-10.91-22.27-12.76-43.81-17.07-67.42-2.76-15.14-8.71-26.09-7.59-42.47,1.6-23.38,10.97-35.21,18.12-55.28,3.78-10.61,4.28-22.1,7.69-32.55,9.4-28.89,50.34-53.75,68.92-77.57,23.3-19.61,87.33-38.47,117.64-40.5Z",
            "M134.86,404.94c-12.93-13.16-23.13-21.12-30.86-38.89-20.78-47.83-27.02-80.7-14.21-132.21,11.72-47.15,53.77-100.71,96.56-123.25,102.46-53.98,229.59-8.52,271.38,100.04,28.31,73.55,14.04,135.77-34.73,195.22-51.41,62.68-128.43,82.88-205.45,58.24-40.64-13-54.05-29.97-82.7-59.14Z",
            "M266.05,101.33c-89.47,6.77-162.55,77.39-171.54,167.5-3.32,33.21,13.68,91.82,36.54,116.28,19.29,20.63,45.49,49.18,70.94,60.42,75.11,33.19,158.25,18.03,211.03-45.73,49.44-59.73,61.5-122.14,29.45-194.94-29.51-67.01-104.2-108.99-176.42-103.53Z",
            "M420.49,225.81c1.9,5.16.3,10.9-3.79,14.58l-25.66,23.35c.65,4.92,1.01,9.96,1.01,15.05s-.36,10.13-1.01,15.05l25.66,23.35c4.09,3.67,5.69,9.42,3.79,14.58-2.61,7.05-5.75,13.81-9.36,20.33l-2.79,4.8c-3.91,6.52-8.3,12.68-13.1,18.49-3.5,4.27-9.3,5.69-14.52,4.03l-33.01-10.49c-7.94,6.1-16.71,11.2-26.08,15.05l-7.41,33.84c-1.19,5.39-5.33,9.66-10.79,10.55-8.18,1.36-16.59,2.07-25.19,2.07s-17.01-.71-25.19-2.07c-5.45-.89-9.6-5.16-10.79-10.55l-7.41-33.84c-9.36-3.85-18.14-8.95-26.08-15.05l-32.95,10.55c-5.22,1.66-11.02.18-14.52-4.03-4.8-5.81-9.19-11.97-13.1-18.49l-2.79-4.8c-3.62-6.52-6.76-13.28-9.36-20.33-1.9-5.16-.3-10.9,3.79-14.58l25.66-23.35c-.65-4.98-1.01-10.02-1.01-15.11s.36-10.13,1.01-15.05l-25.66-23.35c-4.09-3.67-5.69-9.42-3.79-14.58,2.61-7.05,5.75-13.81,9.36-20.33l2.79-4.8c3.91-6.52,8.3-12.68,13.1-18.49,3.5-4.27,9.3-5.69,14.52-4.03l33.01,10.49c7.94-6.1,16.71-11.2,26.08-15.05l7.41-33.84c1.19-5.39,5.33-9.66,10.79-10.55,8.18-1.42,16.59-2.13,25.19-2.13s17.01.71,25.19,2.07c5.45.89,9.6,5.16,10.79,10.55l7.41,33.84c9.36,3.85,18.14,8.95,26.08,15.05l33.01-10.49c5.22-1.66,11.02-.18,14.52,4.03,4.8,5.81,9.19,11.97,13.1,18.49l2.79,4.8c3.62,6.52,6.76,13.28,9.36,20.33l-.06.06Z"
        ];

        // Create path elements
        for (let i = 0; i < pathData.length; i++) {
            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("id", `oakengine-logo-${i+1}`);
            path.setAttribute("d", pathData[i]);
            svg.appendChild(path);
        }

        // Create the circle element
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("id", "oakengine-logo-8");
        circle.setAttribute("cx", "278.50");
        circle.setAttribute("cy", "278.50");
        circle.setAttribute("r", "47.41");
        svg.appendChild(circle);

        // Add the SVG to the templates div
        templatesDiv.appendChild(svg);
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

// Export the class for use in Node.js
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = OakEngineLogo;
} else {
    // For browser environment, make it available globally
    if (typeof window !== 'undefined') {
        window.OakEngineLogo = OakEngineLogo;
    }
}
