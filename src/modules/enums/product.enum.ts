export enum RentalStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  LATE = 'LATE',
  CANCELLED = 'CANCELLED',
}

export enum RentalType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum TransactionType {
  RENTAL = 'RENTAL',
  PURCHASE = 'PURCHASE',
}
