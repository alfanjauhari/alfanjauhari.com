---fm
title: 'useCallback yang Katanya Jamu Cespleng Performa di React JS'
description: 'Pembahasan definisi, cara menggunakan useCallback, dan juga apa saja kelebihan dan kekurangannya.'
excerpt: 'Apakah useCallback berguna untuk-mu?'
thumbnail: '/images/blog/react-usecallback/thumbnail.webp'
category: 'react-js'
date: '2021-01-20 14:24:27'
---endfm

Hal yang paling dibenci kebanyakan developer saat menggunakan React JS adalah **PERFORMANCE OPTIMIZATION**, karena _seharusnya_ developer website tidak suka jika skor performa website yang dibangunnya berwarna merah saat dicek menggunakan tools seperti [Lighthouse](https://web.dev/measure).

React JS mengeluarkan beberapa solusi untuk permasalahan developer di atas, salah satunya adalah _memoization_ yang menurut beberapa sumber memiliki arti sebagai berikut :

> Memoization adalah sebuah fitur yang terdapat di beberapa pemrograman komputer yang menawarkan optimasi di bagian performa dengan menggunakan cache.

Dari penjelasan di atas seharusnya kamu sudah mendapatkan sedikit gambaran tentang definisi dari memoization. Kalau di React JS sendiri memoization berguna untuk caching sebuah component maupun value sehingga tidak perlu melakukan pre-render atau merender kembali component yang bahkan tidak diperlukan. Contoh kasusnya seperti ini :

```typescript
import { memo, useState } from "react";

export default function App() {
  const initialUser = ["Muhammad", "Alfan", "Jauhari"];
  const [users, setUser] = useState<string[]>(initialUser);
  const [text, setText] = useState<string>();

  const handleDelete = (name: string) => {
    setUser((prevUser) => prevUser.filter((user) => user !== name));
  };

  function refill() {
    setUser(initialUser);
  }

  return (
    <>
      {users.length > 0 ? (
        <User users={users} handleDelete={handleDelete} />
      ) : (
        <button onClick={refill}>Refill</button>
      )}
      <input type="text" onChange={(e) => setText(e.target.value)} />
    </>
  );
}

type UserProps = {
  users: string[];
  handleDelete: (name: string) => void;
};

// Komponen User di sini menggunakan High Order Component React.memo() untuk mengetahui apakah ada perubahan props pada komponen User yang berarti komponent User menggunakan Memoization
const User = memo(({ users, handleDelete }: UserProps) => {
  // cek jika komponen user dirender.
  console.log("User component render!");

  return users.map((user) => (
    <li key={user} style={{ display: "flex" }}>
      {user}
      <button onClick={() => handleDelete(user)}>Delete user</button>
    </li>
  ));
});
```

Sebenarnya jika dilihat kodingan di atas sudah benar dan tidak ada yang salah karena sejatinya memang begitu, tetapi ada satu masalah yang cukup menyebalkan untuk beberapa developer perfeksionis, yaitu **Re-Render**.

Benar, jika kita telisik kodingan di atas akan terus menerus melakukan re-render komponen User saat kita melakukan perubahan pada input sehingga dapat menyebabkan masalah yang serius terhadap performa apabila komponen yang di re-render terdapat _heavy function_ di dalamnya.

Hal itu dapat diatasi dengan menggunakan dua hooks memoization yang _katanya jamu cespleng_ performa di React JS. Dua hooks tersebut adalah `useCallback` dan `useMemo`, walaupun saya hanya akan membahas tentang `useCallback` pada artikel kali ini.

Antara dua hooks tersebut sebenarnya saling berkaitan karena sama-sama melakukan memoize di React JS, bedanya kalau `useCallback` return valuenya adalah callback yang sudah di memoize sedangkan `useMemo` mengembalikan value data yang sudah di memoize di dalam `useMemo`. Pada kesempatan kali ini saya akan membahas sedikit tentang `useCallback` dan cara penggunaannya di React JS. Untuk itu mari kita ubah kodingan kita di atas menggunakan `useCallback`.

## Menggunakan useCallback

Di kodingan kita di atas, kita mempunyai dua fungsi `handleDelete` dan `refill`, yang dari namanya saja seharusnya antum bisa menebak kegunaan dua fungsi tersebut. Tapi berhubung saya baik hati akan saya jelaskan sedikit. Jadi, fungsi `handleDelete` akan menghapus data user dari state `users`, sedangkan fungsi `refill` akan mengisi kembali state `users` dengan array `initialUser`.

Setelah mengetahui kegunaan kedua fungsi tersebut mari kita menyelam lebih jauh ke dalam pembahasan kita kali ini. Jadi permasalahan yang dihadapi adalah setiap kita mengubah state `text` melalui input maka komponen User akan ikut di re-render yang bahkan komponen User tidak memiliki hubungan dengan input text.

Apabila kasus kita tersebut ingin teratasi, maka kita perlu menyisipkan function `handleDelete` sebagai callback ke dalam `useCallback`, yang kurang lebih berbentuk seperti ini :

```typescript
import { useCallback } from "react";

export default function App() {
  // ...kode sebelumnya
  const handleDelete = useCallback(
    (name: string) => setUser((prevUser) => prevUser !== name),
    [users]
  );
  // ...kode setelahnya
}
```

Kodingan di atas bermaksud untuk memberi tahu React bahwa jangan re-render komponen User apabila tidak ada perubahan pada state `users` bahkan jika komponen `App` di re-render saat kita mengubah value di input.

## Kapan Waktu Menggunakan useCallback?

**useCallback dapat berguna dengan tepat** apabila kita menempatkannya pada kondisi yang tepat, misal seperti kita pada kasus di atas menginkan komponen User tidak terus di re-render pada saat kita mengubah value di input yang tidak ada hubungannya dengan komponen User.

Namun, **useCallback juga bisa menjadi masalah performa pada aplikasi React JS kita.** Contohnya kasus dengan kodingan di bawah ini :

```typescript
import { useCallback, PropsWithChildren } from 'react';

export default function App() {
    const handleClick = useCallback(() => console.log('Clicked!'), []);

    return <Button onClick={handleClick}>Click Me!</Button>
}

function Button({ onClick, children }: PropsWithChildren<{ onClick: (() => void) }>) {
    return <button onClick={onClick}>{children}></button>
}
```

Pada kodingan di atas terlihat jika kita menambahkan `useCallback` pada fungsi `handleClick` yang sebenarnya tidak perlu dilakukan, dan fungsi `handleClick` ini juga akan di buat lagi apabila komponen App di re-render sehingga dapat mengakibatkan performa aplikasi React JS kita menurun, akan lebih baik jika kita menulisnya seperti ini :

```typescript
import { PropsWithChildren } from 'react';

export default function App() {
    const handleClick = () => console.log('Clicked!')

    return <Button onClick={handleClick}>Click Me!</Button>
}

function Button({ onClick, children }: PropsWithChildren<{ onClick: (() => void) }>) {
    return <button onClick={onClick}>{children}></button>
}
```

Tentunya kodingan kita di atas yang tanpa menggunakan `useCallback` lebih simpel _walaupun hanya beberapa baris_, namun hal tersebut sangat berguna apabila aplikasi React JS kita berkembang lebih berat lagi.

## Kesimpulan

Dari kasus di atas, kita bisa menyimpulkan bahwasanya _`useCallback` dapat berguna apabila kita menempatkannya pada kondisi yang memang dibutuhkan_. Sehingga kita tidak menyia-nyiakan resource server dengan pemrosesan yang berat.

Jadi kita sebagai developer harus pintar-pintar mengetahui kebutuhan apa saja yang diperlukan oleh aplikasi React JS, sama halnya seperti kamu yang terus-terusan memberikan hadiah ke gebetan yang sebenarnya tidak membutuhkan hal tersebut karena ada hati yang harus dijaga.

Sampai di sini saja artikel tentang `useCallback` kali ini, apabila terdapat kesalahan penulisan, penjelasan, dan ejaan silakan dikoreksi dengan mengirim kontak ke saya melalui formulir kontak yang sudah disediakan, karena saya belum sempat menambahkan fitur comment di sini, mungkin hari ini, hari esok atau nanti.

Trims!
