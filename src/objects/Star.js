import * as THREE from 'three';
import { CelestialObject } from './CelestialObject';

export class Star extends CelestialObject {
    constructor(config) {
        super(config);

        const textureLoader = new THREE.TextureLoader();
        let material;

        if (config.textureUrl) {
            const textureUrl = './src/assets' + config.textureUrl;

            const texture = textureLoader.load(
                textureUrl,
                function(loadedTexture) {
                    console.log('Texture loaded successfully:', textureUrl);
                },
                undefined,
                function(error) {
                    console.error('Error loading texture:', textureUrl, error);
                }
            );

            material = new THREE.MeshBasicMaterial({
                map: texture,
                color: 0xffdd00
            });
        } else {
            material = new THREE.MeshBasicMaterial({
                color: config.color || 0xffdd00
            });
        }

        this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        this.material = material;

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(this.position);

        const lightDistance = config.lightDistance || 10000;
        const lightDecay = config.hasOwnProperty('lightDecay') ? config.lightDecay : 1; // Значение 0 означает, что свет не угасает с расстоянием

        this.light = new THREE.PointLight(config.color || 0xffffff, config.intensity || 1, lightDistance);
        this.light.decay = lightDecay;
        this.light.position.copy(this.position);
        this.mesh.add(this.light);

        const ambientLight = new THREE.AmbientLight(0x333333);
        this.mesh.add(ambientLight);
    }

    update(deltaTime, celestialObjects) {
        super.update(deltaTime, celestialObjects);

        this.mesh.rotation.y += 0.001;
    }
}
