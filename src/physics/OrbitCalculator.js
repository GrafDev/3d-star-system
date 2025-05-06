import * as THREE from 'three';

// Гравитационная постоянная (в условных единицах для симуляции)
const G = 6.67430e-11 * 1000; // Увеличено для лучшей визуализации

export class OrbitCalculator {
    // Расчет гравитационной силы между двумя объектами
    static calculateGravitationalForce(object1, object2) {
        // Вектор направления от object1 к object2
        const direction = object2.position.clone().sub(object1.position);
        const distance = direction.length();

        // Избегаем деления на ноль
        if (distance < 0.1) return new THREE.Vector3(0, 0, 0);

        // Нормализованный вектор направления
        const directionNorm = direction.clone().normalize();

        // Расчет силы: F = G * (m1 * m2) / r^2
        const forceMagnitude = G * (object1.mass * object2.mass) / (distance * distance);

        // Возвращаем вектор силы
        return directionNorm.multiplyScalar(forceMagnitude);
    }

    // Расчет начальной скорости для круговой орбиты
    static calculateCircularOrbitVelocity(orbitalBody, centralBody, distanceFromCenter) {
        // v = sqrt(G * M / r)
        const speed = Math.sqrt(G * centralBody.mass / distanceFromCenter);

        // Создаем вектор скорости, перпендикулярный радиус-вектору
        const directionToCentral = centralBody.position.clone().sub(orbitalBody.position).normalize();
        const orbitDirection = new THREE.Vector3(-directionToCentral.z, 0, directionToCentral.x).normalize();

        return orbitDirection.multiplyScalar(speed);
    }

    // Проверка столкновений между двумя объектами
    static checkCollision(object1, object2) {
        const distance = object1.position.distanceTo(object2.position);
        return distance < (object1.radius + object2.radius);
    }
}
