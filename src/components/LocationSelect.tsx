"use client";

import { useEffect, useState } from "react";
import { locationsApi } from "@/lib/api/services";
import type { ProvinceOption } from "@/lib/api/types";

// İl/ilçe verisi tüm uygulamada bir kez yüklenip paylaşılır.
let cache: ProvinceOption[] | null = null;
let inflight: Promise<ProvinceOption[]> | null = null;

function loadLocations(): Promise<ProvinceOption[]> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = locationsApi.list().then((data) => { cache = data; return data; });
  }
  return inflight;
}

interface Props {
  province: string;
  district: string;
  onChange: (province: string, district: string) => void;
  required?: boolean;
  /** Tailwind sınıfı; select görünümünü çağıran sayfaya uydurmak için. */
  selectClassName?: string;
  labelClassName?: string;
  showLabels?: boolean;
}

const DEFAULT_SELECT =
  "w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all";

export default function LocationSelect({
  province,
  district,
  onChange,
  required,
  selectClassName = DEFAULT_SELECT,
  labelClassName = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5",
  showLabels = true,
}: Props) {
  const [provinces, setProvinces] = useState<ProvinceOption[]>(cache ?? []);

  useEffect(() => {
    let active = true;
    loadLocations().then((data) => { if (active) setProvinces(data); }).catch(() => {});
    return () => { active = false; };
  }, []);

  const districts = provinces.find((p) => p.name === province)?.districts ?? [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        {showLabels && <label className={labelClassName}>İl</label>}
        <select
          value={province}
          required={required}
          onChange={(e) => onChange(e.target.value, "")}
          className={selectClassName}
        >
          <option value="">İl seçiniz</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>
      <div>
        {showLabels && <label className={labelClassName}>İlçe</label>}
        <select
          value={district}
          required={required}
          disabled={!province}
          onChange={(e) => onChange(province, e.target.value)}
          className={`${selectClassName} disabled:opacity-50`}
        >
          <option value="">{province ? "İlçe seçiniz" : "Önce il seçin"}</option>
          {districts.map((d) => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
