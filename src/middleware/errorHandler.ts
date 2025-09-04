import { type NextFunction, type Request, type Response } from 'express';

export type AppError = Error & { status?: number };
const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
export default errorHandler;
