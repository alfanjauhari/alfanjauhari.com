---fm
title: 'Tailwind CSS Dark Mode'
description: 'Mengulas tentang fitur baru yang ditawarkan oleh Tailwind CSS pada versi kedua, yaitu Dark Mode'
excerpt: 'Dark mode untukmu dan untukku'
thumbnail: '/images/blog/tailwindcss-dark-mode/thumbnail.webp'
category: 'tailwindcss'
date: '2021-01-30 02:20:37'
---endfm

Setelah pada tahun 2019 Tailwind CSS merilis versi pertamanya dan menjadi langkah awal perjalanan Tailwind CSS, sekarang pada tanggal 19 November 2020 Tailwind CSS merilis versi kedua yang merupakan versi _major_ dan berarti banyak fitur-fitur yang ditambahkan dan banyak juga fitur-fitur dari versi Tailwind CSS pada versi sebelumnya yang dihapus atau _deprecated_.

# Apa yang Baru di Tailwind CSS 2?

Banyak sekali fitur-fitur yang dihadirkan oleh Tailwind CSS pada versi major kedua ini dan saya akan memperkenalkan beberapa fitur di kesempatan kali ini supaya artikel-nya tidak terlalu pendek.

Pada kesempatan kali ini saya akan membahas 3 fitur yang menurut saya penting untuk dibahas. Jadi, apa saja fitur tersebut?

- **Perubahan pada color palletes**

  Pada versi kedua ini Tailwind CSS menambahkan pilihan color palettes mulai dari `50-900`, sehingga para developer memiliki semakin banyak pilihan dalam build atau membangun website dengan Tailwind CSS.

- **2xl breakpoints**

  Tailwind CSS menambahkan breakpoints baru yang berguna untuk mengatur responsivitas pada layar dengan ukuran 1536px ke atas, sehingga di Tailwind CSS versi 2 ini memiliki 5 breakpoints dan kamu bisa menyesuaikannya sesuai kebutuhan.

- **Dark mode support**

  Pada rilis versi major kali ini, Tailwind CSS menghadirkan fitur dark mode yang menurut saya menarik sekali karena kita bisa menyesuaikan website kita menggunakan fitur dark mode dari Tailwind CSS ini hanya menggunakan varian `dark:` di kodingan kamu sama halnya seperti kamu menyesuaikan responsivitas website kamu menggunakan varian breakpoints dari Tailwind CSS.

Sebenarnya masih banyak fitur-fitur yang dihadirkan Tailwind CSS versi kedua ini, namun karena fokus kita kali ini bukan untuk membahas fitur tersebut jadi saya tidak akan membahas semuanya di artikel kali ini, sebagai alternatif kamu bisa membaca artikel tentang perilisan Tailwind CSS ini dan apa saja fitur-fitur baru yang dihadirkan Tailwind CSS 2 secara lengkap di [blog Tailwind CSS](https://blog.tailwindcss.com/tailwindcss-v2).

Lantas apa yang akan kita bahas di artikel ini, apa hanya hal di atas saja? Tentu saja tidak dong sayang. Di kesempatan kali ini saya akan mengulas tentang salah satu dari tiga fitur yang sudah saya ulik di atas, yaitu **Dark Mode**.

# Dark Mode

Dark mode mungkin saat ini adalah salah satu fitur yang menjadi primadona di kalangan developer maupun user, banyak sekali platform-platform yang menggunakan dark mode sebagai fiturnya, sebagai contoh Facebook, Instagram, Twitter, yang sudah mengadaptasi fitur dark mode ini.

Banyak sekali manfaat yang didapatkan ketika kita mengadaptasi dark mode di website atau aplikasi kita, salah satunya adalah _User Interface_ dengan versi yang berbeda sehingga user tidak bosan atau boring dengan tampilan website atau aplikasi kita. Selain itu, kebanyakan orang menyukai menggunakan versi dark mode pada saat malam hari, karena suasana malam yang gelap akan sangat mengganggu apabila kita memandang secara intens dan terus menerus layar dengan light mode.

# Menggunakan Dark Mode di Tailwind CSS

Pada kesempatan kali ini, saya akan memberikan sedikit tips cara menggunakan dark mode di Tailwind CSS. Namun, perlu diperhatikan bahwasanya saya menggunakan framework dari [React JS](https://reactjs.org) yaitu [Next JS](https://nextjs.org) untuk tips kali ini, kamu bisa menyesuaikan dengan keinginan dan kebutuhan kamu akan menggunakan framework atau library apa untuk mengikuti tips ini.

## Inisialisasi Proyek

Sebelumnya, kita akan menginstal Next JS dan dependencies lainnya yang diperlukan dengan menjalankan perintah berikut (dan oh iya, jangan lupa inisialisasi blank project terlebih dahulu menggunakan perintah `yarn init` atau `npm init`) :

```bash
yarn add next react react-dom && yarn add tailwindcss postcss autoprefixer -D
```

Dengan perintah di atas kita akan mengunduh Next JS, React JS, dan React DOM sebagai dependencies kita dan Tailwind CSS, PostCSS, dan Autoprefixer sebagai devDependencies kita.

Setelah menginstal dependencies yang diperlukan kita perlu melakukan konfigurasi beberapa konfigurasi. Yang pertama adalah melakukan konfigurasi pada `package.json` yaitu membuat `scripts` object yang dapat dijalankan di dalam terminal. Kurang lebih seperti ini :

```json
"scripts": {
	"start": "next start",
    "build": "next build",
    "dev": "next dev"
}
```

Oh iya, apabila kamu masih kebingungan tentang konsep scripts di `package.json` kamu bisa membaca dokumentasi dari npm [di sini](https://docs.npmjs.com/cli/v6/using-npm/scripts).

Selanjutnya kamu perlu untuk menginisialisasi Tailwind config dengan menjalankan perintah berikut di terminal :

```bash
npx tailwindcss init --full
```

Dengan perintah di atas Tailwind CSS akan membuat file konfigurasi dengan nama `tailwind.config.js` pada root project kamu.

Setelah melakukan konfigurasi pada Tailwind CSS kita perlu membuat sebuah file baru dengan nama `postcss.config.js` pada root project kita, gunanya adalah untuk mengkonfigurasi PostCSS sehingga Next JS dapat memahami Tailwind CSS. Untuk file `postcss.config.js` kurang lebih berisi seperti ini :

```javascript
module.exports = {
  plugins: ["tailwindcss", "autoprefixer"],
};
```

Script di atas berguna untuk memberitahu plugins apa saja yang akan digunakan oleh PostCSS.

Selanjutnya kita hanya perlu untuk membuat satu file css yang berguna untuk menampung seluruh style dari Tailwind CSS. Di sini saya akan membuat satu folder baru dengan nama `assets` dan membuat satu file di dalam folder tersebut dengan nama `app.css`. Di file `app.css` kita hanya perlu untuk mengisinya dengan kode seperti berikut :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

#__next {
  @apply flex flex-col min-h-screen;
}
```

- Perlu diperhatikan pada baris kode pertama sampai ketiga, kita menggunakan directive `@tailwind` yang berguna untuk `injecting` Tailwind CSS ke dalam `app.css`.
- Selanjutnya pada baris keempat kita menggunakan CSS selector untuk memilih element dengan id `#__next` dan menambahkan class name dari Tailwind CSS ke dalam element tersebut. Untuk fungsi dari masing-masing class tersebut, kamu bisa membacanya di dokumentasi resmi dari Tailwind CSS.

Untuk menggunakan `app.css` tersebut kita perlu mengimpor-nya ke dalam file `_app.jsx`, dan untuk itu mari kita buat terlebih dahulu file `_app.jsx` nya.

Pertama _expand_ atau buka folder `pages` dari Next JS atau kalau belum ada buat folder tersebut di root project, selanjutnya buat satu file dengan nama `_app.jsx` dan isi dengan script berikut ini :

```jsx
import "../assets/app.css"; // untuk mengimpor file app.css dari folder assets

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

Script di atas akan mengimpor `app.css` dari folder assets sehingga seluruh proyek kita bisa menggunakan CSS tersebut.

Untuk penjelasan lebih lanjut mengenai `_app.jsx` kamu bisa mengunjungi dokumentasi resmi Next JS [di sini](https://nextjs.org/docs/advanced-features/custom-app).

## Ngoding Syalala

Setelah berhasil mengisialisasi proyek, kita bisa memulai untuk menulis kode program di Next JS.

Hal pertama yang perlu kita lakukan adalah menulis script untuk layout utama dari studi kasus kita kali ini, sehingga apabila kita akan menambahkan halaman baru kita hanya perlu menulis kode konten utamanya saja.

Untuk layout kita hanya perlu membuat satu folder `layouts` pada root project dan membuat sebuah script dengan nama `Wrapper.jsx` di dalamnya, dimana `Wrapper.jsx` ini nantinya akan menjadi layout utama kita pada studi kasus kali ini. Untuk isi dari `Wrapper.jsx` kurang lebih seperti ini :

```jsx
export default function Wrapper({ children }) {
  return (
    <>
      <header className="px-8 py-4 bg-white dark:bg-gray-900 shadow-lg flex justify-between items-center">
        <ul className="flex">
          <a href="#" className="text-gray-600 dark:text-white mr-4">
            Home
          </a>
          <a href="#" className="text-gray-600 dark:text-white mr-4">
            About
          </a>
          <a href="#" className="text-gray-600 dark:text-white">
            Contact
          </a>
        </ul>
        <div className="flex items-center">
          <button
            className="p-2 md:px-6 md:py-2 text-white dark:text-black bg-purple-700 dark:bg-white hover:bg-purple-800 duration-300 rounded-sm shadow-lg focus:ring focus:ring-purple-300 focus:outline-none"
            type="button"
          >
            Toggle Dark Mode
          </button>
        </div>
      </header>
      <main className="flex-grow p-8 dark:bg-gray-700">{children}</main>
    </>
  );
}
```

Penjelasan kode di atas :

- Kita membuat _functional component_ dengan nama Wrapper yang akan menerima props berupa _children component_(yang nantinya berisi konten utama dari situs kita).
- Kita membuat satu buah menu navigasi simpel yang dapat digunakan untuk navigasi ke halaman lain.
- Kita akan _toggle_ dark mode dari elemen button yang sudah kita buat pada baris 18.
- Yang perlu diperhatikan adalah nama variant `dark:` yang nantinya variant tersebut hanya akan aktif apabila Tailwind CSS mendeteksi dark mode sedang diaktifkan.

Setelah membuat main layout, kita perlu membuat satu component yang dimana component tersebut nantinya akan berguna untuk menjadi halaman Home. Jadi kita perlu untuk membuat satu file dengan nama `index.jsx` pada halaman `pages` di root project kita dan mengisinya dengan kode seperti di bawah :

```jsx
import Wrapper from "../layouts/Wrapper";

export default function Home() {
  return (
    <Wrapper>
      <div className="flex flex-col md:flex-row justify-center items-center">
        <div className="bg-blue-900 dark:bg-gray-800 rounded p-8 text-white w-full md:w-1/3 md:flex md:justify-between md:items-center shadow-2xl">
          <h1 className="text-4xl font-bold">1000</h1>
          <h2>Active users</h2>
        </div>
        <div className="bg-blue-900 dark:bg-gray-800 rounded p-8 text-white w-full md:w-1/3 md:flex md:justify-between md:items-center shadow-2xl mt-4 md:mt-0 md:ml-4">
          <h1 className="text-4xl font-bold">4000</h1>
          <h2>Total users</h2>
        </div>
        <div className="bg-blue-900 dark:bg-gray-800 rounded p-8 text-white w-full md:w-1/3 md:flex md:justify-between md:items-center shadow-2xl mt-4 md:mt-0 md:ml-4">
          <h1 className="text-4xl font-bold">8000</h1>
          <h2>Pending Orders</h2>
        </div>
      </div>
    </Wrapper>
  );
}
```

Sama seperti di `Wrapper.jsx` yang menjadi fokus kita kali ini adalah pada class dengan varian `dark:` dimana kita akan membuat sebuah card yang memiliki background `blue-900` dan akan berubah menjadi `gray-800` pada saat dark mode diaktifkan. _Dan pastikan kamu mengimpor file `Wrapper.jsx` dari folder layouts dan menjadikannya parent component pada component Home kamu tersebut._

### Dark Mode!

Pada bagian ini, kita akan mulai menulis kode yang nantinya akan mengaktifkan atau menonaktifkan dark mode dengan menggunakan Javascript dan di sini saya akan menerapkan konsep _reusability_ dengan mengadopsi [hooks](https://reactjs.org/docs/hooks-intro.html) dari React JS.

**Pertama**, kita perlu membuat sebuah folder dengan nama hooks di root project kita dan membuat satu file dengan nama `useDarkMode.jsx` yang akan menampung kode untuk dark mode kita. Di dalam file `useDarkMode.jsx` tersebut kamu perlu untuk memasukkan kode seperti di bawah ini :

```jsx
import React, { useEffect, useState } from "react";

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setDarkMode(true);
      document.querySelector("html").classList.add("dark");
    } else {
      setDarkMode(false);
      document.querySelector("html").classList.remove("dark");
    }
  }, []);

  function toggleDarkMode() {
    if (localStorage.getItem("theme") === "dark") {
      document.querySelector("html").classList.remove("dark");
      setDarkMode(false);
      localStorage.setItem("theme", "light");
    } else {
      document.querySelector("html").classList.add("dark");
      setDarkMode(true);
      localStorage.setItem("theme", "dark");
    }
  }

  return { toggleDarkMode, darkMode };
}
```

Penjelasan kode di atas :

- Kita membuat sebuah state dengan nama `darkMode` dengan menggunakan React hooks `useState`, yang nantinya akan menyimpan state dari dark mode kita.
- Kita menggunakan `useEffect` untuk menangani _side effect_ pada saat membuka halaman, dan di dalam `useEffect` tersebut kita membuat sebuah percabangan yang akan melihat apakah terdapat item `theme` di dalam `localStorage` dan mengecek apakah di dalam item `theme` tersebut valuenya berupa 'dark' atau 'light'. Dan apabila value-nya dark maka kita akan menambahkan class baru pada root element html kita dengan nama `dark` sehingga seluruh class yang memiliki varian dark akan ditampilkan. Namun, jika tidak ada item theme atau value dari item theme bukan dark, maka kita akan menghapus class `dark` dari root element kita.
- Pada fungsi `toggleDarkMode` kita akan menangani pengaktifan atau penonaktifan dari dark mode Tailwind dengan cara melakukan percabangan yang sama seperti di `useEffect` di atas, namun bedanya kita tidak akan melakukannya ketika kita membuka halaman namun pada saat kita menjalankan fungsi `toggleDarkMode` dan kita tidak hanya menambahkan class pada root element html kita tapi juga akan menambahkan item baru dengan nama theme pada `localStorage` dengan state yang berlaku apakah itu `dark` atau `light`.
- Kita akan mengembalikan object yang menampung fungsi `toggleDarkMode` dan state `darkMode` yang nantinya kedua hal tersebut bisa digunakan secara berdampingan pada component lain.

Setelah membuat `useDarkMode` hooks, kita perlu melakukan beberapa perubahan pada script `Wrapper.jsx`. Kita akan menambahkan event listener pada elemen button yang sudah kita buat tadi. Kurang lebih seperti ini script final dari `Wrapper.jsx` :

```jsx
import useDarkMode from "../hooks/useDarkMode"; // impor useDarkMode hooks dari folder hooks

export default function Wrapper({ children }) {
  const { toggleDarkMode, darkMode } = useDarkMode(); // destructuring object yang dikembalikan oleh useDarkMode hooks.

  return (
    <>
      <header className="px-8 py-4 bg-white dark:bg-gray-900 shadow-lg flex justify-between items-center">
        <ul className="flex">
          <a href="#" className="text-gray-600 dark:text-white mr-4">
            Home
          </a>
          <a href="#" className="text-gray-600 dark:text-white mr-4">
            About
          </a>
          <a href="#" className="text-gray-600 dark:text-white">
            Contact
          </a>
        </ul>
        <div className="flex items-center">
          <button
            className="p-2 md:px-6 md:py-2 text-white dark:text-black bg-purple-700 dark:bg-white hover:bg-purple-800 duration-300 rounded-sm shadow-lg focus:ring focus:ring-purple-300 focus:outline-none"
            type="button"
            onClick={toggleDarkMode} // kita hanya perlu memasukkan nama fungsi dari useDarkMode ke dalam onClick attributes, sehingga React JS mampu mengeksekusi fungsi dari useDarkMode hooks tersebut.
          >
            {darkMode ? (
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1.4em"
                width="1.4em"
                xmlns="http://www.w3.org/2000/svg"
                className="block md:hidden"
              >
                <circle cx={12} cy={12} r={5} />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1.4em"
                width="1.4em"
                xmlns="http://www.w3.org/2000/svg"
                className="block md:hidden"
              >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
            <span className="hidden md:block">Toggle Dark Mode</span>
          </button>
        </div>
      </header>
      <main className="flex-grow p-8 dark:bg-gray-700">{children}</main>
    </>
  );
}
```

Di atas, kita akan mengimpor hooks yang sudah kita buat tadi dan mengambil nilai dan fungsi yang sudah kita buat di dalam `useDarkMode` hooks tersebut dengan menggunakan _destructuring object_. Pada button sendiri, kita menambahkan attribute `onClick` yang berguna sebagai event listener apabila button tersebut diklik maka akan menjalankan fungsi `toggleDarkMode` dari `useDarkMode` hooks. Selain itu saya juga menambahkan variasi di elemen button apabila user menggunakan smartphone maka hanya akan menampilkan icon bulan(apabila dark mode mati) dan icon matahari(apabila dark mode aktif) dan menyembunyikan kalimat 'Toggle Dark Mode' dan apabila user menggunakan laptop atau desktop yang memiliki breakpoints 768px ke atas, maka icon tersebut akan digantikan dengan kalimat 'Toggle Dark Mode'.

Sebenarnya seperti ini saja sudah bisa berjalan dengan normal, namun kamu bisa mengoptimalkannya dengan caramu sendiri, misal menggunakan Context API atau Redux, dan untuk hal itu kamu bisa mencari referensi sendiri di google atau bertanya pada forum-forum yang sesuai.

# Penutup

Itu tadi adalah cara menggunakan dark mode dengan Tailwind CSS dan Next JS, kamu bisa mengembangkannya lebih lanjut karena kode yang saya tulis masih sangat jauh dari kata sempurna, tapi karena saya orangnya gampang males nulis dan mumpung hari ini ada semangat + bahan buat nulis jadi saya paksa sebisa saya untuk nulis.

Apabila kamu memiliki pertanyaan atau rasa mengganjal pada diri kamu, kamu bisa bertanya melalui kontak yang sudah saya sediakan atau menggunakan kolom komentar di bawah ini.

Dan bagi kamu yang ingin mengunjungi demo dan source code yang sudah saya push ke github repository saya. Kamu bisa menggunakan link berikut :

- [Github Repository](https://github.com/alfanjauhari/tailwind-darkmode)
- [Demo](https://tailwind-darkmode.vercel.app)

Terima kasih bagi yang sudah membaca, semoga menjadi ilmu yang sbermanfaat bagi kamu, saya dan semua orang dan saya mohon maaf apabila ada kata-kata yang menyinggung atau menghina itu merupakan salah satu kelemahan diri saya sebagai manusia biasa yang fana ini, jadi ya begitu, sampai jumpa pada artikel berikutnya.
