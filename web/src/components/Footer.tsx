export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1d2d1e] border-t border-[#f0f4f0] dark:border-[#2a3a2c] mt-20 py-12 px-4 md:px-10 lg:px-20">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined text-[32px]">potted_plant</span>
            <h2 className="text-xl font-bold text-[#111812] dark:text-white">GreenThumb</h2>
          </div>
          <p className="text-sm text-[#618965] dark:text-primary/70 max-w-xs">
            Helping you grow your home jungle one plant at a time. Quality guaranteed with 30-day care support.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Shop</h4>
          <ul className="space-y-4 text-sm font-medium text-[#618965] dark:text-primary/70">
            <li>
              <a className="hover:text-primary" href="/shop">
                All Plants
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="/shop">
                New Arrivals
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="/shop">
                Pet Friendly
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="/shop">
                Gift Cards
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Support</h4>
          <ul className="space-y-4 text-sm font-medium text-[#618965] dark:text-primary/70">
            <li>
              <a className="hover:text-primary" href="#">
                Plant Care Guide
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="#">
                Shipping & Returns
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="#">
                FAQ
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="#">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Newsletter</h4>
          <p className="text-sm text-[#618965] dark:text-primary/70 mb-4">Get 10% off your first order!</p>
          <div className="flex">
            <input
              className="flex-1 bg-background-light dark:bg-[#102212] border-none rounded-l-xl px-4 py-3 focus:ring-1 focus:ring-primary text-sm"
              placeholder="Email address"
              type="email"
            />
            <button className="bg-primary px-4 py-3 rounded-r-xl text-white font-bold text-sm hover:bg-primary-dark transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto pt-12 mt-12 border-t border-[#f0f4f0] dark:border-[#2a3a2c] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-[#618965]">© 2023 GreenThumb Marketplace. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="material-symbols-outlined text-[#618965] cursor-pointer hover:text-primary">
            public
          </span>
          <span className="material-symbols-outlined text-[#618965] cursor-pointer hover:text-primary">
            share
          </span>
          <span className="material-symbols-outlined text-[#618965] cursor-pointer hover:text-primary">
            camera
          </span>
        </div>
      </div>
    </footer>
  );
}
