export interface PrayerTime {
  name: string;
  time: string;
  arabicName?: string;
}

export interface DailySchedule {
  date: string;
  day: number;
  prayerTimes: PrayerTime[];
}

export interface ImsakiyahResponse {
  code: number;
  message: string;
  data: ImsakiyahData[];
}

export interface ImsakiyahData {
  provinsi: string;
  kabkota: string;
  hijriah: string;
  masehi: string;
  imsakiyah: ImsakiyahDay[];
}

export interface ImsakiyahDay {
  tanggal: number;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}