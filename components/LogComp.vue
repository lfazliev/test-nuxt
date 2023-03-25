<template>
    <form onsubmit="return false;" class="log">
        <input v-model="login" type="text" placeholder="Login" />
        <input v-model="pwd" type="text" placeholder="Password" />
        <button type="submit" @click="sendUser()">Send</button>
    </form>
</template>
<script setup>
import nuxtStorage from 'nuxt-storage';
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore()
let login = ref('')
let pwd = ref('')
// const dburl = 'https://blog.lfazliev.com'
const dburl = 'http://localhost:3000'

const sendUser = async () => {
    const data = { 'login': login.value.toLocaleLowerCase(), "pwd": pwd.value }
    await useFetch(`${dburl}/api/login`, {
        method: "POST",
        body: data,
        onResponse({ response }) {
            if (response._data) {
                nuxtStorage.localStorage.setData('token', response.headers.get('Authorization'), 7, 'd');
                authStore.isAuth = true;
            } else {
                console.log("wrong login or password");
            }
        },
    })
}
</script>
<style lang = scss>
.log {
    @media screen and (max-width: 380px) {
        width: 80vw;
    }

    @media screen and (max-width: 700px) {
        width: 50vw;
    }

    width: 30vw;
    display: flex;
    flex-direction: column;

    >input,
    button {
        margin: 5px;
    }
}
</style>