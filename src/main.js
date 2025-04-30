import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'


const vuetify = createVuetify({
    components,
    directives,
})

async function initializeApp() {
    try {
        const app = createApp(App)

        app.use(createPinia())
        app.use(router)
        app.use(vuetify);

        app.mount('#app')
    } catch (error) {
        console.error("Error initializing user:", error);
    }
}

initializeApp().then(() => {
    console.log("App initialized successfully");
}).catch((error) => {
    console.error("Error during app initialization:", error);
});
