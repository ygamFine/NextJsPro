import { fetchAPI } from "../../utils/fetch-api";
import "@/app/style/home.css";
import Link from 'next/link';
import Image from "next/image";
import fs from "fs";
import path from "path";




// 🚀 1. 下载远程图片并存储到 `public/images`
async function downloadImage(url: string, filename: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);

    const buffer = await res.arrayBuffer();
    const filePath = path.join(process.cwd(), "public", "images", filename);

    fs.writeFileSync(filePath, Buffer.from(buffer)); // 保存图片
}

// 🚀 2. 获取 Strapi 图片并存储到 `public/`
async function getImages(images: any) {
    if (images instanceof Array) {
        for (const img of images) {
            const imageUrl = `${img.avatar.url}`;
            const filename = path.basename(img.avatar.url); // "image1.jpg"
            const filePath = path.join("public", "images", filename);

            // ✅ 只有当文件不存在时才下载，避免重复下载
            if (!fs.existsSync(filePath)) {
                console.log(`Downloading new image: ${filename}`);
                await downloadImage(imageUrl, filename);
            }

            img.localPath = `/images/${filename}`; // 绑定本地路径
        }
    }
    // if (images instanceof Object && JSON.stringify(images) !== '{}') {
    //     console.log(images.avatar)
    //     const imageUrl = `${images.avatar?.url}`;
    //     const filename = path.basename(imageUrl); // "image1.jpg"
    //     const filePath = path.join("public", "images", filename);

    //     // ✅ 只有当文件不存在时才下载，避免重复下载
    //     if (!fs.existsSync(filePath)) {
    //         console.log(`Downloading new image: ${filename}`);
    //         await downloadImage(imageUrl, filename);
    //     }

    //     images.localPath = `/images/${filename}`; // 绑定本地路径
    // }


    return images;
}



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
    const newsDataArr = await getImages([newsResponse.data]);
    const newsData = newsDataArr && newsDataArr.length > 0 ? newsDataArr[0] : {}


    const prodResponse = await fetchAPI(`/authors?populate[0]=avatar`, {}, {
        ...options,
        next: {
            tags: ['prod'],
            revalidate: 60
        }
    })
    const prodData = await getImages(prodResponse.data) || []

    return (
        <div className="details">
            <h1>{newsData.name}</h1>

            <Image src={newsData.localPath} alt={newsData.avatar.alternativeText || "Gallery Image"} width={200} height={200} priority />
            {/* 其他详情内容 */}
            <h2>其他相关产品</h2>
            <ul className="flex">
                {
                    prodData.map((item: any, index: number) => item.documentId !== id && (
                        <li className="m-8" key={index}>
                            <Link href={`/details/${item.documentId}`} passHref>
                                {item.name}
                                <Image src={item.localPath} alt={item.avatar.alternativeText || "Gallery Image"} width={145} height={145} priority />
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}