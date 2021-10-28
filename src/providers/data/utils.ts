import { User } from "./interfaces";
import * as moment from 'moment';



export function calculateAge(user: User) {
    if (user && user.dob) {
        return moment().diff(user.dob, 'years', false);
    }
    return 0;
}

export function calculateImc(user: User) {
    if (user && user.height) {
        const height = (user.height / 100);
        return (user.weight / (height * height)).toFixed(1);
    }
    return 0;
}

export function calculateIdealWeight(user: User) {
    if (!user.height) {
        return [0, 0];
    }
    return [calculateIdealWeightMin(user.height).toFixed(1), calculateIdealWeightMax(user.height).toFixed(1)];
}

export function calculatePointsIdeal(user: User): number {
    const height = user.height;
    const age = calculateAge(user);
    const gender = (user.gender === 'male' ? 0 : 1)
    const excercise = user.activity_level;

    const maxIdeal = calculateIdealWeightMax(height);
    const minIdeal = calculateIdealWeightMin(height);
    const avgIdeal = Math.round((maxIdeal + minIdeal) / 2);
    const energy = calculateEnergyLimitNew(avgIdeal, height, age, gender, excercise);

    let maxPoints = Math.max(energy - 1000, 1000);
    maxPoints = Math.min(maxPoints, 2500) / 35;
    maxPoints = Math.max(maxPoints - 11, 26);
    maxPoints = Math.round(Math.min(maxPoints, 71));
    return maxPoints;
}

export function calculateIdealWeightMax(heigth: number): number {
    return 24.99 * (heigth / 100 * heigth / 100);
}

export function calculateIdealWeightMin(heigth: number): number {
    return 18.05 * (heigth / 100 * heigth / 100);
}

export function calculateEnergyLimitNew(weigth: number, height: number, age: number, gender: number, excercise: number) {
    if (height > 3) {
        height = height / 100;
    }
    const arrayExercicio = [
        1.2, 1.3, 1.4, 1.5, 1.6, 1.8,
        1.2, 1.3, 1.35, 1.45, 1.5, 1.7
    ];
    const pSex = (gender === 0) ? 0 : 6;
    const factorActivity = arrayExercicio[excercise + pSex];
    const limit = (gender == 0) ?
        (864 - (9.72 * age) + factorActivity * ((14.2 * weigth) + (height * 503)))
        : (387 - (7.31 * age) + factorActivity * ((10.9 * weigth) + (height * 660.7)))
    return limit - (0.09 * limit) + 200;

}