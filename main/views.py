from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import json
from .models import (
    Direction, MainPageDirection,
    Event, MainPageActivity,
    GalleryItem, Contact, FooterContent,
)

def index(request):
    """Главная страница"""
    # Направления на главной
    main_directions = MainPageDirection.objects.filter(
        is_active=True
    ).select_related('direction').order_by('sort_order')
    
    # Активности на главной
    main_activities = MainPageActivity.objects.filter(
        is_active=True
    ).select_related('event').order_by('sort_order')
    
    # Галерея на главной
    gallery_items = GalleryItem.objects.filter(
        is_active=True
    ).order_by('sort_order')
    
    # Контакты и футер
    contacts_info = Contact.objects.first()
    footer_content = FooterContent.objects.first()

    context = {
        'main_directions': main_directions,
        'main_activities': main_activities,
        'gallery_items': gallery_items,
        'contacts_info': contacts_info,
        'footer_content': footer_content,
    }
    
    return render(request, 'index.html', context)

def VR_tour(request):
    contacts_info = Contact.objects.first()
    footer_content = FooterContent.objects.first()
    
    context = {
        'contacts_info': contacts_info,
        'footer_content': footer_content,
    }
    return render(request, 'VR-tour.html', context)
    
def event(request):
    """Страница со списком мероприятий с пагинацией"""
    # Все активные мероприятия, отсортированные по дате
    now = timezone.now()

    # Получаем все события для календаря (без пагинации)
    all_events = Event.objects.filter(is_active=True).order_by('event_date')

    # Разделяем на предстоящие и прошедшие для пагинации
    upcoming_events_queryset = Event.objects.filter(
        is_active=True,
        event_date__gte=now
    ).order_by('event_date')

    past_events_queryset = Event.objects.filter(
        is_active=True,
        event_date__lt=now
    ).order_by('-event_date')  # Сортируем прошедшие от новых к старым

    # Пагинация для предстоящих событий
    upcoming_page = request.GET.get('upcoming_page', 1)
    upcoming_paginator = Paginator(upcoming_events_queryset, 9)  # 9 событий на страницу

    try:
        upcoming_events = upcoming_paginator.page(upcoming_page)
    except PageNotAnInteger:
        upcoming_events = upcoming_paginator.page(1)
    except EmptyPage:
        upcoming_events = upcoming_paginator.page(upcoming_paginator.num_pages)

    # Пагинация для прошедших событий
    past_page = request.GET.get('past_page', 1)
    past_paginator = Paginator(past_events_queryset, 9)  # 9 событий на страницу

    try:
        past_events = past_paginator.page(past_page)
    except PageNotAnInteger:
        past_events = past_paginator.page(1)
    except EmptyPage:
        past_events = past_paginator.page(past_paginator.num_pages)

    # Сериализуем события для календаря (все события)
    events_for_calendar = []
    for e in all_events:
        # Определяем иконку на основе названия или используем дефолтную
        icon = e.get_icon_class()

        events_for_calendar.append({
            'id': e.id,
            'title': e.title,
            'date': e.event_date.isoformat(),
            'location': e.location or '',
            'description': e.description or '',
            'icon': icon,
            'slug': e.slug,
        })

    events_json = json.dumps(events_for_calendar, ensure_ascii=False)

    contacts_info = Contact.objects.first()
    footer_content = FooterContent.objects.first()

    context = {
        'upcoming_events': upcoming_events,
        'past_events': past_events,
        'events_json': events_json,
        'contacts_info': contacts_info,
        'footer_content': footer_content,
    }

    return render(request, 'events.html', context)

def event_full(request, slug):
    """Детальная страница мероприятия"""
    event = get_object_or_404(
        Event, 
        slug=slug, 
        is_active=True
    )
    
    contacts_info = Contact.objects.first()
    footer_content = FooterContent.objects.first()
    
    context = {
        'event': event,
        'contacts_info': contacts_info,
        'footer_content': footer_content,
    }
    
    return render(request, 'event_full.html', context)

def contacts(request):
    """Страница контактов"""
    contacts_info = Contact.objects.first()
    footer_content = FooterContent.objects.first()
    
    context = {
        'contacts_info': contacts_info,
        'footer_content': footer_content,
    }
    
    return render(request, 'contacts.html', context)

def directions_view(request):
    """Страница со списком всех направлений"""
    directions_qs = Direction.objects.filter(
        is_active=True
    ).order_by('sort_order')
    
    for direction in directions_qs:
        if direction.full_text:
            direction.full_text_list = [line for line in direction.full_text.split('\n') if line.strip()]
        else:
            direction.full_text_list = []
            
    contacts_info = Contact.objects.first()
    footer_content = FooterContent.objects.first()
    
    context = {
        'directions': directions_qs,
        'contacts_info': contacts_info,
        'footer_content': footer_content,
    }
    
    return render(request, 'directions.html', context)

def direction_detail(request, slug):
    """Детальная страница направления"""
    direction = get_object_or_404(
        Direction, 
        slug=slug, 
        is_active=True
    )
    
    contacts_info = Contact.objects.first()
    footer_content = FooterContent.objects.first()
    
    context = {
        'direction': direction,
        'contacts_info': contacts_info,
        'footer_content': footer_content,
    }
    
    return render(request, 'direction_detail.html', context)

def gallery_page(request):
    """Блок галереи"""
    gallery_items = GalleryItem.objects.filter(
        is_active=True
    ).order_by('sort_order')

    contacts_info = Contact.objects.first()
    footer_content = FooterContent.objects.first()

    context = {
        'gallery_items': gallery_items,
        'contacts_info': contacts_info,
        'footer_content': footer_content,
    }

    return render(request, 'gallery.html', context)

def contacts_social_partial(request):
    """Partial view для динамической подгрузки социальных сетей"""
    contacts_info = Contact.objects.first()
    return render(request, 'components/partials/social_links.html', {
        'contacts_info': contacts_info,
    })
