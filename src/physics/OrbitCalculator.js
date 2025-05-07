import * as THREE from 'three';

const G = 6.67430e-11 * 1000;

export class OrbitCalculator {
    static calculateGravitationalForce(object1, object2) {
        const direction = object2.position.clone().sub(object1.position);
        const distance = direction.length();

        if (distance < 0.1) return new THREE.Vector3(0, 0, 0);

        const directionNorm = direction.clone().normalize();

        const forceMagnitude = G * (object1.mass * object2.mass) / (distance * distance);

        return directionNorm.multiplyScalar(forceMagnitude);
    }

    static calculateCircularOrbitVelocity(orbitalBody, centralBody, distanceFromCenter) {
        const speed = Math.sqrt(G * centralBody.mass / distanceFromCenter);

        const directionToCentral = centralBody.position.clone().sub(orbitalBody.position).normalize();
        const orbitDirection = new THREE.Vector3(-directionToCentral.z, 0, directionToCentral.x).normalize();

        return orbitDirection.multiplyScalar(speed);
    }

    static checkCollision(object1, object2) {
        const distance = object1.position.distanceTo(object2.position);
        return distance < (object1.radius + object2.radius);
    }
}
