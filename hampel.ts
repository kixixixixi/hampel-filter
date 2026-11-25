const median = (xs: number[]): number => {
  const s = [...xs].sort((a, b) => a - b)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

// MAD を正規分布の標準偏差に換算する係数
const K = 1.4826

/**
 * Hampel filter: 各点の前後 halfWindow 点の中央値から
 * threshold * MAD 以上外れた点を外れ値とし、中央値で置換する。
 * 端点は切り詰めた窓で計算する。
 */
export const hampel = (
  data: number[],
  halfWindow = 3,
  threshold = 3,
): { filtered: number[]; outliers: number[] } => {
  const filtered = [...data]
  const outliers: number[] = []
  // ponytail: 窓ごとにソートで O(n·w log w)。大規模データなら二重ヒープの移動中央値へ
  for (let i = 0; i < data.length; i++) {
    const win = data.slice(Math.max(0, i - halfWindow), i + halfWindow + 1)
    const med = median(win)
    const mad = K * median(win.map((x) => Math.abs(x - med)))
    if (Math.abs(data[i] - med) > threshold * mad) {
      filtered[i] = med
      outliers.push(i)
    }
  }
  return { filtered, outliers }
}
