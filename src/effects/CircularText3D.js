import * as THREE from 'three';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// Импортируем встроенный шрифт
import { helvetikerFont } from '../assets/fonts/helvetiker_bold.js';

export class CircularText3D {
    constructor(text, radius, scene) {
        this.text = text;
        this.radius = radius;
        this.scene = scene;
        this.group = new THREE.Group();
        this.characters = [];

        // Создаем шрифт из встроенных данных
        this.font = new Font(helvetikerFont);
        this.createText();

        // Добавляем группу на сцену
        this.scene.add(this.group);
    }

    createText() {
        // Очищаем предыдущие объекты
        this.characters.forEach(char => {
            this.group.remove(char);
            if (char.geometry) char.geometry.dispose();
            if (char.material) char.material.dispose();
        });
        this.characters = [];

        const textOptions = {
            font: this.font,
            size: 1,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: false
        };

        const textMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1.0
        });

        const characters = this.text.split('');
        const angleStep = (2 * Math.PI) / characters.length;

        characters.forEach((char, index) => {
            const textGeo = new TextGeometry(char, textOptions);
            textGeo.computeBoundingBox();

            const width = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;
            const height = textGeo.boundingBox.max.y - textGeo.boundingBox.min.y;
            const depth = textGeo.boundingBox.max.z - textGeo.boundingBox.min.z;

            textGeo.translate(-width / 2, -height / 2, -depth / 2);

            const textMesh = new THREE.Mesh(textGeo, textMaterial);

            const angle = index * angleStep;

            const x = this.radius * Math.sin(angle);
            const z = this.radius * Math.cos(angle);

            textMesh.position.set(x, 0, z);

            textMesh.lookAt(0, 0, 0);
            textMesh.rotateY(Math.PI);

            this.group.add(textMesh);
            this.characters.push(textMesh);
        });
    }

    updateRadius(newRadius) {
        this.radius = newRadius;
        this.createText();
    }

    setVisible(visible) {
        this.group.visible = visible;
    }

    dispose() {
        this.characters.forEach(char => {
            if (char.geometry) char.geometry.dispose();
            if (char.material) char.material.dispose();
        });
        this.scene.remove(this.group);
    }
}
