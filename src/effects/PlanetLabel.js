import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export class PlanetLabel {
    constructor(name, size = 1.0) {
        const labelElement = document.createElement('div');
        labelElement.className = 'planet-label';
        labelElement.textContent = name;
        labelElement.style.fontSize = `${size}em`;

        this.labelObject = new CSS2DObject(labelElement);

        this.labelObject.position.set(0, 4, 0);

        this.labelObject.visible = true;
    }

    setVisible(visible) {
        this.labelObject.visible = visible;
    }
}
