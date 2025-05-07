// Конфигурация звездной системы в стиле Star Wars
export const systemConfig = {
    // Настройки для постобработки и эффектов
    postProcessing: {
        // Настройки для эффекта Bloom
        bloom: {
            enabled: true,
            strength: 1.5,    // Интенсивность свечения
            radius: 0.8,      // Радиус размытия
            threshold: 0.1    // Порог яркости (от какой яркости начинается эффект)
        }
    },

    // Параметры центральной звезды
    star: {
        mass: 1000,
        radius: 5,
        position: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        color: 0xffdd00,
        emissiveColor: 0xffaa00,  // Цвет свечения
        emissiveIntensity: 1.2,    // Интенсивность свечения самого меша
        intensity: 10,
        lightDistance: 5000,     // Дальность свечения звезды (увеличена для освещения астероидного пояса)
        lightDecay: 0,             // Параметр угасания света (0 - свет не угасает с расстоянием)
        textureUrl: '/textures/sun.png',
        // Добавляем специальный флаг для включения свечения
        bloom: true  // Флаг, что к этому объекту применяется эффект Bloom
    },

    // Функция для создания планет со случайными начальными позициями
    generatePlanets: function() {
        // Базовая конфигурация планет Star Wars
        const planetConfigs = [
            {
                name: "Татуин",
                mass: 1.5,
                radius: 1.6,
                distance: 12,
                velocity: 1.8,
                color: 0xd6c292, // песочный цвет
                textureUrl: '/textures/tatooine.png'
            },
            {
                name: "Корусант",
                mass: 3,
                radius: 2.2,
                distance: 18,
                velocity: 1.6,
                color: 0x4e7fbb, // городской/металлический цвет
                textureUrl: '/textures/coruscant.png'
            },
            {
                name: "Набу",
                mass: 2.2,
                radius: 1.9,
                distance: 24,
                velocity: 1.4,
                color: 0x3d995e, // зеленый/синий цвет
                textureUrl: '/textures/naboo.png'
            },
            {
                name: "Хот",
                mass: 1.8,
                radius: 1.5,
                distance: 30,
                velocity: 1.2,
                color: 0xeeeeff, // ледяной/снежный цвет
                textureUrl: '/textures/hoth.png'
            },
            {
                name: "Дагоба",
                mass: 1.3,
                radius: 1.4,
                distance: 36,
                velocity: 1.1,
                color: 0x4a633d, // болотный цвет
                textureUrl: '/textures/dagobah.png'
            },
            {
                name: "Мустафар",
                mass: 2.8,
                radius: 1.8,
                distance: 44,
                velocity: 0.9,
                color: 0xc13e0e, // вулканический/красный цвет
                textureUrl: '/textures/mustafar.png'
            },
            {
                name: "Кашиик",
                mass: 2.5,
                radius: 2.0,
                distance: 52,
                velocity: 0.8,
                color: 0x2d7d46, // лесной цвет
                textureUrl: '/textures/kashyyyk.png'
            },
            {
                name: "Камино",
                mass: 2.0,
                radius: 1.7,
                distance: 60,
                velocity: 0.7,
                color: 0x1a3a59, // океанический/штормовой цвет
                textureUrl: '/textures/kamino.png'
            }
        ];

        // Создаем массив для хранения полной конфигурации планет
        const planets = [];

        // Создаем планеты со случайными начальными позициями
        for (const config of planetConfigs) {
            // Генерируем случайный угол от 0 до 360 градусов (0 до 2π в радианах)
            const randomAngle = Math.random() * Math.PI * 2;

            // Вычисляем x и z координаты на основе расстояния и случайного угла
            const x = Math.cos(randomAngle) * config.distance;
            const z = Math.sin(randomAngle) * config.distance;

            // Добавляем планету в массив с рассчитанными случайными координатами
            planets.push({
                name: config.name,
                mass: config.mass,
                radius: config.radius,
                position: { x: x, y: 0, z: z },
                velocity: { x: 0, y: 0, z: config.velocity/10 },
                color: config.color,
                textureUrl: config.textureUrl
            });
        }

        return planets;
    },

    // Динамический параметр планет, будет создаваться при каждой загрузке
    get planets() {
        return this.generatePlanets();
    },

    // Параметры астероидного пояса (поле астероидов во внешнем кольце)
    asteroidBelt: {
        innerRadius: 68,
        outerRadius: 76,
        count: 300,
        minSize: 0.1,
        maxSize: 0.4,
        color: 0x888888
    },

    // Параметры звездного неба
    starBackground: {
        // Базовые настройки
        starsCount: 5000,                // Количество звезд
        radius: 4000,                     // Радиус сферы со звездами
        minSize: 0.1,                     // Минимальный размер звезды
        maxSize: 10.0,                     // Максимальный размер звезды
        baseMaterialSize: 12.0,            // Базовый размер материала для точек
        renderOrder: 100,                 // Приоритет рендеринга

        // Настройки мерцания
        flickeringStarsPercent: 0.8,      // Процент мерцающих звезд
        flickeringSpeed: 0.1,             // Скорость мерцания
        flickerMinFactor: 0.1,            // Минимальный фактор мерцания
        flickerMaxFactor: 1.0,            // Максимальный фактор мерцания

        // Настройки цветов звезд в процентах (в сумме должно быть 1.0 или 100%)
        whiteStarsPercent: 0.7,           // Процент белых звезд
        blueStarsPercent: 0.1,            // Процент голубых звезд
        redStarsPercent: 0.1,             // Процент красных звезд
        yellowStarsPercent: 0.1,          // Процент желтых звезд

        // Настройки цветов (RGB компоненты)
        whiteStarsColor: {
            r: [0.9, 1.0],                // Диапазон значений для R
            g: [0.9, 1.0],                // Диапазон значений для G
            b: [0.9, 1.0]                 // Диапазон значений для B
        },
        blueStarsColor: {
            r: [0.8, 1.0],
            g: [0.9, 1.0],
            b: [1.0, 1.0]
        },
        redStarsColor: {
            r: [1.0, 1.0],
            g: [0.7, 1.0],
            b: [0.7, 1.0]
        },
        yellowStarsColor: {
            r: [1.0, 1.0],
            g: [1.0, 1.0],
            b: [0.7, 1.0]
        }
    }
};
