import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    // Правила: пропускать пустые значения в целевом объекте и поиск по нескольким полям
    const comparison = createComparison(
        ['skipEmptyTargetValues'],
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
    );

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        const searchTerm = state[searchField] || '';
        if (!searchTerm) return data; // если строка поиска пуста, возвращаем все данные
        return data.filter(item => comparison(item, { [searchField]: searchTerm }));
    };
}