import { fetchAPI } from "../../utils/fetch-api";
   
   
  export async function generateStaticParams() {
    const posts: any = await fetch('/authors?populate=*')
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
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    if (!token) throw new Error("The Strapi API Token environment variable is not set.");

    const options = { headers: { Authorization: `Bearer ${token}` } };
    const { id } = await params
    const newsResponse = await fetchAPI(`/authors/${id}`, {}, {
      ...options,
      next: {
        tags: ['prod'],
        revalidate: 60
      }
    })
    const newsData = newsResponse?.data || [];
    console.log(newsData)

    return (
      <main>
        <h1>{newsData.title}</h1>
        <p>{newsData.description}</p>
        <ul>
          <li></li>
        </ul>
      </main>
    )
  }