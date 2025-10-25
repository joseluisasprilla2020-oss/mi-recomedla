<template>
  <div v-if="item">
    <h2>{{ item.title }}</h2>
    <p>{{ item.year }}</p>
    <pre>{{ item }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
export default {
  props: ['id'],
  setup(props) {
    const item = ref(null);
    onMounted(async () => {
      const url = (import.meta.env.VITE_API_URL || '') + '/api/media/' + props.id;
      const r = await axios.get(url);
      item.value = r.data;
    });
    return { item };
  }
}
</script>
