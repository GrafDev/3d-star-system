import * as THREE from 'three';
import { CelestialObject } from './CelestialObject';

export class Star extends CelestialObject {
    constructor(config) {
        super(config);

        // Загружаем текстуру звезды
        const textureLoader = new THREE.TextureLoader();
        let material;

        if (config.textureUrl) {
            // Изменяем путь к текстуре, добавляя правильный префикс
            const textureUrl = './src/assets' + config.textureUrl;

            const texture = textureLoader.load(
                textureUrl,
                function(loadedTexture) {
                    console.log('Texture loaded successfully:', textureUrl);
                },
                undefined,
                function(error) {
                    console.error('Error loading texture:', textureUrl, error);
                }
            );

            // Используем MeshBasicMaterial, который не требует освещения
            material = new THREE.MeshBasicMaterial({
                map: texture,
                color: 0xffdd00
            });
        } else {
            // Запасной вариант, если текстура не указана
            material = new THREE.MeshBasicMaterial({
                color: config.color || 0xffdd00
            });
        }

        // Создаем геометрию и устанавливаем материал для звезды
        this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        this.material = material;

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(this.position);

        // Добавляем источник света с настройками из конфигурации
        const lightDistance = config.lightDistance || 10000;
        const lightDecay = config.hasOwnProperty('lightDecay') ? config.lightDecay : 1; // Значение 0 означает, что свет не угасает с расстоянием

        this.light = new THREE.PointLight(config.color || 0xffffff, config.intensity || 1, lightDistance);
        this.light.decay = lightDecay;
        this.light.position.copy(this.position);
        this.mesh.add(this.light);

        // Добавляем еще один источник света для лучшего освещения сцены
        const ambientLight = new THREE.AmbientLight(0x333333);
        this.mesh.add(ambientLight);
    }

    update(deltaTime, celestialObjects) {
        // У звезды нет особой логики обновления, она статична
        super.update(deltaTime, celestialObjects);

        // Добавляем медленное вращение для звезды
        this.mesh.rotation.y += 0.001;
    }
}
