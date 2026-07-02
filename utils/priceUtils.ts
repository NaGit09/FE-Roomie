export default function formatVND(value: number | string) {
  const num = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(num)) return "0 đ";
  return Math.round(num).toLocaleString("vi-VN") + " đ";
}