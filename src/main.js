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
        // Check if the user is logged in
        let userUUID = localStorage.getItem("user_uuid");
        // If userUUID is not found, generate a new one
        if (!userUUID) {
            userUUID = crypto.randomUUID();
            localStorage.setItem("user_uuid", userUUID);
            console.log("Generated new user_uuid:", userUUID);
        } else {
            console.log("Existing user_uuid found:", userUUID);
        }

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
