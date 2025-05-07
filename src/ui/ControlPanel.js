// src/ui/ControlPanel.js
export class ControlPanel {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;

        // Настройки по умолчанию
        this.settings = {
            simulationSpeed: 1.0,
            showOrbits: true,
            starSize: 1.0,
            showLabels: true // Добавляем настройку для меток
        };

        this.container = null;
        this.createUI();
    }

    createUI() {
        // Создаем контейнер для панели управления
        this.container = document.createElement('div');
        this.container.className = 'control-panel';
        document.body.appendChild(this.container);

        // Заголовок панели
        const header = document.createElement('div');
        header.className = 'control-panel-header';
        header.textContent = 'Управление системой';
        this.container.appendChild(header);

        // Кнопка скрытия/показа панели
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button';
        toggleButton.textContent = '−';
        toggleButton.addEventListener('click', () => this.togglePanel());
        header.appendChild(toggleButton);

        // Создаем содержимое панели
        const content = document.createElement('div');
        content.className = 'control-panel-content';
        this.container.appendChild(content);

        // Добавляем слайдеры
        this.addSlider(
            content,
            'Скорость симуляции',
            0.1,
            5.0,
            this.settings.simulationSpeed,
            0.1,
            (value) => this.updateSimulationSpeed(value)
        );

        this.addSlider(
            content,
            'Размер звезды',
            0.8,
            1.5,
            this.settings.starSize,
            0.1,
            (value) => this.updateStarSize(value)
        );

        // Добавляем чекбоксы
        this.addCheckbox(
            content,
            'Показать орбиты',
            this.settings.showOrbits,
            (checked) => this.toggleOrbits(checked)
        );

        // Добавляем чекбокс для названий планет
        this.addCheckbox(
            content,
            'Показать названия планет',
            this.settings.showLabels,
            (checked) => this.toggleLabels(checked)
        );

        // Добавляем CSS стили
        this.addStyles();
    }

    addSlider(container, label, min, max, value, step, callback) {
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';

        const labelElement = document.createElement('label');
        labelElement.textContent = label;

        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'value-display';
        valueDisplay.textContent = value.toFixed(1);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.step = step;

        slider.addEventListener('input', () => {
            const newValue = parseFloat(slider.value);
            valueDisplay.textContent = newValue.toFixed(1);
            callback(newValue);
        });

        sliderContainer.appendChild(labelElement);
        sliderContainer.appendChild(valueDisplay);
        sliderContainer.appendChild(slider);
        container.appendChild(sliderContainer);

        return slider;
    }

    addCheckbox(container, label, checked, callback) {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';

        const labelElement = document.createElement('label');
        labelElement.textContent = label;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checked;

        checkbox.addEventListener('change', () => {
            callback(checkbox.checked);
        });

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(labelElement);
        container.appendChild(checkboxContainer);

        return checkbox;
    }

    togglePanel() {
        const content = this.container.querySelector('.control-panel-content');
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';

        // Меняем значок на кнопке
        const toggleButton = this.container.querySelector('.toggle-button');
        toggleButton.textContent = isVisible ? '+' : '−';
    }

    // Методы для обновления параметров в SceneManager
    updateSimulationSpeed(value) {
        this.settings.simulationSpeed = value;
        this.sceneManager.setSimulationSpeed(value);
    }

    updateStarSize(value) {
        this.settings.starSize = value;
        this.sceneManager.setStarSize(value);
    }

    toggleOrbits(checked) {
        this.settings.showOrbits = checked;
        this.sceneManager.setOrbitsVisibility(checked);
    }

    // Метод для управления видимостью меток
    toggleLabels(checked) {
        this.settings.showLabels = checked;
        this.sceneManager.setLabelsVisibility(checked);
    }

    // Добавление CSS стилей для панели управления
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .control-panel {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 300px;
                background-color: rgba(30, 30, 30, 0.8);
                border-radius: 8px;
                color: white;
                font-family: Arial, sans-serif;
                z-index: 1000;
                overflow: hidden;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
            
            .control-panel-header {
                padding: 10px 15px;
                background-color: rgba(50, 50, 50, 0.9);
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
                border-bottom: 1px solid rgba(80, 80, 80, 0.5);
            }
            
            .toggle-button {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(60, 60, 60, 0.5);
                border-radius: 4px;
                transition: background-color 0.2s;
            }
            
            .toggle-button:hover {
                background-color: rgba(80, 80, 80, 0.8);
            }
            
            .control-panel-content {
                padding: 15px;
            }
            
            .slider-container {
                margin-bottom: 15px;
            }
            
            .slider-container label {
                display: block;
                margin-bottom: 5px;
            }
            
            .value-display {
                margin-left: 10px;
                font-weight: bold;
                color: #87CEFA;
            }
            
            input[type="range"] {
                width: 100%;
                height: 6px;
                background: rgba(80, 80, 80, 0.5);
                border-radius: 3px;
                outline: none;
                -webkit-appearance: none;
            }
            
            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                background: #87CEFA;
                border-radius: 50%;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            input[type="range"]::-webkit-slider-thumb:hover {
                background: #5CACEE;
            }
            
            .checkbox-container {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .checkbox-container input[type="checkbox"] {
                margin-right: 10px;
                width: 18px;
                height: 18px;
            }
            
            /* Стили для меток планет */
            .planet-label {
                color: white;
                font-family: Arial, sans-serif;
                font-weight: bold;
                background-color: rgba(0, 0, 0, 0.6);
                padding: 2px 6px;
                border-radius: 4px;
                pointer-events: none;
                white-space: nowrap;
                text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
            }
        `;
        document.head.appendChild(style);
    }
}
