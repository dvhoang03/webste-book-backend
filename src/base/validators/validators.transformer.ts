import { Transform } from 'class-transformer';
import { config } from '@/config';

interface ITransformerOptions {
  each?: boolean;
  methodObj?: (obj: Record<string, any>, v: any) => any;
}

/**
 * @GenerateAndSetPath('photoPath')
 * Tự động lấy path từ URL và gán vào field đích
 * Nếu `each: true` => xử lý mảng các URL
 */
export function GenerateAndSetPath(
  targetField: string,
  options?: ITransformerOptions,
) {
  return Transform(({ obj, value }) => {
    // Không có dữ liệu thì bỏ qua
    if (!value) return value;

    const bucketPrefix = `${config.MINIO.BUCKET}/`;

    // Hàm xử lý tách path
    const extractPath = (v: string) => {
      if (typeof v !== 'string') return v;
      const index = v.indexOf(bucketPrefix);
      const path =
        index !== -1 ? v.slice(index + bucketPrefix.length).trim() : v.trim();
      return path;
    };

    // Nếu là mảng
    if (options?.each && Array.isArray(value)) {
      const paths = value.map((v) => extractPath(v)).filter(Boolean);

      // Gán vào field đích
      obj[targetField] = paths;

      // Cho phép người dùng can thiệp thêm nếu có methodObj
      if (options.methodObj) {
        obj[targetField] = options.methodObj(obj, paths);
      }

      // Giữ nguyên giá trị gốc
      return value;
    }

    // Nếu là 1 giá trị đơn
    if (typeof value === 'string') {
      const path = extractPath(value);
      obj[targetField] = options?.methodObj
        ? options.methodObj(obj, path)
        : path;
    }

    return value;
  });
}
