import * as THREE from 'three';
import { CameraController } from './CameraController';
import { systemConfig } from '../config/systemConfig';
import { Star } from '../objects/Star';
import { Planet } from '../objects/Planet';
import { AsteroidBelt } from '../objects/AsteroidBelt';
import { Comet } from '../objects/Comet';

export class SceneManager {
    constructor(container) {
        this.container = container;

        // Инициализация основных компонентов Three.js
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.camera = new THREE.PerspectiveCamera(
            70, // FOV
            window.innerWidth / window.innerHeight, // соотношение сторон
            0.1, // ближняя плоскость отсечения
            10000 // дальняя плоскость отсечения
        );

        // Настройка рендерера
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Контроллер камеры
        this.cameraController = new CameraController(this.camera, this.renderer.domElement);

        // Массивы для хранения объектов сцены
        this.celestialObjects = [];

        // Инициализация сцены
        this.initialize();
    }

    initialize() {
        // Установка начальной позиции камеры
        this.camera.position.set(0, 50, 100);
        this.camera.lookAt(0, 0, 0);

        // Добавление основного освещения
        const ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(ambientLight);

        // Создание звездного фона (можно реализовать позже)
        this.createStarBackground();

        // Создание космических объектов
        this.createCelestialObjects();
    }

    createStarBackground() {
        // Временная заглушка для звездного фона
        // Будет реализовано позже с использованием частиц или skybox
    }

    createCelestialObjects() {
        // Создание центральной звезды
        const star = new Star(systemConfig.star);
        this.scene.add(star.mesh);
        this.celestialObjects.push(star);

        // Создание планет
        systemConfig.planets.forEach(planetConfig => {
            const planet = new Planet(planetConfig);
            this.scene.add(planet.mesh);
            this.celestialObjects.push(planet);
        });

        // Создание астероидного пояса
        const asteroidBelt = new AsteroidBelt(systemConfig.asteroidBelt);
        this.scene.add(asteroidBelt.group);
        this.celestialObjects.push(asteroidBelt);

        // Создание комет
        systemConfig.comets.forEach(cometConfig => {
            const comet = new Comet(cometConfig);
            this.scene.add(comet.mesh);
            this.celestialObjects.push(comet);
        });
    }

    update() {
        // Обновление состояния всех объектов
        const deltaTime = 0.01; // В будущем можно использовать реальный deltaTime

        this.celestialObjects.forEach(object => {
            object.update(deltaTime, this.celestialObjects);
        });

        // Обновление контроллера камеры
        this.cameraController.update();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        // Обновление размеров при изменении окна
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
