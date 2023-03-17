
import { defineStore } from 'pinia'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [] as any
  }),
  getters: {
    findpost: (state) => { return (_id: number) => state.posts.at(state.posts.findIndex((n: any) => n._id == _id)) }
  },
  actions: {
    delel(_id: number) {
      this.posts.splice(this.posts.findIndex((n: any) => n._id == _id), 1);
    },
    createPost(title: string, date: string, text: string, url: string, src: string, _id: number) {
      this.posts.push({ title, date, text, url, src, _id })
    }
  }
});

