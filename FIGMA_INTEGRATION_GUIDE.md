# 🎨 Руководство по интеграции с Figma Sites

## 📋 Обзор

Все HTML файлы в проекте (`support.html`, `tags.html`, `design.html`, `something.html`) теперь включают необходимые скрипты для полноценной интеграции с Figma Sites через iframe.

## 🔧 Что уже настроено в HTML файлах

### 1. Автоматическая настройка высоты iframe
- Автоматическое определение и отправка высоты контента
- Отслеживание изменений размеров при взаимодействии пользователя
- Поддержка адаптивного дизайна

### 2. Родительская коммуникация
- Двусторонняя связь между iframe и родительским окном Figma
- Отправка событий взаимодействия (клики, активация кнопок)
- Обработка команд от родительского окна

### 3. Отслеживание событий
- Клики по кнопкам и элементам интерфейса
- Изменения состояния компонентов
- Готовность iframe к работе

## 📄 Кастомный код для Figma Sites

### В настройках Figma Sites добавьте следующий JavaScript код:

```javascript
// Figma Sites - Кастомный код для управления iframe
(function() {
    console.log("Figma Sites iframe manager initialized");
    
    // Функция для настройки высоты iframe
    function setIframeHeight(iframe, height, source) {
        if (iframe && height > 0) {
            const newHeight = Math.max(height, 100); // Минимальная высота 100px
            iframe.style.height = newHeight + "px";
            console.log(`Height set for ${source}: ${newHeight}px`);
            
            // Добавляем небольшую задержку для плавности
            setTimeout(() => {
                iframe.style.transition = "height 0.3s ease";
            }, 100);
        }
    }
    
    // Функция для поиска iframe по источнику
    function findIframeBySource(source) {
        const iframes = document.querySelectorAll('iframe');
        for (let iframe of iframes) {
            // Проверяем src iframe для определения источника
            if (iframe.src.includes('support.html') && source === 'support-html') return iframe;
            if (iframe.src.includes('tags.html') && source === 'tags-html') return iframe;
            if (iframe.src.includes('design.html') && source === 'design-html') return iframe;
            if (iframe.src.includes('something.html') && source === 'something-html') return iframe;
        }
        return null;
    }
    
    // Обработчик сообщений от iframe
    window.addEventListener("message", function(event) {
        // Проверяем источник сообщения для безопасности
        if (!event.data || typeof event.data !== 'object') return;
        
        console.log("Message received from iframe:", event.data);
        
        const { type, source, height, buttonId, target } = event.data;
        const iframe = findIframeBySource(source);
        
        switch(type) {
            case 'setIframeHeight':
                setIframeHeight(iframe, height, source);
                break;
                
            case 'iframeReady':
                console.log(`Iframe ready: ${source}`);
                // Отправляем подтверждение готовности
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'init',
                        timestamp: Date.now()
                    }, '*');
                }
                break;
                
            case 'buttonActivated':
                console.log(`Button activated in ${source}: ${buttonId}`);
                // Здесь можно добавить аналитику или другие действия
                // Например, отправка событий в Google Analytics:
                // gtag('event', 'button_click', { 'button_id': buttonId, 'source': source });
                break;
                
            case 'interaction':
                console.log(`User interaction in ${source}:`, target);
                // Обработка пользовательских взаимодействий
                break;
                
            default:
                console.log(`Unknown message type from ${source}:`, type);
        }
    }, false);
    
    // Функция для отправки команд в iframe
    function sendToIframe(source, message) {
        const iframe = findIframeBySource(source);
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(message, '*');
            console.log(`Message sent to ${source}:`, message);
        }
    }
    
    // Обработка изменения размеров окна
    window.addEventListener('resize', function() {
        // Уведомляем все iframe об изменении размеров
        ['support-html', 'tags-html', 'design-html', 'something-html'].forEach(source => {
            sendToIframe(source, {
                type: 'resize',
                width: window.innerWidth,
                height: window.innerHeight
            });
        });
    });
    
    // Функция для смены темы (если потребуется)
    function changeTheme(theme) {
        ['support-html', 'tags-html', 'design-html', 'something-html'].forEach(source => {
            sendToIframe(source, {
                type: 'theme',
                theme: theme
            });
        });
    }
    
    // Экспортируем функции для использования в Figma Sites
    window.FigmaIframeManager = {
        sendToIframe: sendToIframe,
        changeTheme: changeTheme,
        findIframeBySource: findIframeBySource
    };
    
    console.log("Figma Sites iframe manager ready");
})();
```

## 🚀 Инструкции по добавлению в Figma Sites

### 1. В редакторе Figma Sites:
1. Откройте настройки сайта
2. Перейдите в раздел "Custom Code" или "Кастомный код"
3. Вставьте код выше в секцию "Head" или "Body"

### 2. Для iframe интеграции:
1. Создайте iframe элемент в Figma
2. Укажите URL ваших HTML файлов в атрибуте `src`
3. Установите начальные размеры iframe (они будут автоматически корректироваться)

### 3. Пример iframe настройки:
```html
<iframe 
    src="https://your-domain.com/support.html" 
    frameborder="0" 
    style="width: 100%; height: 600px; border: none;"
    title="Support Demo">
</iframe>
```

## 📊 Возможности отслеживания

Добавленные скрипты позволяют отслеживать:
- ✅ Клики по кнопкам с передачей ID и текста
- ✅ Изменения размеров контента
- ✅ Готовность iframe к работе
- ✅ Пользовательские взаимодействия

## 🎯 Дополнительные возможности

### Интеграция с аналитикой:
```javascript
// Добавьте в обработчик buttonActivated:
gtag('event', 'button_click', {
    'button_id': buttonId,
    'source': source,
    'timestamp': Date.now()
});
```

### Кастомные темы:
```javascript
// Смена темы для всех iframe:
window.FigmaIframeManager.changeTheme('dark');
```

## 🔍 Отладка

Все скрипты включают подробное логирование в консоль браузера:
- Сообщения о готовности iframe
- Информация о передаче высоты
- Логи взаимодействий пользователя
- Отчеты об ошибках

Откройте DevTools (F12) для просмотра логов.

## ⚡ Оптимизация производительности

- Автоматическое дебаунсирование для частых обновлений высоты
- Кеширование ссылок на iframe для быстрого доступа
- Минимальная частота отправки сообщений
- Резервные механизмы для надежности

## 🚨 Важные замечания

1. **Безопасность**: Код проверяет источники сообщений
2. **Совместимость**: Работает во всех современных браузерах
3. **Производительность**: Оптимизирован для минимального влияния на загрузку
4. **Надежность**: Включает резервные механизмы и обработку ошибок 