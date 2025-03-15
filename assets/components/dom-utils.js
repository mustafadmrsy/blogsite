/**
 * DOM Utility Functions - Senirkent Blog
 * Her fonksiyon �neki: snk_dom_ (kod �ak��malar�n� �nlemek i�in)
 */

/**
 * DOM eleman�n� ID'ye g�re se�er
 * @param {string} id - Element ID'si
 * @returns {HTMLElement|null} - Se�ilen element veya null
 */
function snk_dom_getById(id) {
    return document.getElementById(id);
}

/**
 * DOM eleman�n� se�icide g�re se�er
 * @param {string} selector - CSS se�icisi
 * @returns {HTMLElement|null} - Se�ilen element veya null
 */
function snk_dom_getElement(selector) {
    return document.querySelector(selector);
}

/**
 * DOM elemanlar�n� se�icide g�re se�er
 * @param {string} selector - CSS se�icisi
 * @returns {NodeList} - Se�ilen elementler
 */
function snk_dom_getAllElements(selector) {
    return document.querySelectorAll(selector);
}

/**
 * DOM eleman�na olay dinleyici ekler
 * @param {HTMLElement} element - Olay eklenecek element
 * @param {string} eventType - Olay tipi (click, mouseover, vb.)
 * @param {Function} callback - Olay ger�ekle�ti�inde �al��acak fonksiyon
 */
function snk_dom_addEvent(element, eventType, callback) {
    if (element) {
        element.addEventListener(eventType, callback);
    } else {
        console.error('Element bulunamad�:', element);
    }
}

/**
 * DOM eleman�n� olu�turur
 * @param {string} tagName - Element tag ad� (div, span, vb.)
 * @param {Object} attributes - Element �zellikleri (class, id, vb.)
 * @param {string|Node} content - Element i�eri�i (metin veya ba�ka bir Node)
 * @returns {HTMLElement} - Olu�turulan element
 */
function snk_dom_createElement(tagName, attributes = {}, content = '') {
    const element = document.createElement(tagName);

    // �zellikleri ekle
    Object.keys(attributes).forEach(key => {
        element.setAttribute(key, attributes[key]);
    });

    // ��erik ekle
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
 * HTML dizesini DOM elementine d�n��t�r�r
 * @param {string} htmlString - HTML dizesi
 * @returns {DocumentFragment} - D�n��t�r�len DOM fragman�
 */
function snk_dom_parseHTML(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content;
}

/**
 * Elementin s�n�f�n� de�i�tirir
 * @param {HTMLElement} element - Hedef element
 * @param {string} className - Eklenecek/��kar�lacak s�n�f ad�
 * @param {boolean} add - Eklemek i�in true, ��karmak i�in false
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
 * Elementi gizler veya g�sterir
 * @param {HTMLElement} element - Hedef element
 * @param {boolean} show - G�stermek i�in true, gizlemek i�in false
 */
function snk_dom_toggleVisibility(element, show) {
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
}

/**
 * Elementi belirtilen i�erikle g�nceller
 * @param {HTMLElement} element - Hedef element
 * @param {string|Node} content - Yeni i�erik
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

console.log('DOM Utilities y�klendi');
