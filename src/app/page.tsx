import { fetchAPI } from "./utils/fetch-api";
import PageHeader from "./components/PageHeader";
import Link from 'next/link';
import Image from "next/image";
import "@/app/style/home.css";
import fs from "fs";
import path from "path";

// ✅ 1. 生成 SSG 静态页面参数（支持多语言）
export async function generateStaticParams() {
  const i18nResponse = await fetchAPI("/i18n/locales");
  const locales = i18nResponse?.map((locale: any) => locale.code) || ["en"]; // 默认英语
  return locales.map((lang: string) => ({ lang }));
}

// ✅ 2. 使用 ISR 让数据 60 秒后自动刷新
export const revalidate = 60;



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

  return images;
}




export default async function Home({ params }: any) {
  const { lang } = params;
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const options = { headers: { Authorization: `Bearer ${token}` } };

  // 获取所有语言列表
  const i18nResponse = await fetchAPI("/i18n/locales", {}, options);

  // 获取当前语言的菜单数据（60 秒后自动刷新）
  const menusResponse = await fetchAPI(`/menus`, {locale: lang || "en"}, {
    ...options,
    next: {
      tags: ['menu'],
      revalidate: 60
    }
  });
  const menuData = menusResponse?.data || [];
  console.log(menuData)

  const newsResponse = await fetchAPI(`/authors?populate[0]=avatar`, {}, {
    ...options,
    next: {
      tags: ['prod'],
      revalidate: 60
    }
  })
  const newsData = await getImages(newsResponse?.data) || [];
  console.log(newsData)


  

  return (
    <div className="home min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      {/* ✅ 3. 传递 `i18nResponse` 和 `currentLang` */}
      <PageHeader i18n={i18nResponse} currentLang={lang} />

      <ul className="menu flex">
        {menuData.map((item: any, index: number) => (
          <li className="m-8" key={index}>
            {item.label}
          </li>
        ))}
      </ul>
      <main className="">
        <ul className="flex">
        {
          newsData.map((item: any, index: number) => (
            <li className="m-8" key={index}>
              <Link href={`/details/${item.documentId}`} passHref>
              {item.name}
              <Image src={item.localPath} alt={item.avatar.alternativeText || "Gallery Image"} width={145} height={145} priority />
              </Link>
            </li>
          ))
        }
        </ul>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">底部</footer>
    </div>
  );
}
