interface PageHeaderProps {
    i18n: any;
    langChange: (e: any) => void;
  }
  
  export default function PageHeader({ i18n, langChange }: PageHeaderProps) {
    return (
        <div className="ltd flex justify-between p-2">
          <div>Welcome to 1xxxxxxx Machinery. Co., Ltd</div>
          <div>
            <select onChange={langChange}>
              {
                i18n.map((item: any, index: number) => {
                  return (<option value={item.code} key={index}>{item.name}</option>)
                })
              }
            </select>
          </div>
        </div>
    );
  }