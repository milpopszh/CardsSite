// Универсальные компоненты для переиспользования
class Components {
    // Компонент карточки манги
    static createMangaCard(manga, options = {}) {
        console.log('Создание карточки манги:', manga.title);

        const { showStats = true, showTags = true, onClick = null } = options;

        const onClickHandler = onClick || `location.href='manga-reader.html?id=${manga.id}'`;

        return `
            <div class="manga-card" onclick="${onClickHandler}">
                <img src="${manga.cover || 'images/manga/default.jpg'}"
                     alt="${manga.title}"
                     class="manga-card-image"
                     onerror="this.src='images/manga/default.jpg'">
                <div class="manga-card-content">
                    <div class="manga-card-title">${manga.title}</div>
                    <div class="manga-card-author">${manga.author}</div>
                    ${showStats ? `
                    <div class="manga-card-stats">
                        <span class="manga-stat">⭐ ${manga.rating}</span>
                        <span class="manga-stat">📖 ${manga.chapters}</span>
                    </div>
                    ` : ''}
                    ${showTags && manga.tags ? `
                    <div class="manga-card-tags">
                        ${manga.tags.slice(0, 2).map(tag => `<span class="manga-card-tag">${tag}</span>`).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Компонент коллекционной карточки
    static createCollectibleCard(card, options = {}) {
        console.log('Создание коллекционной карточки:', card.name);

        const { showStatus = false, userData = null, size = 'medium', onClick = null } = options;

        // ИСПРАВИЛ: используем статический вызов
        const rarityLetter = Components.getRarityLetter(card.rarity);
        const isOwned = userData?.cards?.includes(card.id);

        const onClickHandler = onClick || `cardsCollection?.showCardModal(${card.id})`;

        return `
            <div class="card card-${size} card-rarity-${card.rarity}"
                 onclick="${onClickHandler}">
                <div class="rarity-badge rarity-${card.rarity}">
                    ${rarityLetter}
                </div>
                ${showStatus ? `
                <div class="${isOwned ? 'card-owned' : 'card-missing'}">
                    ${isOwned ? '✓' : '?'}
                </div>
                ` : ''}
                <img src="${card.image || 'images/cards/default.jpg'}"
                     alt="${card.name}"
                     class="card-image"
                     onerror="this.src='images/cards/default.jpg'">
                <div class="card-overlay">
                    <div class="card-overlay-title">${card.name}</div>
                    <div class="card-overlay-subtitle">${card.manga}</div>
                </div>
            </div>
        `;
    }

    // Компонент пустого состояния
    static createEmptyState(message, icon = '📚') {
        console.log('Создание пустого состояния:', message);
        return `
            <div style="text-align: center; grid-column: 1 / -1; padding: 3rem; color: #7f8c8d;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${icon}</div>
                <p>${message}</p>
            </div>
        `;
    }

    // Утилита для букв редкости
    static getRarityLetter(rarity) {
        const letterMap = {
            'common': 'N',
            'rare': 'S',
            'epic': 'R',
            'legendary': 'X'
        };
        return letterMap[rarity] || rarity.charAt(0).toUpperCase();
    }

    // Компонент сетки
    static renderGrid(containerId, items, itemRenderer, options = {}) {
        console.log('Рендер сетки:', containerId, items?.length, options);

        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Контейнер не найден:', containerId);
            return;
        }

        if (!items || items.length === 0) {
            console.log('Нет элементов для отображения');
            container.innerHTML = this.createEmptyState(options.emptyMessage || 'Ничего не найдено', options.emptyIcon);
            return;
        }

        // Устанавливаем правильный класс для сетки если нужно
        if (options.gridClass) {
            container.className = options.gridClass;
        }

        try {
            container.innerHTML = items.map(item => itemRenderer(item, options)).join('');
            console.log('Сетка успешно отрендерена:', items.length, 'элементов');
        } catch (error) {
            console.error('Ошибка рендера сетки:', error);
            container.innerHTML = this.createEmptyState('Ошибка загрузки контента', '❌');
        }
    }
}

console.log('Components.js загружен');