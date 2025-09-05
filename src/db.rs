use sqlx::{SqlitePool, query, query_as};
use crate::types::DBGameRow;

pub async fn ensure_schema(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    query(r#"
        CREATE TABLE IF NOT EXISTS games_rust (
            id INTEGER NOT NULL PRIMARY KEY,
            rows INTEGER NOT NULL,
            cols INTEGER NOT NULL,
            num_to_win INTEGER NOT NULL,
            history TEXT NOT NULL,
            created_at INTEGER NOT NULL
        );
    "#).execute(pool).await?;
    Ok(())
}