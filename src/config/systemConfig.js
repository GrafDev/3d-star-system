// Конфигурация звездной системы в стиле Star Wars
export const systemConfig = {
    // Параметры центральной звезды
    star: {
        mass: 1000,
        radius: 5,
        position: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        color: 0xffdd00,
        emissiveColor: 0xffaa00,
        intensity: 2000
    },

    // Параметры планет Star Wars
    planets: [
        {
            name: "Татуин",
            mass: 1.5,
            radius: 1.6,
            position: { x: 12, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 1.8 },
            color: 0xd6c292, // песочный цвет
            textureUrl: '/textures/tatooine.png'
        },
        {
            name: "Корусант",
            mass: 3,
            radius: 2.2,
            position: { x: 18, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 1.6 },
            color: 0x4e7fbb, // городской/металлический цвет
            textureUrl: '/textures/coruscant.png'
        },
        {
            name: "Набу",
            mass: 2.2,
            radius: 1.9,
            position: { x: 24, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 1.4 },
            color: 0x3d995e, // зеленый/синий цвет
            textureUrl: '/textures/naboo.png'
        },
        {
            name: "Хот",
            mass: 1.8,
            radius: 1.5,
            position: { x: 30, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 1.2 },
            color: 0xeeeeff, // ледяной/снежный цвет
            textureUrl: '/textures/hoth.png'
        },
        {
            name: "Дагоба",
            mass: 1.3,
            radius: 1.4,
            position: { x: 36, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 1.1 },
            color: 0x4a633d, // болотный цвет
            textureUrl: '/textures/dagobah.png'
        },
        {
            name: "Мустафар",
            mass: 2.8,
            radius: 1.8,
            position: { x: 44, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 0.9 },
            color: 0xc13e0e, // вулканический/красный цвет
            textureUrl: '/textures/mustafar.png'
        },
        {
            name: "Кашиик",
            mass: 2.5,
            radius: 2.0,
            position: { x: 52, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 0.8 },
            color: 0x2d7d46, // лесной цвет
            textureUrl: '/textures/kashyyyk.png'
        },
        {
            name: "Камино",
            mass: 2.0,
            radius: 1.7,
            position: { x: 60, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 0.7 },
            color: 0x1a3a59, // океанический/штормовой цвет
            textureUrl: '/textures/kamino.png'
        }
    ],

    // Параметры астероидного пояса (поле астероидов во внешнем кольце)
    asteroidBelt: {
        innerRadius: 68,
        outerRadius: 76,
        count: 300,
        minSize: 0.1,
        maxSize: 0.4,
        color: 0x888888
    },

    // Параметры комет
    comets: [
        {
            mass: 0.1,
            radius: 0.5,
            position: { x: 80, y: 10, z: 20 },
            velocity: { x: -0.5, y: 0.2, z: 1.0 },
            color: 0xffffff,
            tailLength: 20,
            tailColor: 0x88aaff
        },
        {
            mass: 0.08,
            radius: 0.4,
            position: { x: -70, y: 5, z: 30 },
            velocity: { x: 0.7, y: -0.3, z: 0.5 },
            color: 0xffffff,
            tailLength: 15,
            tailColor: 0xaaffff
        }
    ]
};
