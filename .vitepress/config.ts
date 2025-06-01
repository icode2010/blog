import { defineConfig } from 'vitepress'
import { getPosts } from './theme/serverUtils'
import { initTags, initCategory } from './theme/functions' // 👈 1. 导入您的函数
import { isThisWeek, isThisMonth } from 'date-fns'          // 👈 2. 导入日期计算函数

//每页的文章数量
const pageSize = 10

const isProd = process.env.NODE_ENV === 'production'

export default async () => {
    const posts = await getPosts(pageSize);
    const categories = initCategory(posts);
    const tags = initTags(posts);
    const stats = {
        total: posts.length,
        thisWeek: posts.filter(p => isThisWeek(new Date(p.frontMatter.date), { weekStartsOn: 1 })).length,
        thisMonth: posts.filter(p => isThisMonth(new Date(p.frontMatter.date))).length
    };

    return defineConfig({
        title: 'icode',
        base: '/',
        cacheDir: './node_modules/vitepress_cache',
        description: 'vitepress,blog,blog-theme',
        ignoreDeadLinks: true,

        themeConfig: {
            posts: posts,
            categories: categories,
            tags: tags,
            stats: stats,
            website: 'https://blog.icode.one', 
            comment: {
                repo: 'icode2010/blog',
                repoId: 'R_kgDOOyhM_A',
                categoryId: 'DIC_kwDOOyhM_M4CqudP'
            },
            nav: [
                { text: 'Home', link: '/' },
                { text: 'Archives', link: '/pages/archives' },
                { text: 'About', link: '/pages/about' }
            ],
            search: {
                provider: 'local'
            },
            outline: {
                label: '文章摘要'
            }
        },

        srcExclude: isProd
            ? [
                  '**/trash/**/*.md',
                  '**/draft/**/*.md',
                  '**/private-notes/*.md',
                  'README.md'
              ]
            : ['README.md'],
        vite: {
            server: { port: 5000 }
        }
    })
}