// utils.js - ДОБАВИМ ПОЛЕЗНЫЕ ФУНКЦИИ
class Utils {
    static formatDate(date) {
        return new Date(date).toLocaleDateString('ru-RU');
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Настройка отложенного ввода
    static setupDebouncedInput(inputId, callback, delay = 300) {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', this.debounce(callback, delay));
        }
    }

    static async loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Ошибка загрузки ${url}:`, error);
            return [];
        }
    }

    static async saveJSON(url, data) {
        try {
            const storageKey = `local_${url.replace(/\//g, '_')}`;
            localStorage.setItem(storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            return false;
        }
    }
}

class DataStore {
    static async getUsers() {
        return await Utils.loadJSON('data/users.json');
    }

    static async getManga() {
        return await Utils.loadJSON('data/manga.json');
    }

    static async getCards() {
        return await Utils.loadJSON('data/cards.json');
    }

    static async saveUsers(users) {
        return await Utils.saveJSON('data/users.json', users);
    }

    static async saveManga(manga) {
        return await Utils.saveJSON('data/manga.json', manga);
    }

    static async saveCards(cards) {
        return await Utils.saveJSON('data/cards.json', cards);
    }
}