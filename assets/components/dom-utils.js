/**
 * DOM Utility Functions - Senirkent Blog
 * Her fonksiyon öneki: snk_dom_ (kod çakýþmalarýný önlemek için)
 */

/**
 * DOM elemanýný ID'ye göre seçer
 * @param {string} id - Element ID'si
 * @returns {HTMLElement|null} - Seçilen element veya null
 */
function snk_dom_getById(id) {
    return document.getElementById(id);
}

/**
 * DOM elemanýný seçicide göre seçer
 * @param {string} selector - CSS seçicisi
 * @returns {HTMLElement|null} - Seçilen element veya null
 */
function snk_dom_getElement(selector) {
    return document.querySelector(selector);
}

/**
 * DOM elemanlarýný seçicide göre seçer
 * @param {string} selector - CSS seçicisi
 * @returns {NodeList} - Seçilen elementler
 */
function snk_dom_getAllElements(selector) {
    return document.querySelectorAll(selector);
}

/**
 * DOM elemanýna olay dinleyici ekler
 * @param {HTMLElement} element - Olay eklenecek element
 * @param {string} eventType - Olay tipi (click, mouseover, vb.)
 * @param {Function} callback - Olay gerçekleþtiðinde çalýþacak fonksiyon
 */
function snk_dom_addEvent(element, eventType, callback) {
    if (element) {
        element.addEventListener(eventType, callback);
    } else {
        console.error('Element bulunamadý:', element);
    }
}

/**
 * DOM elemanýný oluþturur
 * @param {string} tagName - Element tag adý (div, span, vb.)
 * @param {Object} attributes - Element özellikleri (class, id, vb.)
 * @param {string|Node} content - Element içeriði (metin veya baþka bir Node)
 * @returns {HTMLElement} - Oluþturulan element
 */
function snk_dom_createElement(tagName, attributes = {}, content = '') {
    const element = document.createElement(tagName);

    // Özellikleri ekle
    Object.keys(attributes).forEach(key => {
        element.setAttribute(key, attributes[key]);
    });

    // Ýçerik ekle
    if (content) {
        if (typeof content === 'string') {
            element.textContent = content;
        } else {
            element.appendChild(content);
        }
    }

    return element;
}

/**
 * HTML dizesini DOM elementine dönüþtürür
 * @param {string} htmlString - HTML dizesi
 * @returns {DocumentFragment} - Dönüþtürülen DOM fragmaný
 */
function snk_dom_parseHTML(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content;
}

/**
 * Elementin sýnýfýný deðiþtirir
 * @param {HTMLElement} element - Hedef element
 * @param {string} className - Eklenecek/çýkarýlacak sýnýf adý
 * @param {boolean} add - Eklemek için true, çýkarmak için false
 */
function snk_dom_toggleClass(element, className, add) {
    if (element) {
        if (add === undefined) {
            element.classList.toggle(className);
        } else if (add) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    }
}

/**
 * Elementi gizler veya gösterir
 * @param {HTMLElement} element - Hedef element
 * @param {boolean} show - Göstermek için true, gizlemek için false
 */
function snk_dom_toggleVisibility(element, show) {
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
}

/**
 * Elementi belirtilen içerikle günceller
 * @param {HTMLElement} element - Hedef element
 * @param {string|Node} content - Yeni içerik
 */
function snk_dom_updateContent(element, content) {
    if (element) {
        if (typeof content === 'string') {
            element.innerHTML = content;
        } else {
            element.innerHTML = '';
            element.appendChild(content);
        }
    }
}

console.log('DOM Utilities yüklendi');
