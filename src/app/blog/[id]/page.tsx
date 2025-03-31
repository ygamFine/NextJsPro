interface Post {
    id: string
    title: string
    description: string
  }
   
  // Next.js will invalidate the cache when a
  // request comes in, at most once every 60 seconds.
  export const revalidate = 60
   
  // We'll prerender only the params from `generateStaticParams` at build time.
  // If a request comes in for a path that hasn't been generated,
  // Next.js will server-render the page on-demand.
  export const dynamicParams = true // or false, to 404 on unknown paths
   
  export async function generateStaticParams() {
    const posts: any = await fetch('https://victorious-wisdom-f9f44dd049.strapiapp.com/api/articles').then((res) =>
      res.json()
    )
    console.log(posts?.data)
    return posts.data.map((post: any) => ({
      id: String(post.documentId),
    }))
  }

  export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params
    const post = await fetch(`https://victorious-wisdom-f9f44dd049.strapiapp.com/api/articles/${id}`).then(
      (res) => res.json()
    )
    console.log(post)
    return (
      <main>
        <h1>{post.title}</h1>
        <p>{post.description}</p>
      </main>
    )
  }