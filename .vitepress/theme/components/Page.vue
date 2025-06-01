<template>
  <div :class="{ 'home-layout-container': pageCurrent === 1 }">
    <div class="content-area">
      <div v-for="article in posts" :key="article.regularPath" class="post-list">
        <a :href="withBase(article.regularPath)" v-if="article.frontMatter.cover">
          <img class="post-cover" :src="withBase(article.frontMatter.cover)" :alt="`${article.frontMatter.title} cover`"/>
        </a>
        <div class="post-header">
          <div class="post-title">
            {{ article.frontMatter.order > 0 ? '📌' : '' }}
            <a :href="withBase(article.regularPath)"> {{ article.frontMatter.title }}</a>
          </div>
        </div>
        <p class="describe" v-html="article.frontMatter.description"></p>
        <div class='post-info'>
          <span class="date">{{ article.frontMatter.date }}</span>
          <span v-for="item in article.frontMatter.tags" :key="item" class="tag">
            <a :href="withBase(`/pages/tags.html?name=${item}`)"> {{ item }}</a>
          </span>
        </div>
      </div>
      <div class="pagination" v-if="pagesNum > 1">
        <span v-for="(item, index) in pageArray" :key="index" :class="['link', { active: item === pageCurrent }]">
            <template v-if="item === '...'"> ... </template>
            <template v-else-if="item === pageCurrent"> {{ item }} </template>
            <template v-else>
              <a :href="withBase(item === 1 ? '/index.html' : `/page_${item}.html`)">{{ item }}</a>
            </template>
        </span>
      </div>
    </div>

    <aside v-if="pageCurrent === 1" class="sidebar-area">
        <div v-if="stats" class="sidebar-card">
          <div class="stats-container">
            <div class="stat-item">
              <span class="stat-title">Posts</span>
              <strong class="stat-value">{{ stats.total }}</strong>
            </div>
            
            <div class="stat-item">
              <span class="stat-title">This Week</span>
              <strong class="stat-value">{{ stats.thisWeek }}</strong>
            </div>
              <div class="stat-item">
              <span class="stat-title">This Month</span>
              <strong class="stat-value">{{ stats.thisMonth }}</strong>
            </div>
          </div>
        </div>
        <div v-if="categories && Object.keys(categories).length" class="sidebar-card">
          <h3 class="card-title">🗂️ Categories</h3>
          <ul class="term-list">
            <li v-for="(posts, name) in limitedCategories" :key="name">
              <a :href="withBase(`/pages/category.html?name=${encodeURIComponent(name)}`)"> 
                {{ name }} <span>{{ posts.length }}</span>
              </a>
            </li>
          </ul>
          <a v-if="Object.keys(categories).length > 10" class="more-link" :href="withBase('/pages/category.html')">
            View all categories...
          </a>
        </div>
        <div v-if="tags && Object.keys(tags).length" class="sidebar-card">
          <h3 class="card-title">🏷️ Tags</h3>
          <div class="tag-cloud">
            <a v-for="(_posts, name) in tags" :key="name" :href="withBase(`/pages/tags.html?name=${encodeURIComponent(name)}`)" class="tag-item">
              {{ name }}
            </a>
          </div>
        </div>
        <div v-if="friendLinks && friendLinks.length" class="sidebar-card">
          <h3 class="card-title">🔗 Links</h3>
          <ul class="friend-link-list">
            <li v-for="friend in limitedFriendLinks" :key="friend.link">
              <a :href="friend.link" target="_blank" rel="noopener noreferrer" class="friend-link-item">
                <span class="friend-name">{{ friend.name }}</span>
              </a>
            </li>
          </ul>
          <a v-if="friendLinks.length > 10" class="more-link" :href="withBase('/pages/links.html')">
            View all links...
          </a>
        </div>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { useData, withBase } from 'vitepress'
import { computed, PropType } from 'vue'
import { data as friendLinks } from '../data/links.data.ts'

// Define Props
const props = defineProps({
  posts: { type: Array as PropType<any[]>, required: true },
  pageCurrent: { type: Number, required: true },
  pagesNum: { type: Number, required: true }
})

// Get global data
const { themeConfig } = useData().site.value
const categories = themeConfig.categories || {}
const tags = themeConfig.tags || {}
const stats = themeConfig.stats || { total: 0, thisMonth: 0, thisWeek: 0 }

const limitedCategories = computed(() => {
  const entries = Object.entries(categories)
  if (entries.length <= 10) {
    return categories
  }
  return Object.fromEntries(entries.slice(0, 10))
})

const limitedFriendLinks = computed(() => {
  if (friendLinks.length <= 10) {
    return friendLinks
  }
  return friendLinks.slice(0, 10)
})

// Pagination logic
const pageArray = computed(() => {
    const totalPages = props.pagesNum;
    const currentPage = props.pageCurrent;
    const width = 2;
    if (totalPages <= 1) return [];
    const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
    const mainPages = new Set<number>();
    for (let i = -width; i <= width; i++) {
        const page = currentPage + i;
        if (page > 1 && page < totalPages) {
            mainPages.add(page);
        }
    }
    const result: (string | number)[] = [1];
    if (currentPage - width > 2) result.push('...');
    result.push(...Array.from(mainPages).sort((a,b) => a-b));
    if (currentPage + width < totalPages - 1) result.push('...');
    if (totalPages > 1) result.push(totalPages);
    return result;
});
</script>

<style scoped>
/* ===== Layout Styles ===== */
.home-layout-container { display: block; }
@media (min-width: 960px) {
  .home-layout-container { display: grid; gap: 2rem; grid-template-columns: 1fr 280px; }
}
.sidebar-area { position: sticky; top: 88px; height: fit-content; }
@media (max-width: 959px) { .sidebar-area { margin-top: 2rem; } }

/* ===== Post List Styles ===== */
.post-list { border-bottom: 1px dashed var(--vp-c-divider); padding: 1.5rem 0; }
.post-list:first-child { padding-top: 0.5rem; }
.post-cover { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1.25rem; }
.post-title { font-size: 1.25rem; font-weight: 600; }
.post-title a { color: var(--vp-c-text-1); text-decoration: none; }
.describe { font-size: 0.95rem; color: var(--vp-c-text-2); margin: 1rem 0; line-height: 1.6rem; }
.post-info { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem 1rem; font-size: 0.9rem; }
.post-info .tag a { color: var(--vp-c-text-2); background-color: var(--vp-c-bg-mute); padding: 2px 8px; border-radius: 4px; text-decoration: none; }

/* ===== Pagination Styles ===== */
.pagination { margin-top: 2rem; display: flex; justify-content: center; gap: 0.5rem; }
.link { display: flex; justify-content: center; align-items: center; width: 2rem; height: 2rem; border-radius: 50%; }
.link a { color: inherit; text-decoration: none; display: block; width: 100%; text-align: center; }
.link.active { background: var(--vp-c-brand-1); color: var(--vp-c-bg); }

/* ===== Sidebar Card Styles ===== */
.sidebar-card {  border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; border: 1px solid var(--vp-c-divider); }
.card-title { font-size: 1.1rem; font-weight: 600; margin: 0 0 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--vp-c-divider); }
.term-list { list-style: none; padding: 0; margin: 0; }
.term-list li a { display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0; text-decoration: none; color: var(--vp-c-text-1); }
.term-list span { background-color: var(--vp-c-bg-mute); padding: 2px 8px; border-radius: 6px; font-size: 0.85rem; }
.tag-cloud { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.tag-item { background-color: var(--vp-c-bg-mute); padding: 4px 12px; border-radius: 14px; text-decoration: none; color: var(--vp-c-text-2); }

/* ===== Stats Card Styles ===== */
.stats-container { display: flex; justify-content: space-around; text-align: center; }
.stat-item { display: flex; flex-direction: column; gap: 0.25rem; }
.stat-title { font-size: 0.9rem; color: var(--vp-c-text-2); }
.stat-value { font-size: 1.25rem; font-weight: 600; color: var(--vp-c-text-1); }

/* ===== Friend Link Styles ===== */
.friend-link-list { list-style: none; padding: 0; margin: 0;  }
.friend-link-item { display: flex; align-items: center; padding: 0.4rem 0; gap: 0.75rem; text-decoration: none;  border-bottom:0px !important }
.friend-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
.friend-name { font-size: 0.9rem; font-weight: 500; color: var(--vp-c-text-1);  }

/* ===== "View More" Link Styles ===== */
.more-link { display: block; text-align: right; margin-top: 0.75rem; font-size: 0.85rem;  text-decoration: none; }
</style>