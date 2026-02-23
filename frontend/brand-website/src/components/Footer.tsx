import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-gray-800">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 tech-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-xl font-bold gradient-text">博智媒体</span>
            </div>
            <p className="text-gray-400 text-sm">
              专注机器人行业资讯、产品评测与技术洞察的领先自媒体平台
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm">
                  行业资讯
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors text-sm">
                  产品中心
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">联系方式</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>邮箱：contact@botmedia.cn</li>
              <li>电话：400-888-8888</li>
              <li>地址：北京市海淀区中关村科技园</li>
            </ul>
          </div>

          {/* WeChat & Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">关注我们</h3>
            <div className="space-y-3">
              <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-700">
                <Image
                  src="/images/wechat-qrcode.jpg"
                  alt="微信公众号二维码"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-500 text-xs">扫码关注获取最新资讯</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} 博智媒体 BotMedia. 保留所有权利.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-white">京ICP备XXXXXXXX号</a>
            {' | '}
            <a href="#" className="hover:text-white">京公网安备XXXXXXXXXXXX号</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
