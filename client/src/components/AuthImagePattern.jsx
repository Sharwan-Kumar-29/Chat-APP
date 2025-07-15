export const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center p-12">
      <div className="max-w-md text-center">
        {/* grid pattern */}
        <div className="grid grid-cols-3 gap-3 mb-8 mt-12">
          {["https://www.usnews.com/object/image/00000190-1323-d761-a5d7-9be3e0070000/gettyimages-1454837777.jpg?update-time=1718308100055&size=responsive640","https://png.pngtree.com/thumb_back/fw800/background/20220830/pngtree-she-puts-the-social-in-social-media-beautiful-comfortable-fun-photo-image_38999530.jpg","https://tse1.explicit.bing.net/th/id/OIP.WnkFQehkISARUA0CYs6SngHaE8?w=1300&h=868&rs=1&pid=ImgDetMain&o=7&rm=3","https://tse1.mm.bing.net/th/id/OIP.hhK-Bb6AY2P_YQPFbtdNNAHaE8?w=990&h=660&rs=1&pid=ImgDetMain&o=7&rm=3","https://www.mediabistro.com/wp-content/uploads/2022/01/bigstock-Young-Smiling-Happy-Beautiful-424329200-860x484.jpg","https://www.pfu-us.ricoh.com/-/media/project/scanners/blog/2020/06/working-from-home_woman-image_with-scanner.jpg?mw=992&w=992&hash=1AF8431DA927BF960B404D6E5483B8A0","https://www.camella.com.ph/wp-content/uploads/2023/05/portrait-young-working-woman-korean-girl-studying-remote-online-talking-laptop-video-chat-h1.jpg","https://tse3.mm.bing.net/th/id/OIP.eHqCtigrZrt-dPa9VhRWpQHaE8?pid=ImgDet&w=184&h=122&c=7&dpr=1.3&o=7&rm=3","https://th.bing.com/th/id/R.9cd74e14966784681e8b5159841e4e87?rik=wZk6iyg7h80l5g&riu=http%3a%2f%2fhrmasia.com%2fwp-content%2fuploads%2f2018%2f10%2fPhilippine-work-from-home-bill-gets-senate-and-house-approval.jpg&ehk=%2ft2k6LKyupqU8GdXsTSkJHOOgHKBlnd2TLnhx7iXGgU%3d&risl=&pid=ImgRaw&r=0"].map((pic, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl bg-gray-700/30 ${i % 2 === 0 ? "animate-pulse" : ""}`}
            >
              <img src={pic} alt="" className="h-28 object-bottom object-cover rounded-lg shadow-lg" />
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-black mb-4">{title}</h2>
        <p className="text-gray-700">{subtitle}</p>
      </div>
    </div>
  );
};
