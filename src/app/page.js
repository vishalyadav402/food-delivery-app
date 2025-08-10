import Footer from "./components/Footer";
import Header from "./components/Header";
import Menu from "./components/Menu";


export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      <Header />
      {/* Hero Section */}
      <div className="flex-grow w-full rounded-md max-w-6xl mx-auto px-4 py-4">
        <section className="py-12 text-center rounded-md bg-[url('/images/banner.png')] bg-no-repeat bg-cover h-[20vh] md:h-[60vh] text-white">
          {/* <h2 className="text-4xl text-gray-700 font-bold mb-4">Order Your Favorite Food Now</h2>
          <p className="text-lg text-gray-700 mb-6">Delicious meals delivered fresh to your door</p>
          <button className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600">
            Order Now
          </button> */}
        </section>
      </div>

      {/* Menu Section */}
      <main className="flex-grow max-w-6xl mx-auto px-6 py-12">
       <Menu />
      </main>

      <Footer />
    </div>
  );
}
