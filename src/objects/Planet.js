import * as THREE from 'three';
import { CelestialObject } from './CelestialObject';

export class Planet extends CelestialObject {
    constructor(config) {
        super(config);

        this.name = config.name || 'Planet';

        // Создаем геометрию и материал для планеты
        this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        this.material = new THREE.MeshStandardMaterial({
            color: config.color || 0xaaaaaa,
            roughness: 0.7,
            metalness: 0.1
        });

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
    }
}
