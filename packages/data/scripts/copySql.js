import cpy from 'cpy';
import path from 'path';

const result = await cpy('src/**/*.sqlite.sql', 'dist', {});
console.log(result);
