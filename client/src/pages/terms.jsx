import Header from "../components/ui/header";
import Footer from "../components/ui/footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Điều khoản sử dụng</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">
                1. Điều khoản chung
              </h2>
              <p className="text-gray-600">
                Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ
                và chịu ràng buộc bởi các điều khoản và điều kiện sau đây.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                2. Quyền sở hữu trí tuệ
              </h2>
              <p className="text-gray-600">
                Tất cả nội dung trên website bao gồm nhưng không giới hạn ở
                text, graphics, logos, icons, images, audio clips, video clips
                và phần mềm là tài sản của chúng tôi và được bảo vệ bởi luật bản
                quyền quốc tế.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                3. Tài khoản người dùng
              </h2>
              <p className="text-gray-600">
                Khi tạo tài khoản với chúng tôi, bạn phải cung cấp thông tin
                chính xác, đầy đủ và cập nhật. Bạn hoàn toàn chịu trách nhiệm về
                việc bảo mật tài khoản của mình.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                4. Nội dung khóa học
              </h2>
              <p className="text-gray-600">
                Chúng tôi không đảm bảo rằng nội dung khóa học sẽ đáp ứng yêu
                cầu của bạn hoặc không bị gián đoạn, kịp thời, an toàn hoặc
                không có lỗi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                5. Thay đổi điều khoản
              </h2>
              <p className="text-gray-600">
                Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc nào.
                Việc tiếp tục sử dụng website sau khi thay đổi đồng nghĩa với
                việc bạn chấp nhận những thay đổi đó.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
