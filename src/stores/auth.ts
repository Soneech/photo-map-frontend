import router from "@/router";
import { defineStore } from "pinia";
import { useAuthElementsStore } from '@/stores/authElements';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => {
        return {
            id: localStorage.getItem('id') ? JSON.parse(localStorage.getItem('id')!) : null,
            email: localStorage.getItem('email') ? JSON.parse(localStorage.getItem('email')!) : null,
            name: localStorage.getItem('name') ? JSON.parse(localStorage.getItem('name')!) : null,
            token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')!) : null,
            loginSuccessReturnUrl: '/',
            registrationSuccessReturnUrl: '/auth/login',
            errors: {},
            message: '',
            loginStatus: 0,
            registrationStatus: 0
        }
    },
    getters: {
        isLoggedIn: (state) => !!state.token
    },
    actions: {
        async registration(name: string, email: string, password: string) {
            const response = await fetch('http://localhost:8080/auth/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, email, password})
            });

            if (response.status == 201) {
                this.registrationStatus = 201;
                router.push(this.registrationSuccessReturnUrl || '/')
            }
            else if (response.status == 400) {
                this.registrationStatus = 400;
                const data = await response.json();
                this.errors = data.errors;
            }
            else {
                this.registrationStatus = 409;
                const data = await response.json();
                this.message = data.message;
            }
            
        },
        async login(email: string, password: string) {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            });

            if (response.status == 200) {
                this.loginStatus = 200;
                const data = await response.json();

                const token = data.token;
                const id = data.id;
                this.token = token;
                this.id = id;

                localStorage.setItem('token', JSON.stringify(token));
                localStorage.setItem('id', JSON.stringify(id));

                useAuthElementsStore().loginAction();
                router.push(this.loginSuccessReturnUrl || '/');
            } 
            else if (response.status == 400) {
                this.loginStatus = 400;
                const data = await response.json();
                this.errors = data.errors;
            } 
            else if (response.status == 401) {
                this.loginStatus = 401;
                const data = await response.json();
                this.message = data.message;
            }
        },
        logout() {
            this.loginStatus = 0;
            this.registrationStatus = 0;
            this.token = null;

            localStorage.removeItem('token');
            localStorage.removeItem('id');
            useAuthElementsStore().logoutAction();

            router.push('/');
        }
    }
});