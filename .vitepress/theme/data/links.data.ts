import { createContentLoader } from 'vitepress'

interface Link {
    name: string
    link: string
    avatar: string
    description?: string
}

declare const data: Link[]
export { data }

export default createContentLoader('.vitepress/theme/data/links.md', {
    transform(raw) {
        return raw[0].frontmatter.links
    }
})