import * as THREE from 'three';
import { CameraController } from './CameraController';
import { systemConfig } from '../config/systemConfig';
import { Star } from '../objects/Star';
import { Planet } from '../objects/Planet';
import { AsteroidBelt } from '../objects/AsteroidBelt';
// Удаляем импорт класса Comet
// import { Comet } from '../objects/Comet';
import { StarBackground } from '../effects/StarBackground';

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
        this.starBackground = null;

        // Инициализация сцены
        this.initialize();
    }

    initialize() {
        console.log("SceneManager: Начало инициализации...");

        // Установка начальной позиции камеры
        this.camera.position.set(0, 50, 100);
        this.camera.lookAt(0, 0, 0);

        console.log("SceneManager: Камера установлена:", this.camera.position);

        // Улучшенное освещение сцены

        // Увеличиваем яркость рассеянного освещения
        const ambientLight = new THREE.AmbientLight(0x555555); // Увеличено с 0x333333
        this.scene.add(ambientLight);

        // Добавляем полусферическое освещение для более естественных переходов
        const hemisphereLight = new THREE.HemisphereLight(
            0xffffbb, // небесный цвет
            0x080820, // земной цвет
            0.5       // интенсивность
        );
        this.scene.add(hemisphereLight);

        console.log("SceneManager: Добавлено улучшенное освещение");

        // Черный фон
        this.scene.background = new THREE.Color(0x000000);

        // Создание звездного фона
        console.log("SceneManager: Создание звездного фона...");
        this.createStarBackground();

        // Создание космических объектов
        console.log("SceneManager: Создание космических объектов...");
        this.createCelestialObjects();

        console.log("SceneManager: Инициализация завершена.");
        console.log("SceneManager: Дерево сцены:", this.scene);
    }

    createStarBackground() {
        console.log("SceneManager.createStarBackground: Начало создания звездного фона...");

        // Используем параметры из конфигурации или значения по умолчанию
        const starBackgroundConfig = systemConfig.starBackground || {
            starsCount: 25000,  // Увеличил количество звезд
            radius: 2500,       // Увеличил радиус
            minSize: 1.0,       // Увеличил минимальный размер
            maxSize: 4.0,       // Увеличил максимальный размер
            flickeringStarsPercent: 0.2,
            flickeringSpeed: 0.3
        };

        console.log("SceneManager.createStarBackground: Использую конфигурацию:", starBackgroundConfig);

        // Создаем звездное небо с использованием системы частиц
        const starBackground = new StarBackground(starBackgroundConfig);

        // Проверка, что объект points создан
        if (!starBackground.points) {
            console.error("SceneManager.createStarBackground: starBackground.points не создан!");
            return;
        }

        console.log("SceneManager.createStarBackground: Добавление на сцену, points =", starBackground.points);
        this.scene.add(starBackground.points);

        // Проверяем, что звезды действительно добавлены на сцену
        const objectAdded = this.scene.children.includes(starBackground.points);
        console.log(`SceneManager.createStarBackground: Звезды ${objectAdded ? 'успешно добавлены' : 'НЕ добавлены'} на сцену`);

        // Выводим структуру сцены после добавления
        console.log("SceneManager.createStarBackground: Текущая структура сцены:",
            this.scene.children.map(child => ({
                type: child.type,
                renderOrder: child.renderOrder,
                visible: child.visible,
                uuid: child.uuid
            }))
        );

        this.starBackground = starBackground;
        console.log("SceneManager.createStarBackground: Завершение создания звездного фона");
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

            // Добавляем орбиту планеты в сцену
            if (planet.orbitMesh) {
                this.scene.add(planet.orbitMesh);
            }
        });

        // Создание астероидного пояса
        const asteroidBelt = new AsteroidBelt(systemConfig.asteroidBelt);
        this.scene.add(asteroidBelt.group);
        this.celestialObjects.push(asteroidBelt);

        // Кометы удалены

        console.log("SceneManager.createCelestialObjects: Создано объектов:", this.celestialObjects.length);
    }

    update() {
        // Обновление состояния всех объектов
        const deltaTime = 0.01; // В будущем можно использовать реальный deltaTime

        // Обновление звездного неба для анимации мерцания (обновляем первым)
        if (this.starBackground) {
            this.starBackground.update(deltaTime);
        } else {
            console.warn("SceneManager.update: starBackground не инициализирован");
        }

        // Обновление космических объектов
        this.celestialObjects.forEach(object => {
            object.update(deltaTime, this.celestialObjects);
        });

        // Обновление контроллера камеры
        this.cameraController.update();
    }

    animate() {
        // Рекурсивный вызов для анимации
        requestAnimationFrame(this.animate.bind(this));

        // Логирование на первых 10 кадрах
        if (!this._frameCount) {
            this._frameCount = 0;
        }

        if (this._frameCount < 10) {
            console.log(`SceneManager.animate: Рендеринг кадра ${this._frameCount}`);
            this._frameCount++;
        }

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
