import { defineStore } from "pinia";

export const useAuthElementsStore = defineStore ({
    id: 'authElements',

    actions: {
        logoutAction() {
            let logoutBtn = document.getElementById('logout-btn');
            logoutBtn.style.visibility = "hidden";

            let signInBtn = document.getElementById('sign-in-btn');
            signInBtn.style.visibility = "visible";

            let signUpBtn = document.getElementById('sign-up-btn');
            signUpBtn.style.visibility = "visible";
        },
        loginAction() {
            let logoutBtn = document.getElementById('logout-btn');
            logoutBtn.style.visibility = "visible";

            let signInBtn = document.getElementById('sign-in-btn');
            signInBtn.style.visibility = "hidden";

            let signUpBtn = document.getElementById('sign-up-btn');
            signUpBtn.style.visibility = "hidden";
        }
    }
});