<template>
  <main>
    <HeaderComp></HeaderComp>
    <div class=visibl>
      <div v-if="authStore.isAuth">
        <AdminComp></AdminComp>
      </div>
      <div v-else class=logcont>
        <LogComp v-if="showlogin"></LogComp>
        <button @click="showlogin = !showlogin">{{ (showlogin == true) ? 'Hide login' : 'Login' }}</button>
      </div>
      <div class="postline">
        <div v-for="p of postsStore.posts" :key="p._id" class="post">
          <h1 v-if="editId != p._id">{{ p.title }}</h1>
          <input v-else type="text" placeholder="Header" v-model="titledit" style="margin-top: 10px" />
          <p class=postdate>{{ p.date }}</p>
          <p v-if="editId != p._id">
            {{ p.text }}
          </p>
          <textarea v-else placeholder="Text" v-model="textedit"></textarea>
          <div class="imgConteiner" v-if="Boolean(p.src)">
            <nuxt-picture :src="'/' + p.src" />
          </div>
          <div v-if="editId != p._id" style="display: flex; justify-content: space-between;">
            <a class=btnpost :href="'https://' + p.url"><button v-if="Boolean(p.url)"> Сlick link</button></a>
            <div v-if="authStore.isAuth">
              <button class="btnact" @click="delPost(p)">
                <img src="./assets/img/trashimg.svg" />
              </button>
              <button class="btnact" @click="editPost(p._id)">
                <img src="./assets/img/edit-svgrepo-com.svg" />
              </button>
            </div>
          </div>
          <div v-if="editId == p._id" class="res">
            <button @click="fileEditName = ''; fileEdit = null; editSrc = '';" v-if="Boolean(p.src)">Delete
              an image</button>
            <div>
              <input type="file" id="file2" accept="image/*" @change="previewEditFiles" class="filest" />
              <label class="filecont" for="file2">
                <span>{{ (fileEditName) ? fileEditName : "Choose file" }}</span>
                <div>Browse</div>
              </label>
            </div>
            <input type="url" placeholder="Link for ex 'lfazlev.com'" v-model="urledit" />
            <button @click="savePost(p._id)">Save post</button>
          </div>
        </div>
      </div>
    </div>
  </main>
  <FooterComp class=visibl></FooterComp>
</template>

<script setup>
import { usePostsStore } from "./stores/posts";
import { useAuthStore } from "./stores/auth";
const postsStore = usePostsStore()
const authStore = useAuthStore()
let showlogin = ref(false)
const dburl = 'https://blog.lfazliev.com'
// const dburl = 'http://localhost:3000'
let titledit = ref("")
let textedit = ref("")
let urledit = ref("")
let editId = ref("")
let fileEditName = ref("")
let editSrc = ref("")
let fileEdit = ref()
await useFetch(`${dburl}/api/posts`, {
  method: "GET",
  onResponse({ response }) {
    postsStore.posts = response._data.all
  }
});


onMounted(async () => {
  let token
  if (process.client) {
    token = localStorage.getItem('token')
  }
  await useFetch(`${dburl}/api/checkjwt`, {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Authorization": token,
    },
    method: "POST",
    onResponse({ response }) {
      if (response._data.auth) {
        authStore.isAuth = true
      }
    }
  });
})


const previewEditFiles = (event) => {
  const allowedTypes = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg']
  const file = event.target.files[0]
  if (allowedTypes.includes(file.type)) {
    const fileExtension = file.name.split('.').pop();
    const editFile = new File([file], `${new Date().getTime()}.${fileExtension}`, { type: file.type })
    fileEdit.value = editFile
    fileEditName.value = file.name;
    editSrc.value = editFile.name;
  }
}
const delPost = async (p) => {
  postsStore.delel(p._id)
  let token
  if (process.client) {
    token = localStorage.getItem('token')
  }
  const { data: result } = await useFetch(`${dburl}/api/posts`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Authorization": token,
    },
    body: { p },
  }
  );
  if (result.value == false) {
    authStore.isAuth = false
  }
}
const savePost = async (_id) => {
  if (titledit.value != '' && textedit.value != '') {
    let post = postsStore.findpost(_id);
    post.title = titledit.value
    post.text = textedit.value
    post.url = urledit.value
    const data = new FormData();
    data.append("src", post.src);
    if (fileEditName.value == '' && post.src) {
      data.append("file", 'delete');
      post.src = ''
    }
    else {
      data.append("file", (fileEdit.value) ? fileEdit.value : null);
    }
    data.append("title", post.title);
    data.append("text", post.text);
    data.append("data", new Date().toLocaleDateString());
    data.append("url", post.url);
    data.append("_id", post._id);
    editId.value = '';
    let token
    if (process.client) {
      token = localStorage.getItem('token')
    }
    const result = await fetch(`${dburl}/api/posts`, {
      headers: {
        "Authorization": token,
      },
      method: 'PUT',
      body: data,
    })
    const insertRes = await result.json()
    if (insertRes == 'false') {
      authStore.isAuth = false
    }
    if (fileEdit.value) {
      post.src = editSrc.value
    }
  }
  else {
    alert('Fill in the text and title fields')
  }
}
const editPost = async (_id) => {
  if (editId.value == '') {
    editId.value = _id;
    let post = postsStore.findpost(_id);
    titledit.value = post.title;
    textedit.value = post.text;
    urledit.value = post.url;
    fileEditName.value = post.src
  }
  else {
    alert('You havent finished editing another post')
  }
}
</script>

<style  lang = 'scss'>
.logcont {
  padding: 10px;
}

.imgConteiner {
  display: flex;

  justify-content: center;

  img {
    width: 100%;
    max-height: 50vh;
    object-fit: contain;
  }
}

.postdate {
  color: rgb(90, 90, 90);
  font-size: 15px !important;
}

.postline {
  width: 80vw;
  margin: 0 auto;
}

a:-webkit-any-link {
  color: black;
  text-decoration: none;
}

.post {
  box-shadow: 0px 8px 16px 10px rgba(0, 0, 0, 0.253);
  border-radius: 10px;
  background-color: aliceblue;
  padding: 3%;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;

  >input,
  >div,
  >button,
  p,
  textarea {
    margin: 5px 0;
  }

  >p,
  >h1 {
    overflow-wrap: break-word;

  }

  >p {
    font-size: 22px;
  }
}



.btnact {
  height: 28px;
  padding: 5px;
  margin: 5px;

  >img {
    width: 15px;
  }
}

.btnact:hover {
  background: #00000034;
}

.btnpost {
  width: 100%;
  height: 100%;

  >button {
    background-color: rgb(87, 192, 253);
    font-size: 20px;
    padding: 7px;
  }


}

.filecont>div {
  background-color: rgb(188, 188, 188);
  height: 100%;
  padding: 5px;
  border-radius: 0px 5px 5px 0px;
  transition: 300ms;
}

.filecont>span {
  padding: 5px;
  margin: auto 0;
}

.filecont>div:hover {
  background-color: rgb(202, 202, 202);
  transition: 300ms;
}

.filecont {
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  color: black;
}

input[type="file"] {
  display: none;
}

.res {
  >div {
    background-color: #ffffff;
    border-radius: 9px;
    box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.2);
  }

  >input,
  >div,
  >button {
    margin: 5px 0;
  }

  display: flex;
  flex-direction: column;
}

label:hover {
  cursor: pointer;
}

label span {
  padding: 5px;
  overflow: hidden;
  height: 20px
}
</style>
