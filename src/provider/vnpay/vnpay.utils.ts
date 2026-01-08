// src/provider/vnpay/vnpay.utils.ts

export const sortObject = (obj: Record<string, any>): Record<string, any> => {
  const sorted: any = {};
  const str: any = [];
  let key;
  for (key in obj) {
    // ---- SỬA DÒNG NÀY ----
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // ---------------------
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    // Bạn cũng nên kiểm tra ở đây cho an toàn,
    // nhưng lỗi chính là ở vòng lặp 'for...in'
    const value = obj[str[key]];
    sorted[str[key]] = encodeURIComponent(value).replace(/%20/g, '+');
  }
  return sorted;
};

// export const validateChecksum = (vnp_Params: Record<string, any>): boolean => {
//   const secureHash = vnp_Params['vnp_SecureHash'];
//
//   // Xóa hash và hashType khỏi params
//   delete vnp_Params['vnp_SecureHash'];
//   delete vnp_Params['vnp_SecureHashType'];
//
//   const sortedParams = this.sortObject(vnp_Params);
//   const signData = querystring.stringify(sortedParams, { encode: false });
//   const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
//   const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
//
//   return secureHash === signed;
// };
