import * as THREE from 'three';

export class StarBackground {
    constructor(config = {}) {
        console.log("StarBackground: Создание с конфигурацией:", config);

        // Базовые настройки из конфигурации
        this.starsCount = config.starsCount || 15000;
        this.radius = config.radius || 2000;
        this.minSize = config.minSize || 1.0;
        this.maxSize = config.maxSize || 4.0;
        this.baseMaterialSize = config.baseMaterialSize || 4.0;
        this.renderOrder = config.renderOrder || 100;

        // Настройки мерцания из конфигурации
        this.flickeringStarsPercent = config.flickeringStarsPercent || 0.2;
        this.flickeringSpeed = config.flickeringSpeed || 0.5;
        this.flickerMinFactor = config.flickerMinFactor || 0.4; // Минимальный фактор для заметного затемнения
        this.flickerMaxFactor = config.flickerMaxFactor || 1.0; // Максимальный фактор для нормальной яркости

        // Настройки цветов из конфигурации
        this.whiteStarsPercent = config.whiteStarsPercent || 0.7;
        this.blueStarsPercent = config.blueStarsPercent || 0.1;
        this.redStarsPercent = config.redStarsPercent || 0.1;
        this.yellowStarsPercent = config.yellowStarsPercent || 0.1;

        this.whiteStarsColor = config.whiteStarsColor || {
            r: [0.9, 1.0],
            g: [0.9, 1.0],
            b: [0.9, 1.0]
        };

        this.blueStarsColor = config.blueStarsColor || {
            r: [0.8, 1.0],
            g: [0.9, 1.0],
            b: [1.0, 1.0]
        };

        this.redStarsColor = config.redStarsColor || {
            r: [1.0, 1.0],
            g: [0.7, 1.0],
            b: [0.7, 1.0]
        };

        this.yellowStarsColor = config.yellowStarsColor || {
            r: [1.0, 1.0],
            g: [1.0, 1.0],
            b: [0.7, 1.0]
        };

        this.points = null;
        this.flickeringStars = [];
        this.originalSizes = [];     // Хранение оригинальных размеров звезд
        this.originalColors = [];    // Хранение оригинальных цветов звезд

        this.initialize();
    }

    // Вспомогательный метод для получения случайного значения из диапазона
    getRandomInRange(range) {
        return range[0] + Math.random() * (range[1] - range[0]);
    }

    initialize() {
        console.log("StarBackground: Начало инициализации...");

        // Создаем геометрию для точек-звезд
        const geometry = new THREE.BufferGeometry();

        // Создаем массивы для позиций, размеров и цветов точек
        const positions = new Float32Array(this.starsCount * 3);
        const sizes = new Float32Array(this.starsCount);
        const colors = new Float32Array(this.starsCount * 3); // RGB для каждой звезды

        // Инициализируем массивы для хранения оригинальных значений
        this.originalSizes = new Float32Array(this.starsCount);
        this.originalColors = new Float32Array(this.starsCount * 3);

        console.log(`StarBackground: Генерация ${this.starsCount} звезд...`);

        // Заполняем массивы случайными значениями
        for (let i = 0; i < this.starsCount; i++) {
            // Генерируем равномерное распределение точек на сфере
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);

            const x = this.radius * Math.sin(phi) * Math.cos(theta);
            const y = this.radius * Math.sin(phi) * Math.sin(theta);
            const z = this.radius * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Случайный размер для каждой звезды
            const size = this.minSize + Math.random() * (this.maxSize - this.minSize);
            sizes[i] = size;
            this.originalSizes[i] = size; // Сохраняем оригинальный размер

            // Определяем цвет звезды на основе процентных соотношений
            const colorRand = Math.random();
            let colorRange = null;

            // Определяем, к какой категории относится звезда
            if (colorRand < this.whiteStarsPercent) {
                // Белые звезды
                colorRange = this.whiteStarsColor;
            } else if (colorRand < this.whiteStarsPercent + this.blueStarsPercent) {
                // Голубые звезды
                colorRange = this.blueStarsColor;
            } else if (colorRand < this.whiteStarsPercent + this.blueStarsPercent + this.redStarsPercent) {
                // Красные звезды
                colorRange = this.redStarsColor;
            } else {
                // Желтые звезды
                colorRange = this.yellowStarsColor;
            }

            // Устанавливаем цвет на основе выбранного диапазона
            const r = this.getRandomInRange(colorRange.r);
            const g = this.getRandomInRange(colorRange.g);
            const b = this.getRandomInRange(colorRange.b);

            colors[i * 3] = r;     // R
            colors[i * 3 + 1] = g; // G
            colors[i * 3 + 2] = b; // B

            // Сохраняем оригинальные цвета
            this.originalColors[i * 3] = r;
            this.originalColors[i * 3 + 1] = g;
            this.originalColors[i * 3 + 2] = b;

            // Определяем мерцающие звезды
            if (Math.random() < this.flickeringStarsPercent) {
                this.flickeringStars.push({
                    index: i,
                    phase: Math.random() * Math.PI * 2,                     // Случайная начальная фаза
                    speed: this.flickeringSpeed * (0.5 + Math.random() * 0.5) // Вариация скорости
                });
            }
        }

        console.log(`StarBackground: Сгенерировано ${this.flickeringStars.length} мерцающих звезд`);

        // Добавляем атрибуты в геометрию
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Создаем материал для точек с параметрами из конфигурации
        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: this.baseMaterialSize,
            sizeAttenuation: true,
            transparent: true,  // Включаем прозрачность для более плавного эффекта
            alphaTest: 0.01,    // Небольшое значение для предотвращения проблем с прозрачностью
            depthWrite: false,
            fog: false,
            vertexColors: true  // Активируем использование цветов вершин
        });

        console.log("StarBackground: Создание системы частиц (Points)...");

        // Создаем и сохраняем систему частиц
        this.points = new THREE.Points(geometry, material);

        // Устанавливаем приоритет рендеринга
        this.points.renderOrder = this.renderOrder;

        // Сохраняем ссылки на атрибуты для анимации
        this.sizesAttribute = geometry.attributes.size;
        this.colorsAttribute = geometry.attributes.color;

        console.log("StarBackground: Инициализация завершена:", this.points);
    }

    update(deltaTime) {
        // Проверяем наличие мерцающих звезд
        if (this.flickeringStars.length === 0) return;

        // Обновляем мерцающие звезды
        for (const star of this.flickeringStars) {
            const index = star.index;

            // Простой тайминг для мерцания - просто проверяем время
            const currentTime = performance.now() * 0.001;

            // Используем простую логику: если время с определенной фазой больше некоторого порога - звезда видима,
            // в противном случае - менее видима
            const isVisible = Math.sin(currentTime * star.speed + star.phase) > 0;

            // Фактор видимости - либо максимальный, либо минимальный
            const flickerFactor = isVisible ? this.flickerMaxFactor : this.flickerMinFactor;

            // Обновляем размер звезды
            this.sizesAttribute.array[index] = this.originalSizes[index] * flickerFactor;

            // Обновляем цвет звезды
            this.colorsAttribute.array[index * 3] = this.originalColors[index * 3] * flickerFactor;     // R
            this.colorsAttribute.array[index * 3 + 1] = this.originalColors[index * 3 + 1] * flickerFactor; // G
            this.colorsAttribute.array[index * 3 + 2] = this.originalColors[index * 3 + 2] * flickerFactor; // B
        }

        // Помечаем атрибуты как нуждающиеся в обновлении
        this.sizesAttribute.needsUpdate = true;
        this.colorsAttribute.needsUpdate = true;
    }
}
