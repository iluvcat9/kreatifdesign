document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "CV Waitress", img: "1.jpg", price: 40000 },
      { id: 2, name: "CV Web Design", img: "2.jpg", price: 40000 },
      { id: 3, name: "CV Koki", img: "3.jpg", price: 40000 },
      { id: 4, name: "CV Otomotis", img: "4.jpg", price: 40000 },
      { id: 5, name: "CV Akuntan", img: "5.jpg", price: 40000 },
      { id: 6, name: "CV Hair Stylist", img: "6.jpg", price: 40000 },
      { id: 7, name: "CV Fotografi", img: "7.jpg", price: 40000 },
      { id: 8, name: "CV Pertanian", img: "8.jpg", price: 40000 },
      { id: 9, name: "CV Web Developer", img: "9.jpg", price: 40000 },
      { id: 10, name: "CV Teknisi", img: "10.jpg", price: 40000 },
      { id: 11, name: "CV Accounting", img: "11.jpg", price: 40000 },
      { id: 12, name: "CV Barista", img: "12.jpg", price: 40000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada /cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            //jika barang sudah ada, tambah quantity dan total
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      //ambil item yang mau di remove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      //jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
          //jika bukan barang yang di klik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        //jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

//kirim data ketika tombol checkout diklik
checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open("http://wa.me/6289637313619?text=" + encodeURIComponent(message));
});

// format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer
  Nama: ${obj.name}
  Email: ${obj.email}
  No HP: ${obj.phone}
Data Pesanan
 ${JSON.parse(obj.items).map(
   (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
 )}
 TOTAL: ${rupiah(obj.total)}
 Terima kasih.`;
};

// konversi ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
