import * as THREE from 'three';
import { CameraController } from './CameraController';
import { systemConfig } from '../config/systemConfig';
import { Star } from '../objects/Star';
import { Planet } from '../objects/Planet';
import { AsteroidBelt } from '../objects/AsteroidBelt';
import { StarBackground } from '../effects/StarBackground';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { CircularText3D } from '../effects/CircularText3D';

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

        // Добавляем значение по умолчанию для скорости симуляции
        this.simulationSpeed = 1.0;

        // Настройка рендерера
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Инициализация CSS2DRenderer для меток
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0';
        this.labelRenderer.domElement.style.pointerEvents = 'none';
        this.container.appendChild(this.labelRenderer.domElement);

        // Добавляем метки по умолчанию видимыми
        this.labelsVisible = true;

        // Контроллер камеры
        this.cameraController = new CameraController(this.camera, this.renderer.domElement);

        // Массивы для хранения объектов сцены
        this.celestialObjects = [];
        this.starBackground = null;
        this.circularText = null;

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

        // Добавляем кольцевую надпись вокруг звезды
        this.createCircularText();

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

        console.log("SceneManager.createCelestialObjects: Создано объектов:", this.celestialObjects.length);
    }

    createCircularText() {
        // Радиус для текста (немного больше радиуса звезды)
        const textRadius = systemConfig.star.radius * 1.3;

        // Создаем 3D-текст по окружности
        this.circularText = new CircularText3D(" * Created by Gregory Iakovlev", textRadius, this.scene);

        console.log("SceneManager: Добавлена 3D-надпись вокруг звезды");
    }

    // Установка скорости симуляции
    setSimulationSpeed(speed) {
        this.simulationSpeed = speed;
        console.log(`SceneManager: Скорость симуляции установлена на ${speed}`);
    }

    // Установка размера звезды
    setStarSize(size) {
        // Находим звезду среди космических объектов
        const star = this.celestialObjects.find(obj => obj instanceof Star);
        if (star) {
            const originalRadius = systemConfig.star.radius;
            const newRadius = originalRadius * size;

            // Обновляем геометрию звезды
            star.mesh.geometry.dispose(); // Освобождаем старую геометрию
            star.geometry = new THREE.SphereGeometry(newRadius, 32, 32);
            star.mesh.geometry = star.geometry;
            star.radius = newRadius;

            // Обновляем радиус текста вокруг звезды
            if (this.circularText) {
                this.circularText.updateRadius(newRadius * 1.3);
            }

            console.log(`SceneManager: Размер звезды установлен на ${size} (радиус: ${newRadius})`);
        }
    }

    // Установка видимости орбит
    setOrbitsVisibility(visible) {
        // Находим планеты и делаем их орбиты видимыми или невидимыми
        this.celestialObjects.forEach(object => {
            if (object instanceof Planet && object.orbitMesh) {
                object.orbitMesh.visible = visible;
            }
        });

        console.log(`SceneManager: Видимость орбит установлена на ${visible ? 'видимо' : 'невидимо'}`);
    }

    // Установка видимости меток планет
    setLabelsVisibility(visible) {
        this.labelsVisible = visible;

        // Обновляем видимость для всех планет
        this.celestialObjects.forEach(object => {
            if (object instanceof Planet) {
                object.setLabelVisibility(visible);
            }
        });

        // Обновляем видимость кольцевой надписи
        if (this.circularText) {
            this.circularText.setVisible(visible);
        }

        console.log(`SceneManager: Видимость названий планет установлена на ${visible ? 'видимо' : 'невидимо'}`);
    }

    update() {
        // Учитываем скорость симуляции при расчете deltaTime
        const deltaTime = 0.01 * (this.simulationSpeed || 1.0);

        // Обновление звездного неба для анимации мерцания (обновляем первым)
        if (this.starBackground) {
            this.starBackground.update(deltaTime);
        } else {
            console.warn("SceneManager.update: starBackground не инициализирован");
        }

        // Обновление космических объектов с учетом скорости симуляции
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
        this.labelRenderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        // Обновление размеров при изменении окна
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }
}
