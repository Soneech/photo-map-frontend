import router from "@/router";
import { defineStore } from "pinia";
import { useAuthElementsStore } from '@/stores/authElements';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => {
        return {
            email: localStorage.getItem('email') ? JSON.parse(localStorage.getItem('email')!) : null,
            name: localStorage.getItem('name') ? JSON.parse(localStorage.getItem('name')!) : null,
            token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')!) : null, 
            loginSuccessReturnUrl: '/',
            registrationSuccessReturnUrl: '/auth/login',
            fieldsErrors: {messages: []},
            loginErrors: {messages: []},
            loginStatus: 0,
            registrationStatus: 0
        }
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
            else {
                this.registrationStatus = 400;
                const data = await response.json();
                this.fieldsErrors = data;
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
                //const name = data.name;
                
                //this.name = name;
                this.email = email;
                this.token = token;
                
                //localStorage.setItem('name', JSON.stringify(name));
                localStorage.setItem('email', JSON.stringify(email));
                localStorage.setItem('token', JSON.stringify(token));

                useAuthElementsStore().loginAction();

                router.push(this.loginSuccessReturnUrl || '/');
            } else {
                this.loginStatus = 400;
                const data = await response.json();
                this.loginErrors = data;
            }
        },
        logout() {
            this.loginStatus = 0;
            this.registrationStatus = 0;

            //this.name = null;
            this.email = null;
            this.token = null;

            //localStorage.removeItem('name');
            localStorage.removeItem('email');
            localStorage.removeItem('token');

            useAuthElementsStore().logoutAction();

            router.push('/');
        }
    }
});