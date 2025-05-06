import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

export class CameraController {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        // Инициализация орбитальных контролов
        this.controls = new OrbitControls(this.camera, this.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Режим отслеживания объекта
        this.trackingMode = false;
        this.targetObject = null;
        this.trackingOffset = new THREE.Vector3(0, 10, 30);

        this.initialize();
    }

    initialize() {
        // Дополнительная настройка контролов
        this.controls.minDistance = 5;
        this.controls.maxDistance = 500;
    }

    setTrackingTarget(object) {
        this.trackingMode = !!object;
        this.targetObject = object;
    }

    update() {
        if (this.trackingMode && this.targetObject) {
            // В режиме отслеживания перемещаем камеру за объектом
            const targetPosition = this.targetObject.position.clone();
            this.camera.position.copy(targetPosition.add(this.trackingOffset));
            this.camera.lookAt(this.targetObject.position);
        } else {
            // В обычном режиме используем орбитальные контролы
            this.controls.update();
        }
    }
}
