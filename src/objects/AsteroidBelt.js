import * as THREE from 'three';
import { CelestialObject } from './CelestialObject';

export class AsteroidBelt extends CelestialObject {
    constructor(config) {
        super({
            mass: 0,
            radius: (config.innerRadius + config.outerRadius) / 2,
            position: { x: 0, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 0 }
        });

        this.innerRadius = config.innerRadius;
        this.outerRadius = config.outerRadius;
        this.count = config.count || 100;
        this.minSize = config.minSize || 0.1;
        this.maxSize = config.maxSize || 0.3;

        this.group = new THREE.Group();

        this.generateAsteroids(config.color || 0x888888);
    }

    generateAsteroids(color) {
        const geometry = new THREE.SphereGeometry(1, 4, 4);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.9,
            metalness: 0.2
        });

        for (let i = 0; i < this.count; i++) {
            const radius = this.innerRadius + Math.random() * (this.outerRadius - this.innerRadius);

            const angle = Math.random() * Math.PI * 2;

            const yOffset = (Math.random() - 0.5) * 2;

            const x = Math.cos(angle) * radius;
            const y = yOffset;
            const z = Math.sin(angle) * radius;

            const size = this.minSize + Math.random() * (this.maxSize - this.minSize);

            const asteroid = new THREE.Mesh(geometry, material);
            asteroid.position.set(x, y, z);
            asteroid.scale.set(size, size, size);

            asteroid.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );

            asteroid.userData.rotationSpeed = {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            };

            const orbitSpeed = 0.05 + Math.random() * 0.05;
            asteroid.userData.orbitSpeed = orbitSpeed;
            asteroid.userData.angle = angle;
            asteroid.userData.radius = radius;

            this.group.add(asteroid);
        }
    }

    update(deltaTime, celestialObjects) {
        this.group.children.forEach(asteroid => {
            asteroid.userData.angle += asteroid.userData.orbitSpeed * deltaTime;

            asteroid.position.x = Math.cos(asteroid.userData.angle) * asteroid.userData.radius;
            asteroid.position.z = Math.sin(asteroid.userData.angle) * asteroid.userData.radius;

            asteroid.rotation.x += asteroid.userData.rotationSpeed.x;
            asteroid.rotation.y += asteroid.userData.rotationSpeed.y;
            asteroid.rotation.z += asteroid.userData.rotationSpeed.z;
        });
    }
}
