// Основной файл приложения - ИСПРАВЛЕННАЯ ВЕРСИЯ
class MangaApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log('Инициализация MangaApp...');
        this.checkAuth();
        this.updateNavigation();

        // Загружаем контент только если находимся на главной странице
        if (this.isHomePage()) {
            this.loadFeaturedContent();
        }

        this.setupEventListeners();
    }

    // Проверяем находимся ли на главной странице
    isHomePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        return currentPage === 'index.html';
    }

    checkAuth() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            console.log('Пользователь авторизован:', this.currentUser.username);
        } else {
            console.log('Пользователь не авторизован');
        }
    }

    updateNavigation() {
        console.log('Обновление навигации...');
        const elements = {
            loginLink: document.getElementById('login-link'),
            registerLink: document.getElementById('register-link'),
            profileLink: document.getElementById('profile-link'),
            logoutBtn: document.getElementById('logout-btn'),
            adminLink: document.getElementById('admin-link')
        };

        if (this.currentUser) {
            this.toggleElements(elements, false, true);
            if (this.currentUser.role === 'admin' && elements.adminLink) {
                elements.adminLink.style.display = 'block';
            }
        } else {
            this.toggleElements(elements, true, false);
        }

        this.highlightActivePage();
    }

    toggleElements(elements, showAuth, showUser) {
        if (elements.loginLink) elements.loginLink.style.display = showAuth ? 'block' : 'none';
        if (elements.registerLink) elements.registerLink.style.display = showAuth ? 'block' : 'none';
        if (elements.profileLink) elements.profileLink.style.display = showUser ? 'block' : 'none';
        if (elements.logoutBtn) elements.logoutBtn.style.display = showUser ? 'block' : 'none';
        if (elements.adminLink) elements.adminLink.style.display = 'none';
    }

    highlightActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === currentPage);
        });
    }

    async loadFeaturedContent() {
        console.log('Загрузка контента для главной...');
        try {
            const [manga, cards] = await Promise.all([
                DataStore.getManga(),
                DataStore.getCards()
            ]);

            console.log('Загружено манги:', manga.length);
            console.log('Загружено карточек:', cards.length);

            this.renderFeaturedManga(manga.slice(0, 8));
            this.renderFeaturedCards(cards.slice(0, 8));
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }

    renderFeaturedManga(manga) {
        console.log('Рендер манги на главной:', manga.length);

        // Проверяем существует ли контейнер перед рендером
        if (!document.getElementById('featured-manga')) {
            console.log('Контейнер featured-manga не найден (не главная страница)');
            return;
        }

        Components.renderGrid('featured-manga', manga, Components.createMangaCard, {
            gridClass: 'featured-manga-grid',
            emptyMessage: 'Манга не найдена',
            emptyIcon: '📚'
        });
    }

    renderFeaturedCards(cards) {
        console.log('Рендер карточек на главной:', cards.length);

        // Проверяем существует ли контейнер перед рендером
        if (!document.getElementById('recent-cards')) {
            console.log('Контейнер recent-cards не найден (не главная страница)');
            return;
        }

        Components.renderGrid('recent-cards', cards, Components.createCollectibleCard, {
            gridClass: 'featured-cards-grid',
            emptyMessage: 'Карточки не найдены',
            emptyIcon: '🃏',
            size: 'small'
        });
    }

    setupEventListeners() {
        document.getElementById('logout-btn')?.addEventListener('click', () => this.logout());
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        location.reload();
    }
}

console.log('Запуск инициализации MangaApp...');
// Инициализация приложения
const app = new MangaApp();