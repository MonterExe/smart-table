import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";
import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";
import { initTable } from "./components/table.js";
import { initSearching } from "./components/searching.js";
import { initFiltering } from "./components/filtering.js";
import { initSorting } from "./components/sorting.js";
import { initPagination } from "./components/pagination.js";

// Исходные данные используемые в render()
const { data, sellers, customers } = initData(sourceData);

// Переменные для модулей
let sampleTable;
let applyPagination;
let applySorting;
let applyFiltering;
let applySearching;

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    if (!sampleTable || !sampleTable.container) return {};
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);
    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState();
    let result = [...data];
    // Применяем модули в правильном порядке: поиск -> фильтрация -> сортировка -> пагинация
    if (applySearching) result = applySearching(result, state, action);
    if (applyFiltering) result = applyFiltering(result, state, action);
    if (applySorting) result = applySorting(result, state, action);
    if (applyPagination) result = applyPagination(result, state, action);
    sampleTable.render(result);
}

// Инициализация таблицы с выводом всех необходимых шаблонов
sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// Инициализация модуля пагинации
applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

// Инициализация модуля сортировки (кнопки из шаблона header)
applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Инициализация модуля фильтрации (элементы фильтров и индексы продавцов)
applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: sellers
});

// Инициализация модуля поиска (имя поля – 'search')
applySearching = initSearching('search');

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);
render();