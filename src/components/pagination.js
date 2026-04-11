import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();
    let pageCount;

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        if (action) {
            switch (action.name) {
                case 'first':
                    page = 1;
                    break;
                case 'prev':
                    page = Math.max(1, page - 1);
                    break;
                case 'next':
                    page = Math.min(pageCount, page + 1);
                    break;
                case 'last':
                    page = pageCount;
                    break;
                default:
                    if (action.name === 'page') {
                        page = parseInt(action.value);
                    }
                    break;
            }
        }

        return Object.assign({}, query, { limit, page });
    };

    const updatePagination = (total, { limit, page }) => {
        pageCount = Math.ceil(total / limit);
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));

        const start = (page - 1) * limit;
        const end = Math.min(start + limit, total);
        fromRow.textContent = total === 0 ? 0 : start + 1;
        toRow.textContent = end;
        totalRows.textContent = total;
    };

    return { applyPagination, updatePagination };
};