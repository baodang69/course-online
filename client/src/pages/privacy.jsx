import Header from "../components/ui/header";
import Footer from "../components/ui/footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Chính sách bảo mật</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">
                1. Thu thập thông tin
              </h2>
              <p className="text-gray-600">
                Chúng tôi thu thập thông tin khi bạn đăng ký trên website, đăng
                ký khóa học hoặc điền các biểu mẫu. Thông tin thu thập bao gồm
                tên, email, số điện thoại và các thông tin liên quan khác.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                2. Sử dụng thông tin
              </h2>
              <p className="text-gray-600">
                Thông tin chúng tôi thu thập từ bạn có thể được sử dụng để:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600">
                <li>Cá nhân hóa trải nghiệm của bạn</li>
                <li>Cải thiện website của chúng tôi</li>
                <li>Cải thiện dịch vụ khách hàng</li>
                <li>Xử lý giao dịch</li>
                <li>Gửi email định kỳ</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                3. Bảo mật thông tin
              </h2>
              <p className="text-gray-600">
                Chúng tôi thực hiện nhiều biện pháp bảo mật để đảm bảo an toàn
                thông tin cá nhân của bạn. Chúng tôi sử dụng mã hóa để bảo vệ
                thông tin nhạy cảm được truyền trực tuyến.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Cookies</h2>
              <p className="text-gray-600">
                Chúng tôi sử dụng cookies để hiểu và lưu thông tin về sở thích
                của bạn nhằm mục đích cải thiện trải nghiệm người dùng và phân
                tích dữ liệu về lưu lượng truy cập website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                5. Chia sẻ thông tin
              </h2>
              <p className="text-gray-600">
                Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân
                của bạn cho các bên thứ ba. Điều này không bao gồm các bên thứ
                ba đáng tin cậy hỗ trợ chúng tôi trong việc vận hành website.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
