---fm
title: "Reconciliation: Proses di Balik React JS Virtual DOM"
description: "Memahami bersama proses reconciliation pada React JS Virtual DOM"
excerpt: "Reconciliation proses perbandingan pada React JS Virtual DOM"
thumbnail: "/images/blog/react-reconciliation/thumbnail.webp"
category: "reactjs"
date: "2022-07-27 12:09:25"
---endfm

Setelah hampir satu tahun tidak membuat catatan di situs kecil ini, akhirnya ada waktu menulis tentang per-React an walaupun hanya sedikit di penghujung waktu resign ini 😄.

Seperti yang sudah tertera pada judul di atas, saya mau sedikit mencoba membagikan pemahaman yang baru saja pelajari beberapa waktu yang lalu tentang _reconciliation_ pada Virtual DOM React JS.

_Disclaimer: Tulisan ini hanya menjadi catatan saya dalam proses memahami tentang konsep reconcilitaion ini dan saya harap bisa menjadi referensi untuk pembaca tulisan ini. Sehingga, apabila nantinya ditemukan kesalahan pada penjelasan atau tulisan saya, saya sangat menghargai masukan dari teman-teman di sini baik secara langsung atau melalui kontribusi di [Github website ini](https://github.com/alfanjauhari/alfanjauhari.com)._

## Reconciliation

Setelah menjelajah _Gulu Gulu_ (Google) tentang definisi dari _reconciliation_ saya menemukan beberapa definisi yang berbeda, namun tetap mengarah pada proses membedakan sesuatu.

Terkadang istilah _reconciliation_ juga digunakan oleh warga akuntan untuk membedakan catatan keuangan.

## Virtual DOM

Seperti yang diketahui, React JS menggunakan Virtual DOM sebagai konsep untuk mengelola UI secara efisien dan cepat.

Virtual DOM sendiri adalah representasi “virtual” dari Real DOM yang ada pada browser, sehingga ketika kita berurusan dengan DOM di React JS, kita hanya berurusan dengan Virtual DOM punya React tanpa berurusan langsung dengan Real DOM yang ada.

Sebenarnya Virtual DOM ini bukan sebuah teknologi eksklusif yang ada di React JS. Virtual DOM juga ditemui di Vue JS sebagai framework JavaScript selain React JS (_iya iya library_) yang menggunakan Virtual DOM. Sehingga membuat Virtual DOM ini menjadi lebih terlihat sebagai pattern daripada teknologi khusus.

## Virtual DOM Reconciliation

Seperti yang sudah saya katakan, bahwasanya apabila kita berurusan dengan DOM di React JS maka kita tidak akan berurusan langsung dengan Real DOM yang ada. Alhasil kita hanya akan berurusan dengan Virtual DOM di React saja.

Hal tersebut membuat Virtual DOM menjanjikan keunggulan berupa performa yang lebih baik dikarenakan kita tidak mengubah Real DOM secara langsung.

**Mengapa lebih baik?** Karena, setiap kita melakukan perubahan pada element yang biasanya melalui state/props, kita tidak serta merta mengubah element yang ada pada Real DOM, namun React JS akan membandingkan antara perubahan di Virtual DOM dengan _snapshot_ dari Virtual DOM sebelum perubahan terjadi, sehingga apabila ditemukan perbedaan, React JS akan mengubah Real DOM yang ada berdasarkan Virtual DOM terbaru. Proses inilah yang dinamai dengan _reconciliation_.

## Kesimpulan

Dengan penjelasan di atas, kita bisa menarik kesimpulan bahwasanya _reconciliation_ pada React Virtual DOM merupakan proses dimana React membandingkan antara Virtual DOM yang memiliki perubahan dengan _snapshot_ Virtual DOM sebelum perubahan tersebut terjadi, yang kemudian hasil dari perbandingan tersebut akan digunakan sebagai acuan apakah ada perubahan yang mengharuskan Real DOM diperbarui atau tidak.

Atas kurang lebih nya saya mohon maaf, _wabilahitaufik walhidayah wassalamu’alaikum wr.wb._
