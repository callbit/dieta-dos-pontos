import * as moment from 'moment';

export const initialAppState: AppState = {
    user: null,
    meals: [],
    foods: [],
    consumes: [],
    meal: null,
    date: moment().format('YYYY-MM-DD'),
    lastModified: 0,
    online: false,
    trash: [],
}

export interface AppState {
    user?: User,        // Usuário autenticado
    consumes?: Consume[],       // Lista de consumos
    meals?: Meal[],             // Lista de refeições
    foods?: Food[],             // Lista de comidas
    meal?: Meal,        // Refeição selecionada
    date: string;
    lastModified?: number;
    online: boolean;
    trash?: string[]
}

export interface User {
    id: number;
    name: string;
    email: string;
    dob?: string;
    weight?: number;
    height?: number;
    gender?: string;
    activity_level?: number;
    dailyPoints?: number;
    created?: string;
    modified?: string;
}

export interface Consume {
    id: number;
    sid?: number;
    uuid: string;
    food_id: number;
    meal_id: number;
    quantity: number;
    date: string;
    created?: string;
    sync?: number;
    deleted?: string;
}

export interface Meal {
    id: number;
    name: string;
    balance: number;
    modified?: string;
    deleted?: string;
}

export interface Food {
    id: number;
    name: string;
    unit: string;
    points: number;
    parent_id: number | null;
    modified?: string;
    children?: Food[];
    deleted?: string;

}

