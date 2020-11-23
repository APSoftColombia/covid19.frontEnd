/* eslint-disable no-console */

import { register } from 'register-service-worker'
import { store } from './store/store'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB')
    },
    registered () {
      // localStorage.setItem('rF5',0)
      console.log('Service worker has been registered.')
      store.commit('assingRF5', 0)
      /* eslint-disable */
      let deferredPrompt
      window.addEventListener('beforeinstallprompt', (e) => {
        // Stash the event so it can be triggered later.
        deferredPrompt = e
        showInstallPromotion()
      });

      window.addEventListener('appinstalled', (evt) => {
        console.log('a2hs installed', evt);
      });
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      // localStorage.setItem('rF5',1)
      console.log('New content is available; please refresh.')
      store.commit('assingRF5', 1)
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
