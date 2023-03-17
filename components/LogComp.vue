<template>
    <form onsubmit="return false;" class="log">
        <input v-model="login" type="text" placeholder="Login" />
        <input v-model="pwd" type="text" placeholder="Password" />
        <button type="submit" @click="sendUser()">Send</button>
    </form>
</template>
<script setup lang="ts">

let login = ref('')
let pwd = ref('')
const dburl = 'https://blog.lfazliev.com'
// const dburl = 'http://localhost:3002'
// props: ['isAdmin'],
const sendUser = async () => {
    const data = new FormData();
    data.append("login", login.value.toLocaleLowerCase());
    data.append("pwd", pwd.value);
    const response = await $fetch(`${dburl}/login`, {
        method: "POST",
        body: data,
    });
    const result = await response.text()
    if (result == 'true') {
        localStorage.setItem('token', response.headers.get('Authorization'))
        const emit = defineEmits(['changeIsAdmin'])
        emit('changeIsAdmin', true)
    }
    else {
        console.log("wrong login or password");
    }
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