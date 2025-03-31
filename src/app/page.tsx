import { fetchAPI } from "./utils/fetch-api";
import PageHeader from "./components/PageHeader";
import "@/app/style/home.css";

// ✅ 1. 生成 SSG 静态页面参数（支持多语言）
export async function generateStaticParams() {
  const i18nResponse = await fetchAPI("/i18n/locales");
  const locales = i18nResponse?.map((locale: any) => locale.code) || ["en"]; // 默认英语
  return locales.map((lang: string) => ({ lang }));
}

// ✅ 2. 使用 ISR 让数据 60 秒后自动刷新
export const revalidate = 60;

export default async function Home({ params }: any ) {
  const { lang } = params;
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const options = { headers: { Authorization: `Bearer ${token}` } };

  // 获取所有语言列表
  const i18nResponse = await fetchAPI("/i18n/locales", { next: { revalidate: 60 } });

  // 获取当前语言的菜单数据（60 秒后自动刷新）
  const menusResponse = await fetchAPI(`/menus?locale=${lang || "en"}`, { next: { revalidate: 60 } });
  const menuData = menusResponse?.data || [];
  console.log(menuData)

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

      <main className="">内容</main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">底部</footer>
    </div>
  );
}
