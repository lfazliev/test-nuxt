<template>
    <div class="admin">
        <button @click="logout()">Log out</button>
        <input v-model="title" type="text" placeholder="Header" />
        <button @click="fileName = ''; file = null; src = '' " v-if="file">Delete an image</button>
        <input v-model="url" type="url" placeholder="Link for ex 'lfazlev.com'" />
        <div>
            <input type="file" id="file1" accept="image/*" @change="previewFiles" class="filest" />
            <label class="filecont" for="file1">
                <span>{{ (fileName) ? fileName : 'Choose file' }}</span>
                <div>Browse</div>
            </label>
        </div>
        <textarea v-model="text" placeholder="Text"></textarea>
        <button @click="addPost">Add a post</button>
    </div>
</template>
<script setup>
import nuxtStorage from 'nuxt-storage';
import { usePostsStore } from "../stores/posts";
import { useAuthStore } from "../stores/auth";
const postsStore = usePostsStore()
const authStore = useAuthStore()
// const dburl = 'https://blog.lfazliev.com'
const dburl = 'http://localhost:3000'
const date = ref(new Date().toLocaleDateString())
let title = ref("")
let text = ref("")
let url = ref("")
let src = ref("")
let file = ref()
let fileName = ref("")
const logout = () => {
    nuxtStorage.localStorage.removeItem('token')
    authStore.isAuth = false
}
const previewFiles = (event) => {
    const allowedTypes = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg']
    const filee = event.target.files[0]
    if (allowedTypes.includes(filee.type)) {
        const fileExtension = filee.name.split('.').pop();
        const editFile = new File([filee], `${new Date().getTime()}.${fileExtension}`, { type: filee.type })
        file.value = editFile;
        fileName.value = filee.name;
        src.value = editFile.name;
    }
}
const addPost = async () => {
    if (title.value != '' && text.value != '') {
        const data = new FormData();
        if (file.value) {
            data.append("file", file.value);
        }
        data.append("title", title.value);
        data.append("text", text.value);
        data.append("url", url.value);
        data.append('date', date.value)
        const token = nuxtStorage.localStorage.getData('token');
        const { data: result } = await useFetch(`${dburl}/api/posts`, {
            method: "POST",
            headers: {
                "Authorization": token
            },
            body: data,
        });
        if (result.value != 'false') {
            postsStore.createPost(title.value, date.value, text.value, url.value, src.value, result.value.result.insertedId)
            title.value = "";
            text.value = "";
            url.value = "";
            file.value = null;
            fileName.value = "Choose file";
        }
        else {
            authStore.isAuth = false
        }
    }
}

</script>



<style lang = 'scss'>
.admin {

    >div,
    input,
    button,
    textarea {
        margin: 7px;
    }

    >div {
        background-color: #ffffff;
        border-radius: 9px;
        box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.2);
    }

    margin: 0 auto;
    padding: 10px;
    display: flex;
    width: 80vw;
    flex-direction: column;
}
</style>