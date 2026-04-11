import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            field = action.dataset.field;
            order = sortMap[action.dataset.value];
            // Update button data-value and reset other sort buttons
            columns.forEach(btn => {
                if (btn === action) {
                    btn.dataset.value = order;
                } else {
                    btn.dataset.value = 'none';
                }
            });
        } else {
            // Find currently active sort button
            const activeBtn = columns.find(btn => btn.dataset.value !== 'none');
            if (activeBtn) {
                field = activeBtn.dataset.field;
                order = activeBtn.dataset.value;
            }
        }

        const sortParam = (field && order !== 'none') ? `${field}:${order}` : null;
        return sortParam ? Object.assign({}, query, { sort: sortParam }) : query;
    };
}