'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Cog6ToothIcon,
  BellIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CubeIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import api from "@/lib/api";

export default function CollectionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (session?.accessToken) {
      api
        .get("/Collection/GetAll", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })
        .then((res) => {
          const data = res.data.data.map((item: any) => ({
            ...item,
            constants: item.constants || { filters: [], salesChannelNames: [] },
          }));
          setCollections(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("API Hatası:", err);
          setLoading(false);
        });
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 🔹 Sidebar */}
     <aside
  className={`fixed top-0 left-0 lg:static z-40 bg-white border-r p-5 flex flex-col transform transition-transform duration-300
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  w-60 h-screen lg:h-auto lg:translate-x-0`}
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

      {/* 🔹 İçerik */}
      <main className="flex-1 p-6 lg:p-10">
        {/* Üst bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 border rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                Koleksiyon
              </h1>
              <p className="text-gray-500 text-sm">Koleksiyon Listesi</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4 text-gray-500">
            <button><GlobeAltIcon className="w-5 h-5" /></button>
            <button><EnvelopeIcon className="w-5 h-5" /></button>
            <button><BellIcon className="w-5 h-5" /></button>
            <button><MoonIcon className="w-5 h-5" /></button>
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          </div>
        </div>

        {/* 🔹 Tablo / Kart Görünümü */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          {/* Masaüstü görünümü */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-2 font-semibold text-gray-600">Başlık</th>
                  <th className="py-3 px-2 font-semibold text-gray-600">Ürün Koşulları</th>
                  <th className="py-3 px-2 font-semibold text-gray-600">Satış Kanalı</th>
                  <th className="py-3 px-2 font-semibold text-gray-600 text-right">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {collections.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 text-gray-800">{c.info?.name}</td>
                    <td className="py-3 px-2 text-gray-600 text-sm">
                      {c.constants?.filters?.length ? (
                        c.constants.filters.map((f: any, i: number) => (
                          <div key={i}>
                            {f.name} {f.type} {f.value}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 italic">Koşul yok</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-gray-600">
                      {c.constants?.salesChannelNames?.length
                        ? c.constants.salesChannelNames.join(", ")
                        : "—"}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => router.push(`/edit/${c.id}`)}
                        title="Sabitleri Düzenle"
                        className="p-2 rounded-md hover:bg-gray-100 transition"
                      >
                        <Cog6ToothIcon className="w-5 h-5 text-gray-700" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobil görünümü */}
          <div className="md:hidden space-y-4">
            {collections.map((c) => (
              <div
                key={c.id}
                className="border rounded-lg p-4 flex flex-col bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">
                    {c.info?.name || 'Koleksiyon'}
                  </h2>
                  <button
                    onClick={() => router.push(`/edit/${c.id}`)}
                    title="Sabitleri Düzenle"
                    className="p-2 rounded-md hover:bg-gray-200"
                  >
                    <Cog6ToothIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Ürün Koşulları:</strong>{" "}
                  {c.constants?.filters?.length
                    ? c.constants.filters
                        .map((f: any) => `${f.name} ${f.type} ${f.value}`)
                        .join(", ")
                    : "Koşul yok"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Satış Kanalı:</strong>{" "}
                  {c.constants?.salesChannelNames?.length
                    ? c.constants.salesChannelNames.join(", ")
                    : "—"}
                </p>
              </div>
            ))}
          </div>

          {/* Sayfalandırma */}
          <div className="flex justify-center mt-6 space-x-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`w-8 h-8 text-sm rounded ${
                  n === 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
