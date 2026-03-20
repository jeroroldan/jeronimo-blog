---
title: "CSV"
code: "csv"
description: "CSV: La Guía Definitiva de Consejos y Enseñanzas"
pubDate: "Jun 19 2024"
heroImage: "../../assets/blog-placeholder-1.jpg"
---

# 🎓 Master Class: Manejo Profesional de Archivos de Exportación

### Data Engineering & Software Development — Guía Completa con TypeScript

> **Audiencia:** Desarrolladores y Data Engineers que necesitan dominar la creación, lectura, optimización y exportación de archivos en producción.  
> **Stack:** TypeScript + Node.js  
> **Nivel:** Intermedio → Avanzado

---

## Tabla de Contenidos

1. [Fundamentos: ¿Qué es un archivo de exportación?](#1-fundamentos)
2. [CSV — El rey del intercambio de datos](#2-csv)
3. [JSON y NDJSON — Datos estructurados](#3-json--ndjson)
4. [Excel (XLSX) — El mundo corporativo](#4-excel-xlsx)
5. [Parquet — El estándar analítico](#5-parquet)
6. [XML — Sistemas legacy y enterprise](#6-xml)
7. [PDF — Reportes y documentos finales](#7-pdf)
8. [Archivos comprimidos: ZIP, GZIP, TAR](#8-compresión)
9. [Streaming: exportar sin morir en el intento](#9-streaming)
10. [Optimización y Performance](#10-optimización-y-performance)
11. [Patrones de diseño para exportaciones](#11-patrones-de-diseño)
12. [Seguridad en exportaciones](#12-seguridad)
13. [Casos de uso reales](#13-casos-de-uso-reales)
14. [Checklist de producción](#14-checklist-de-producción)

---

## 1. Fundamentos

### ¿Qué es un archivo de exportación?

Un archivo de exportación es la serialización de datos en memoria a un formato persistente y transferible. Cada formato tiene trade-offs:

| Formato | Legible por humanos |      Tamaño | Velocidad lectura | Velocidad escritura |  Tipado |
| ------- | ------------------: | ----------: | ----------------: | ------------------: | ------: |
| CSV     |             ✅ Alto |       Medio |            Rápido |          Muy rápido |   ❌ No |
| JSON    |             ✅ Alto |      Grande |             Medio |               Medio | Parcial |
| NDJSON  |            ✅ Medio |      Grande |        Muy rápido |          Muy rápido | Parcial |
| XLSX    |            ✅ Medio |      Grande |             Lento |               Lento |   ✅ Sí |
| Parquet |               ❌ No |     Pequeño |        Muy rápido |              Rápido |   ✅ Sí |
| XML     |             ✅ Alto |  Muy grande |             Lento |               Lento |   ✅ Sí |
| GZIP    |               ❌ No | Muy pequeño |             Medio |               Medio |     N/A |

### Regla de oro

```
Elige el formato según quién consume el archivo, no quien lo produce.
```

- Usuario final → XLSX, PDF, CSV
- Otro sistema → JSON, XML, Parquet
- Análisis masivo → Parquet, NDJSON
- Archivado → GZIP + CSV/JSON

---

## 2. CSV

### Anatomía de un CSV

```
nombre,edad,ciudad,salario
"García, Juan",28,"Buenos Aires",75000.50
"López, María",34,"Córdoba",92000.00
```

**Problemas comunes que destruyen un CSV:**

- Comas dentro de valores sin escapar
- Saltos de línea en campos de texto
- Encoding incorrecto (UTF-8 vs Latin-1)
- BOM (Byte Order Mark) inesperado en Excel
- Números con punto vs coma decimal según locale

### Implementación desde cero en TypeScript

```typescript
// csv.ts — Parser y serializer completo

interface CsvOptions {
  delimiter?: string; // default ","
  quote?: string; // default '"'
  escape?: string; // default '"'
  lineTerminator?: string; // default "\n"
  headers?: boolean; // incluir cabeceras
  encoding?: BufferEncoding;
  bom?: boolean; // añadir BOM para Excel
}

// ✅ Serializar: objeto → CSV string
function serializeToCsv<T extends Record<string, unknown>>(
  data: T[],
  options: CsvOptions = {},
): string {
  const {
    delimiter = ",",
    quote = '"',
    lineTerminator = "\n",
    headers = true,
    bom = false,
  } = options;

  if (data.length === 0) return "";

  const keys = Object.keys(data[0]);

  // Función para escapar un campo individual
  const escapeField = (value: unknown): string => {
    if (value === null || value === undefined) return "";

    const str = String(value);

    // Necesita comillas si contiene: delimiter, quote, lineTerminator, o espacios al inicio/fin
    const needsQuoting =
      str.includes(delimiter) ||
      str.includes(quote) ||
      str.includes("\n") ||
      str.includes("\r") ||
      str.startsWith(" ") ||
      str.endsWith(" ");

    if (!needsQuoting) return str;

    // Escapar comillas internas duplicándolas (estándar RFC 4180)
    return `${quote}${str.replace(new RegExp(quote, "g"), `${quote}${quote}`)}${quote}`;
  };

  const rows: string[] = [];

  // Cabeceras
  if (headers) {
    rows.push(keys.map(escapeField).join(delimiter));
  }

  // Filas de datos
  for (const row of data) {
    rows.push(keys.map((key) => escapeField(row[key])).join(delimiter));
  }

  const csv = rows.join(lineTerminator);

  // BOM para compatibilidad con Excel (UTF-8 BOM)
  return bom ? `\uFEFF${csv}` : csv;
}

// ✅ Parsear: CSV string → objetos tipados
function parseCsv<T = Record<string, string>>(
  input: string,
  options: CsvOptions = {},
): T[] {
  const { delimiter = ",", quote = '"' } = options;

  const lines = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  if (lines.length === 0) return [];

  // Parsear una línea respetando campos entre comillas
  const parseLine = (line: string): string[] => {
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === quote) {
        if (inQuotes && nextChar === quote) {
          // Comilla escapada (doble comilla → una comilla)
          current += quote;
          i += 2;
        } else {
          // Entrada/salida de modo comillas
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === delimiter && !inQuotes) {
        fields.push(current);
        current = "";
        i++;
      } else {
        current += char;
        i++;
      }
    }

    fields.push(current);
    return fields;
  };

  const headers = parseLine(lines[0]);
  const result: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;

    const values = parseLine(lines[i]);
    const obj: Record<string, string> = {};

    headers.forEach((header, idx) => {
      obj[header] = values[idx] ?? "";
    });

    result.push(obj as T);
  }

  return result;
}
```

### Exportar CSV a archivo con Node.js

```typescript
import { writeFileSync, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

interface User {
  id: number;
  name: string;
  email: string;
  salary: number;
  joinedAt: Date;
}

// ✅ Para datasets pequeños (<100k filas): todo en memoria
async function exportSmallDataset(
  users: User[],
  outputPath: string,
): Promise<void> {
  const csv = serializeToCsv(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      salary: u.salary.toFixed(2), // Formato numérico consistente
      joinedAt: u.joinedAt.toISOString(), // Fecha en ISO 8601
    })),
    { bom: true }, // BOM para que Excel lo abra correctamente
  );

  writeFileSync(outputPath, csv, "utf8");
  console.log(
    `✅ Exportado: ${outputPath} (${Buffer.byteLength(csv, "utf8")} bytes)`,
  );
}

// ✅ Para datasets grandes (>100k filas): streaming
async function exportLargeDataset(
  getDataChunk: (offset: number, limit: number) => Promise<User[]>,
  outputPath: string,
  chunkSize = 5_000,
): Promise<void> {
  const writeStream = createWriteStream(outputPath, { encoding: "utf8" });

  // Cabecera
  writeStream.write("\uFEFF"); // BOM
  writeStream.write("id,name,email,salary,joinedAt\n");

  let offset = 0;
  let totalRows = 0;

  while (true) {
    const chunk = await getDataChunk(offset, chunkSize);
    if (chunk.length === 0) break;

    // Serializar sin cabeceras (ya las escribimos)
    const csvChunk = serializeToCsv(
      chunk.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        salary: u.salary.toFixed(2),
        joinedAt: u.joinedAt.toISOString(),
      })),
      { headers: false },
    );

    writeStream.write(csvChunk + "\n");
    totalRows += chunk.length;
    offset += chunkSize;

    // ⚠️ Importante: esperar el drain si el buffer está lleno
    if (!writeStream.write("")) {
      await new Promise((resolve) => writeStream.once("drain", resolve));
    }
  }

  await new Promise<void>((resolve, reject) => {
    writeStream.end((err: Error | null | undefined) =>
      err ? reject(err) : resolve(),
    );
  });

  console.log(
    `✅ Exportado: ${totalRows.toLocaleString()} filas en ${outputPath}`,
  );
}
```

### Validación de CSV importado

```typescript
import { z } from "zod"; // npm install zod

// Definir schema de validación
const UserCsvSchema = z.object({
  id: z
    .string()
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().positive()),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  salary: z.string().transform((v) => parseFloat(v.replace(",", "."))),
  joinedAt: z.string().datetime(),
});

type ParsedCsvError = {
  row: number;
  field: string;
  message: string;
  rawValue: string;
};

function validateAndParseCsv(csvContent: string): {
  valid: z.infer<typeof UserCsvSchema>[];
  errors: ParsedCsvError[];
} {
  const rows = parseCsv(csvContent);
  const valid: z.infer<typeof UserCsvSchema>[] = [];
  const errors: ParsedCsvError[] = [];

  rows.forEach((row, index) => {
    const result = UserCsvSchema.safeParse(row);

    if (result.success) {
      valid.push(result.data);
    } else {
      result.error.issues.forEach((issue) => {
        errors.push({
          row: index + 2, // +1 por cabecera, +1 porque es 1-indexed
          field: issue.path.join("."),
          message: issue.message,
          rawValue: String((row as Record<string, unknown>)[issue.path[0]]),
        });
      });
    }
  });

  return { valid, errors };
}
```

---

## 3. JSON y NDJSON

### JSON estándar vs NDJSON

**JSON estándar** — todo el array en memoria:

```json
[
  { "id": 1, "name": "Juan" },
  { "id": 2, "name": "María" }
]
```

**NDJSON (Newline Delimited JSON)** — una línea, un objeto, streamable:

```
{"id": 1, "name": "Juan"}
{"id": 2, "name": "María"}
```

> NDJSON es el estándar para pipelines de datos, logs, y exportaciones masivas porque puede procesarse línea a línea sin cargar todo en memoria.

### Exportar JSON con control total

```typescript
import { writeFileSync } from "fs";
import { createWriteStream } from "fs";

// ✅ JSON con tipos especiales serializados correctamente
function safeJsonStringify(data: unknown, pretty = false): string {
  return JSON.stringify(
    data,
    (key, value) => {
      // Fechas → ISO string
      if (value instanceof Date) return value.toISOString();
      // BigInt → string (JSON no soporta BigInt nativamente)
      if (typeof value === "bigint") return value.toString();
      // undefined en arrays → null (JSON omite undefined en objetos, null en arrays)
      if (value === undefined) return null;
      // Map → objeto plano
      if (value instanceof Map) return Object.fromEntries(value);
      // Set → array
      if (value instanceof Set) return Array.from(value);
      return value;
    },
    pretty ? 2 : 0,
  );
}

// ✅ Exportar JSON paginado con metadata
interface ExportMetadata {
  exportedAt: string;
  totalRecords: number;
  version: string;
  schema: string;
}

interface JsonExport<T> {
  metadata: ExportMetadata;
  data: T[];
}

async function exportJson<T>(
  data: T[],
  outputPath: string,
  options: { pretty?: boolean; metadata?: Partial<ExportMetadata> } = {},
): Promise<void> {
  const payload: JsonExport<T> = {
    metadata: {
      exportedAt: new Date().toISOString(),
      totalRecords: data.length,
      version: "1.0",
      schema: "users",
      ...options.metadata,
    },
    data,
  };

  const content = safeJsonStringify(payload, options.pretty);
  writeFileSync(outputPath, content, "utf8");
}

// ✅ Exportar NDJSON (streaming, ideal para millones de registros)
async function exportNdjson<T>(
  getChunk: (offset: number, limit: number) => Promise<T[]>,
  outputPath: string,
  chunkSize = 10_000,
): Promise<void> {
  const stream = createWriteStream(outputPath, { encoding: "utf8" });

  let offset = 0;
  let total = 0;

  while (true) {
    const chunk = await getChunk(offset, chunkSize);
    if (chunk.length === 0) break;

    // Una línea por objeto, sin separadores extra
    const lines =
      chunk.map((item) => safeJsonStringify(item)).join("\n") + "\n";
    stream.write(lines);

    total += chunk.length;
    offset += chunkSize;

    process.stdout.write(
      `\r📤 Exportando... ${total.toLocaleString()} registros`,
    );
  }

  await new Promise<void>((resolve, reject) =>
    stream.end((err: Error | null | undefined) =>
      err ? reject(err) : resolve(),
    ),
  );

  console.log(`\n✅ NDJSON exportado: ${total.toLocaleString()} registros`);
}

// ✅ Parsear NDJSON en streaming (lectura línea por línea)
import { createReadStream } from "fs";
import * as readline from "readline";

async function* parseNdjsonStream<T>(filePath: string): AsyncGenerator<T> {
  const fileStream = createReadStream(filePath, { encoding: "utf8" });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (line.trim() === "") continue;
    try {
      yield JSON.parse(line) as T;
    } catch {
      console.warn(`⚠️ Línea JSON inválida: ${line.substring(0, 80)}...`);
    }
  }
}

// Uso del generador:
async function processNdjson(filePath: string): Promise<void> {
  let count = 0;
  for await (const user of parseNdjsonStream<User>(filePath)) {
    // Procesar de a uno sin cargar todo en memoria
    count++;
  }
  console.log(`Procesados: ${count} registros`);
}
```

---

## 4. Excel (XLSX)

Excel sigue siendo el formato más pedido en el mundo empresarial. La librería de referencia en el ecosistema Node.js es **ExcelJS**.

```bash
npm install exceljs
npm install --save-dev @types/node
```

### Exportación profesional con ExcelJS

```typescript
import ExcelJS from "exceljs";

interface SalesReport {
  rep: string;
  region: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  total: number;
}

async function exportExcelReport(
  data: SalesReport[],
  outputPath: string,
): Promise<void> {
  const workbook = new ExcelJS.Workbook();

  // Metadata del workbook
  workbook.creator = "DataExportService";
  workbook.lastModifiedBy = "Sistema";
  workbook.created = new Date();
  workbook.modified = new Date();

  // ── Hoja 1: Datos crudos ──────────────────────────────────────────
  const dataSheet = workbook.addWorksheet("Datos", {
    pageSetup: { paperSize: 9, orientation: "landscape" }, // A4 landscape
    views: [{ state: "frozen", ySplit: 1 }], // Cabecera fija
  });

  // Definir columnas con tipos y anchos
  dataSheet.columns = [
    {
      header: "Representante",
      key: "rep",
      width: 25,
      style: { alignment: { horizontal: "left" } },
    },
    { header: "Región", key: "region", width: 15 },
    { header: "Q1", key: "q1", width: 14, style: { numFmt: "$#,##0.00" } },
    { header: "Q2", key: "q2", width: 14, style: { numFmt: "$#,##0.00" } },
    { header: "Q3", key: "q3", width: 14, style: { numFmt: "$#,##0.00" } },
    { header: "Q4", key: "q4", width: 14, style: { numFmt: "$#,##0.00" } },
    {
      header: "Total Anual",
      key: "total",
      width: 16,
      style: { numFmt: "$#,##0.00" },
    },
  ];

  // Estilo de cabecera
  const headerRow = dataSheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2E4057" }, // Azul oscuro
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      bottom: { style: "medium", color: { argb: "FF1A2B3C" } },
    };
  });
  headerRow.height = 28;

  // Agregar datos con formato alternado
  data.forEach((row, index) => {
    const excelRow = dataSheet.addRow(row);

    // Filas alternadas (zebra stripes)
    if (index % 2 === 1) {
      excelRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF5F7FA" },
        };
      });
    }

    // Colorear la columna Total según performance
    const totalCell = excelRow.getCell("total");
    const totalValue = row.total;

    if (totalValue >= 500_000) {
      totalCell.font = { bold: true, color: { argb: "FF1A7F47" } }; // Verde
    } else if (totalValue < 100_000) {
      totalCell.font = { color: { argb: "FFC0392B" } }; // Rojo
    }
  });

  // Fila de totales con fórmulas Excel
  const totalRow = dataSheet.addRow({
    rep: "TOTALES",
    region: "",
    q1: { formula: `SUM(C2:C${data.length + 1})` },
    q2: { formula: `SUM(D2:D${data.length + 1})` },
    q3: { formula: `SUM(E2:E${data.length + 1})` },
    q4: { formula: `SUM(F2:F${data.length + 1})` },
    total: { formula: `SUM(G2:G${data.length + 1})` },
  });

  totalRow.eachCell((cell) => {
    cell.font = { bold: true, size: 12 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFE4B5" }, // Amarillo suave
    };
    cell.border = {
      top: { style: "medium" },
      bottom: { style: "double" },
    };
  });

  // Añadir AutoFilter
  dataSheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: data.length + 1, column: 7 },
  };

  // ── Hoja 2: Resumen ejecutivo ─────────────────────────────────────
  const summarySheet = workbook.addWorksheet("Resumen");

  summarySheet.mergeCells("A1:E1");
  const titleCell = summarySheet.getCell("A1");
  titleCell.value = "📊 Reporte Anual de Ventas";
  titleCell.font = { size: 18, bold: true };
  titleCell.alignment = { horizontal: "center" };

  summarySheet.getCell("A3").value = "Generado:";
  summarySheet.getCell("B3").value = new Date();
  summarySheet.getCell("B3").numFmt = "dd/mm/yyyy hh:mm";

  summarySheet.getCell("A4").value = "Total registros:";
  summarySheet.getCell("B4").value = data.length;

  // ── Guardar ───────────────────────────────────────────────────────
  await workbook.xlsx.writeFile(outputPath);
  console.log(`✅ Excel exportado: ${outputPath}`);
}
```

### Leer Excel con validaciones

```typescript
async function importExcel<T>(
  filePath: string,
  sheetName: string,
  validator: (row: Record<string, unknown>) => T | null,
): Promise<{ data: T[]; errors: string[] }> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) throw new Error(`Hoja "${sheetName}" no encontrada`);

  const headers: string[] = [];
  const data: T[] = [];
  const errors: string[] = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      // Leer cabeceras
      row.eachCell((cell) => headers.push(String(cell.value ?? "")));
      return;
    }

    const rowObj: Record<string, unknown> = {};
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber - 1];
      if (header) {
        // Normalizar valores de Excel
        rowObj[header] =
          cell.value instanceof Date ? cell.value.toISOString() : cell.value;
      }
    });

    const parsed = validator(rowObj);
    if (parsed !== null) {
      data.push(parsed);
    } else {
      errors.push(`Fila ${rowNumber}: datos inválidos`);
    }
  });

  return { data, errors };
}
```

---

## 5. Parquet

Parquet es el formato estándar para análisis de datos masivos (columnar, comprimido, con schema).

```bash
npm install parquetjs-lite
# o para proyectos más grandes:
npm install @dsnp/parquetjs
```

```typescript
import parquet from "parquetjs-lite";

// ✅ Definir schema fuertemente tipado
const userSchema = new parquet.ParquetSchema({
  id: { type: "INT64" },
  name: { type: "UTF8" },
  email: { type: "UTF8" },
  salary: { type: "DOUBLE" },
  isActive: { type: "BOOLEAN" },
  joinedAt: { type: "INT64" }, // Unix timestamp en ms
  tags: { type: "UTF8", repeated: true }, // Array de strings
});

// ✅ Escribir Parquet
async function exportParquet(users: User[], outputPath: string): Promise<void> {
  const writer = await parquet.ParquetWriter.openFile(userSchema, outputPath, {
    compression: "GZIP", // SNAPPY (más rápido) o GZIP (más compacto)
  });

  for (const user of users) {
    await writer.appendRow({
      id: BigInt(user.id),
      name: user.name,
      email: user.email,
      salary: user.salary,
      isActive: true,
      joinedAt: BigInt(user.joinedAt.getTime()),
      tags: ["employee", "active"],
    });
  }

  await writer.close();
  console.log(`✅ Parquet exportado: ${outputPath}`);
}

// ✅ Leer Parquet con proyección de columnas (solo las que necesitas)
async function readParquetColumns(
  filePath: string,
  columns: string[],
): Promise<Record<string, unknown>[]> {
  const reader = await parquet.ParquetReader.openFile(filePath);
  const cursor = reader.getCursor(columns); // Solo lee las columnas pedidas

  const rows: Record<string, unknown>[] = [];
  let record;

  while ((record = await cursor.next()) !== null) {
    rows.push(record);
  }

  await reader.close();
  return rows;
}
```

**¿Por qué Parquet es tan eficiente?**

```
Formato fila (CSV/JSON):     [col1, col2, col3] [col1, col2, col3] [col1, col2, col3]
                              ← fila 1 →         ← fila 2 →         ← fila 3 →

Formato columnar (Parquet):  [col1, col1, col1] [col2, col2, col2] [col3, col3, col3]
                              ←── columna 1 ──→  ←── columna 2 ──→  ←── columna 3 ──→

Si solo necesitas col1 y col3 → Parquet lee 2/3 menos datos.
Los valores similares en una columna comprimen 10x mejor que datos mezclados.
```

---

## 6. XML

XML sigue siendo el estándar en facturación electrónica (AFIP, SAT, DIAN), EDI, SOAP y sistemas legacy.

```typescript
// ✅ Generar XML seguro sin vulnerabilidades de inyección
class XmlBuilder {
  private parts: string[] = [];

  constructor(private encoding = "UTF-8") {
    this.parts.push(`<?xml version="1.0" encoding="${encoding}"?>`);
  }

  // Escapar caracteres especiales XML
  private escape(value: string): string {
    return value
      .replace(/&/g, "&amp;") // ⚠️ SIEMPRE primero
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  openTag(name: string, attrs: Record<string, string> = {}): this {
    const attrStr = Object.entries(attrs)
      .map(([k, v]) => ` ${k}="${this.escape(v)}"`)
      .join("");
    this.parts.push(`<${name}${attrStr}>`);
    return this;
  }

  closeTag(name: string): this {
    this.parts.push(`</${name}>`);
    return this;
  }

  selfClosing(name: string, attrs: Record<string, string> = {}): this {
    const attrStr = Object.entries(attrs)
      .map(([k, v]) => ` ${k}="${this.escape(v)}"`)
      .join("");
    this.parts.push(`<${name}${attrStr}/>`);
    return this;
  }

  text(name: string, value: string | number | boolean | null): this {
    if (value === null || value === undefined) {
      return this.selfClosing(name, { "xsi:nil": "true" });
    }
    this.parts.push(`<${name}>${this.escape(String(value))}</${name}>`);
    return this;
  }

  build(): string {
    return this.parts.join("\n");
  }
}

// Uso: Factura electrónica
interface Invoice {
  id: string;
  date: Date;
  seller: { name: string; taxId: string };
  buyer: { name: string; taxId: string };
  items: { description: string; qty: number; price: number }[];
}

function generateInvoiceXml(invoice: Invoice): string {
  const xml = new XmlBuilder();
  const total = invoice.items.reduce((s, i) => s + i.qty * i.price, 0);

  xml
    .openTag("Factura", {
      xmlns: "http://facturacion.ejemplo.com/v1",
      version: "1.0",
    })
    .openTag("Encabezado")
    .text("NumeroFactura", invoice.id)
    .text("FechaEmision", invoice.date.toISOString().split("T")[0])
    .text("TipoMoneda", "ARS")
    .closeTag("Encabezado")
    .openTag("Emisor")
    .text("RazonSocial", invoice.seller.name)
    .text("CUIT", invoice.seller.taxId)
    .closeTag("Emisor")
    .openTag("Receptor")
    .text("RazonSocial", invoice.buyer.name)
    .text("CUIT", invoice.buyer.taxId)
    .closeTag("Receptor")
    .openTag("Items");

  invoice.items.forEach((item, idx) => {
    xml
      .openTag("Item", { numero: String(idx + 1) })
      .text("Descripcion", item.description)
      .text("Cantidad", item.qty)
      .text("PrecioUnitario", item.price.toFixed(2))
      .text("Subtotal", (item.qty * item.price).toFixed(2))
      .closeTag("Item");
  });

  xml
    .closeTag("Items")
    .openTag("Totales")
    .text("SubTotal", total.toFixed(2))
    .text("IVA21", (total * 0.21).toFixed(2))
    .text("TotalConIVA", (total * 1.21).toFixed(2))
    .closeTag("Totales")
    .closeTag("Factura");

  return xml.build();
}
```

---

## 7. PDF

Para generar PDFs en Node.js, **PDFKit** es la opción robusta y sin dependencias nativas:

```bash
npm install pdfkit
npm install --save-dev @types/pdfkit
```

```typescript
import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";

async function exportPdfReport(
  title: string,
  data: SalesReport[],
  outputPath: string,
): Promise<void> {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 60, right: 60 },
  });

  const stream = createWriteStream(outputPath);
  doc.pipe(stream);

  // ── Encabezado ────────────────────────────────────────────────────
  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .fillColor("#2E4057")
    .text(title, { align: "center" })
    .moveDown(0.3);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#7F8C8D")
    .text(`Generado: ${new Date().toLocaleString("es-AR")}`, {
      align: "center",
    })
    .moveDown(1.5);

  // Línea separadora
  doc
    .moveTo(60, doc.y)
    .lineTo(535, doc.y)
    .strokeColor("#2E4057")
    .lineWidth(2)
    .stroke()
    .moveDown(1);

  // ── Tabla ─────────────────────────────────────────────────────────
  const tableTop = doc.y;
  const cols = [
    { key: "rep", label: "Representante", x: 60, width: 150 },
    { key: "region", label: "Región", x: 210, width: 80 },
    { key: "total", label: "Total Anual", x: 290, width: 120 },
    { key: "q4", label: "Q4", x: 410, width: 120 },
  ];

  // Cabecera de tabla
  doc.rect(60, tableTop, 475, 22).fill("#2E4057");

  cols.forEach((col) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#FFFFFF")
      .text(col.label, col.x, tableTop + 5, { width: col.width });
  });

  // Filas
  let y = tableTop + 25;
  data.forEach((row, idx) => {
    if (y > 700) {
      doc.addPage();
      y = 50;
    }

    // Zebra stripes
    if (idx % 2 === 0) {
      doc.rect(60, y - 3, 475, 20).fill("#F5F7FA");
    }

    cols.forEach((col) => {
      const value = row[col.key as keyof SalesReport];
      const text =
        typeof value === "number"
          ? `$${value.toLocaleString("es-AR")}`
          : String(value);

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#2C3E50")
        .text(text, col.x, y, { width: col.width });
    });

    y += 20;
  });

  // ── Pie de página ─────────────────────────────────────────────────
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(8)
      .fillColor("#95A5A6")
      .text(
        `Página ${i + 1} de ${pageCount} — Confidencial`,
        60,
        doc.page.height - 30,
        { align: "center" },
      );
  }

  doc.end();

  await new Promise<void>((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  console.log(`✅ PDF exportado: ${outputPath}`);
}
```

---

## 8. Compresión

### GZIP: comprimir un archivo

```typescript
import { createGzip, createGunzip } from "zlib";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";

// Comprimir: archivo → archivo.gz
async function gzipFile(
  inputPath: string,
  outputPath?: string,
): Promise<string> {
  const out = outputPath ?? `${inputPath}.gz`;

  await pipeline(
    createReadStream(inputPath),
    createGzip({ level: 6 }), // nivel 1 (rápido) a 9 (máx compresión). 6 = balance
    createWriteStream(out),
  );

  return out;
}

// Descomprimir: archivo.gz → archivo
async function gunzipFile(
  inputPath: string,
  outputPath: string,
): Promise<void> {
  await pipeline(
    createReadStream(inputPath),
    createGunzip(),
    createWriteStream(outputPath),
  );
}
```

### ZIP: múltiples archivos en un paquete

```bash
npm install archiver
npm install --save-dev @types/archiver
```

```typescript
import archiver from "archiver";
import { createWriteStream } from "fs";

interface FileToZip {
  path: string; // Ruta real del archivo
  name: string; // Nombre dentro del ZIP
}

async function createZipBundle(
  files: FileToZip[],
  outputPath: string,
  comment?: string,
): Promise<{ sizeBytes: number }> {
  const output = createWriteStream(outputPath);

  const archive = archiver("zip", {
    zlib: { level: 6 },
    comment,
  });

  archive.pipe(output);

  for (const file of files) {
    archive.file(file.path, { name: file.name });
  }

  await archive.finalize();

  return new Promise((resolve, reject) => {
    output.on("close", () => resolve({ sizeBytes: archive.pointer() }));
    archive.on("error", reject);
  });
}

// Uso:
const { sizeBytes } = await createZipBundle(
  [
    { path: "/tmp/reporte.csv", name: "reportes/ventas.csv" },
    { path: "/tmp/reporte.xlsx", name: "reportes/ventas.xlsx" },
    { path: "/tmp/reporte.pdf", name: "reportes/ventas.pdf" },
  ],
  "/tmp/exportacion-2024.zip",
  "Exportación generada automáticamente",
);

console.log(`ZIP creado: ${(sizeBytes / 1024 / 1024).toFixed(2)} MB`);
```

---

## 9. Streaming

El principio más importante en exportaciones de producción:

> **Nunca cargues en memoria lo que puedes procesar en streaming.**

### Transform Stream: procesamiento en pipeline

```typescript
import { Transform, TransformCallback } from "stream";

// Transform stream que convierte objetos a líneas CSV
class ObjectToCsvTransform extends Transform {
  private headers: string[] | null = null;
  private rowCount = 0;

  constructor() {
    super({ objectMode: true }); // Acepta objetos, emite strings
  }

  _transform(
    chunk: Record<string, unknown>,
    _encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    // Primera fila: emitir cabeceras
    if (this.headers === null) {
      this.headers = Object.keys(chunk);
      this.push(this.headers.join(",") + "\n");
    }

    const line = this.headers
      .map((h) => {
        const val = String(chunk[h] ?? "");
        return val.includes(",") || val.includes('"')
          ? `"${val.replace(/"/g, '""')}"`
          : val;
      })
      .join(",");

    this.push(line + "\n");
    this.rowCount++;
    callback();
  }

  get rows(): number {
    return this.rowCount;
  }
}

// Pipeline completo: DB → Transform → GZIP → Archivo
async function exportCompressedCsv(
  dbStream: NodeJS.ReadableStream,
  outputPath: string,
): Promise<void> {
  const csvTransform = new ObjectToCsvTransform();
  const gzip = createGzip({ level: 6 });

  await pipeline(dbStream, csvTransform, gzip, createWriteStream(outputPath));

  console.log(
    `✅ ${csvTransform.rows.toLocaleString()} filas exportadas y comprimidas`,
  );
}
```

### Exportación con progreso en tiempo real

```typescript
interface ExportProgress {
  processed: number;
  total: number;
  percentage: number;
  elapsedMs: number;
  estimatedRemainingMs: number;
  rowsPerSecond: number;
}

async function exportWithProgress<T>(
  data: T[],
  processRow: (row: T) => string,
  outputPath: string,
  onProgress?: (p: ExportProgress) => void,
): Promise<void> {
  const stream = createWriteStream(outputPath);
  const total = data.length;
  const startTime = Date.now();
  const reportInterval = Math.max(1, Math.floor(total / 100)); // Reportar cada 1%

  for (let i = 0; i < data.length; i++) {
    const line = processRow(data[i]);

    if (!stream.write(line + "\n")) {
      // Back-pressure: esperar que el buffer se vacíe
      await new Promise((resolve) => stream.once("drain", resolve));
    }

    if (onProgress && i % reportInterval === 0) {
      const elapsed = Date.now() - startTime;
      const processed = i + 1;
      const percentage = (processed / total) * 100;
      const rowsPerSecond = processed / (elapsed / 1000);
      const remainingRows = total - processed;

      onProgress({
        processed,
        total,
        percentage,
        elapsedMs: elapsed,
        estimatedRemainingMs: (remainingRows / rowsPerSecond) * 1000,
        rowsPerSecond: Math.round(rowsPerSecond),
      });
    }
  }

  await new Promise<void>((resolve, reject) =>
    stream.end((err: Error | null | undefined) =>
      err ? reject(err) : resolve(),
    ),
  );
}

// Uso:
await exportWithProgress(
  users,
  (user) => `${user.id},${user.name},${user.email}`,
  "/tmp/users.csv",
  (p) => {
    process.stdout.write(
      `\r⏳ ${p.percentage.toFixed(1)}% | ${p.processed.toLocaleString()}/${p.total.toLocaleString()} | ${p.rowsPerSecond.toLocaleString()} filas/s`,
    );
  },
);
```

---

## 10. Optimización y Performance

### Benchmark de formatos (referencia práctica)

```
Dataset: 1.000.000 filas × 10 columnas numéricas

Formato   | Tamaño raw | Tamaño gzip | Escritura | Lectura
----------|-----------|-------------|-----------|--------
CSV       | 180 MB    | 45 MB       | 2.1 s     | 1.8 s
JSON      | 420 MB    | 80 MB       | 4.5 s     | 6.2 s
NDJSON    | 390 MB    | 75 MB       | 3.8 s     | 2.1 s
XLSX      | 95 MB     | N/A         | 18.0 s    | 12.0 s
Parquet   | 22 MB     | N/A (ya comprimido) | 3.2 s | 0.4 s
```

### Optimizaciones clave

```typescript
// ❌ MAL: concatenar strings (crea nuevo objeto en cada iteración)
let csv = "";
for (const row of rows) {
  csv += row.join(",") + "\n"; // O(n²) en memoria
}

// ✅ BIEN: usar array y join al final (O(n))
const lines: string[] = [];
for (const row of rows) {
  lines.push(row.join(","));
}
const csv = lines.join("\n");

// ✅ MEJOR: stream directo (O(1) memoria)
const stream = createWriteStream(outputPath);
for (const row of rows) {
  stream.write(row.join(",") + "\n");
}
```

### Pool de workers para exportación paralela

```typescript
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import * as os from "os";

// worker.ts — Se ejecuta en el thread secundario
if (!isMainThread) {
  const { chunk, options } = workerData as {
    chunk: Record<string, unknown>[];
    options: CsvOptions;
  };

  const result = serializeToCsv(chunk, { ...options, headers: false });
  parentPort!.postMessage(result);
}

// main.ts — Divide el trabajo entre CPU cores
async function exportParallel<T extends Record<string, unknown>>(
  data: T[],
  outputPath: string,
): Promise<void> {
  const numWorkers = Math.min(os.cpus().length - 1, 4);
  const chunkSize = Math.ceil(data.length / numWorkers);
  const chunks: T[][] = [];

  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }

  // Procesar chunks en paralelo
  const results = await Promise.all(
    chunks.map(
      (chunk) =>
        new Promise<string>((resolve, reject) => {
          const worker = new Worker(__filename, {
            workerData: { chunk, options: {} },
          });
          worker.on("message", resolve);
          worker.on("error", reject);
        }),
    ),
  );

  // Cabecera + resultados ordenados
  const header = serializeToCsv([data[0]], { headers: true }).split("\n")[0];
  const content = [header, ...results].join("\n");
  writeFileSync(outputPath, content);
}
```

---

## 11. Patrones de Diseño

### Patrón Strategy — Múltiples formatos con la misma interfaz

```typescript
// Interfaz común para todos los exportadores
interface ExportStrategy<T> {
  readonly format: string;
  readonly mimeType: string;
  readonly extension: string;
  export(data: T[], options?: Record<string, unknown>): Promise<Buffer>;
}

// Implementaciones concretas
class CsvExportStrategy<
  T extends Record<string, unknown>,
> implements ExportStrategy<T> {
  readonly format = "CSV";
  readonly mimeType = "text/csv";
  readonly extension = ".csv";

  async export(data: T[]): Promise<Buffer> {
    const csv = serializeToCsv(data, { bom: true });
    return Buffer.from(csv, "utf8");
  }
}

class JsonExportStrategy<T> implements ExportStrategy<T> {
  readonly format = "JSON";
  readonly mimeType = "application/json";
  readonly extension = ".json";

  async export(data: T[]): Promise<Buffer> {
    return Buffer.from(
      safeJsonStringify({ data, exportedAt: new Date() }, true),
    );
  }
}

// Orquestador: no le importa el formato concreto
class DataExporter<T extends Record<string, unknown>> {
  private strategies = new Map<string, ExportStrategy<T>>();

  register(strategy: ExportStrategy<T>): this {
    this.strategies.set(strategy.format.toLowerCase(), strategy);
    return this;
  }

  async export(
    format: string,
    data: T[],
    outputDir: string,
  ): Promise<{ path: string; mimeType: string; sizeBytes: number }> {
    const strategy = this.strategies.get(format.toLowerCase());
    if (!strategy) {
      throw new Error(
        `Formato no soportado: ${format}. Disponibles: ${[...this.strategies.keys()].join(", ")}`,
      );
    }

    const buffer = await strategy.export(data);
    const fileName = `export_${Date.now()}${strategy.extension}`;
    const fullPath = `${outputDir}/${fileName}`;

    writeFileSync(fullPath, buffer);

    return {
      path: fullPath,
      mimeType: strategy.mimeType,
      sizeBytes: buffer.length,
    };
  }
}

// Uso:
const exporter = new DataExporter<User>()
  .register(new CsvExportStrategy())
  .register(new JsonExportStrategy());

const result = await exporter.export("csv", users, "/tmp");
console.log(`Exportado a: ${result.path} (${result.mimeType})`);
```

### Patrón Builder — Configurar exportaciones complejas

```typescript
class ExportBuilder<T extends Record<string, unknown>> {
  private _data: T[] = [];
  private _format: "csv" | "json" | "xlsx" = "csv";
  private _compress = false;
  private _columns?: string[];
  private _filters: Array<(row: T) => boolean> = [];
  private _transforms: Array<(row: T) => T> = [];

  data(data: T[]): this {
    this._data = data;
    return this;
  }

  format(format: "csv" | "json" | "xlsx"): this {
    this._format = format;
    return this;
  }

  compress(): this {
    this._compress = true;
    return this;
  }

  columns(columns: string[]): this {
    this._columns = columns;
    return this;
  }

  filter(predicate: (row: T) => boolean): this {
    this._filters.push(predicate);
    return this;
  }

  transform(fn: (row: T) => T): this {
    this._transforms.push(fn);
    return this;
  }

  async build(outputPath: string): Promise<string> {
    let processed = this._data;

    // Aplicar filtros
    for (const filter of this._filters) {
      processed = processed.filter(filter);
    }

    // Aplicar transformaciones
    for (const transform of this._transforms) {
      processed = processed.map(transform);
    }

    // Proyección de columnas
    if (this._columns) {
      processed = processed.map(
        (row) =>
          Object.fromEntries(
            this._columns!.filter((k) => k in row).map((k) => [k, row[k]]),
          ) as T,
      );
    }

    // Serializar según formato
    let content: string;
    if (this._format === "csv") {
      content = serializeToCsv(processed, { bom: true });
    } else {
      content = safeJsonStringify({ data: processed }, true);
    }

    const finalPath = this._compress ? `${outputPath}.gz` : outputPath;

    if (this._compress) {
      writeFileSync(outputPath, content);
      await gzipFile(outputPath, finalPath);
    } else {
      writeFileSync(finalPath, content);
    }

    return finalPath;
  }
}

// Uso encadenado (fluent interface):
const path = await new ExportBuilder<User>()
  .data(users)
  .format("csv")
  .compress()
  .columns(["id", "name", "email", "salary"])
  .filter((u) => u.salary > 50_000)
  .transform((u) => ({ ...u, name: u.name.toUpperCase() }))
  .build("/tmp/usuarios-filtrados.csv");
```

---

## 12. Seguridad

### Sanitización de datos antes de exportar

```typescript
// ⚠️ CSV Injection: un valor como =CMD("...") en Excel puede ejecutar comandos
function sanitizeCsvValue(value: string): string {
  // Prefijos peligrosos en Excel/Google Sheets
  const dangerousPrefixes = ["=", "+", "-", "@", "\t", "\r"];

  if (dangerousPrefixes.some((p) => value.startsWith(p))) {
    return `'${value}`; // Escapar con comilla simple (Excel lo trata como texto)
  }

  return value;
}

// Sanitizar todos los campos de texto antes de exportar
function sanitizeForExport<T extends Record<string, unknown>>(data: T[]): T[] {
  return data.map(
    (row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          typeof value === "string" ? sanitizeCsvValue(value) : value,
        ]),
      ) as T,
  );
}

// ⚠️ Path Traversal: evitar que el nombre de archivo salga del directorio permitido
import * as path from "path";

function safeOutputPath(baseDir: string, filename: string): string {
  // Normalizar y verificar que sigue dentro del directorio base
  const safeName = path.basename(filename); // Elimina cualquier "../"
  const fullPath = path.resolve(baseDir, safeName);

  if (!fullPath.startsWith(path.resolve(baseDir))) {
    throw new Error(`Path traversal detectado: ${filename}`);
  }

  return fullPath;
}

// ⚠️ PII: enmascarar datos sensibles antes de exportar
function maskPii<T extends Record<string, unknown>>(
  data: T[],
  sensitiveFields: string[],
): T[] {
  return data.map(
    (row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => {
          if (!sensitiveFields.includes(key)) return [key, value];
          if (typeof value !== "string") return [key, "***"];

          // Email: mostrar solo dominio
          if (key === "email" && value.includes("@")) {
            const [, domain] = value.split("@");
            return [key, `***@${domain}`];
          }

          // Número de tarjeta: mostrar solo últimos 4
          if (key === "cardNumber") {
            return [key, `****-****-****-${value.slice(-4)}`];
          }

          // Por defecto: mostrar solo primeros/últimos 2 caracteres
          return [
            key,
            `${value.slice(0, 2)}${"*".repeat(Math.max(0, value.length - 4))}${value.slice(-2)}`,
          ];
        }),
      ) as T,
  );
}
```

---

## 13. Casos de Uso Reales

### Caso 1: API REST — Endpoint de exportación multi-formato

```typescript
import express, { Request, Response } from "express";

const router = express.Router();

// GET /api/export/users?format=csv&compress=true&fields=id,name,email
router.get("/users", async (req: Request, res: Response) => {
  try {
    const format = (req.query.format as string) ?? "csv";
    const compress = req.query.compress === "true";
    const fields = req.query.fields
      ? (req.query.fields as string).split(",")
      : undefined;

    // Obtener datos
    const users = await getUsersFromDb();

    // Proyección de campos
    const data = fields
      ? users.map((u) =>
          Object.fromEntries(
            fields.map((f) => [f, (u as Record<string, unknown>)[f]]),
          ),
        )
      : users;

    const timestamp = new Date().toISOString().split("T")[0];
    let filename = `users_${timestamp}`;
    let contentType: string;
    let body: Buffer;

    switch (format) {
      case "csv": {
        const csv = serializeToCsv(data as Record<string, unknown>[], {
          bom: true,
        });
        body = Buffer.from(csv, "utf8");
        contentType = "text/csv; charset=utf-8";
        filename += ".csv";
        break;
      }
      case "json": {
        const json = safeJsonStringify({ data, exportedAt: new Date() }, true);
        body = Buffer.from(json, "utf8");
        contentType = "application/json";
        filename += ".json";
        break;
      }
      default:
        return res
          .status(400)
          .json({ error: `Formato no soportado: ${format}` });
    }

    if (compress) {
      const { promisify } = await import("util");
      const { gzip } = await import("zlib");
      const gzipAsync = promisify(gzip);
      body = await gzipAsync(body);
      contentType += "; encoding=gzip";
      filename += ".gz";
      res.setHeader("Content-Encoding", "gzip");
    }

    res
      .setHeader("Content-Type", contentType)
      .setHeader("Content-Disposition", `attachment; filename="${filename}"`)
      .setHeader("Content-Length", body.length)
      .setHeader("X-Export-Rows", data.length.toString())
      .send(body);
  } catch (err) {
    console.error("Error en exportación:", err);
    res.status(500).json({ error: "Error interno al exportar" });
  }
});
```

### Caso 2: Job de exportación programado (ETL)

```typescript
import * as cron from "node-cron";

interface ExportJob {
  name: string;
  schedule: string;
  query: () => Promise<Record<string, unknown>[]>;
  formats: Array<"csv" | "json">;
  outputDir: string;
  retention: number; // días a conservar archivos
}

class ExportScheduler {
  private jobs: ExportJob[] = [];

  register(job: ExportJob): this {
    this.jobs.push(job);
    return this;
  }

  start(): void {
    for (const job of this.jobs) {
      cron.schedule(job.schedule, () => this.runJob(job), {
        timezone: "America/Argentina/Buenos_Aires",
      });
      console.log(`🕐 Job "${job.name}" programado: ${job.schedule}`);
    }
  }

  private async runJob(job: ExportJob): Promise<void> {
    const startTime = Date.now();
    console.log(`\n▶️  Iniciando job: ${job.name}`);

    try {
      const data = await job.query();
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

      for (const format of job.formats) {
        const filename = `${job.name}_${timestamp}.${format}`;
        const outputPath = safeOutputPath(job.outputDir, filename);

        if (format === "csv") {
          const csv = serializeToCsv(data, { bom: true });
          writeFileSync(outputPath, csv);
        } else {
          writeFileSync(outputPath, safeJsonStringify({ data }, true));
        }

        // Comprimir automáticamente
        await gzipFile(outputPath);

        console.log(
          `   ✅ ${format.toUpperCase()}: ${filename}.gz (${data.length} filas)`,
        );
      }

      // Limpiar archivos viejos
      await this.cleanOldFiles(job.outputDir, job.retention);

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`✅ Job "${job.name}" completado en ${elapsed}s`);
    } catch (err) {
      console.error(`❌ Job "${job.name}" falló:`, err);
      // Aquí irían alertas: Slack, email, PagerDuty, etc.
    }
  }

  private async cleanOldFiles(
    dir: string,
    retentionDays: number,
  ): Promise<void> {
    const { readdirSync, statSync, unlinkSync } = await import("fs");
    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

    for (const file of readdirSync(dir)) {
      const filePath = `${dir}/${file}`;
      if (statSync(filePath).mtimeMs < cutoff) {
        unlinkSync(filePath);
        console.log(`   🗑️  Eliminado: ${file}`);
      }
    }
  }
}

// Configuración del scheduler:
const scheduler = new ExportScheduler()
  .register({
    name: "ventas-diarias",
    schedule: "0 6 * * *", // Todos los días a las 6:00 AM
    query: async () => await getSalesData(),
    formats: ["csv", "json"],
    outputDir: "/exports/sales",
    retention: 30,
  })
  .register({
    name: "usuarios-semanal",
    schedule: "0 2 * * 1", // Todos los lunes a las 2:00 AM
    query: async () => await getUsersData(),
    formats: ["csv"],
    outputDir: "/exports/users",
    retention: 90,
  });

scheduler.start();
```

---

## 14. Checklist de Producción

Antes de deployar cualquier sistema de exportación, verificar:

### Corrección de datos

- [ ] Los tipos numéricos usan punto como separador decimal
- [ ] Las fechas están en formato ISO 8601
- [ ] Los campos de texto están correctamente escapados (comas, comillas, saltos de línea)
- [ ] Los valores nulos/undefined se manejan explícitamente
- [ ] Los números grandes (>15 dígitos) se exportan como string en CSV/JSON

### Performance

- [ ] El export usa streaming para datasets >10k filas
- [ ] Back-pressure implementado en streams
- [ ] Archivos mayores a 10 MB se comprimen automáticamente
- [ ] Existe paginación en la consulta a base de datos
- [ ] No se carga toda la tabla en memoria antes de escribir

### Seguridad

- [ ] CSV Injection sanitizada (prefijos `=`, `+`, `-`, `@`)
- [ ] Path traversal validado antes de escribir archivos
- [ ] Datos PII enmascarados según política
- [ ] Autenticación/autorización en endpoints de exportación
- [ ] Rate limiting en endpoints de exportación

### UX y Operaciones

- [ ] Headers HTTP correctos (`Content-Disposition`, `Content-Type`, `Content-Length`)
- [ ] BOM incluido en CSV para compatibilidad con Excel
- [ ] Logs de auditoría: quién exportó qué y cuándo
- [ ] Alertas si un job de exportación falla
- [ ] Política de retención de archivos definida
- [ ] Tests automatizados para cada formato

---

## Recursos y Librerías de Referencia

| Propósito      | Librería              | npm                       |
| -------------- | --------------------- | ------------------------- |
| CSV avanzado   | PapaParse / csv-parse | `papaparse` / `csv-parse` |
| Excel completo | ExcelJS               | `exceljs`                 |
| Parquet        | parquetjs-lite        | `parquetjs-lite`          |
| ZIP/TAR        | archiver              | `archiver`                |
| PDF            | PDFKit                | `pdfkit`                  |
| XML parsing    | fast-xml-parser       | `fast-xml-parser`         |
| Validación     | Zod                   | `zod`                     |
| Scheduling     | node-cron             | `node-cron`               |

---

_Master Class generada para uso interno. Stack: TypeScript 5+ / Node.js 20+._
_Última actualización: 2026_
