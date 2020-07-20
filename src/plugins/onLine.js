import {store} from '../store/store'
window.addEventListener('online', () => {
    fetch('https://sosaludaps.tk')
        .then(response => {
            store.commit('onLine', response.ok)
        }).catch(() => {
        store.commit('onLine', true)
    })
}, false)

window.addEventListener('offline', () => {
    fetch('https://sosaludaps.tk')
        .then(response => {
            store.commit('onLine', response.ok)
        }).catch(() => {
        store.commit('onLine', true)
    })
}, false)