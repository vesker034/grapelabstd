/**
 * Управление пагинацией на странице событий с сохранением активной вкладки
 */

document.addEventListener('DOMContentLoaded', function () {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    const upcomingPage = urlParams.get('upcoming_page');
    const pastPage = urlParams.get('past_page');

    // Определяем активную вкладку на основе параметров пагинации
    let activeTab = 'upcoming'; // По умолчанию

    // Проверяем только наличие параметра
    if (pastPage) {
        activeTab = 'past';
    }
    if (upcomingPage && !pastPage) {
        activeTab = 'upcoming';
    }

    // Восстанавливаем активную вкладку
    const tabToActivate = document.querySelector(`#${activeTab}-tab`);
    if (tabToActivate) {
        tabToActivate.click();
    }

    // Обновляем все ссылки пагинации после небольшой задержки
    // чтобы дать время табу переключиться
    setTimeout(updatePaginationLinks, 100);

    // При переключении вкладок обновляем ссылки пагинации
    const tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');
    tabButtons.forEach(button => {
        button.addEventListener('shown.bs.tab', function (event) {
            updatePaginationLinks();
        });
    });
});

function updatePaginationLinks() {
    // Получаем активную вкладку
    const activeTabButton = document.querySelector('.nav-link.active');
    if (!activeTabButton) return;

    const activeTabId = activeTabButton.getAttribute('data-bs-target').replace('#', '');

    // Находим контейнер активной вкладки
    const activeTabPane = document.querySelector(`#${activeTabId}`);
    if (!activeTabPane) return;

    // Обновляем все ссылки пагинации в активной вкладке
    const paginationLinks = activeTabPane.querySelectorAll('.pagination a.page-link');

    paginationLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        // Парсим существующий URL
        const url = new URL(href, window.location.origin + window.location.pathname);
        const params = new URLSearchParams(url.search);

        // Получаем номер страницы
        let pageNum = null;
        let paramName = null;

        if (activeTabId === 'upcoming') {
            pageNum = params.get('upcoming_page');
            paramName = 'upcoming_page';
        } else if (activeTabId === 'past') {
            pageNum = params.get('past_page');
            paramName = 'past_page';
        }

        // Создаем новый URL только с нужным параметром
        if (pageNum && paramName) {
            link.setAttribute('href', `?${paramName}=${pageNum}`);
        }
    });
}
