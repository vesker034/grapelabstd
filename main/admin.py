from django.contrib import admin
from .models import (
    Direction, MainPageDirection, 
    Event, MainPageActivity, 
    GalleryItem, Contact, FooterContent 
)
# --- НАПРАВЛЕНИЯ ---
@admin.register(Direction)
class DirectionAdmin(admin.ModelAdmin):
    # Какие колонки показывать в списке
    list_display = ('title', 'slug', 'sort_order', 'is_active', 'created_at')
    # По каким полям можно искать
    search_fields = ('title', 'short_text')
    # Какие поля можно редактировать прямо из списка (очень удобно!)
    list_editable = ('sort_order', 'is_active')
    # Фильтр справа (по дате и активности)
    list_filter = ('is_active', 'created_at')
    # Автоматическое заполнение slug из названия (чтобы не писать вручную)
    prepopulated_fields = {'slug': ('title',)}

@admin.register(MainPageDirection)
class MainPageDirectionAdmin(admin.ModelAdmin):
    list_display = ('direction', 'sort_order', 'is_active')
    list_editable = ('sort_order', 'is_active')

# --- МЕРОПРИЯТИЯ ---
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_date', 'status', 'is_active')
    list_filter = ('status', 'event_date', 'is_active')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'event_date' # Появится навигация по датам сверху

@admin.register(MainPageActivity)
class MainPageActivityAdmin(admin.ModelAdmin):
    list_display = ('event', 'sort_order', 'is_active')
    list_editable = ('sort_order', 'is_active')

# --- КОМАНДА ---
@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'year', 'sort_order', 'is_active', 'link_url', 'updated_at')
    list_editable = ('sort_order', 'is_active', 'link_url')
    list_filter = ('is_active', 'year')
    search_fields = ('title',)

# --- КОНТАКТЫ И ФУТЕР ---
# Здесь всё просто, так как записей будет мало (всего по одной)
@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('email', 'phone', 'updated_at')

@admin.register(FooterContent)
class FooterContentAdmin(admin.ModelAdmin):
    list_display = ('version', 'updated_at')