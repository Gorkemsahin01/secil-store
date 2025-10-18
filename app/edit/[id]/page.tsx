'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  BellIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  MoonIcon,
  Squares2X2Icon,
  Bars4Icon,
  PhotoIcon,
  FunnelIcon,
  TrashIcon,
  XMarkIcon,
  InformationCircleIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import {
  HomeIcon,
  CubeIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';

interface Product {
  id: number;
  name: string;
  code: string;
  imageUrl: string;
}

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();

  const [products, setProducts] = useState<Product[]>([]);
  const [constants, setConstants] = useState<Product[]>([]);
  const [draggingProduct, setDraggingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<string[]>(['Yıl: 2024']);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [productCode, setProductCode] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [gridCols, setGridCols] = useState(3);
  const [gridCount, setGridCount] = useState(6);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const collectionId = String(params.id || '');
    if (!session?.accessToken) return;

    const fetchProducts = async () => {
      try {
        const res = await api.post(
          `/Collection/${collectionId}/GetProductsForConstants`,
          {},
          { headers: { Authorization: `Bearer ${session.accessToken}` } }
        );
        const data = res.data?.data?.data ?? [];
        if (!Array.isArray(data)) return;
        const formattedProducts = data.map((item: any, index: number) => {
          const imagePath = item.imageUrl?.trim() || "";
          const isFullUrl = imagePath.startsWith("http");
          return {
            id: item.id ?? index,
            name: item.name ?? "Ürün",
            code: item.code ?? "123456789",
            imageUrl: isFullUrl
              ? imagePath
              : `https://cdn.secilstore.com${imagePath.startsWith("/") ? "" : "/"}${imagePath}`,
          };
        });
        setProducts(formattedProducts);
      } catch (err) {
        console.error('API Hatası:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [params.id, session]);

  const handleDrop = (product: Product) => {
    if (constants.some((p) => p.id === product.id)) return;
    setConstants((prev) => [...prev, product]);
  };

  const handleRemove = (product: Product) => {
    Swal.fire({
      title: 'Uyarı!',
      text: 'Sabitlerden çıkarılacaktır. Emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Onayla',
      cancelButtonText: 'Vazgeç',
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#EF4444',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setConstants((prev) => prev.filter((p) => p.id !== product.id));
        Swal.fire({
          title: 'Başarılı',
          text: 'Sabitlerden çıkarıldı.',
          icon: 'success',
          confirmButtonColor: '#10B981',
        });
      }
    });
  };

  const handleSearch = () => {
    const activeFilters: string[] = [];
    if (selectedYear) activeFilters.push(`Yıl: ${selectedYear}`);
    if (selectedStock) activeFilters.push(`Depo: ${selectedStock}`);
    if (minStock) activeFilters.push(`Min Stok: ${minStock}`);
    if (maxStock) activeFilters.push(`Max Stok: ${maxStock}`);
    if (productCode) activeFilters.push(`Kod: ${productCode}`);
    if (sortOrder) activeFilters.push(`Sıralama: ${sortOrder}`);
    setFilters(activeFilters);
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setSelectedYear('');
    setSelectedStock('');
    setMinStock('');
    setMaxStock('');
    setProductCode('');
    setSortOrder('');
    setFilters([]);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Yükleniyor...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* 🟢 Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 bg-white border-r p-5 flex flex-col transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-60 h-screen lg:static lg:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="text-2xl font-bold text-gray-700 tracking-tight">LOGO</div>
          <button
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full text-left p-2 rounded-md hover:bg-gray-100 flex items-center gap-3 transition"
          >
            <HomeIcon className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => router.push('/products')}
            className="w-full text-left p-2 rounded-md hover:bg-gray-100 flex items-center gap-3 transition"
          >
            <CubeIcon className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Ürünler</span>
          </button>

          <div className="mt-4 border-t border-gray-200"></div>

          <button
            onClick={() => router.push('/collection')}
            className="w-full text-left p-2 rounded-md bg-blue-100 text-blue-700 font-semibold flex items-center gap-3 transition"
          >
            <FolderIcon className="w-5 h-5 text-blue-700" />
            <span>Koleksiyon</span>
          </button>
        </nav>
      </aside>

      {/* 🟢 Mobilde Sidebar Açıkken Arka Plan */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🟣 İçerik */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Üst Bar */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 border rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Sabitleri Düzenle</h1>
              <p className="text-gray-500 text-sm">Koleksiyon - 1 / {products.length} Ürün</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4 text-gray-500">
            <GlobeAltIcon className="w-5 h-5 cursor-pointer" />
            <EnvelopeIcon className="w-5 h-5 cursor-pointer" />
            <BellIcon className="w-5 h-5 cursor-pointer" />
            <MoonIcon className="w-5 h-5 cursor-pointer" />
            <div className="w-8 h-8 rounded-full bg-gray-300" />
          </div>
        </div>

        {/* 🟨 Filtre Barı */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div className="flex-1 border border-gray-300 rounded-md p-3 bg-white shadow-sm w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-gray-700">Uygulanan Kriterler:</h3>
              {filters.length > 0 ? (
                filters.map((f, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200"
                  >
                    {f}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">Henüz filtre uygulanmadı</span>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2 bg-black text-white text-xs px-4 py-2 rounded-md hover:bg-gray-800 sm:ml-3 h-[40px]"
          >
            <FunnelIcon className="w-4 h-4" /> Filtreler
          </button>
        </div>

        {/* 🟦 Ürünler & Sabitler */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Ürünler */}
          <div className="flex-1 bg-white border rounded-lg p-4 shadow-sm">
            <h2 className="text-md font-semibold mb-3">Koleksiyon Ürünleri</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh]">
              {products.map((p) => {
                const isAdded = constants.some((c) => c.id === p.id);
                return (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={() => setDraggingProduct(p)}
                    onDragEnd={() => setDraggingProduct(null)}
                    className={`relative border rounded-lg p-2 flex flex-col items-center transition ${isAdded ? 'opacity-60 grayscale' : 'hover:shadow-md'
                      }`}
                  >
                    <div className="w-full h-36 sm:h-40 bg-gray-100 rounded mb-2 flex items-center justify-center overflow-hidden relative">
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        width={150}
                        height={150}
                        className="object-cover w-full h-full rounded"
                      />
                      {isAdded && (
                        <div className="absolute bottom-2 bg-black/80 text-white text-xs px-3 py-1 rounded">
                          Eklendi
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-700 text-center truncate w-full">
                      {p.name}
                    </div>
                    <div className="text-xs text-gray-500 text-center">{p.code}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sabitler */}
          <div className="w-full lg:w-[40%] bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-md font-semibold">Sabitler</h2>
              <div className="flex items-center space-x-2 text-gray-500">
                <Squares2X2Icon
                  className={`w-5 h-5 cursor-pointer hover:text-blue-500 ${gridCols === 2 ? 'text-blue-600' : ''
                    }`}
                  onClick={() => {
                    setGridCols(2);
                    setGridCount(4);
                  }}
                />
                <Bars4Icon
                  className={`w-5 h-5 cursor-pointer hover:text-blue-500 ${gridCols === 3 ? 'text-blue-600' : ''
                    }`}
                  onClick={() => {
                    setGridCols(3);
                    setGridCount(6);
                  }}
                />
                <PhotoIcon
                  className={`w-5 h-5 cursor-pointer hover:text-blue-500 ${gridCols === 4 ? 'text-blue-600' : ''
                    }`}
                  onClick={() => {
                    setGridCols(4);
                    setGridCount(16);
                  }}
                />
              </div>
            </div>

            <div
              className={`grid gap-4 overflow-y-auto max-h-[70vh]`}
              style={{
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: gridCount }).map((_, i) => (
                <div
                  key={i}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => draggingProduct && handleDrop(draggingProduct)}
                  className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 hover:border-gray-400 cursor-pointer transition relative group"
                >
                  {constants[i] ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={constants[i].imageUrl}
                        alt={constants[i].name}
                        width={150}
                        height={150}
                        className="object-cover w-full h-full rounded group-hover:blur-[2px] transition"
                      />
                      <button
                        onClick={() => handleRemove(constants[i]!)}
                        className="absolute inset-0 hidden group-hover:flex items-center justify-center text-white"
                      >
                        <div className="bg-black/60 p-2 rounded-full">
                          <TrashIcon className="w-6 h-6 text-white" />
                        </div>
                      </button>
                    </div>
                  ) : (
                    <PhotoIcon className="w-10 h-10 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🟩 Alt Butonlar */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
          <button
            onClick={() => router.push('/collection')}
            className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-700 w-full sm:w-auto"
          >
            Vazgeç
          </button>
          <button
            onClick={() =>
              Swal.fire({
                title: 'Başarılı!',
                text: 'Değişiklikler kaydedildi.',
                icon: 'success',
                confirmButtonColor: '#10B981',
              })
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto"
          >
            Kaydet
          </button>
        </div>
      </main>

      {/* 🟣 Filtre Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-[900px] rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFilterModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <h3 className="font-semibold mb-2">Filtreler</h3>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Yıl Seçiniz</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
                <select className="w-full border rounded-md p-2 mt-2">
                  <option>Filtre Seçiniz</option>
                </select>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Stok</h3>
                <select
                  value={selectedStock}
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Depo Seçiniz</option>
                  <option value="Merkez">Merkez</option>
                  <option value="Ankara">Ankara</option>
                </select>
                <input
                  type="number"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  placeholder="Minimum Stok"
                  className="w-full border rounded-md p-2 mt-2"
                />
                <input
                  type="number"
                  value={maxStock}
                  onChange={(e) => setMaxStock(e.target.value)}
                  placeholder="Maksimum Stok"
                  className="w-full border rounded-md p-2 mt-2"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">Ürün Kodu</h3>
                <input
                  type="text"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="Ürün kodu giriniz"
                  className="w-full border rounded-md p-2"
                />
                <div className="flex items-center mt-2 gap-2">
                  <input type="checkbox" />
                  <label className="text-sm">Tüm Bedenlerinde Stok Olanlar</label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-1">
                  Sıralamalar <InformationCircleIcon className="w-4 h-4" />
                </h3>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Seçiniz</option>
                  <option value="A-Z">A-Z</option>
                  <option value="Z-A">Z-A</option>
                </select>
              </div>
            </div>

            <div className="border p-3 rounded-md mt-3">
              <h4 className="font-semibold mb-2 text-sm">Uygulanan Kriterler</h4>
              <div className="flex flex-wrap gap-2">
                {filters.length > 0 ? (
                  filters.map((f, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200"
                    >
                      {f}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">Henüz filtre uygulanmadı</span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 w-full sm:w-auto"
              >
                Seçimi Temizle
              </button>
              <button
                onClick={handleSearch}
                className="px-6 py-2 border border-black text-black rounded-md hover:bg-gray-100 w-full sm:w-auto"
              >
                Ara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
