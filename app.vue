<script setup>
import HeaderC from './components/HeaderComp.vue'
import FooterC from './components/FooterComp.vue'
import Admin from './components/AdminComp.vue'
import Login from './components/LogComp.vue'
</script>
<template>
  <main>
    <HeaderC></HeaderC>
    <div class=visibl>
      <div v-if="isAdmin">
        <Admin :isAdmin="isAdmin" @changeIsAdmin="changeIsAdmin"></Admin>
      </div>
      <div v-else class=logcont>
        <Login v-if="showlogin" :isAdmin="isAdmin" @changeIsAdmin="changeIsAdmin"></Login>
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
            <img :src="dburl + '/assets/' + p.src" />
            <!-- <img :src="'http://localhost:5173/src/assets/' + p.src" /> -->
          </div>
          <div v-if="editId != p._id" style="display: flex; justify-content: space-between;">
            <a class=btnpost :href="'https://' + p.url"><button v-if="Boolean(p.url)"> Сlick link</button></a>
            <div v-if="isAdmin">
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
  <FooterC class=visibl></FooterC>
</template>

<script>

import { usePostsStore } from "./stores/posts";
import { mapStores } from "pinia";
export default {
  components: {
    Login,
    Admin
  },
  data() {
    return {
      showlogin: false,
      isAdmin: false,
      dburl: 'https://blog.lfazliev.com',
      // dburl: 'http://localhost:3002',
      titledit: "",
      textedit: "",
      urledit: "",
      editId: '',
      fileEditName: '',
      editSrc: "",
      fileEdit: null
    };
  },
  async beforeMount() {
    const data = await fetch(`${this.dburl}/posts`);
    const posts = await data.json();
    this.postsStore.posts = posts.all;
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.dburl}/checkjwt`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Authorization": token,
      },
      method: "POST",
    });
    const result = await response.text()
    if (result != 'false') {
      this.isAdmin = true
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.isAdmin = false
    },
    changeIsAdmin(newValue) {
      if (newValue == false) {
        localStorage.removeItem('token')
      }
      this.isAdmin = newValue
    },
    previewEditFiles(event) {
      const allowedTypes = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg']
      const file = event.target.files[0]
      if (allowedTypes.includes(file.type)) {
        const fileExtension = file.name.split('.').pop();
        const editFile = new File([file], `${new Date().getTime()}.${fileExtension}`, { type: file.type })
        this.fileEdit = editFile
        this.fileEditName = file.name;
        this.editSrc = editFile.name;
      }
    },
    delPost: async function (p) {
      this.postsStore.delel(p._id)
      const token = localStorage.getItem('token');
      const result = await fetch(`${this.dburl}/posts`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "Authorization": token,
        },
        body: JSON.stringify({ p }),
      });
      const insertRes = await result.json();
      if (insertRes == false) {
        this.isAdmin = false
      }
    },
    savePost: async function (_id) {
      if (this.titledit != '' && this.textedit != '') {
        let post = this.postsStore.findpost(_id);
        post.title = this.titledit
        post.text = this.textedit
        post.url = this.urledit
        const data = new FormData();
        data.append("src", post.src);
        if (this.fileEditName == '' && post.src) {
          data.append("file", 'delete');
          post.src = ''
        }
        else {
          data.append("file", (this.fileEdit) ? this.fileEdit : null);
        }
        data.append("title", post.title);
        data.append("text", post.text);
        data.append("data", new Date().toLocaleDateString());
        data.append("url", post.url);
        data.append("_id", post._id);
        this.editId = '';
        const token = localStorage.getItem('token');
        const result = await fetch(`${this.dburl}/posts`, {
          headers: {
            "Authorization": token,
          },
          method: 'PUT',
          body: data,
        })
        const insertRes = await result.json()
        if (insertRes == 'false') {
          this.isAdmin = false
        }
        if (this.fileEdit) {
          post.src = this.editSrc
        }
        this.fileEdit = null
      }
      else {
        alert('Fill in the text and title fields')
      }
    },
    editPost: async function (_id) {
      if (this.editId == '') {
        this.editId = _id;
        let post = this.postsStore.findpost(_id);
        this.titledit = post.title;
        this.textedit = post.text;
        this.urledit = post.url;
        this.fileEditName = post.src
      }
      else {
        alert('You havent finished editing another post')
      }
    },
  },
  computed: { ...mapStores(usePostsStore) },
};
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
