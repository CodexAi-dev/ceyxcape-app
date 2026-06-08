import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as xss from 'xss';

// Strips HTML tags and XSS payloads from any string field in incoming request bodies.
// Applied selectively on message/comment/search fields — not on every route.
@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    return this.sanitize(value);
  }

  private sanitize(value: any): any {
    if (typeof value === 'string') return xss.filterXSS(value.trim());
    if (Array.isArray(value)) return value.map(v => this.sanitize(v));
    if (value !== null && typeof value === 'object') {
      const result: Record<string, any> = {};
      for (const key of Object.keys(value)) {
        result[key] = this.sanitize(value[key]);
      }
      return result;
    }
    return value;
  }
}
