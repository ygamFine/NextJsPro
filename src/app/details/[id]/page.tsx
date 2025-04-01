import { fetchAPI } from "../../utils/fetch-api";
import "@/app/style/home.css";
import Link from 'next/link';
import Image from "next/image";
export default async function DetailPage({
    params
  }: {
    params: any;
  }) {
    
 const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    if (!token) throw new Error("The Strapi API Token environment variable is not set.");

    const options = { headers: { Authorization: `Bearer ${token}` } };
    const { id } = await params
    const newsResponse = await fetchAPI(`/authors/${id}?populate[0]=avatar`, {}, {
      ...options,
      next: {
        tags: ['prod'],
        revalidate: 60
      }
    })
    const newsData = newsResponse?.data || {};
    console.log(newsData)


    const prodResponse = await fetchAPI(`/authors?populate[0]=avatar`, {}, {
        ...options,
        next: {
          tags: ['prod'],
          revalidate: 60
        }
      })
      const prodData = prodResponse.data || []
  
    return (
      <div className="details">
        <h1>{newsData.name}</h1>

        <Image src={newsData.avatar.url} alt={newsData.avatar.alternativeText || "Gallery Image"} width={200} height={200} priority />
        {/* 其他详情内容 */}
        <h2>其他相关产品</h2>
        <ul className="flex">
        {
          prodData.map((item: any, index: number) => item.documentId !== id && (
            <li className="m-8" key={index}>
              <Link href={`/details/${item.documentId}`} passHref>
              {item.name}
                <Image src={item.avatar.url} alt={item.avatar.alternativeText || "Gallery Image"} width={145} height={145} priority />
              </Link>
            </li>
          ))
        }
        </ul>
      </div>
    );
  }