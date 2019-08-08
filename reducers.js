export default (state = [], action) => {
    switch (action.type) {
        case 'BLADES_FETCH_SUCCESS':
            return action.blades
        case 'ADD_BLADE_SUCCESS':
            return state.concate(action.blade)
        default:
                return state;
    }
    
}