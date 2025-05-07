import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export class PlanetLabel {
    constructor(name, size = 1.0) {
        // Создаем HTML элемент для метки
        const labelElement = document.createElement('div');
        labelElement.className = 'planet-label';
        labelElement.textContent = name;
        labelElement.style.fontSize = `${size}em`;

        // Создаем CSS2DObject
        this.labelObject = new CSS2DObject(labelElement);

        // Устанавливаем позицию метки выше над планетой
        this.labelObject.position.set(0, 4, 0);

        // По умолчанию метки включены
        this.labelObject.visible = true;
    }

    // Установка видимости метки
    setVisible(visible) {
        this.labelObject.visible = visible;
    }
}
