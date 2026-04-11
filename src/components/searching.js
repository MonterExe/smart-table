export function initSearching(searchField) {
    return (query, state, action) => {
        const searchTerm = state[searchField];
        return searchTerm ? Object.assign({}, query, { search: searchTerm }) : query;
    };
}