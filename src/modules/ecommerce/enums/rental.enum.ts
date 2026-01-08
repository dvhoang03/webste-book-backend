export enum RentalReturnStatus {
  PENDING = 'PENDING', // Khách đã tạo yêu cầu, chờ gửi sách
  APPROVAL = 'APPROVAL',
  IN_TRANSIT = 'IN_TRANSIT', // Khách đã gửi, đang trên đường
  RECEIVED = 'RECEIVED', // Kho đã nhận được
  COMPLETED = 'COMPLETED', // Đã kiểm tra/xử lý xong (tất toán)
  CANCELLED = 'CANCELLED', // Đã hủy (nếu có)
}
