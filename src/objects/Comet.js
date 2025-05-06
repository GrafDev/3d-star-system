import * as THREE from 'three';
import { CelestialObject } from './CelestialObject';

export class Comet extends CelestialObject {
    constructor(config) {
        super(config);

        // Создаем геометрию и материал для кометы
        this.geometry = new THREE.SphereGeometry(this.radius, 16, 16);
        this.material = new THREE.MeshStandardMaterial({
            color: config.color || 0xffffff,
            emissive: 0x333333,
            roughness: 0.8
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(this.position);

        // Создаем хвост кометы с использованием системы частиц
        this.tailLength = config.tailLength || 10;
        this.tailColor = config.tailColor || 0x88aaff;

        this.createTail();
    }

    createTail() {
        // Простая реализация хвоста с использованием линии
        const tailMaterial = new THREE.LineBasicMaterial({
            color: this.tailColor,
            opacity: 0.6,
            transparent: true
        });

        const tailGeometry = new THREE.BufferGeometry();

        // Создаем массив позиций для точек хвоста
        const positions = new Float32Array(3 * 10); // 10 точек

        // Заполняем начальными значениями
        for (let i = 0; i < 10; i++) {
            positions[i * 3] = this.position.x - (i * this.radius * 2);
            positions[i * 3 + 1] = this.position.y;
            positions[i * 3 + 2] = this.position.z;
        }

        // Устанавливаем позиции в геометрию
        tailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Создаем линию
        this.tail = new THREE.Line(tailGeometry, tailMaterial);
        this.mesh.add(this.tail);

        // Сохраняем историю позиций для хвоста
        this.positionHistory = new Array(10).fill().map(() => this.position.clone());
    }

    update(deltaTime, celestialObjects) {
        // Обновляем историю позиций
        this.positionHistory.unshift(this.position.clone());
        this.positionHistory.pop();

        // Обновляем позицию кометы
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        this.mesh.position.copy(this.position);

        // Обновляем позиции точек хвоста
        const positions = this.tail.geometry.attributes.position.array;

        for (let i = 0; i < 10; i++) {
            if (this.positionHistory[i]) {
                positions[i * 3] = this.positionHistory[i].x;
                positions[i * 3 + 1] = this.positionHistory[i].y;
                positions[i * 3 + 2] = this.positionHistory[i].z;
            }
        }

        this.tail.geometry.attributes.position.needsUpdate = true;
    }
}
