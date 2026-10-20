import type { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {

  // temps debut requete
  const start = performance.now();
 if( req.originalUrl !== '/api/health') {

  res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${duration.toFixed(1)} ms)`);
  });
 }

  next();
}

