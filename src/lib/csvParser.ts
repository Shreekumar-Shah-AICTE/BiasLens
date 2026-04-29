import Papa from 'papaparse';

// Columns that likely contain sensitive/protected attributes
const SENSITIVE_PATTERNS: Record<string, string[]> = {
  gender: ['gender', 'sex', 'male', 'female', 'non-binary', 'nb'],
  race: ['race', 'ethnicity', 'ethnic', 'racial', 'nationality', 'national_origin'],
  age: ['age', 'birth_date', 'dob', 'date_of_birth', 'birth_year', 'graduation_year'],
  income: ['income', 'salary', 'wage', 'earnings', 'compensation', 'annual_income'],
  location: ['zip', 'zipcode', 'zip_code', 'postal', 'city', 'state', 'county', 'neighborhood', 'address', 'region'],
  disability: ['disability', 'disabled', 'handicap', 'accommodation'],
  religion: ['religion', 'religious', 'faith'],
  marital: ['marital', 'married', 'single', 'divorced', 'spouse', 'partner'],
  education: ['education', 'school', 'university', 'college', 'degree', 'gpa'],
  language: ['language', 'primary_language', 'native_language', 'english'],
};

export interface CsvSummary {
  totalRows: number;
  totalColumns: number;
  columns: string[];
  sensitiveColumns: { column: string; category: string }[];
  sampleRows: Record<string, string>[];
  uniqueValues: Record<string, string[]>;
}

export function parseCsv(file: File): Promise<CsvSummary> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: 200, // Parse up to 200 rows for analysis
      complete: (results) => {
        const data = results.data as Record<string, string>[];
        if (!data.length) {
          reject(new Error('CSV file is empty or has no valid rows.'));
          return;
        }

        const columns = Object.keys(data[0]);
        const sensitiveColumns = detectSensitiveColumns(columns);
        const sampleRows = data.slice(0, 5);
        const uniqueValues = getUniqueValues(data, columns);

        resolve({
          totalRows: data.length,
          totalColumns: columns.length,
          columns,
          sensitiveColumns,
          sampleRows,
          uniqueValues,
        });
      },
      error: (err) => reject(new Error(`Failed to parse CSV: ${err.message}`)),
    });
  });
}

function detectSensitiveColumns(columns: string[]): { column: string; category: string }[] {
  const detected: { column: string; category: string }[] = [];

  for (const col of columns) {
    const normalized = col.toLowerCase().replace(/[^a-z0-9]/g, '_');
    for (const [category, patterns] of Object.entries(SENSITIVE_PATTERNS)) {
      if (patterns.some((p) => normalized.includes(p))) {
        detected.push({ column: col, category });
        break;
      }
    }
  }

  return detected;
}

function getUniqueValues(data: Record<string, string>[], columns: string[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const col of columns) {
    const values = new Set<string>();
    for (const row of data) {
      if (row[col] && values.size < 10) {
        values.add(String(row[col]).trim());
      }
    }
    result[col] = Array.from(values);
  }

  return result;
}

export function buildCustomPrompt(summary: CsvSummary, userContext: string): string {
  const sensitiveList = summary.sensitiveColumns
    .map((s) => `"${s.column}" (likely ${s.category})`)
    .join(', ');

  const columnList = summary.columns.join(', ');

  const sampleData = summary.sampleRows
    .slice(0, 3)
    .map((row) =>
      Object.entries(row)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' | ')
    )
    .join('\n');

  return `Analyze this custom dataset for bias:

System Context: ${userContext || 'An automated decision system using the following dataset.'}

Dataset Summary:
- Total rows: ${summary.totalRows}
- Total columns: ${summary.totalColumns}
- Column names: ${columnList}
- Detected sensitive/protected columns: ${sensitiveList || 'None auto-detected — look for hidden proxies in all columns.'}

Sample data (first 3 rows):
${sampleData}

Unique values per column (up to 10):
${Object.entries(summary.uniqueValues)
  .map(([col, vals]) => `  ${col}: [${vals.join(', ')}]`)
  .join('\n')}

Perform a comprehensive bias audit of this dataset. Pay special attention to:
1. Any column that could serve as a proxy for protected attributes (race, gender, age, socioeconomic status)
2. Potential disparate impact across demographic groups
3. Feature correlations that could amplify historical discrimination
4. Data collection biases that may be baked into the dataset

Be very specific with your statistical findings. Infer realistic bias patterns from the column names, sample data, and unique values provided.`;
}
