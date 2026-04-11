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

const API = initData(sourceData);

let sampleTable;
let applyPagination;
let updatePagination;
let applySorting;
let applyFiltering;
let updateIndexes;
let applySearching;

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

async function render(action) {
    let state = collectState();
    let query = {};

    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    const { total, items } = await API.getRecords(query);
    updatePagination(total, query);
    sampleTable.render(items);
}

sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

const pagination = initPagination(
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
applyPagination = pagination.applyPagination;
updatePagination = pagination.updatePagination;

applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const filtering = initFiltering(sampleTable.filter.elements);
applyFiltering = filtering.applyFiltering;
updateIndexes = filtering.updateIndexes;

applySearching = initSearching('search');

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
    const indexes = await API.getIndexes();
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
    render();
}

init();