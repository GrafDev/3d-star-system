import * as THREE from 'three';
import { CelestialObject } from './CelestialObject';

export class Star extends CelestialObject {
    constructor(config) {
        super(config);

        // Создаем геометрию и материал для звезды
        this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        this.material = new THREE.MeshBasicMaterial({
            color: config.color || 0xffdd00,
            emissive: config.emissiveColor || 0xffaa00,
            emissiveIntensity: config.intensity || 1
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(this.position);

        // Добавляем источник света
        this.light = new THREE.PointLight(config.color || 0xffffff, config.intensity || 1, 100);
        this.light.position.copy(this.position);
        this.mesh.add(this.light);
    }

    update(deltaTime, celestialObjects) {
        // У звезды нет особой логики обновления, она статична
        super.update(deltaTime, celestialObjects);
    }
}
