<template>
  <div class="app">
    <header class="header">
      <span class="title">Photo Editor</span>
      <EditorNavbar :data="data" @change="change" />
    </header>
    <main class="main">
      <Editor v-if="data.loaded" ref="editor" :data="data" />
      <Loader v-else ref="loader" :data="data" />
    </main>
  </div>
</template>

<script>
import Editor from '@/components/Editor.vue';
import EditorNavbar from '@/components/EditorNavbar.vue';
import Loader from '@/components/Loader.vue';

export default {
  name: 'PhotoEditorApp',

  components: {
    EditorNavbar,
    Loader,
    Editor,
  },

  data() {
    return {
      data: {
        cropped: false,
        cropping: false,
        loaded: false,
        name: '',
        previousUrl: '',
        type: '',
        url: '',
      },
    };
  },

  methods: {
    change(action) {
      const editor = this.$refs.editor;

      switch (action) {
        case 'crop':
          editor.crop();
          break;

        case 'clear':
          editor.clear();
          break;

        case 'restore':
          editor.restore();
          break;

        case 'remove':
          editor.reset();
          break;

        default:
          console.warn(`Unknown action: ${action}`);
      }
    },
  },
};
</script>

<style scoped>
.app {
  bottom: 0;
  left: 0;
  position: absolute;
  top: 0;
  right: 0;
}

.header {
  background-color: #666;
  height: 3rem;
  overflow: hidden;
  padding-left: 1rem;
  padding-right: 1rem;
  position: relative;
  z-index: 1;
}

@media (min-width: 768px) {
  .header {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

.title {
  color: #fff;
  display: block;
  float: left;
  font-size: 1.125rem;
  line-height: 3rem;
}

.main {
  background-color: #333;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 3rem;
}
</style>
