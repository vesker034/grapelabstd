/**
 * Скрипт для переключения тем Bootstrap 5 (светлая/темная)
 * Сохраняет выбор пользователя в localStorage.
 */
(() => {
    'use strict';

    const storedTheme = localStorage.getItem('theme');

    const getPreferredTheme = () => {
        if (storedTheme) {
            return storedTheme;
        }
        // По умолчанию темная тема, если пользователь не выбрал или его система не настроена
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const setTheme = (theme) => {
        if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme);
        }
        // Обновляем иконку
        updateIcon(theme);
    };

    const updateIcon = (theme) => {
        const iconElement = document.getElementById('theme-icon');
        if (iconElement) {
            if (theme === 'light') {
                iconElement.classList.remove('bi-sun-fill');
                iconElement.classList.add('bi-moon-stars-fill');
            } else {
                iconElement.classList.remove('bi-moon-stars-fill');
                iconElement.classList.add('bi-sun-fill');
            }
        }
    };


    // Устанавливаем тему при загрузке
    const currentTheme = getPreferredTheme();
    setTheme(currentTheme);


    // Добавляем обработчик клика на кнопку переключения
    window.addEventListener('DOMContentLoaded', () => {
        const switcher = document.getElementById('theme-switcher');
        if (switcher) {
            switcher.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-bs-theme');
                const newTheme = current === 'dark' ? 'light' : 'dark';
                localStorage.setItem('theme', newTheme);
                setTheme(newTheme);
            });
        }
        // Обновляем иконку при загрузке DOM
        updateIcon(document.documentElement.getAttribute('data-bs-theme'));
    });

})();
