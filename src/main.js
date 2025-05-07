// Модифицируем src/main.js для добавления панели управления

import { SceneManager } from './components/SceneManager';
import { ControlPanel } from './ui/ControlPanel';
import './styles/main.css';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app') || document.body;

    const sceneManager = new SceneManager(container);

    const controlPanel = new ControlPanel(sceneManager);

    sceneManager.animate();

    window.addEventListener('resize', () => {
        sceneManager.onWindowResize();
    });
});
