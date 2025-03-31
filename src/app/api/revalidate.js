// pages/api/revalidate.js
export default async function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Only POST requests are allowed" });
    }
  
    const { path } = req.body;
    
    if (!path) {
      return res.status(400).json({ message: "Path is required" });
    }
  
    try {
      // 手动触发 ISR 重新验证页面
      await res.revalidate(path);
  
      return res.json({ message: `Page revalidated successfully for path: ${path}` });
    } catch (error) {
      return res.status(500).json({ message: "Error revalidating page", error });
    }
  }
  