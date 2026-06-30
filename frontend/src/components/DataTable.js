import styles from './DataTable.module.css';

export default function DataTable({ columns, data, onEdit, onDelete, actions }) {
  if (!data || data.length === 0) {
    return <div className={styles.emptyState}>Kayıt bulunamadı.</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
            {(onEdit || onDelete || actions) && <th>İşlemler</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
              {(onEdit || onDelete || actions) && (
                <td className={styles.actions}>
                  {actions && actions(row)}
                  {onEdit && (
                    <button className={styles.editBtn} onClick={() => onEdit(row)}>
                      Düzenle
                    </button>
                  )}
                  {onDelete && (
                    <button className={styles.deleteBtn} onClick={() => onDelete(row.id)}>
                      Sil
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
