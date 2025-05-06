import { SceneManager } from './components/SceneManager';
import './styles/main.css';

// Инициализация приложения при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    // Создаем контейнер для Three.js сцены
    const container = document.getElementById('app') || document.body;

    // Инициализируем менеджер сцены
    const sceneManager = new SceneManager(container);

    // Запускаем анимационный цикл
    sceneManager.animate();

    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        sceneManager.onWindowResize();
    });
});
