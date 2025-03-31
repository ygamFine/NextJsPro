import { fetchAPI } from "./utils/fetch-api";
import '@/app/style/home.css'
import PageHeader from "./components/PageHeader";



export async function generateStaticParams() {
  const i18nResponse = await fetchAPI("/i18n/locales");
  const locales = i18nResponse.map((locale: any) => locale.code); // 获取所有语言代码

  return locales.map((lang: any) => ({ lang }));
}


export default async function Home({ lang }: { lang: string; menuData: any[] }) {
  console.log('当前语言', lang)
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const options = { headers: { Authorization: `Bearer ${token}` } };
  const menusResponse = await fetchAPI(`/menus?locale=${lang || 'en'}`);
  const menuData = menusResponse.data || [];

  // const response = await fetchAPI("/menus", options);
  // console.log(response)
  console.log(menuData)


  return (
    <div className="home min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <header className="header">
        {/* <PageHeader i18n={i18nResponse} langChange={langChange}></PageHeader> */}
        <ul className="menu flex">
          {
            menuData &&  menuData.map((item: any, index: number) => {
              return (<li className="m-8" key={index}>{ item.label }</li>)
            })
          }
        </ul>
      </header>
      <main className="">
        内容
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        底部
      </footer>
    </div>
  );
}
