import * as THREE from 'three';
import { CelestialObject } from './CelestialObject';

export class Planet extends CelestialObject {
    constructor(config) {
        super(config);

        this.name = config.name || 'Planet';

        // Создаем геометрию для планеты
        this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);

        // Загружаем текстуру, если она указана в конфигурации
        const textureLoader = new THREE.TextureLoader();
        let material;

        if (config.textureUrl) {
            // Изменяем путь к текстуре, добавляя правильный префикс
            const textureUrl = './src/assets' + config.textureUrl;

            const texture = textureLoader.load(
                textureUrl,
                function(loadedTexture) {
                    console.log('Texture loaded successfully for ' + config.name + ':', textureUrl);
                },
                undefined,
                function(error) {
                    console.error('Error loading texture for ' + config.name + ':', textureUrl, error);
                }
            );

            material = new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.7,
                metalness: 0.1
            });
        } else {
            // Если текстуры нет, используем цвет
            material = new THREE.MeshStandardMaterial({
                color: config.color || 0xaaaaaa,
                roughness: 0.7,
                metalness: 0.1
            });
        }

        this.material = material;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(this.position);

        // Создаем орбиту (визуализация)
        const orbitGeometry = new THREE.RingGeometry(
            this.position.length() - 0.1,
            this.position.length() + 0.1,
            64
        );
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2
        });
        this.orbitMesh = new THREE.Mesh(orbitGeometry, orbitMaterial);
        this.orbitMesh.rotation.x = Math.PI / 2; // Размещаем в горизонтальной плоскости
    }

    update(deltaTime, celestialObjects) {
        // Временное решение: вращение вокруг центра сцены на фиксированном расстоянии
        const angle = this.velocity.z * deltaTime;
        const distance = this.position.length();

        // Вращаем позицию вокруг центра
        const newX = Math.cos(angle) * this.position.x - Math.sin(angle) * this.position.z;
        const newZ = Math.sin(angle) * this.position.x + Math.cos(angle) * this.position.z;

        this.position.x = newX;
        this.position.z = newZ;

        // Обновляем положение меша
        this.mesh.position.copy(this.position);

        // Добавляем вращение планеты вокруг своей оси
        this.mesh.rotation.y += 0.005; // Можно настроить скорость вращения
    }
}
