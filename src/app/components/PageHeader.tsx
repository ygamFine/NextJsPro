"use client";

import { useRouter } from "next/navigation";

type PageHeaderProps = {
  i18n: { code: string; name: string }[];
  currentLang: string;
};

export default function PageHeader({ i18n, currentLang }: PageHeaderProps) {
  const router = useRouter();

  const handleLangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value;
    router.push(`/${newLang}`); // 语言切换，保持 SSG
  };

  return (
    <header className="header">
      <div className="ltd flex justify-between p-2">
        <div>Welcome to 1xxxxxxx Machinery. Co., Ltd</div>
        <div>
          <select onChange={handleLangChange} value={currentLang}>
            {i18n.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
