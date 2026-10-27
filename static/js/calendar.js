/**
 * Календарь мероприятий
 * Динамический календарь с возможностью переключения между видами сетки и списка
 */

class EventCalendar {
    constructor(events = []) {
        this.events = events;
        this.currentDate = new Date();
        this.currentView = 'grid';
        this.statusFilter = 'all';

        // Русские названия месяцев и дней
        this.monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];

        this.monthNamesGenitive = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];

        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.checkMobileView();

        // Проверка при изменении размера окна
        window.addEventListener('resize', () => this.checkMobileView());
    }

    bindEvents() {
        // Навигация по месяцам
        document.getElementById('prevMonth')?.addEventListener('click', () => this.prevMonth());
        document.getElementById('nextMonth')?.addEventListener('click', () => this.nextMonth());

        // Клик по заголовку месяца - открыть виджет выбора
        document.getElementById('currentMonth')?.addEventListener('click', () => this.openMonthYearPicker());

        // Переключатели вида
        document.getElementById('gridViewBtn')?.addEventListener('click', () => this.switchView('grid'));
        document.getElementById('listViewBtn')?.addEventListener('click', () => this.switchView('list'));

        // Фильтр по статусу
        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.statusFilter = e.target.value;
            this.render();
        });

        // Кнопка "Сегодня"
        document.getElementById('todayBtn')?.addEventListener('click', () => this.goToToday());

        // Виджет выбора месяца и года
        this.bindMonthYearPickerEvents();
    }

    bindMonthYearPickerEvents() {
        const picker = document.getElementById('monthYearPicker');
        const overlay = document.getElementById('monthYearPickerOverlay');
        const closeBtn = document.getElementById('monthYearPickerClose');
        const prevYearBtn = document.getElementById('prevYear');
        const nextYearBtn = document.getElementById('nextYear');
        const todayBtn = document.getElementById('pickerTodayBtn');
        const monthButtons = document.querySelectorAll('.month-item');

        // Закрытие виджета
        overlay?.addEventListener('click', () => this.closeMonthYearPicker());
        closeBtn?.addEventListener('click', () => this.closeMonthYearPicker());

        // Навигация по годам
        prevYearBtn?.addEventListener('click', () => this.changePickerYear(-1));
        nextYearBtn?.addEventListener('click', () => this.changePickerYear(1));

        // Кнопка "Текущий месяц"
        todayBtn?.addEventListener('click', () => {
            this.goToToday();
            this.closeMonthYearPicker();
        });

        // Клик по месяцу
        monthButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const month = parseInt(e.target.dataset.month);
                this.selectMonth(month);
            });
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && picker?.classList.contains('active')) {
                this.closeMonthYearPicker();
            }
        });
    }

    goToToday() {
        this.currentDate = new Date();
        this.render();
    }

    openMonthYearPicker() {
        const picker = document.getElementById('monthYearPicker');
        const yearDisplay = document.getElementById('yearDisplay');

        if (picker && yearDisplay) {
            // Устанавливаем текущий год
            yearDisplay.textContent = this.currentDate.getFullYear();

            // Подсвечиваем текущий месяц
            this.updateMonthSelection();

            // Показываем виджет
            picker.classList.add('active');
            document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
        }
    }

    closeMonthYearPicker() {
        const picker = document.getElementById('monthYearPicker');
        if (picker) {
            picker.classList.remove('active');
            document.body.style.overflow = ''; // Восстанавливаем скролл
        }
    }

    changePickerYear(delta) {
        const yearDisplay = document.getElementById('yearDisplay');
        if (yearDisplay) {
            const currentYear = parseInt(yearDisplay.textContent);
            yearDisplay.textContent = currentYear + delta;
            this.updateMonthSelection();
        }
    }

    updateMonthSelection() {
        const yearDisplay = document.getElementById('yearDisplay');
        const monthButtons = document.querySelectorAll('.month-item');
        const now = new Date();
        const selectedYear = parseInt(yearDisplay?.textContent || this.currentDate.getFullYear());

        monthButtons.forEach((btn, index) => {
            // Убираем все классы
            btn.classList.remove('current', 'selected');

            // Текущий месяц и год
            if (selectedYear === now.getFullYear() && index === now.getMonth()) {
                btn.classList.add('current');
            }

            // Выбранный месяц
            if (selectedYear === this.currentDate.getFullYear() && index === this.currentDate.getMonth()) {
                btn.classList.add('selected');
            }
        });
    }

    selectMonth(month) {
        const yearDisplay = document.getElementById('yearDisplay');
        const year = parseInt(yearDisplay?.textContent || this.currentDate.getFullYear());

        this.currentDate = new Date(year, month, 1);
        this.render();
        this.closeMonthYearPicker();
    }

    checkMobileView() {
        // На мобильных устройствах автоматически переключаемся на список
        if (window.innerWidth <= 768) {
            this.currentView = 'list';
            this.updateViewButtons();
        }
    }

    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }

    switchView(view) {
        this.currentView = view;
        this.updateViewButtons();
        this.render();
    }

    updateViewButtons() {
        const gridBtn = document.getElementById('gridViewBtn');
        const listBtn = document.getElementById('listViewBtn');

        if (gridBtn && listBtn) {
            gridBtn.classList.toggle('active', this.currentView === 'grid');
            listBtn.classList.toggle('active', this.currentView === 'list');
        }
    }

    render() {
        this.updateMonthTitle();

        if (this.currentView === 'grid') {
            this.renderGridView();
        } else {
            this.renderListView();
        }

        this.toggleViews();
    }

    updateMonthTitle() {
        const monthTitle = document.getElementById('currentMonth');
        if (monthTitle) {
            const month = this.monthNames[this.currentDate.getMonth()];
            const year = this.currentDate.getFullYear();
            monthTitle.textContent = `${month} ${year}`;
        }
    }

    toggleViews() {
        const gridView = document.querySelector('.calendar-grid-view');
        const listView = document.querySelector('.calendar-list-view');
        const emptyView = document.getElementById('calendarEmpty');

        if (gridView && listView && emptyView) {
            const hasEvents = this.getFilteredEvents().length > 0;

            if (!hasEvents) {
                gridView.classList.remove('active');
                listView.classList.remove('active');
                emptyView.classList.remove('d-none');
            } else {
                emptyView.classList.add('d-none');
                if (this.currentView === 'grid') {
                    gridView.classList.add('active');
                    listView.classList.remove('active');
                } else {
                    gridView.classList.remove('active');
                    listView.classList.add('active');
                }
            }
        }
    }

    getFilteredEvents() {
        const now = new Date();

        return this.events.filter(event => {
            const eventDate = new Date(event.date);

            if (this.statusFilter === 'upcoming' && eventDate < now) {
                return false;
            }
            if (this.statusFilter === 'past' && eventDate >= now) {
                return false;
            }

            return true;
        });
    }

    renderGridView() {
        const grid = document.getElementById('calendarGrid');
        if (!grid) return;

        // Очищаем только ячейки дней, сохраняя заголовки
        const dayHeaders = grid.querySelectorAll('.calendar-day-header');
        grid.innerHTML = '';
        dayHeaders.forEach(header => grid.appendChild(header));

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Первый день месяца
        const firstDay = new Date(year, month, 1);
        // Последний день месяца
        const lastDay = new Date(year, month + 1, 0);

        // День недели первого дня (0 = воскресенье, преобразуем в понедельник = 0)
        let startingDayOfWeek = firstDay.getDay() - 1;
        if (startingDayOfWeek === -1) startingDayOfWeek = 6; // Воскресенье

        // Дни из предыдущего месяца
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            const dayElement = this.createDayElement(day, true, false);
            grid.appendChild(dayElement);
        }

        // Дни текущего месяца
        const today = new Date();
        const filteredEvents = this.getFilteredEvents();

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const currentDate = new Date(year, month, day);
            const isToday = currentDate.toDateString() === today.toDateString();

            // Находим события для этого дня
            const dayEvents = filteredEvents.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.toDateString() === currentDate.toDateString();
            });

            const dayElement = this.createDayElement(day, false, isToday, dayEvents, currentDate);
            grid.appendChild(dayElement);
        }

        // Дни из следующего месяца
        const remainingCells = 42 - (startingDayOfWeek + lastDay.getDate());
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(day, true, false);
            grid.appendChild(dayElement);
        }
    }

    createDayElement(day, otherMonth, isToday, events = [], date = null) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';

        if (otherMonth) {
            dayDiv.classList.add('other-month');
        }
        if (isToday) {
            dayDiv.classList.add('today');
        }

        // Номер дня
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = day;
        dayDiv.appendChild(dayNumber);

        // События
        if (events && events.length > 0) {
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'calendar-day-events';

            const maxVisible = 2;
            const visibleEvents = events.slice(0, maxVisible);

            visibleEvents.forEach(event => {
                const eventDot = document.createElement('div');
                eventDot.className = 'calendar-event-dot';

                const eventDate = new Date(event.date);
                const now = new Date();
                if (eventDate < now) {
                    eventDot.classList.add('past');
                }

                eventDot.textContent = event.title;
                eventDot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showEventModal(event);
                });

                eventsContainer.appendChild(eventDot);
            });

            // Индикатор дополнительных событий
            if (events.length > maxVisible) {
                const moreEvents = document.createElement('div');
                moreEvents.className = 'calendar-more-events';
                moreEvents.textContent = `+${events.length - maxVisible} еще`;
                moreEvents.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Можно открыть модалку с списком всех событий дня
                    this.showEventModal(events[0]);
                });
                eventsContainer.appendChild(moreEvents);
            }

            dayDiv.appendChild(eventsContainer);
        }

        return dayDiv;
    }

    renderListView() {
        const listView = document.getElementById('calendarListView');
        if (!listView) return;

        listView.innerHTML = '';

        const filteredEvents = this.getFilteredEvents();

        // Группируем события по датам
        const eventsByDate = {};
        filteredEvents.forEach(event => {
            const eventDate = new Date(event.date);
            const dateKey = eventDate.toDateString();

            if (!eventsByDate[dateKey]) {
                eventsByDate[dateKey] = [];
            }
            eventsByDate[dateKey].push(event);
        });

        // Сортируем даты
        const sortedDates = Object.keys(eventsByDate).sort((a, b) => {
            return new Date(a) - new Date(b);
        });

        // Создаем группы событий
        sortedDates.forEach(dateKey => {
            const events = eventsByDate[dateKey];
            const date = new Date(dateKey);

            const groupDiv = document.createElement('div');
            groupDiv.className = 'calendar-list-group';

            // Заголовок даты
            const dateHeader = document.createElement('div');
            dateHeader.className = 'calendar-list-date';
            dateHeader.textContent = this.formatDateFull(date);
            groupDiv.appendChild(dateHeader);

            // События этой даты
            events.forEach(event => {
                const eventItem = this.createListEventElement(event);
                groupDiv.appendChild(eventItem);
            });

            listView.appendChild(groupDiv);
        });
    }

    createListEventElement(event) {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'calendar-list-item';

        const eventDate = new Date(event.date);
        const now = new Date();
        if (eventDate < now) {
            eventDiv.classList.add('past');
        }

        eventDiv.addEventListener('click', () => this.showEventModal(event));

        // Иконка
        const iconDiv = document.createElement('div');
        iconDiv.className = 'calendar-list-item-icon';
        iconDiv.innerHTML = `<i class="bi bi-${event.icon || 'calendar-event'}"></i>`;
        eventDiv.appendChild(iconDiv);

        // Контент
        const contentDiv = document.createElement('div');
        contentDiv.className = 'calendar-list-item-content';

        const title = document.createElement('div');
        title.className = 'calendar-list-item-title';
        title.textContent = event.title;
        contentDiv.appendChild(title);

        const info = document.createElement('div');
        info.className = 'calendar-list-item-info';

        // Время
        const timeDetail = document.createElement('div');
        timeDetail.className = 'calendar-list-item-detail';
        timeDetail.innerHTML = `<i class="bi bi-clock"></i> ${this.formatTime(eventDate)}`;
        info.appendChild(timeDetail);

        // Место
        if (event.location) {
            const locationDetail = document.createElement('div');
            locationDetail.className = 'calendar-list-item-detail';
            locationDetail.innerHTML = `<i class="bi bi-geo-alt"></i> ${event.location}`;
            info.appendChild(locationDetail);
        }

        contentDiv.appendChild(info);
        eventDiv.appendChild(contentDiv);

        return eventDiv;
    }

    showEventModal(event) {
        const modal = new bootstrap.Modal(document.getElementById('eventModal'));

        const eventDate = new Date(event.date);
        const now = new Date();
        const isPast = eventDate < now;

        // Заполняем данные модального окна
        document.getElementById('eventModalTitle').textContent = event.title;
        document.getElementById('eventModalDate').textContent = this.formatDateFull(eventDate);
        document.getElementById('eventModalTime').textContent = this.formatTime(eventDate);

        const locationContainer = document.getElementById('eventModalLocationContainer');
        if (event.location) {
            document.getElementById('eventModalLocation').textContent = event.location;
            locationContainer.style.display = 'flex';
        } else {
            locationContainer.style.display = 'none';
        }

        const statusText = isPast ? 'Прошедшее событие' : 'Предстоящее событие';
        document.getElementById('eventModalStatus').textContent = statusText;

        document.getElementById('eventModalDescription').textContent = event.description || 'Описание не указано';

        modal.show();
    }

    formatDateFull(date) {
        const day = date.getDate();
        const month = this.monthNamesGenitive[date.getMonth()];
        const year = date.getFullYear();

        const dayOfWeek = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'][date.getDay()];

        return `${day} ${month} ${year}, ${dayOfWeek}`;
    }

    formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Обновление событий (для динамической загрузки)
    updateEvents(events) {
        this.events = events;
        this.render();
    }
}

// Инициализация календаря после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, есть ли на странице календарь
    if (document.getElementById('calendarGrid')) {
        // События будут загружены из Django template или API
        // Для начала используем пустой массив, события добавятся через window.calendarEvents
        window.eventCalendar = new EventCalendar(window.calendarEvents || []);
    }
});
