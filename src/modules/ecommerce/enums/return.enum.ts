// /enums/return.enum.ts

export enum ReturnStatus {
  PENDING = 'PENDING', // Yêu cầu đang chờ duyệt
  APPROVED = 'APPROVED', // Đã duyệt (chờ nhận hàng)
  REJECTED = 'REJECTED', // Yêu cầu bị từ chối
  RECEIVED = 'RECEIVED', // Đã nhận được hàng trả
  PROCESSING = 'PROCESSING', // Đang xử lý (kiểm tra hàng,...)
  COMPLETED = 'COMPLETED', // Hoàn tất (đã hoàn tiền/đổi hàng)
}

export enum ReturnReason {
  DAMAGED = 'DAMAGED', // Hàng bị hỏng
  WRONG_ITEM = 'WRONG_ITEM', // Giao nhầm hàng
  NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED', // Không giống mô tả
  CHANGED_MIND = 'CHANGED_MIND', // Đổi ý (thường cho hàng mua)
  EARLY_RETURN = 'EARLY_RETURN', // Trả sớm (cho hàng thuê)
  OTHER = 'OTHER', // Khác
}
