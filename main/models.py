from django.db import models

# 1. Таблица для самих "Направлений"
class Direction(models.Model):
    title = models.CharField("Название", max_length=255)
    slug = models.SlugField("URL (авто-поле)", max_length=255, unique=True)
    short_text = models.TextField("Краткое описание", null=True, blank=True)
    full_text = models.TextField("Полное описание", null=True, blank=True)
    icon = models.ImageField("Иконка", upload_to='directions/', null=True, blank=True)
    sort_order = models.IntegerField("Сортировка", default=100)
    is_active = models.BooleanField("Активно", default=True)
    created_at = models.DateTimeField("Создано", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Направление"
        verbose_name_plural = "Направления"
        ordering = ['sort_order']

# 2. Таблица-связка для "Направлений на Главной"
class MainPageDirection(models.Model):
    direction = models.ForeignKey(
        Direction,
        on_delete=models.CASCADE,
        verbose_name="Направление"
    )
    sort_order = models.IntegerField("Сортировка на главной", default=100)
    is_active = models.BooleanField("Показывать на главной", default=True)
    created_at = models.DateTimeField("Создано", auto_now_add=True)

    def __str__(self):
        return f"На главной: {self.direction.title}"

    class Meta:
        verbose_name = "Направление на главной"
        verbose_name_plural = "Направления на главной"
        ordering = ['sort_order']

# 3. Таблица для "Мероприятий" (основная)
# 3. Таблица для "Мероприятий" (основная)
class Event(models.Model):
    # Статусы мероприятий
    STATUS_DRAFT = 'draft'
    STATUS_UPCOMING = 'upcoming'
    STATUS_ACTIVE = 'active'
    STATUS_COMPLETED = 'completed'
    STATUS_CANCELLED = 'cancelled'
    
    STATUS_CHOICES = [
        (STATUS_DRAFT, 'Черновик'),
        (STATUS_UPCOMING, 'Предстоящее'),
        (STATUS_ACTIVE, 'Активное'),
        (STATUS_COMPLETED, 'Завершено'),
        (STATUS_CANCELLED, 'Отменено'),
    ]
    
    title = models.CharField("Название мероприятия", max_length=255)
    slug = models.SlugField("URL", max_length=255, unique=True)
    event_date = models.DateTimeField("Дата и время мероприятия")
    location = models.CharField("Место проведения", max_length=500, null=True, blank=True)
    icon = models.ImageField("Иконка", upload_to='events/', null=True, blank=True)
    status = models.CharField(
        "Статус", 
        max_length=20, 
        choices=STATUS_CHOICES, 
        default=STATUS_DRAFT
    )
    description = models.TextField("Описание", null=True, blank=True)
    is_active = models.BooleanField("Активно", default=True)
    created_at = models.DateTimeField("Создано", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Мероприятие"
        verbose_name_plural = "Мероприятия"
        ordering = ['-event_date']

    @property
    def is_upcoming(self):
        """Проверяет, является ли мероприятие предстоящим"""
        return self.status == self.STATUS_UPCOMING

    @property
    def is_completed(self):
        """Проверяет, завершено ли мероприятие"""
        return self.status == self.STATUS_COMPLETED

    def get_icon_class(self):
        """Возвращает класс иконки Bootstrap Icons на основе названия события"""
        title_lower = self.title.lower()

        if 'хакатон' in title_lower or 'hack' in title_lower:
            return 'code-slash'
        elif 'встреча' in title_lower or 'конференция' in title_lower:
            return 'mic'
        elif 'воркшоп' in title_lower or 'мастер-класс' in title_lower:
            return 'palette'
        elif 'квиз' in title_lower:
            return 'question-circle'
        elif 'мероприятие' in title_lower:
            return 'calendar-event'
        else:
            return 'calendar-check'  # Дефолтная иконка

    def get_formatted_date(self):
        """Возвращает отформатированную дату события"""
        from django.utils import formats
        return formats.date_format(self.event_date, "j E, H:i")

# 4. Таблица-связка для "Активностей на Главной"
class MainPageActivity(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        verbose_name="Мероприятие"
    )
    sort_order = models.IntegerField("Сортировка на главной", default=100)
    is_active = models.BooleanField("Показывать на главной", default=True)
    created_at = models.DateTimeField("Создано", auto_now_add=True)

    def __str__(self):
        return f"Активность: {self.event.title}"

    class Meta:
        verbose_name = "Активность на главной"
        verbose_name_plural = "Активности на главной"
        ordering = ['sort_order']

# 5. Таблица для "Команды на Главной"
class GalleryItem(models.Model):
    title = models.CharField("Заголовок", max_length=255) # Например: Хакатон "Цифровой Прорыв"
    image = models.ImageField("Фото", upload_to='gallery/')
    year = models.CharField("Год", max_length=10, default="2024") # CharField, чтобы можно было написать "2023-2024"
    
    # Ссылка и текст кнопки
    link_url = models.URLField("Ссылка (куда ведет)", blank=True, null=True) # Например: https://vk.com/post123
    link_text = models.CharField("Текст на кнопке", max_length=50, default="Подробнее") # Например: "Смотреть отчет"
    
    sort_order = models.IntegerField("Сортировка", default=100)
    is_active = models.BooleanField("Активно", default=True)
    created_at = models.DateTimeField("Создано", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Фото в галерее"
        verbose_name_plural = "Галерея на главной"
        ordering = ['sort_order']

# 6. Таблица для "Контактов"
class Contact(models.Model):
    description = models.TextField("Описание", null=True, blank=True)
    map_embed = models.TextField("Код карты", null=True, blank=True)
    email = models.EmailField("Email", max_length=255)
    phone = models.CharField("Телефон", max_length=255)
    social_links = models.JSONField("Социальные сети", default=dict, blank=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    # Маппинг социальных сетей на иконки и названия
    SOCIAL_NETWORKS_MAP = {
        'vk': {'name': 'VK', 'icon': 'vk.png'},
        'telegram': {'name': 'Telegram', 'icon': 'telegram.png'},
        'whatsapp': {'name': 'WhatsApp', 'icon': 'whatsapp.png'},
        'max': {'name': 'Max', 'icon': 'max.png'},
        'mail': {'name': 'Gmail', 'icon': 'mail.png'},
    }



    def get_social_links_display(self):
        """
        Возвращает список социальных сетей с метаданными для отображения
        """
        result = []
        for key, url in self.social_links.items():
            if url:  # Проверяем, что URL не пустой
                social_info = self.SOCIAL_NETWORKS_MAP.get(key.lower(), {
                    'name': key.capitalize(),
                    'icon': 'default.png'  # fallback иконка
                })
                result.append({
                    'key': key,
                    'url': url,
                    'name': social_info['name'],
                    'icon': social_info['icon']
                })
        return result

    def __str__(self):
        return "Контактная информация"

    class Meta:
        verbose_name = "Контакт"
        verbose_name_plural = "Контакты"

# 7. Таблица для "Футера"
class FooterContent(models.Model):
    copyright_text = models.TextField("Авторские права", null=True, blank=True)
    additional = models.TextField("Дополнительная информация", null=True, blank=True)
    quick_links = models.JSONField("Быстрые ссылки", default=dict, blank=True)
    version = models.CharField("Версия", max_length=50, default="1.0")
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    def __str__(self):
        return f"Футер v{self.version}"

    class Meta:
        verbose_name = "Содержание футера"
        verbose_name_plural = "Содержание футера"
