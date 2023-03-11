<template>
    <form onsubmit="return false;" class="log">
        <input v-model="login" type="text" placeholder="Login" />
        <input v-model="pwd" type="text" placeholder="Password" />
        <button type="submit" @click="sendUser()">Send</button>
    </form>
</template>
<script>
export default {
    data() {
        return {
            login: '',
            pwd: '',
            dburl: 'https://blog.lfazliev.com',
            // dburl: 'http://localhost:3002',
        }
    },
    props: ['isAdmin'],
    methods: {
        sendUser: async function () {
            const data = new FormData();
            data.append("login", this.login.toLocaleLowerCase());
            data.append("pwd", this.pwd);
            const response = await $fetch(`${this.dburl}/login`, {
                method: "POST",
                body: data,
            });
            const result = await response.text()
            if (result == 'true') {
                localStorage.setItem('token', response.headers.get('Authorization'))
                this.$emit('changeIsAdmin', true)
            }
            else {
                console.log("wrong login or password");
            }
        }
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