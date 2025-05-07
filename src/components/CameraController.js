import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

export class CameraController {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        this.controls = new OrbitControls(this.camera, this.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.trackingMode = false;
        this.targetObject = null;
        this.trackingOffset = new THREE.Vector3(0, 10, 30);

        this.initialize();
    }

    initialize() {
        this.controls.minDistance = 5;
        this.controls.maxDistance = 500;
    }

    setTrackingTarget(object) {
        this.trackingMode = !!object;
        this.targetObject = object;
    }

    update() {
        if (this.trackingMode && this.targetObject) {
            const targetPosition = this.targetObject.position.clone();
            this.camera.position.copy(targetPosition.add(this.trackingOffset));
            this.camera.lookAt(this.targetObject.position);
        } else {
            this.controls.update();
        }
    }
}
