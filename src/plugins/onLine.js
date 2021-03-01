import {store} from '../store/store'
window.addEventListener('online', () => {
    fetch('https://google.com')
        .then(response => {
            store.commit('onLine', response.ok)
        }).catch(() => {
        store.commit('onLine', true)
    })
}, false)

window.addEventListener('offline', () => {
    fetch('https://google.com')
        .then(response => {
            store.commit('onLine', response.ok)
        }).catch(() => {
        store.commit('onLine', true)
    })
}, false)