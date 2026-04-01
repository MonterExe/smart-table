import { createComparison, rules } from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // Заполняем select продавцов
    Object.keys(indexes).forEach(elementName => {
        const select = elements[elementName];
        if (!select) return;
        const options = Object.values(indexes[elementName]).map(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            return option;
        });
        select.append(...options);
    });

    // Настраиваем компаратор: пропускаем несуществующие и пустые поля,
    // а для диапазона total, подстрок и точного совпадения используем правила
    const compare = createComparison(
        ['skipNonExistentSourceFields', 'skipEmptyTargetValues'],
        [
            rules.arrayAsRange(),               // обрабатывает массив [from, to] для total
            rules.caseInsensitiveStringIncludes(), // для date и customer
            rules.exactEquality()               // для seller (точное совпадение)
        ]
    );

    return (data, state, action) => {
        // Очистка поля (если нажата кнопка clear)
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            if (field) {
                const wrapper = action.closest('.filter-wrapper');
                if (wrapper) {
                    const input = wrapper.querySelector('input');
                    if (input) input.value = '';
                }
                if (field === 'seller') {
                    const select = elements.searchBySeller;
                    if (select) select.value = '';
                }
            }
            return data;
        }

        // Формируем объект фильтрации из state, удаляя служебные поля
        const filterState = { ...state };
        delete filterState.page;
        delete filterState.rowsPerPage;
        delete filterState.search;
        delete filterState.sort;

        // Преобразуем totalFrom и totalTo в массив total
        const from = filterState.totalFrom !== '' ? parseFloat(filterState.totalFrom) : '';
        const to = filterState.totalTo !== '' ? parseFloat(filterState.totalTo) : '';
        if (from !== '' || to !== '') {
            filterState.total = [from, to];
        }
        delete filterState.totalFrom;
        delete filterState.totalTo;

        // Проверяем, есть ли активные фильтры
        const hasFilters = Object.values(filterState).some(v => v && v !== '');
        if (!hasFilters) return data;

        // Фильтруем данные
        return data.filter(row => compare(row, filterState));
    };
}