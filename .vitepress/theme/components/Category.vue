<template>
    <div class="tags">
        <span 
            @click="toggleCategory(String(key))" 
            v-for="(_, key) in data" 
            :key="key"
            :class="['tag', { active: selectCategory === key }]"
        >
            {{ key }} <sup>{{ data[key].length }}</sup>
        </span>
    </div>

    <template v-if="selectCategory">
      <div class="tag-header"># {{ selectCategory }}</div>
      <a
          :href="withBase(article.regularPath)"
          v-for="(article, index) in data[selectCategory]"
          :key="index"
          class="posts"
      >
          <div class="post-container">
              <div class="post-dot"></div>
              {{ article.frontMatter.title }}
          </div>
          <div class="date">{{ article.frontMatter.date }}</div>
      </a>
    </template>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useData, withBase } from 'vitepress'
import { initCategory } from '../functions'

const { theme } = useData()
const data = computed(() => initCategory(theme.value.posts || []))
const selectCategory = ref('')

const toggleCategory = (category: string) => {
    if (selectCategory.value === category) {
        selectCategory.value = ''
    } else {
        selectCategory.value = category
    }
}

onMounted(() => {
    const params = new URLSearchParams(window.location.search)
    const categoryFromUrl = params.get('name') 

    if (categoryFromUrl) {
        selectCategory.value = categoryFromUrl
    } else if (Object.keys(data.value).length > 0) {
        selectCategory.value = Object.keys(data.value)[0]
    }
})
</script>

<style scoped>

.tags { 
    margin-top: 14px; 
    display: flex; 
    flex-wrap: wrap; 
}
.tag { 
    padding: 0 16px; 
    margin: 6px 8px; 
    font-size: 0.875rem; 
    line-height: 28px; 
    background-color: var(--vp-c-bg-alt); 
    transition: 0.4s; 
    border-radius: 4px; 
    color: var(--vp-c-text-1); 
    cursor: pointer; 
}
.tag sup { 
    color: var(--vp-c-brand); 
    font-weight: bold; 
}
.tag-header { 
    padding: 28px 0 10px 0; 
    font-size: 1.375rem; 
    font-weight: 600; 
    color: var(--bt-theme-title); 
}
.posts { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    padding: 10px 0; 
    border-bottom: 1px dashed var(--vp-c-divider); 
    color: var(--vp-c-text-1); 
    text-decoration: none; 
    transition: color 0.25s; 
}
.posts:hover { 
    color: var(--vp-c-brand); 
}
.post-container { 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
}
.post-dot { 
    width: 6px; 
    height: 6px; 
    background-color: var(--vp-c-text-3); 
    border-radius: 50%; 
    transition: background-color 0.25s; 
}
.posts:hover .post-dot { 
    background-color: var(--vp-c-brand); 
}
.date { 
    color: var(--vp-c-text-2); 
    font-size: 0.875rem; 
}
</style>