<template>
    <div class="admin">
        <button @click="this.$emit('changeIsAdmin', false)">Log out</button>
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
<script>
import { usePostsStore } from "../stores/posts";
import { mapStores } from "pinia";
export default {
    data() {
        return {
            dburl: 'https://blog.lfazliev.com',
            // dburl: 'http://localhost:3002',
            date: new Date().toLocaleDateString(),
            title: "",
            text: "",
            url: "",
            src: "",
            file: null,
            fileName: "",
        };
    },
    props: ['isAdmin'],
    async beforeMount() {
        const data = await useFetch(`${this.dburl}/posts`);
        const posts = await data.json();
        this.postsStore.posts = posts.all;
    },
    methods: {
        previewFiles(event) {
            const allowedTypes = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg']
            const file = event.target.files[0]
            if (allowedTypes.includes(file.type)) {
                const fileExtension = file.name.split('.').pop();
                const editFile = new File([file], `${new Date().getTime()}.${fileExtension}`, { type: file.type })
                this.file = editFile;
                this.fileName = file.name;
                this.src = editFile.name;
            }
        },
        addPost: async function () {
            if (this.title != '' && this.text != '') {
                const data = new FormData();
                if (this.file) {
                    data.append("file", this.file);
                }
                else {
                    data.append("file", null);
                }
                data.append("title", this.title);
                data.append("text", this.text);
                data.append("url", this.url);
                data.append('date', this.date)
                const token = localStorage.getItem('token');
                const result = await $fetch(`${this.dburl}/posts`, {
                    method: "POST",
                    headers: {
                        "Authorization": token
                    },
                    body: data,
                });
                const insertRes = await result.json();
                if (insertRes != 'false') {
                    this.postsStore.createPost(this.title, this.date, this.text, this.url, this.src, insertRes.result.insertedId)
                    this.title = "";
                    this.text = "";
                    this.url = "";
                    this.file = null;
                    this.fileName = "Choose file";
                }
                else {
                    this.$emit('changeIsAdmin', false)
                }
            }
        },
    },
    computed: { ...mapStores(usePostsStore) },
};
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