import * as THREE from 'three';

// Базовый класс для всех космических объектов
export class CelestialObject {
    constructor(config) {
        this.mass = config.mass || 1;
        this.radius = config.radius || 1;
        this.position = new THREE.Vector3(config.position.x, config.position.y, config.position.z);
        this.velocity = new THREE.Vector3(config.velocity.x, config.velocity.y, config.velocity.z);
        this.acceleration = new THREE.Vector3(0, 0, 0);

        // Базовая геометрия и материал (будут перезаписаны в дочерних классах)
        this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // Установка начальной позиции меша
        this.mesh.position.copy(this.position);
    }

    update(deltaTime, celestialObjects) {
        // Базовое обновление позиции на основе скорости
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        this.mesh.position.copy(this.position);
    }

    applyForce(force) {
        // F = ma -> a = F/m
        const accelerationDelta = force.clone().divideScalar(this.mass);
        this.acceleration.add(accelerationDelta);
    }

    dispose() {
        // Освобождение ресурсов
        if (this.geometry) this.geometry.dispose();
        if (this.material) this.material.dispose();
    }
}
