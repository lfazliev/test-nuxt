
import { defineStore } from 'pinia'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: []
  }),
  getters: {
    findpost: (state) => { return (_id) => state.posts.at(state.posts.findIndex((n) => n._id == _id)) }
  },
  actions: {
    delel(_id) {
      this.posts.splice(this.posts.findIndex((n) => n._id == _id), 1);
    },
    createPost(title, date, text, url, src, _id) {
      this.posts.push({ title: title, date: date, text: text, url: url, src: src, _id: _id })
    }
  }
});

