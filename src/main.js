// Модифицируем src/main.js для добавления панели управления

import { SceneManager } from './components/SceneManager';
import { ControlPanel } from './ui/ControlPanel';
import './styles/main.css';

// Инициализация приложения при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    // Создаем контейнер для Three.js сцены
    const container = document.getElementById('app') || document.body;

    // Инициализируем менеджер сцены
    const sceneManager = new SceneManager(container);

    // Инициализируем панель управления, передавая ей ссылку на sceneManager
    const controlPanel = new ControlPanel(sceneManager);

    // Запускаем анимационный цикл
    sceneManager.animate();

    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        sceneManager.onWindowResize();
    });
});
