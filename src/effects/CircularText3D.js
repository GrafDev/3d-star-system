import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export class CircularText3D {
    constructor(text, radius, scene) {
        this.text = text;
        this.radius = radius;
        this.scene = scene;
        this.group = new THREE.Group();
        this.characters = [];
        this.isLoaded = false;

        // Загружаем шрифт
        const fontLoader = new FontLoader();
        fontLoader.load('/node_modules/three/examples/fonts/helvetiker_bold.typeface.json', (font) => {
            this.font = font;
            this.isLoaded = true;
            this.createText();
        });
    }

    createText() {
        if (!this.isLoaded) return;

        // Очищаем предыдущие символы
        this.characters.forEach(char => {
            this.group.remove(char);
            if (char.geometry) char.geometry.dispose();
            if (char.material) char.material.dispose();
        });
        this.characters = [];

        // Параметры для текстовой геометрии
        const textOptions = {
            font: this.font,
            size: 1,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: false
        };

        // Создаем материал для светящегося текста без теней
        const textMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,  // Белый цвет
            emissive: 0xffffff, // Свечение тоже белое
            emissiveIntensity: 1.0 // Максимальная интенсивность свечения
        });

        // Отключаем отбрасывание теней для всего текста
        textMaterial.castShadow = false;
        textMaterial.receiveShadow = false;

        // Равномерно распределяем символы по окружности
        const characters = this.text.split('');
        const angleStep = (2 * Math.PI) / characters.length;

        characters.forEach((char, index) => {
            // Создаем геометрию для символа
            const textGeo = new TextGeometry(char, textOptions);
            textGeo.computeBoundingBox();

            // Вычисляем размеры символа для центрирования
            const width = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;
            const height = textGeo.boundingBox.max.y - textGeo.boundingBox.min.y;
            const depth = textGeo.boundingBox.max.z - textGeo.boundingBox.min.z;

            // Центрируем геометрию относительно её опорной точки
            textGeo.translate(-width / 2, -height / 2, -depth / 2);

            // Создаем меш
            const textMesh = new THREE.Mesh(textGeo, textMaterial);

            // Отключаем отбрасывание и получение теней для каждого меша
            textMesh.castShadow = false;
            textMesh.receiveShadow = false;

            // Рассчитываем угол для текущего символа
            const angle = index * angleStep;

            // Рассчитываем позицию на окружности
            const x = this.radius * Math.sin(angle);
            const z = this.radius * Math.cos(angle);

            // Устанавливаем позицию
            textMesh.position.set(x, 0, z);

            // Ориентируем символ по касательной к окружности
            textMesh.lookAt(0, 0, 0); // Сначала смотрим в центр
            textMesh.rotateY(Math.PI); // Поворачиваем на 180 градусов, чтобы смотреть наружу

            // Добавляем в группу и сохраняем ссылку
            this.group.add(textMesh);
            this.characters.push(textMesh);
        });

        // Добавляем группу в сцену
        this.scene.add(this.group);
    }

    // Обновление радиуса текста
    updateRadius(newRadius) {
        this.radius = newRadius;
        this.createText();
    }

    // Установка видимости
    setVisible(visible) {
        this.group.visible = visible;
    }

    // Очистка ресурсов
    dispose() {
        this.characters.forEach(char => {
            if (char.geometry) char.geometry.dispose();
            if (char.material) char.material.dispose();
        });
        this.scene.remove(this.group);
    }
}
