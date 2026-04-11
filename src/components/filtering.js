export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            const select = elements[elementName];
            if (!select) return;
            select.innerHTML = ''; // clear existing options
            const options = Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            });
            select.append(...options);
        });
    };

    const applyFiltering = (query, state, action) => {
        // Clear filter action
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
            // Return same query – the UI will be re‑read in next collectState()
            return query;
        }

        // Build filter object from current input values
        const filter = {};
        Object.keys(elements).forEach(key => {
            const el = elements[key];
            if (el && (el.tagName === 'INPUT' || el.tagName === 'SELECT') && el.value) {
                filter[`filter[${el.name}]`] = el.value;
            }
        });

        // Special handling for total range inputs (they are not in `elements` but in the DOM)
        const totalFrom = document.querySelector('[data-name="totalFrom"]');
        const totalTo = document.querySelector('[data-name="totalTo"]');
        if (totalFrom && totalFrom.value) filter['filter[totalFrom]'] = totalFrom.value;
        if (totalTo && totalTo.value) filter['filter[totalTo]'] = totalTo.value;

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    return { updateIndexes, applyFiltering };
}