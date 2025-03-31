import { fetchAPI } from "./utils/fetch-api";
import PageHeader from "./components/PageHeader";
import "@/app/style/home.css";

// ✅ 1. 使用 getStaticPaths 动态生成多语言路径
export async function getStaticPaths() {
  // 获取所有语言列表
  const i18nResponse = await fetchAPI("/i18n/locales");
  const locales = i18nResponse?.map((locale: any) => locale.code) || ["en"]; // 默认英语

  // 返回每个语言的路径
  const paths = locales.map((lang: string) => ({
    params: { lang },
  }));

  return {
    paths,
    fallback: 'blocking',  // 页面未生成时，阻塞请求，生成新页面
  };
}

// ✅ 2. 使用 getStaticProps 获取页面数据并启用 ISR
export async function getStaticProps({ params }: any) {
  const { lang } = params;
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const options = { headers: { Authorization: `Bearer ${token}` } };

  // 获取当前语言的菜单数据（启用 ISR）
  const menusResponse = await fetchAPI(`/menus`, { next: { revalidate: 60 } });
  const menuData = menusResponse?.data || [];

  // 获取当前语言的 i18n 信息
  const i18nResponse = await fetchAPI("/i18n/locales", { next: { revalidate: 60 } });

  return {
    props: {
      menuData,
      i18nResponse,
      lang,
    },
    revalidate: 60,  // 每60秒重新生成页面
  };
}

export default function Home({ menuData, i18nResponse, lang }: any) {
  return (
    <div className="home min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      {/* ✅ 3. 传递 i18nResponse 和 currentLang */}
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
